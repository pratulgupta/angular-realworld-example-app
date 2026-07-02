/**
 * Estimated read time in minutes for an article body.
 *
 * Strips Markdown syntax down to plain text, counts whitespace-separated
 * words, and divides by an assumed reading speed of 200 words per minute.
 * The result is floored at a minimum of 1 minute so an empty, null, or
 * prose-free body still renders `1 min read` rather than `0 min read`.
 */
const WORDS_PER_MINUTE = 200;

export function readTimeMinutes(body: string | null | undefined): number {
  const text = stripMarkdown(body ?? '');
  const words = text.split(/\s+/).filter(word => word.length > 0);
  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
}

function stripMarkdown(body: string): string {
  return (
    body
      // Fenced code blocks (``` ... ``` and ~~~ ... ~~~): remove entirely.
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/~~~[\s\S]*?~~~/g, ' ')
      // Images ![alt](url): remove entirely (no words counted).
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      // Links [text](url): keep the link text, drop the URL.
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // Inline code `code`: strip backticks, keep the enclosed text.
      .replace(/`([^`]*)`/g, '$1')
      // Headings: strip leading # characters.
      .replace(/^\s*#+\s*/gm, '')
      // Emphasis / bold markers (*, **, _, __): strip the markers.
      .replace(/(\*\*|__|\*|_)/g, '')
  );
}
