// Cacheado via ISR. Não chamar em SSR puro.
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Element, Root, RootContent } from "hast";
import { slugify } from "./slugify";

export type TocItem = { id: string; text: string; level: 2 | 3 };

// Strict sanitization schema - XSS prevention
const sanitizeSchema = {
  tagNames: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "ul", "ol", "li", "a", "strong", "em", "b", "i",
    "code", "pre", "blockquote", "img",
    "figure", "figcaption", "aside", "section", "span",
    "br", "hr", "table", "thead", "tbody", "tr", "th", "td",
  ],
  // NO: svg, iframe, object, embed, math, script, style, form, input
  attributes: {
    "*": ["id"], // NO 'style' - blocks XSS via background:url(javascript:)
    a: ["href", "title", "rel", "target"],
    img: ["src", "alt", "width", "height", "loading", "decoding"],
    aside: ["role", "aria-labelledby", "class"],
    section: ["aria-labelledby", "class"],
    figure: ["class"],
    span: ["class"],
    p: ["class"],
    h1: ["id"], h2: ["id"], h3: ["id"], h4: ["id"], h5: ["id"], h6: ["id"],
  },
  protocols: {
    href: ["http", "https", "mailto"],
    src: ["http", "https"], // NO 'data:' - blocks SVG XSS
  },
};

// Class allowlist per tag - strips unknown classes
const classAllowlist: Record<string, string[]> = {
  aside: ["blog-card", "card-grid", "callout", "callout-warn"],
  figure: ["blog-card", "card-grid", "rarity-card"],
  section: ["blog-card", "card-grid", "inline-cta"],
  span: ["rarity-rank", "rarity-price", "rarity-info", "callout-icon"],
  p: ["lead"],
};

// Rehype plugin: semantic transform (div.callout → aside.callout)
function rehypeSemanticTransform() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      const classes = getClasses(node);

      if (node.tagName === "div") {
        if (classes.includes("callout") || classes.includes("callout-warn")) {
          node.tagName = "aside";
          node.properties = {
            ...node.properties,
            role: "note",
            class: ["blog-card", "card-grid", ...classes].join(" "),
          };
        } else if (classes.includes("rarity-card")) {
          node.tagName = "figure";
          node.properties = {
            ...node.properties,
            class: ["blog-card", "card-grid", "rarity-card"].join(" "),
          };
        } else if (classes.includes("inline-cta")) {
          node.tagName = "section";
          node.properties = {
            ...node.properties,
            class: ["blog-card", "card-grid", "inline-cta"].join(" "),
          };
        }
      }
    });
  };
}

// Rehype plugin: validate links (block bad protocols, force rel on external)
function rehypeValidateLinks() {
  const badProtocols = /^(javascript|data|vbscript):/i;
  const internalDomain = /^(https?:\/\/)?(www\.)?figurinhafacil\.com/i;

  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;

      const href = node.properties?.href;
      if (typeof href !== "string") return;

      // Block dangerous protocols
      if (badProtocols.test(href)) {
        delete node.properties?.href;
        return;
      }

      // External links: force security attributes
      const isExternal = href.startsWith("http") && !internalDomain.test(href);
      if (isExternal) {
        node.properties = {
          ...node.properties,
          target: "_blank",
          rel: "noopener noreferrer ugc",
        };
      } else {
        // Internal links: remove target
        delete node.properties?.target;
      }
    });
  };
}

// Rehype plugin: filter class values to allowlist
function rehypeClassFilter() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      const allowedClasses = classAllowlist[node.tagName];
      if (!allowedClasses) {
        delete node.properties?.class;
        return;
      }

      const classes = getClasses(node);
      const filtered = classes.filter((c) => allowedClasses.includes(c));
      if (filtered.length > 0) {
        node.properties = { ...node.properties, class: filtered.join(" ") };
      } else {
        delete node.properties?.class;
      }
    });
  };
}

function getClasses(node: Element): string[] {
  const cls = node.properties?.class ?? node.properties?.className;
  if (typeof cls === "string") return cls.split(/\s+/).filter(Boolean);
  if (Array.isArray(cls)) return cls.map(String);
  return [];
}

export async function processContent(html: string): Promise<{
  sanitizedHtml: string;
  headings: TocItem[];
  wordCount: number;
}> {
  const headings: TocItem[] = [];
  let wordCount = 0;

  const file = await unified()
    .use(rehypeParse, { fragment: true })
    // 1. Semantic transform BEFORE sanitize (adds classes that sanitize preserves)
    .use(rehypeSemanticTransform)
    // 2. Link validation BEFORE sanitize (adds rel/target that sanitize preserves)
    .use(rehypeValidateLinks)
    // 3. Class filter BEFORE sanitize (strips unknown classes)
    .use(rehypeClassFilter)
    // 4. Sanitize with strict schema
    .use(rehypeSanitize, sanitizeSchema)
    // 5. Slug generation (server-side, uses NFD normalize)
    .use(rehypeSlug, { prefix: "" })
    // 6. Extract headings + wordCount
    .use(() => (tree: Root) => {
      const plainText = toString(tree as unknown as Parameters<typeof toString>[0]);
      wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;

      visit(tree, "element", (node: Element) => {
        if (node.tagName === "h2" || node.tagName === "h3") {
          const id = node.properties?.id as string | undefined;
          if (id) {
            headings.push({
              id,
              text: toString(node),
              level: node.tagName === "h2" ? 2 : 3,
            });
          }
        }
      });
    })
    .use(rehypeStringify)
    .process(html);

  return { sanitizedHtml: String(file), headings, wordCount };
}
