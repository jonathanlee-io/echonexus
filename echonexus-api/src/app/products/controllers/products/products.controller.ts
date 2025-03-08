import {Controller, Ip, Logger, Param, Post, Query} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Throttle} from '@nestjs/throttler';
import {DateTime} from 'luxon';

import {CurrentUser} from '../../../../lib/auth/decorators/current-user/current-user.decorator';
import {IsPublic} from '../../../../lib/auth/decorators/is-public/is-public.decorator';
import {CurrentUserDto} from '../../../../lib/auth/dto/CurrentUserDto';
import {SubdomainParamDto} from '../../../../lib/dto/SubdomainParam.dto';

@ApiTags('Products')
@Controller()
export class ProductsController {
  @IsPublic()
  @Throttle({default: {limit: 3, ttl: 60_000}})
  @Post('feedback/:subdomain')
  async receiveFeedback(
    @CurrentUser() {clientSubdomain}: CurrentUserDto,
    @Param() {subdomain: urlSubdomain}: SubdomainParamDto,
    @Query() query: any,
    @Ip() ip: string,
  ) {
    Logger.log('Saving feedback', {
      clientMetadata: {ip, clientSubdomain, urlSubdomain},
      query,
      submittedAt: DateTime.now().toISO(),
    });
  }
}
