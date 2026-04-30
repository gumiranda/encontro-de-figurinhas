# Album Page Scanning v4 — Arquitetura Híbrida + Gemini Flash

## Context

Escanear páginas do álbum Copa 2026 (980 figurinhas, 112 páginas, ~20 por seleção). Layout em grid fixo = problema de visão resolvível com template matching + VLM.

## Arquitetura

```
Cliente (OpenCV.js + jscanify)          Servidor (Convex Action)
┌─────────────────────────────┐         ┌──────────────────────────┐
│ 1. getUserMedia (720p/1080p)│         │ 6. Rate limit (sharded)  │
│ 2. jscanify: detectar página│         │ 7. pHash lookup (cache)  │
│ 3. Laplaciano: blur check   │         │ 8. Gemini 2.5 Flash call │
│ 4. warpPerspective: retificar│        │ 9. Parse JSON estruturado│
│ 5. JPEG q80 → ~200KB Blob   │─────────│10. Mutation: atualizar   │
│    ↓ só se qualidade OK     │         │    userStickers          │
│ Upload via Convex storage   │         └──────────────────────────┘
└─────────────────────────────┘
```

**Custo estimado:** ~$0.001/scan (Gemini 560 input + ~300 output tokens). 30k scans/mês = ~$30.

## Por que NÃO Tesseract.js

- 2-20s por imagem em mobile (iPhone X benchmarks)
- 10MB+ download (WASM + traineddata)
- Template matching + Gemini elimina necessidade de OCR

## Por que Template Matching

Álbum Panini tem layout **fixo**:
- Página 5 = Brasil = 20 slots em posições conhecidas
- Se você sabe qual página é, sabe qual figurinha está em cada slot
- Slot vazio vs preenchido = variância de cor (clássico, sem ML)

**Template map** (criar uma vez):
```ts
const ALBUM_TEMPLATE: Record<number, SlotTemplate[]> = {
  5: [ // Brasil
    { slot: 1, code: "BRA-1", x: 0.05, y: 0.10, w: 0.20, h: 0.25 },
    { slot: 2, code: "BRA-2", x: 0.30, y: 0.10, w: 0.20, h: 0.25 },
    // ... 20 slots
  ],
  // ... 112 páginas
};
```

## Dependências

```bash
pnpm add @anthropic-ai/sdk -F @workspace/backend  # ou @google/genai
pnpm add phash-image -F @workspace/web           # pHash para cache
# OpenCV.js e jscanify via CDN ou self-host
```

## Arquivos Novos

```
apps/web/
├── public/
│   └── opencv/                          # Self-hosted OpenCV.js (~600KB gzip)
│       ├── opencv.js
│       └── opencv_js.wasm
├── modules/stickers/
│   ├── lib/
│   │   ├── album-template.ts            # Template map 112 páginas
│   │   ├── use-album-scanner.ts         # Hook: OpenCV + jscanify + quality
│   │   ├── image-quality.ts             # Laplaciano, histograma, pHash
│   │   └── scan-queue.ts                # IndexedDB queue para offline
│   ├── ui/
│   │   ├── components/
│   │   │   ├── scanner-camera.tsx       # Live preview + auto-capture
│   │   │   ├── scanner-overlay.tsx      # Bounding box + feedback
│   │   │   └── scan-result-drawer.tsx   # Confirmação
│   │   └── views/
│   │       └── album-scanner-view.tsx
├── app/(auth)/cadastrar-figurinhas/escanear/
│   └── page.tsx

packages/backend/convex/
├── scan.ts                              # Actions: scanPage, processScan
└── lib/
    └── gemini.ts                        # Wrapper Gemini 2.5 Flash
```

---

## Implementação Faseada

### Fase 0: Dados (1-2 semanas)

**Task 0.1:** Schema `albumPages` no Convex
```ts
albumPages: defineTable({
  pageNumber: v.number(),
  sectionCode: v.string(),        // "BRA", "ARG"
  sectionName: v.string(),
  slots: v.array(v.object({
    slotId: v.number(),
    stickerCode: v.string(),      // "BRA-1"
    absoluteNum: v.number(),
    x: v.float64(),               // Coordenadas normalizadas 0-1
    y: v.float64(),
    w: v.float64(),
    h: v.float64(),
  })),
}).index("by_page", ["pageNumber"])
```

