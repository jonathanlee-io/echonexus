import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Component, inject, input} from '@angular/core';

import {ProjectStore} from '../../../../+state/project/project.store';
import {ProductFeedbackSubmissionDto} from '../../../../dtos/projects/ProductFeedbackSubmissionDto';
import {PageChangedEvent, PaginatorComponent} from '../../paginator/paginator.component';

@Component({
  selector: 'app-product-feedback-dashboard-panel',
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    PaginatorComponent,
  ],
  templateUrl: './product-feedback-dashboard-panel.component.html',
  styleUrl: './product-feedback-dashboard-panel.component.scss',
})
export class ProductFeedbackDashboardPanelComponent {
  productFeedbackSubmissions = input.required<(ProductFeedbackSubmissionDto & {serverResponseTime: string})[]>();
  projectId = input.required<string>();
  protected currentPage: number = 0;
  protected readonly projectStore = inject(ProjectStore);
  protected readonly itemsPerPage: number = 5;

  onPageChange($event: PageChangedEvent) {
    if ($event.pageChangedTo === this.currentPage) {
      return;
    } else if ($event.pageChangedTo < this.currentPage) {
      this.projectStore.setProductFeedbackSubmissionsOffset(this.projectStore.productFeedbackSubmissionsOffset() - 5);
    } else {
      this.projectStore.setProductFeedbackSubmissionsOffset(this.projectStore.productFeedbackSubmissionsOffset() + 5);
    }
    this.currentPage = $event.pageChangedTo;
    this.projectStore.loadProductFeedbackByProjectId(this.projectId());
  }
}
