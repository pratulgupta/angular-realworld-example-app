import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Article } from '../models/article.model';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DefaultImagePipe } from '../../../shared/pipes/default-image.pipe';

@Component({
  selector: 'app-article-meta',
  template: `
    <div class="article-meta">
      <a [routerLink]="['/profile', article.author.username]">
        <img [src]="article.author.image | defaultImage" />
      </a>

      <div class="info">
        <a class="author" [routerLink]="['/profile', article.author.username]">
          {{ article.author.username }}
        </a>
        <span class="date">
          {{ article.createdAt | date: 'longDate' }}
        </span>
        <span class="read-time">· {{ readTime }} min read</span>
      </div>

      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, DefaultImagePipe],
})
export class ArticleMetaComponent {
  @Input() article!: Article;

  // Estimated reading time, recomputed from the current article body on each
  // change detection so it never shows a value stale from a previous article.
  get readTime(): number {
    return readingTime(this.article?.body ?? '');
  }
}

const WORDS_PER_MINUTE = 200;

// Client-side reading-time estimate. Strips Markdown syntax before counting
// words (whitespace-split), then Math.ceil(words / 200) with a minimum of 1.
export function readingTime(body: string): number {
  const text = (body ?? '')
    // Drop image embeds entirely (alt text is not visible copy).
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    // Keep the visible text of links, drop the URL.
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Strip remaining Markdown punctuation (headings, emphasis, lists, code, rules).
    .replace(/[#>*_`~=+-]/g, ' ');

  const words = text.split(/\s+/).filter(word => word.length > 0);
  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
}
