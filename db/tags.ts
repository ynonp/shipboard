/** Lowercase, trim, strip leading "#", collapse whitespace to dashes. */
export function normalizeTag(input: string): string {
  return input
    .trim()
    .replace(/^#+/, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .slice(0, 30);
}
