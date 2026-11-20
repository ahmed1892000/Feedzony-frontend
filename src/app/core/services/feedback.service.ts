import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Feedback } from '../models/feedback.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly storageKey = 'feedzony_feedbacks';
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly entries = signal<Feedback[]>(this.readEntries());

  readonly feedback = this.entries.asReadonly();
  readonly totalCount = computed(() => this.getTotalFeedbacks());
  readonly averageRating = computed(() => this.getAverageRating());

  getFeedbacks(): Feedback[] {
    return [...this.entries()];
  }

  addFeedback(feedback: Feedback): void {
    const feedbacks = this.getFeedbacks();
    feedbacks.unshift(feedback);
    this.persist(feedbacks);
    this.entries.set(feedbacks);
  }

  getAverageRating(): number {
    const feedbacks = this.getFeedbacks();
    if (feedbacks.length === 0) {
      return 0;
    }

    const total = feedbacks.reduce((sum, item) => sum + item.rating, 0);
    return Number((total / feedbacks.length).toFixed(1));
  }

  getTotalFeedbacks(): number {
    return this.getFeedbacks().length;
  }

  private readEntries(): Feedback[] {
    if (!this.isBrowser) {
      return [];
    }

    const storedEntries = localStorage.getItem(this.storageKey);
    return storedEntries ? (JSON.parse(storedEntries) as Feedback[]) : [];
  }

  private persist(entries: Feedback[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, JSON.stringify(entries));
    }
  }
}
