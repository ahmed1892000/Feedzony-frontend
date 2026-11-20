import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Feedback } from '../../core/models/feedback.model';
import { FeedbackService } from '../../core/services/feedback.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
})
export class FeedbackComponent {
  submitted = false;

  readonly feedbackForm: FormGroup<{
    businessName: FormControl<string>;
    customerName: FormControl<string>;
    email: FormControl<string>;
    rating: FormControl<number>;
    category: FormControl<string>;
    comment: FormControl<string>;
  }>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly feedbackService: FeedbackService,
  ) {
    this.feedbackForm = this.fb.nonNullable.group({
      businessName: ['', [Validators.required, Validators.maxLength(120)]],
      customerName: ['', [Validators.required, Validators.maxLength(80)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      category: ['Service Quality', Validators.required],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    });
  }

  setRating(value: number): void {
    this.feedbackForm.patchValue({ rating: value });
  }

  submitFeedback(): void {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

    const feedback: Feedback = {
      id: Date.now(),
      ...this.feedbackForm.getRawValue(),
      createdAt: new Date().toISOString(),
    };

    this.feedbackService.addFeedback(feedback);
    this.submitted = true;
    this.feedbackForm.reset({
      businessName: '',
      customerName: '',
      email: '',
      rating: 5,
      category: 'Service Quality',
      comment: '',
    });
  }
}
