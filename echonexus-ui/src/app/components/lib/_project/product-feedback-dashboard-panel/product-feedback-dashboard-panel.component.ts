import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Component, inject, input, OnInit} from '@angular/core';
import {Paginator, PaginatorState} from 'primeng/paginator';

import {ProjectStore} from '../../../../+state/project/project.store';
import {ProductFeedbackSubmissionDto} from '../../../../dtos/projects/ProductFeedbackSubmissionDto';

@Component({
  selector: 'app-product-feedback-dashboard-panel',
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    Paginator,
  ],
  templateUrl: './product-feedback-dashboard-panel.component.html',
  styleUrl: './product-feedback-dashboard-panel.component.scss',
})
export class ProductFeedbackDashboardPanelComponent implements OnInit {
  productFeedbackSubmissions = input.required<(ProductFeedbackSubmissionDto & {serverResponseTime: string})[]>();
  projectId = input.required<string>();

  protected first: number = 0;
  protected rows: number = 10;

  protected readonly projectStore = inject(ProjectStore);

  onPageChange($event: PaginatorState) {
    this.first = $event.first ?? 0;
    this.rows = $event.rows ?? 5;
    this.projectStore.setProductFeedbackSubmissionsOffset(($event.page ?? 0) * 5);
    this.projectStore.loadProductFeedbackByProjectId(this.projectId());
  }

  ngOnInit() {
    this.rows = this.projectStore.productFeedbackSubmissions().length;
  }
}
