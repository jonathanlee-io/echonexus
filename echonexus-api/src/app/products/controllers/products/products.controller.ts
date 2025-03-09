import {Controller, Get, Ip, Logger, Query} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Throttle} from '@nestjs/throttler';
import {DateTime} from 'luxon';

import {CurrentUser} from '../../../../lib/auth/decorators/current-user/current-user.decorator';
import {IsPublic} from '../../../../lib/auth/decorators/is-public/is-public.decorator';
import {CurrentUserDto} from '../../../../lib/auth/dto/CurrentUserDto';

@ApiTags('Products')
@Controller()
export class ProductsController {
  @IsPublic()
  @Throttle({default: {limit: 3, ttl: 60_000}})
  @Get('feedback')
  async receiveFeedback(
    @CurrentUser() {clientSubdomain}: CurrentUserDto,
    @Query() query: any,
    @Ip() ip: string,
  ) {
    Logger.log('Saving feedback', {
      clientMetadata: {ip, clientSubdomain},
      query,
      submittedAt: DateTime.now().toISO(),
    });
  }
}
