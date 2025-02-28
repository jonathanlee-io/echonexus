import {HttpStatus, INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {StartedPostgreSqlContainer} from '@testcontainers/postgresql';
import {Client} from 'pg';
import * as request from 'supertest';

import {AppModule} from '../src/app/app.module';
import {e2eTestTimeout} from '../src/lib/constants/testing/integration-testing.constants';
import {initApp} from '../src/lib/init/init-app';
import {
  createMockCreateClientDto,
  createMockRequestingUser,
  initializePostgresTestContainer,
  tearDownPostgresTestContainer,
} from '../src/lib/util/tests.helpers.util';

describe('AppController (e2e)', () => {
  jest.setTimeout(e2eTestTimeout);

  let app: INestApplication;
  let postgresContainer: StartedPostgreSqlContainer;
  let postgresClient: Client;

  const mockUser = createMockRequestingUser();

  beforeAll(async () => {
    const {initializedPostgresContainer, initializedPostgresClient} =
      await initializePostgresTestContainer();
    postgresContainer = initializedPostgresContainer;
    postgresClient = initializedPostgresClient;
  });

  afterAll(async () => {
    await tearDownPostgresTestContainer(postgresContainer, postgresClient);
  });

  beforeEach(async () => {
    process.env['DATABASE_URL'] = postgresContainer.getConnectionUri();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    initApp(app);

    await app.init();
    await app.listen(3000);
  });

  afterEach(async () => {
    await app.close();
  });

  it('/v1/clients/create [POST]', async () => {
    const payload = createMockCreateClientDto();

    await request(app.getHttpServer())
      .post('/v1/users/authenticated/check-in')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-Requesting-User-Subject-Id', mockUser.userSubjectId)
      .set('X-Requesting-User-Email', mockUser.email)
      .expect(HttpStatus.OK)
      .then((response) => {
        console.log(response.body);
      });

    return request(app.getHttpServer())
      .post('/v1/clients/create')
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-Requesting-User-Subject-Id', mockUser.userSubjectId)
      .set('X-Requesting-User-Email', mockUser.email)
      .expect(HttpStatus.CREATED)
      .then((response) => {
        console.log(response.body);
      });
  });
});
