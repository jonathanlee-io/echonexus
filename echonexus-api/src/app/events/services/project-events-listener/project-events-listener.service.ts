import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {OnEvent} from '@nestjs/event-emitter';

import {PrismaService} from '../../../../lib/prisma/services/prisma.service';
import {ProjectCreatedEvent} from '../../../projects/events/ProjectCreated.event';

@Injectable()
export class ProjectEventsListenerService {
  constructor(
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  @OnEvent(ProjectCreatedEvent.eventName, {async: true})
  async createProductFromProject({
    requestingUserEmail,
    projectId,
  }: ProjectCreatedEvent) {
    this.logger.log(
      `User with e-mail: ${requestingUserEmail} Creating product for project ID: ${projectId}`,
    );
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }
    await this.prisma.product.create({
      data: {
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
  }
}
