import {Mocked, TestBed} from '@suites/unit';

import {AuthenticatedUsersController} from './authenticated-users.controller';
import {AuthenticatedUsersService} from '../../services/authenticated-users/authenticated-users.service';

describe('AuthenticatedUsersController', () => {
  let controller: AuthenticatedUsersController;
  let mockAuthenticatedUserService: Mocked<AuthenticatedUsersService>;

  beforeEach(async () => {
    const {unit, unitRef} = await TestBed.solitary(
      AuthenticatedUsersController,
    ).compile();

    controller = unit;
    mockAuthenticatedUserService = unitRef.get<AuthenticatedUsersService>(
      AuthenticatedUsersService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockAuthenticatedUserService).toBeDefined();
  });
});
