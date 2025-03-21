import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Component, effect, inject, input, signal} from '@angular/core';

import {ProjectStore} from '../../../../+state/project/project.store';
import {ProductFeedbackSubmissionDto} from '../../../../dtos/projects/ProductFeedbackSubmissionDto';
import {PaginatorComponent} from '../../paginator/paginator.component';

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
  protected readonly currentPage = signal<number>(0);
  protected readonly projectStore = inject(ProjectStore);
  protected readonly itemsPerPage: number = 5;

  constructor() {
    let isInitialized = false;

    effect(() => {
      const page = this.currentPage();
      console.log('Inside effect', page);

      if (!isInitialized) {
        isInitialized = true;
        console.log('Skipping initial effect');
        return;
      }

      const offset = page * this.itemsPerPage;
      this.projectStore.setProductFeedbackSubmissionsOffset(offset);
      this.projectStore.loadProductFeedbackByProjectId(String(this.projectStore.projectById()?.id));
    });
  }
}
