import {Logger, Module} from '@nestjs/common';

import {ProjectsController} from './controllers/projects/projects.controller';
import {ProjectsRepositoryService} from './repositories/projects-repository/projects-repository.service';
import {ProjectsService} from './services/projects/projects.service';
import {PrismaModule} from '../../lib/prisma/prisma.module';
import {ClientsModule} from '../clients/clients.module';
import {UsersModule} from '../users/users.module';

@Module({
  imports: [PrismaModule, ClientsModule, UsersModule],
  controllers: [ProjectsController],
  providers: [
    {
      provide: Logger,
      useFactory: () => new Logger(ProjectsModule.name),
    },
    ProjectsService,
    ProjectsRepositoryService,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
