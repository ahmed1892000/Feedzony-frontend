import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { AuthActionsComponent } from '../../core/components/auth-actions.component';
import { FeedbackService } from '../../core/services/feedback.service';

const CATEGORIES = ['Product', 'Support', 'Content', 'Other'];
const CATEGORY_COLORS = ['#df6947', '#e9b568', '#739a7d', '#a8a0bd'];

@Component({
  selector: 'app-dashboard',
  imports: [AuthActionsComponent, BaseChartDirective, DatePipe, DecimalPipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private readonly feedbackService = inject(FeedbackService);

  readonly feedback = this.feedbackService.feedback;
  readonly totalCount = this.feedbackService.totalCount;
  readonly averageRating = this.feedbackService.averageRating;
  readonly categories = computed(() =>
    [...this.categoryCounts().keys()].map((name, index) => ({
      name,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    })),
  );
  readonly activeCategoryCount = computed(
    () => [...this.categoryCounts().values()].filter((count) => count > 0).length,
  );
  readonly categoryCounts = computed(() => {
    const counts = new Map<string, number>(CATEGORIES.map((category) => [category, 0]));
    for (const entry of this.feedback()) {
      counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
    }
    return counts;
  });

  readonly chartData = computed<ChartData<'doughnut'>>(() => ({
    labels: this.categories().map((category) => category.name),
    datasets: [
      {
        data: this.categories().map((category) => this.categoryCounts().get(category.name) ?? 0),
        backgroundColor: this.categories().map((category) => category.color),
        borderWidth: 0,
        hoverOffset: 5,
      },
    ],
  }));
  readonly chartOptions: ChartOptions<'doughnut'> = {
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    maintainAspectRatio: false,
  };
}
