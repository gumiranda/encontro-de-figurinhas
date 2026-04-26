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
    "figure", "figcaption", "aside", "section", "span", "div",
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
    div: ["class"],
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
  span: ["rarity-rank", "rarity-price", "amount", "label", "callout-icon"],
  div: ["rarity-info", "rarity-price"],
  p: ["lead"],
};

// Warning keywords for callout detection
const WARN_KEYWORDS = /\b(atenção|cuidado|aviso|alerta|importante|warning)\b/i;
const INFO_KEYWORDS = /\b(dica|nota|lembre|saiba|info|tip)\b/i;
const CTA_KEYWORDS = /\b(começar|criar conta|cadastr|inscreva|baixar|download|experimente)\b/i;
// Price pattern: R$ followed by numbers (with optional . or , separators)
const PRICE_PATTERN = /R\$\s*[\d.,]+/;

// Rehype plugin: auto-detect semantic patterns and transform
function rehypeSemanticTransform() {
  return (tree: Root) => {
    let foundLead = false;

    // First pass: find and mark lead paragraph (first substantial <p>)
    visit(tree, "element", (node: Element, index, parent) => {
      if (foundLead) return;
      if (node.tagName !== "p") return;
      if (!parent || parent.type !== "root") return;

      const text = toString(node);
      // Lead: first paragraph with >80 chars, no images
      if (text.length > 80 && !hasChildTag(node, "img")) {
        node.properties = { ...node.properties, class: "lead" };
        foundLead = true;
      }
    });

    // Second pass: transform blockquotes to callouts
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "blockquote") return;

      const text = toString(node);
      const isWarn = WARN_KEYWORDS.test(text);
      const isInfo = INFO_KEYWORDS.test(text) || text.length > 50;

      if (isWarn || isInfo) {
        node.tagName = "aside";
        node.properties = {
          ...node.properties,
          role: "note",
          class: isWarn
            ? "blog-card card-grid callout callout-warn"
            : "blog-card card-grid callout",
        };
      }
    });

    // Third pass: transform ordered lists with prices to rarity cards
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "ol") return;

      const items = node.children.filter(
        (c): c is Element => c.type === "element" && c.tagName === "li"
      );

      // Check if list items have price patterns
      const hasRarityPattern = items.some((li) => {
        const text = toString(li);
        return PRICE_PATTERN.test(text);
      });

      if (!hasRarityPattern || items.length === 0) return;

      // Transform each <li> to a rarity card figure
      const rarityCards: Element[] = items.map((li, i) => {
        const text = toString(li);
        const priceMatch = text.match(PRICE_PATTERN);
        const price = priceMatch ? priceMatch[0] : "";
        // Extract title: everything before the price or em-dash
        const titlePart = text.split(/[—–-]\s*R\$/)[0] || text.split(PRICE_PATTERN)[0] || text;
        const title = titlePart.replace(/^\d+[\.\)]\s*/, "").trim();

        return {
          type: "element" as const,
          tagName: "figure",
          properties: { class: "blog-card card-grid rarity-card" },
          children: [
            {
              type: "element" as const,
              tagName: "span",
              properties: { class: "rarity-rank" },
              children: [{ type: "text" as const, value: String(i + 1).padStart(2, "0") }],
            },
            {
              type: "element" as const,
              tagName: "div",
              properties: { class: "rarity-info" },
              children: [
                {
                  type: "element" as const,
                  tagName: "h4",
                  properties: {},
                  children: [{ type: "text" as const, value: title }],
                },
              ],
            },
            ...(price
              ? [
                  {
                    type: "element" as const,
                    tagName: "div",
                    properties: { class: "rarity-price" },
                    children: [
                      {
                        type: "element" as const,
                        tagName: "span",
                        properties: { class: "amount" },
                        children: [{ type: "text" as const, value: price }],
                      },
                      {
                        type: "element" as const,
                        tagName: "span",
                        properties: { class: "label" },
                        children: [{ type: "text" as const, value: "valor médio" }],
                      },
                    ],
                  },
                ]
              : []),
          ],
        };
      });

      // Replace <ol> with the rarity cards
      if (parent && typeof index === "number") {
        (parent.children as Element[]).splice(index, 1, ...rarityCards);
      }
    });

    // Fourth pass: detect CTA paragraphs (links with CTA text)
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "p") return;

      const hasCtaLink = node.children.some((child) => {
        if (child.type !== "element" || child.tagName !== "a") return false;
        const linkText = toString(child);
        return CTA_KEYWORDS.test(linkText);
      });

      if (hasCtaLink) {
        node.tagName = "section";
        node.properties = {
          ...node.properties,
          class: "blog-card card-grid inline-cta",
        };
      }
    });

    // Fifth pass: handle explicit div classes (backwards compat)
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

function hasChildTag(node: Element, tagName: string): boolean {
  return node.children.some(
    (c) => c.type === "element" && c.tagName === tagName
  );
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
