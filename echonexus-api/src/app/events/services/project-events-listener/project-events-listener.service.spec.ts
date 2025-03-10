import { Test, TestingModule } from '@nestjs/testing';
import { ProjectEventsListenerService } from './project-events-listener.service';

describe('ProjectEventsListenerService', () => {
  let service: ProjectEventsListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectEventsListenerService],
    }).compile();

    service = module.get<ProjectEventsListenerService>(ProjectEventsListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
