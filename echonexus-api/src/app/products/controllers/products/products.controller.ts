import {Body, Controller, Ip, Logger, Param, Post} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Throttle} from '@nestjs/throttler';
import {DateTime} from 'luxon';

import {CurrentUser} from '../../../../lib/auth/decorators/current-user/current-user.decorator';
import {CurrentUserDto} from '../../../../lib/auth/dto/CurrentUserDto';
import {SubdomainParamDto} from '../../../../lib/dto/SubdomainParam.dto';
import {SubmitProductFeedbackRequestDto} from '../../dto/SubmitProductFeedbackRequest.dto';

@ApiTags('Products')
@Controller()
export class ProductsController {
  @Throttle({default: {limit: 3, ttl: 60_000}})
  @Post('feedback/:subdomain')
  async receiveFeedback(
    @CurrentUser() {clientSubdomain}: CurrentUserDto,
    @Body() {widgetMetadata, userFeedback}: SubmitProductFeedbackRequestDto,
    @Param() {subdomain: urlSubdomain}: SubdomainParamDto,
    @Ip() ip: string,
  ) {
    Logger.log('Saving feedback', {
      clientMetadata: {ip, clientSubdomain, urlSubdomain},
      widgetMetadata,
      userFeedback,
      submittedAt: DateTime.now().toISO(),
    });
  }
}
