import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'readTime', standalone: true })
export class ReadTimePipe implements PipeTransform {
  transform(body: string | null | undefined): number | null {
    if (body == null) {
      console.error('[ReadTimePipe] article body is null or undefined');
      return null;
    }

    const text = body
      // Fenced code blocks: strip ``` markers, keep content words
      .replace(/```[\s\S]*?```/g, m => m.replace(/```/g, ''))
      // Images: keep alt text only
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      // Links: keep link text only
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // Headings: strip # prefix
      .replace(/^#{1,6}\s+/gm, '')
      // Inline code backticks
      .replace(/`/g, '')
      // Bold/italic/strikethrough markers
      .replace(/[*_~]/g, '');

    const words = text
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0);
    return Math.ceil(Math.max(1, words.length) / 200);
  }
}
