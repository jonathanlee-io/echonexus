import {NgIf} from '@angular/common';
import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ButtonDirective, ButtonIcon, ButtonLabel} from 'primeng/button';
import {ProgressSpinner} from 'primeng/progressspinner';

import {ProjectStore} from '../../../../+state/project/project.store';
import {RoutePath} from '../../../../app.routes';
import {rebaseRoutePathAsString} from '../../../../util/router/Router.utils';

@Component({
  selector: 'app-project-actions-panel',
  imports: [
    NgIf,
    ProgressSpinner,
    ButtonDirective,
    ButtonIcon,
    RouterLink,
    ButtonLabel,
  ],
  templateUrl: './project-actions-panel.component.html',
  styleUrl: './project-actions-panel.component.scss',
})
export class ProjectActionsPanelComponent {
  protected readonly projectStore = inject(ProjectStore);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  getProductPath() {
    const projectById = this.projectStore.projectById();
    if (!projectById) {
      return;
    }
    return rebaseRoutePathAsString(RoutePath.PRODUCT_PAGE.replace(':subdomain', projectById.subdomains?.[0]?.subdomain));
  }

  promptDeleteProject() {
    const projectById = this.projectStore.projectById();
    if (!projectById) {
      return;
    }
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${projectById.name} permanently?`,
      acceptButtonStyleClass: 'p-button-danger',
      acceptIcon: 'pi pi-trash',
      rejectIcon: 'pi pi-times',
      closable: false,
      accept: () =>
        this.projectStore.deleteProjectById(projectById.id),
    });
  }
}
