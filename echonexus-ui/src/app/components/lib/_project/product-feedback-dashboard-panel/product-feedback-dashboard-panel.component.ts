import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Component, input} from '@angular/core';

import {ProductFeedbackSubmissionDto} from '../../../../dtos/projects/ProductFeedbackSubmissionDto';

@Component({
  selector: 'app-product-feedback-dashboard-panel',
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
  ],
  templateUrl: './product-feedback-dashboard-panel.component.html',
  styleUrl: './product-feedback-dashboard-panel.component.scss',
})
export class ProductFeedbackDashboardPanelComponent {
  productFeedbackSubmissions = input.required<(ProductFeedbackSubmissionDto & {serverResponseTime: string})[]>();
}
