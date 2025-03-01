import {Injectable, Logger} from '@nestjs/common';

import {POSTSuccessDto} from '../../../../lib/dto/POSTSuccess.dto';
import {UsersRepositoryService} from '../../repositories/users-repository/users-repository.service';

@Injectable()
export class AuthenticatedUsersService {
  constructor(
    private readonly logger: Logger,
    private readonly usersRepository: UsersRepositoryService,
  ) {}

  async checkIn(
    requestingUserSubjectId: string,
    requestingUserEmail: string,
  ): Promise<POSTSuccessDto & {isCreatedNew: boolean}> {
    const existingUser = await this.usersRepository.findBySupabaseIdOrEmail(
      requestingUserSubjectId,
      requestingUserEmail,
    );
    if (existingUser) {
      if (
        existingUser.supabaseUserId !== requestingUserSubjectId ||
        existingUser.email !== requestingUserEmail
      ) {
        this.usersRepository.updateUserSupabaseIdByEmail(
          requestingUserSubjectId,
          requestingUserEmail,
        );
      }
      return {isSuccessful: true, isCreatedNew: false};
    }
    this.logger.log(`Creating new user for <${requestingUserEmail}>`);
    await this.usersRepository.createUserFromAuthUser(
      requestingUserSubjectId,
      requestingUserEmail,
    );
    return {isSuccessful: true, isCreatedNew: true};
  }
}