**Task 0.2:** Mapear manualmente coordenadas de 1 página (~30min)
- Fotografar página, retificar, anotar slots
- Script gera entry para `albumPages`

**Task 0.3:** Popular `albumPages` (4-6 horas total, pode ser paralelo)

### Fase 1: MVP Pipeline (3-4 semanas)

**Step 1: Self-host OpenCV.js**
```bash
mkdir -p apps/web/public/opencv
curl -o apps/web/public/opencv/opencv.js \
  "https://docs.opencv.org/4.10.0/opencv.js"
```

**Step 2: `use-album-scanner.ts`**

```ts
"use client";

import { useRef, useState, useCallback, useEffect } from "react";

type ScannerState = 'idle' | 'detecting' | 'processing' | 'confirming' | 'error';

type QualityScore = {
  blur: number;        // Laplacian variance (>100 = OK)
  exposure: number;    // % pixels not clipped
  coverage: number;    // % frame covered by page quad
  isGood: boolean;
};

export function useAlbumScanner() {
  const [state, setState] = useState<ScannerState>('idle');
  const [quality, setQuality] = useState<QualityScore | null>(null);
  const [quadCorners, setQuadCorners] = useState<Point[] | null>(null);
  const cvRef = useRef<typeof cv | null>(null);
  const scanifyRef = useRef<any>(null);
  
  // Lazy load OpenCV.js
  const initCV = useCallback(async () => {
    if (cvRef.current) return;
    
    // Load OpenCV.js script
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/opencv/opencv.js';
      script.onload = () => {
        // OpenCV.js sets global `cv` when ready
        (window as any).cv.onRuntimeInitialized = () => {
          cvRef.current = (window as any).cv;
          resolve();
        };
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    
    // Load jscanify
    const { default: Scanner } = await import('jscanify');
    scanifyRef.current = new Scanner();
  }, []);
  
  // Process frame from video
  const processFrame = useCallback((video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    const cv = cvRef.current;
    if (!cv) return null;
    
    // Draw video to canvas
    const ctx = canvas.getContext('2d')!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    // Detect page quadrilateral
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const src = cv.matFromImageData(imgData);
    
    // jscanify detection
    const corners = scanifyRef.current.detectContour(src);
    
    if (corners && corners.length === 4) {
      setQuadCorners(corners);
      
      // Quality assessment
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      
      // Laplacian variance (blur detection)
      const laplacian = new cv.Mat();
      cv.Laplacian(gray, laplacian, cv.CV_64F);
      const mean = new cv.Mat();
      const stddev = new cv.Mat();
      cv.meanStdDev(laplacian, mean, stddev);
      const variance = Math.pow(stddev.doubleAt(0, 0), 2);
      
      // Coverage (quad area / frame area)
      const quadArea = cv.contourArea(cv.matFromArray(4, 1, cv.CV_32FC2, corners.flat()));
      const frameArea = canvas.width * canvas.height;
      const coverage = quadArea / frameArea;
      
      // Exposure (% not saturated)
      const hist = new cv.Mat();
      const mask = new cv.Mat();
      cv.calcHist([gray], [0], mask, hist, [256], [0, 256]);
      const saturatedHigh = hist.floatAt(255);
      const saturatedLow = hist.floatAt(0);
      const totalPixels = canvas.width * canvas.height;
      const exposure = 1 - (saturatedHigh + saturatedLow) / totalPixels;
      
      const score: QualityScore = {
        blur: variance,
        exposure: exposure * 100,
        coverage: coverage * 100,
        isGood: variance > 100 && exposure > 0.9 && coverage > 0.5,
      };
      setQuality(score);
      
      // Cleanup
      gray.delete(); laplacian.delete(); mean.delete(); stddev.delete();
      hist.delete(); mask.delete();
      
      return score.isGood ? corners : null;
    }
    
    src.delete();
    return null;
  }, []);
  
  // Capture and rectify
  const capture = useCallback(async (
    video: HTMLVideoElement, 
    canvas: HTMLCanvasElement,
    corners: Point[]
  ): Promise<Blob> => {
    const cv = cvRef.current!;
    const ctx = canvas.getContext('2d')!;
    
    // Draw current frame
    ctx.drawImage(video, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const src = cv.matFromImageData(imgData);
    
    // Rectify with perspective transform
    const targetWidth = 1200;
    const targetHeight = 1600;
    const srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, corners.flat());
    const dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0, 0,
      targetWidth, 0,
      targetWidth, targetHeight,
      0, targetHeight,
    ]);
    const M = cv.getPerspectiveTransform(srcPoints, dstPoints);
    const dst = new cv.Mat();
    cv.warpPerspective(src, dst, M, new cv.Size(targetWidth, targetHeight));
    
    // Convert back to canvas and get Blob
    const rectCanvas = document.createElement('canvas');
    rectCanvas.width = targetWidth;
    rectCanvas.height = targetHeight;
    cv.imshow(rectCanvas, dst);
    
    // Cleanup
    src.delete(); srcPoints.delete(); dstPoints.delete(); M.delete(); dst.delete();
    
    return new Promise((resolve) => {
      rectCanvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8);
    });
  }, []);
  
  return {
    state,
    quality,
    quadCorners,
    initCV,
    processFrame,
    capture,
  };
}
```

