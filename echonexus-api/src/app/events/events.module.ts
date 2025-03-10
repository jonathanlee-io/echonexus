import {Logger, Module} from '@nestjs/common';

import {ProjectEventsListenerService} from './services/project-events-listener/project-events-listener.service';
import {PrismaModule} from '../../lib/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: Logger,
      useFactory: () => new Logger(EventsModule.name),
    },
    ProjectEventsListenerService,
  ],
})
export class EventsModule {}
