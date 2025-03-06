import {Body, Controller, Ip, Logger, Param, Post} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Throttle} from '@nestjs/throttler';
import {DateTime} from 'luxon';

import {ApiGatewayRequestHeaders} from '../../../../lib/auth/api-gateway/decorators/api-gateway-request-headers.decorator';
import {ApiGatewayRequestHeadersDto} from '../../../../lib/auth/api-gateway/domain/ApiGatewayRequestHeaders.dto';
import {SubdomainParamDto} from '../../../../lib/dto/SubdomainParam.dto';
import {SubmitProductFeedbackRequestDto} from '../../dto/SubmitProductFeedbackRequest.dto';

@ApiTags('Products')
@Controller()
export class ProductsController {
  @Throttle({default: {limit: 3, ttl: 60_000}})
  @Post('feedback/:subdomain')
  async receiveFeedback(
    @ApiGatewayRequestHeaders() {clientSubdomain}: ApiGatewayRequestHeadersDto,
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
