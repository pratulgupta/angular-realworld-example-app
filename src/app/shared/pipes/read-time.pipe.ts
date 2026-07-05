import { Pipe, PipeTransform } from '@angular/core';

const WORDS_PER_MINUTE = 200;

/**
 * Strip common Markdown syntax so only visible words remain:
 * a `# Heading` counts as one word, a `[text](url)` link counts "text"
 * (not the URL), and image embeds contribute no visible text.
 */
function stripMarkdown(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ') // images -> no visible text
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1') // links -> link text only
    .replace(/^\s*[#>\-*+]+\s*/gm, ' ') // heading/quote/list markers
    .replace(/[*_~]/g, ' '); // emphasis markers
}

@Pipe({ name: 'readTime', standalone: true })
export class ReadTimePipe implements PipeTransform {
  transform(body: string | null | undefined): number {
    const words = stripMarkdown(body ?? '')
      .split(/\s+/)
      .filter(word => word.length > 0);
    return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
  }
}
