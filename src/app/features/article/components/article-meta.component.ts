import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Article } from '../models/article.model';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DefaultImagePipe } from '../../../shared/pipes/default-image.pipe';
import { readTimeMinutes } from '../utils/read-time';

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
  styles: [
    `
      .read-time {
        color: var(--danger);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, DefaultImagePipe],
})
export class ArticleMetaComponent {
  @Input() article!: Article;

  get readTime(): number {
    return readTimeMinutes(this.article.body);
  }
}
