import {NgIf} from '@angular/common';
import {Component, inject, input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {ButtonDirective} from 'primeng/button';
import {ArrowRightIcon} from 'primeng/icons';

import {ClientStore} from '../../../../+state/client/client.store';
import {ProjectStore} from '../../../../+state/project/project.store';
import {RoutePath} from '../../../../app.routes';
import {rebaseRoutePath} from '../../../../util/router/Router.utils';

@Component({
  selector: 'app-cancel-continue',
  imports: [
    ArrowRightIcon,
    ButtonDirective,
    NgIf,
    RouterLink,
  ],
  templateUrl: './cancel-continue.component.html',
  styleUrl: './cancel-continue.component.scss',
})
export class CancelContinueComponent {
  private readonly projectStore = inject(ProjectStore);
  protected readonly RoutePath = RoutePath;
  protected readonly rebaseRoutePath = rebaseRoutePath;
  protected readonly clientStore = inject(ClientStore);
  isNewClient = input.required<boolean>();
  isReadyToContinue = input.required<boolean>();
  cancelRoutePath = input.required<string>();
  clientDisplayNameFormControl = input.required<FormControl<string>>();
  subdomainFormControl = input.required<FormControl<string>>();
  bugReportsEnabledFormControl = input.required<FormControl<boolean>>();
  featureRequestsEnabledFormControl = input.required<FormControl<boolean>>();
  featureFeedbackEnabledFormControl = input.required<FormControl<boolean>>();

  doCreateProject() {
    if (!this.isReadyToContinue() ||
      (this.clientDisplayNameFormControl().invalid && this.clientDisplayNameFormControl().enabled) ||
      !this.subdomainFormControl().valid
    ) {
      return;
    }
    if (this.isNewClient()) {
      this.clientStore.registerNewClientAndProjectWithPlan(
          this.clientDisplayNameFormControl().value,
          this.subdomainFormControl().value,
          this.bugReportsEnabledFormControl().value,
          this.featureRequestsEnabledFormControl().value,
          this.featureFeedbackEnabledFormControl().value,
      );
      return;
    }
    const clientId = this.clientStore.clientById()?.id;
    if (!clientId) {
      return;
    }
    this.projectStore.createProjectForExistingClient(
        clientId,
        {
          clientId,
          name: this.subdomainFormControl().value,
          subdomain: this.subdomainFormControl().value,
          isBugReportsEnabled: this.bugReportsEnabledFormControl().value,
          isFeatureRequestsEnabled: this.featureRequestsEnabledFormControl().value,
          isFeatureFeedbackEnabled: this.featureFeedbackEnabledFormControl().value,
        },
    );
  }
}