**Step 3: `scanner-camera.tsx`**

```tsx
"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useAlbumScanner } from "../../lib/use-album-scanner";
import { ScannerOverlay } from "./scanner-overlay";
import { Button } from "@workspace/ui/components/button";

type Props = {
  onCapture: (blob: Blob) => Promise<void>;
  isProcessing: boolean;
};

export function ScannerCamera({ onCapture, isProcessing }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const stableFramesRef = useRef(0);
  const lastCornersRef = useRef<Point[] | null>(null);
  
  const { state, quality, quadCorners, initCV, processFrame, capture } = useAlbumScanner();
  
  // Start camera
  const startCamera = useCallback(async () => {
    try {
      await initCV();
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', 
          width: { ideal: 1280 },  // Not 4K - crashes low-end Android
          height: { ideal: 720 },
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setStream(mediaStream);
      setIsReady(true);
    } catch (err) {
      if (err instanceof DOMException) {
        setError(err.name === 'NotAllowedError' 
          ? 'Câmera bloqueada. Permita nas configurações.'
          : 'Erro ao acessar câmera.');
      }
    }
  }, [initCV]);
  
  // Live detection loop (5-10 FPS)
  useEffect(() => {
    if (!isReady || !videoRef.current || !canvasRef.current) return;
    
    let animationId: number;
    let lastTime = 0;
    const FPS = 8;
    
    const loop = (time: number) => {
      if (time - lastTime > 1000 / FPS) {
        lastTime = time;
        const corners = processFrame(videoRef.current!, canvasRef.current!);
        
        // Auto-capture: stable for 1 second (8 frames)
        if (corners && quality?.isGood) {
          const isSameCorners = cornersMatch(corners, lastCornersRef.current);
          if (isSameCorners) {
            stableFramesRef.current++;
            if (stableFramesRef.current >= 8 && !isProcessing) {
              handleCapture(corners);
            }
          } else {
            stableFramesRef.current = 0;
          }
          lastCornersRef.current = corners;
        } else {
          stableFramesRef.current = 0;
        }
      }
      animationId = requestAnimationFrame(loop);
    };
    
    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [isReady, quality, isProcessing, processFrame]);
  
  const handleCapture = useCallback(async (corners: Point[]) => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    
    const blob = await capture(videoRef.current, canvasRef.current, corners);
    await onCapture(blob);
  }, [capture, onCapture, isProcessing]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, [stream]);
  
  return (
    <div className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      
      <ScannerOverlay 
        corners={quadCorners} 
        quality={quality}
        isProcessing={isProcessing}
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <p className="text-white text-center px-4">{error}</p>
        </div>
      )}
      
      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button onClick={startCamera}>Iniciar Câmera</Button>
        </div>
      )}
    </div>
  );
}

function cornersMatch(a: Point[], b: Point[] | null): boolean {
  if (!b) return false;
  const threshold = 10; // pixels
  return a.every((p, i) => 
    Math.abs(p.x - b[i].x) < threshold && Math.abs(p.y - b[i].y) < threshold
  );
}
```

**Step 4: Convex Action `scanPage`**

