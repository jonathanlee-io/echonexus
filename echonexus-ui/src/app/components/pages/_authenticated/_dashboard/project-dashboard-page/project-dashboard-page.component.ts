import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {FormControl, FormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {uuid} from '@supabase/supabase-js/dist/main/lib/helpers';
import {DateTime} from 'luxon';
import {ButtonModule} from 'primeng/button';
import {filter, Subscription, tap} from 'rxjs';

import {ProjectStore} from '../../../../../+state/project/project.store';
import {RoutePath} from '../../../../../app.routes';
import {ProductFeedbackSubmissionDto} from '../../../../../dtos/projects/ProductFeedbackSubmissionDto';
import {ProjectDto} from '../../../../../dtos/projects/Project.dto';
import {rebaseRoutePath, rebaseRoutePathAsString} from '../../../../../util/router/Router.utils';
import {
  ProductFeedbackDashboardPanelComponent,
} from '../../../../lib/_project/product-feedback-dashboard-panel/product-feedback-dashboard-panel.component';
import {
  ProjectActionsPanelComponent,
} from '../../../../lib/_project/project-actions-panel/project-actions-panel.component';
import {
  ProjectFeaturesSwitchesComponent,
} from '../../../../lib/_project/project-features-switches/project-features-switches.component';

@Component({
  selector: 'app-project-dashboard-page',
  imports: [
    ButtonModule,
    ProjectFeaturesSwitchesComponent,
    FormsModule,
    ProjectActionsPanelComponent,
    ProductFeedbackDashboardPanelComponent,
  ],
  templateUrl: './project-dashboard-page.component.html',
  styleUrl: './project-dashboard-page.component.scss',
})
export class ProjectDashboardPageComponent implements OnInit, OnDestroy {
  bugReportsEnabledFormControl = new FormControl<boolean>(true, {
    nonNullable: true,
    validators: [Validators.required],
  });
  featureRequestsEnabledFormControl = new FormControl<boolean>(true, {
    nonNullable: true,
    validators: [Validators.required],
  });
  featureFeedbackEnabledFormControl = new FormControl<boolean>(true, {
    nonNullable: true,
    validators: [Validators.required],
  });
  productFeedbackSubmissions: (ProductFeedbackSubmissionDto & {serverResponseTime: string})[] = this.generateSampleData(10);
  protected readonly projectStore = inject(ProjectStore);
  protected readonly rebaseRoutePath = rebaseRoutePath;
  protected readonly RoutePath = RoutePath;
  protected readonly rebaseRoutePathAsString = rebaseRoutePathAsString;
  private readonly route = inject(ActivatedRoute);
  private readonly bugReportsSubscription: Subscription;
  private readonly featureRequestsSubscription: Subscription;
  private readonly featureFeedbackSubscription: Subscription;
  private routeParamsSubscription?: Subscription;
  private projectByIdSubscription?: Subscription;

  constructor() {
    this.projectByIdSubscription = toObservable<ProjectDto | null>(this.projectStore.projectById).pipe(
        filter((value) => !!value),
        tap((projectById) => {
          this.bugReportsEnabledFormControl.setValue(projectById.isBugReportsEnabled, {emitEvent: false});
          this.featureRequestsEnabledFormControl.setValue(projectById.isFeatureRequestsEnabled, {emitEvent: false});
          this.featureFeedbackEnabledFormControl.setValue(projectById.isFeatureFeedbackEnabled, {emitEvent: false});
        }),
    ).subscribe();

    this.bugReportsSubscription = this.bugReportsEnabledFormControl.valueChanges.pipe(
        tap((newValue) => this.updateProjectFormControlValue({isBugReportsEnabled: newValue})),
    ).subscribe();

    this.featureRequestsSubscription = this.featureRequestsEnabledFormControl.valueChanges.pipe(
        tap((newValue) => this.updateProjectFormControlValue({isFeatureRequestsEnabled: newValue})),
    ).subscribe();

    this.featureFeedbackSubscription = this.featureFeedbackEnabledFormControl.valueChanges.pipe(
        tap((newValue) => this.updateProjectFormControlValue({isFeatureFeedbackEnabled: newValue})),
    ).subscribe();

    this.productFeedbackSubmissions = this.productFeedbackSubmissions.map((submission) => ({
      ...submission,
      serverResponseTime: String(DateTime
          .fromJSDate(new Date(submission.submittedAt))
          .diff(
              DateTime.fromJSDate(new Date(submission.createdAt)),
              ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'],
          ).toMillis()),
    }));
  }

  ngOnInit() {
    this.routeParamsSubscription = this.route.params.pipe(
        tap((params) => {
          this.projectStore.loadProjectById(params['projectId']);
        }),
    ).subscribe();
  }

  ngOnDestroy() {
    this.routeParamsSubscription?.unsubscribe();
    this.projectByIdSubscription?.unsubscribe();
    this.bugReportsSubscription.unsubscribe();
    this.featureRequestsSubscription.unsubscribe();
    this.featureFeedbackSubscription.unsubscribe();
  }

  private updateProjectFormControlValue(updateProjectValue: Partial<ProjectDto>) {
    const projectById = this.projectStore.projectById();
    if (!projectById) {
      return;
    }
    this.projectStore.updateProjectById(projectById.id, {...projectById, ...updateProjectValue});
  }

  private generateSampleData(count: number): (ProductFeedbackSubmissionDto & {serverResponseTime: string})[] {
    const data: (ProductFeedbackSubmissionDto & {serverResponseTime: string})[] = [];
    for (let i = 0; i < count; i++) {
      data.push({
        id: uuid(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
        serverResponseTime: Math.random() * 1000 + 'ms',
        productId: `product-${i + 1}`,
        clientIp: `192.168.1.${i + 1}`,
        clientSubdomain: `example-${i + 1}.com`,
        widgetMetadataType: 'feedback',
        widgetMetadataUrl: '/feedback',
        widgetMetadataTimezone: 'UTC',
        userFeedback: `Sample feedback ${i + 1}`,
      });
    }
    return data;
  }
}
