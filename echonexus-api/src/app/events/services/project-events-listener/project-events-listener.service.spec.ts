import {TestBed} from '@suites/unit';

import {ProjectEventsListenerService} from './project-events-listener.service';

describe('ProjectEventsListenerService', () => {
  let service: ProjectEventsListenerService;

  beforeEach(async () => {
    const {unit} = await TestBed.solitary(
      ProjectEventsListenerService,
    ).compile();

    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