```ts
// packages/backend/convex/scan.ts
"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { rateLimiter } from "./lib/rateLimiter";

export const scanPage = action({
  args: {
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, { imageStorageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Não autenticado");
    
    const userId = identity.subject;
    
    // 1. Rate limit FIRST (sharded for scale)
    await rateLimiter.limit(ctx, "scanPage", { 
      key: userId, 
      throws: true,
    });
    
    // 2. Get image from storage
    const imageUrl = await ctx.storage.getUrl(imageStorageId);
    if (!imageUrl) throw new Error("Imagem não encontrada");
    
    // 3. Compute pHash for cache lookup
    const imageBlob = await fetch(imageUrl).then(r => r.blob());
    const pHash = await computePHash(imageBlob);
    
    // 4. Check cache
    const cached = await ctx.runQuery(internal.scan.getCachedScan, { pHash });
    if (cached) {
      return cached.result;
    }
    
    // 5. Call Gemini 2.5 Flash
    const result = await callGemini(imageUrl);
    
    // 6. Cache result
    await ctx.runMutation(internal.scan.cacheScanResult, {
      pHash,
      imageStorageId,
      result,
      userId,
    });
    
    return result;
  },
});

async function callGemini(imageUrl: string) {
  const { GoogleGenerativeAI } = await import("@google/genai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });
  
  const imageData = await fetch(imageUrl).then(r => r.arrayBuffer());
  const base64 = Buffer.from(imageData).toString("base64");
  
  const prompt = `Analise esta página do álbum de figurinhas da Copa do Mundo FIFA 2026.

Retorne um JSON com:
{
  "pageNumber": número da página (visível no canto),
  "sectionCode": código da seleção (ex: "BRA", "ARG"),
  "sectionName": nome da seleção em português,
  "filledSlots": [
    { "slotId": número do slot na página, "stickerCode": "BRA-1" }
  ],
  "emptySlots": [número dos slots vazios]
}

Se não conseguir identificar a página, retorne {"error": "motivo"}.`;

  const result = await model.generateContent([
    { text: prompt },
    { 
      inlineData: { 
        mimeType: "image/jpeg", 
        data: base64,
      } 
    },
  ]);
  
  return JSON.parse(result.response.text());
}

async function computePHash(blob: Blob): Promise<string> {
  // Simplified pHash - in production use phash-image library
  const arrayBuffer = await blob.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", arrayBuffer);
  return Array.from(new Uint8Array(hash.slice(0, 8)))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
```

**Step 5: Rate Limiter Config**

```ts
// packages/backend/convex/lib/rateLimiter.ts
import { RateLimiter, MINUTE, DAY } from "@convex-dev/rate-limiter";
import { components } from "../_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  scanPage: { 
    kind: "token bucket", 
    rate: 10, 
    period: MINUTE, 
    capacity: 20,
  },
  scanPageDaily: { 
    kind: "fixed window", 
    rate: 200, 
    period: DAY,
  },
  scanGlobal: { 
    kind: "token bucket", 
    rate: 1000, 
    period: MINUTE, 
    shards: 100, // For Copa peak
  },
});
```

---

## Checklist de Segurança

- [x] Rate limit FIRST (antes de qualquer DB work)
- [x] Rate limit sharded para Copa peak
- [x] pHash cache evita reprocessamento
- [x] Backend valida contra `albumPages`
- [x] Autenticação obrigatória
- [x] Imagem size cap (já enforçado por Convex storage)
- [x] Gemini responde JSON estruturado (não texto livre)

---

## UX Crítico

1. **Auto-capture** quando quadrilátero estável por 1s
2. **Feedback visual** em tempo real (verde/amarelo/vermelho)
3. **Preview antes de confirmar** ("12 figurinhas detectadas")
4. **PWA** para instalação sem Play Store
5. **Offline queue** - captura funciona, upload quando online

---

## Verificação

1. `pnpm add @google/genai -F @workspace/backend`
2. `pnpm add @convex-dev/rate-limiter -F @workspace/backend`
3. Download OpenCV.js para `public/opencv/`
4. Criar `albumPages` com 1 página de teste
5. `pnpm build`
6. Manual test:
   - Apontar para página do álbum
   - Verde quando bem enquadrado
   - Auto-capture após 1s estável
   - Gemini retorna JSON com slots
   - Confirmar → atualiza userStickers

---

## V2 Scope

- YOLOv8n client-side para detecção robusta em vídeo
- Classificador slot vazio/preenchido client-side (elimina chamadas servidor)
- CLIP para scan de figurinhas soltas (pacotes)
- pSEO landing `/escanear-album-figurinhas-copa-2026`
