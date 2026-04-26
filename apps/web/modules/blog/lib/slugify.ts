export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics (PT-BR: ção → cao)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function validateSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && !slug.includes("..");
}
