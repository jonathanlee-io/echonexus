import * as fs from 'node:fs';
import * as path from 'node:path';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {EventEmitter2} from '@nestjs/event-emitter';

import {ApplicationConfig} from '../../../../lib/config/Application.config';
import {ClientsService} from '../../../clients/services/clients/clients.service';
import {CreateProjectDto} from '../../dto/CreateProject.dto';
import {UpdateProjectDto} from '../../dto/UpdateProject.dto';
import {ProjectCreatedEvent} from '../../events/ProjectCreated.event';
import {ProjectsRepositoryService} from '../../repositories/projects-repository/projects-repository.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectsRepository: ProjectsRepositoryService,
    private readonly clientsService: ClientsService,
    private readonly eventEmitter: EventEmitter2,
    private readonly applicationConfig: ApplicationConfig,
  ) {}

  async createProject(
    requestingUserSubjectId: string,
    createProjectDto: CreateProjectDto,
  ) {
    const client = await this.clientsService.getClientById(
      requestingUserSubjectId,
      createProjectDto.clientId,
    );
    if (
      !client.admins
        .map((admin) => admin.supabaseUserId)
        .includes(requestingUserSubjectId)
    ) {
      throw new ForbiddenException();
    }
    if (
      !(
        await this.clientsService.checkIfSubdomainAvailable({
          subdomain: createProjectDto.subdomain,
        })
      ).isSubdomainAvailable
    ) {
      return new BadRequestException('Subdomain already exists');
    }
    const project = await this.projectsRepository.create(
      requestingUserSubjectId,
      createProjectDto,
    );
    this.eventEmitter.emit(
      ProjectCreatedEvent.eventName,
      new ProjectCreatedEvent(requestingUserSubjectId, project.id),
    );
    return project;
  }

  async getProjectsWhereInvolved(requestingUserSubjectId: string) {
    return this.projectsRepository.getProjectsWhereInvolved(
      requestingUserSubjectId,
    );
  }

  async getProjectById(requestingUserSubjectId: string, projectId: string) {
    const project = await this.projectsRepository.findById(projectId);
    await this.clientsService.getClientById(
      requestingUserSubjectId,
      project.clientId,
    ); // Will throw not found or forbidden exception
    return project;
  }

  async updateProjectById(
    requestingUserSubjectId: string,
    projectId: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.projectsRepository.findById(projectId);
    const client = await this.clientsService.getClientById(
      requestingUserSubjectId,
      project.clientId,
    ); // Will throw not found or forbidden exception
    if (
      !client.admins
        .map((admin) => admin.supabaseUserId)
        .includes(requestingUserSubjectId)
    ) {
      throw new ForbiddenException();
    }
    return this.projectsRepository.updateProjectById(
      projectId,
      updateProjectDto,
    );
  }

  async getProjectsForClient(
    requestingUserSubjectId: string,
    clientId: string,
  ) {
    await this.clientsService.getClientById(requestingUserSubjectId, clientId); // Will throw not found or forbidden exception
    return this.projectsRepository.getProjectsForClient(clientId);
  }

  async getFeedbackWidgetScript(clientSubdomain: string) {
    if (
      !clientSubdomain ||
      clientSubdomain === 'www' ||
      clientSubdomain === 'echonexus'
    ) {
      return this.generateWidgetInitScript(clientSubdomain, {
        name: 'echonexus',
        subdomain: clientSubdomain,
        isBugReportsEnabled: true,
        isFeatureRequestsEnabled: true,
        isFeatureFeedbackEnabled: true,
      });
    }
    const [project] =
      await this.projectsRepository.findBySubdomain(clientSubdomain);
    return this.generateWidgetInitScript(clientSubdomain, {
      ...project,
    });
  }

  async getWidgetScript() {
    return fs.readFileSync(
      path.join(__dirname, '../../../../..', 'widget/dist/echonexus-widget.js'),
      'utf8',
    );
  }

  async deleteProjectById(requestingUserSubjectId: string, projectId: string) {
    const project = await this.projectsRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException(
        `Could not find project with id: ${projectId}`,
      );
    }
    const client = await this.clientsService.getClientById(
      requestingUserSubjectId,
      project.clientId,
    );
    if (
      !client.admins
        .map((admin) => admin.supabaseUserId)
        .includes(requestingUserSubjectId)
    ) {
      throw new ForbiddenException();
    }
    return this.projectsRepository.deleteProjectById(projectId);
  }

  private async generateWidgetInitScript(
    clientSubdomain: string,
    returnedProject: unknown,
  ) {
    let widgetSrc: string;
    if (this.applicationConfig.nodeEnv === 'production') {
      widgetSrc = `https://${clientSubdomain}.api.echonexus.io/v1/scripts/echonexus-widget.js`;
    } else if (this.applicationConfig.nodeEnv === 'staging') {
      widgetSrc = `https://${clientSubdomain}.api.echonexus-staging.com/v1/scripts/echonexus-widget.js`;
    } else {
      widgetSrc = `http://${clientSubdomain}.api.echonexus-local.com:8080/v1/scripts/echonexus-widget.js`;
    }
    return `
        (function (w,d,s,o,f,js,fjs) {
            w['JS-Widget']=o;w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
            js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
            js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
        }(window, document, 'script', 'mw', '${widgetSrc}'));
        mw('init', { project: ${returnedProject ? JSON.stringify(returnedProject) : null} } );
        mw('message', { project: ${returnedProject ? JSON.stringify(returnedProject) : null} });
    `;
  }
}
