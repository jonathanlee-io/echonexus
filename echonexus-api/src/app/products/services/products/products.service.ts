import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {OnEvent} from '@nestjs/event-emitter';

import {ProjectCreatedEvent} from '../../../projects/events/ProjectCreated.event';
import {ProjectsService} from '../../../projects/services/projects/projects.service';
import {ProductsRepositoryService} from '../../repositories/products-repository/products-repository.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly logger: Logger,
    private readonly productsRepository: ProductsRepositoryService,
    private readonly projectsService: ProjectsService,
  ) {}

  @OnEvent(ProjectCreatedEvent.eventName, {async: true})
  async createProductFromProject({
    requestingUserSubjectId,
    projectId,
  }: ProjectCreatedEvent) {
    this.logger.log(
      `User with subject ID: ${requestingUserSubjectId} Creating product for project ID: ${projectId}`,
    );
    const project = await this.projectsService.getProjectById(
      requestingUserSubjectId,
      projectId,
    );
    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }
    return this.productsRepository.createProduct(project.id);
  }
}
