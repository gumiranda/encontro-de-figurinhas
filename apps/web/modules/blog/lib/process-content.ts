// Cacheado via ISR. Não chamar em SSR puro.
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Element } from "hast";

export type TocItem = { id: string; text: string; level: 2 | 3 };

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    h1: [...(defaultSchema.attributes?.["h1"] || []), "id"],
    h2: [...(defaultSchema.attributes?.["h2"] || []), "id"],
    h3: [...(defaultSchema.attributes?.["h3"] || []), "id"],
    h4: [...(defaultSchema.attributes?.["h4"] || []), "id"],
    h5: [...(defaultSchema.attributes?.["h5"] || []), "id"],
    h6: [...(defaultSchema.attributes?.["h6"] || []), "id"],
    a: [
      ...(defaultSchema.attributes?.["a"] || []),
      "href",
      "target",
      "rel",
    ],
    img: [
      ...(defaultSchema.attributes?.["img"] || []),
      "src",
      "alt",
      "width",
      "height",
      "loading",
      "decoding",
    ],
  },
};

export async function processContent(html: string): Promise<{
  sanitizedHtml: string;
  headings: TocItem[];
}> {
  const headings: TocItem[] = [];

  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeSlug)
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(() => (tree) => {
      visit(tree, "element", (node: Element) => {
        if (node.tagName === "h2" || node.tagName === "h3") {
          const id = node.properties?.id as string | undefined;
          if (id) {
            const text = toString(node);
            headings.push({
              id,
              text,
              level: node.tagName === "h2" ? 2 : 3,
            });
          }
        }
      });
    })
    .use(rehypeStringify)
    .process(html);

  return { sanitizedHtml: String(file), headings };
}
