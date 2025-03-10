import {Controller, Get, Ip, Param, Query} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Throttle} from '@nestjs/throttler';
import {DateTime} from 'luxon';

import {CurrentUser} from '../../../../lib/auth/decorators/current-user/current-user.decorator';
import {IsPublic} from '../../../../lib/auth/decorators/is-public/is-public.decorator';
import {CurrentUserDto} from '../../../../lib/auth/dto/CurrentUserDto';
import {IdParamDto} from '../../../../lib/validation/id.param.dto';
import {SubmitProductFeedbackRequestDto} from '../../dto/SubmitProductFeedbackRequest.dto';
import {ProductsService} from '../../services/products/products.service';

@ApiTags('Products')
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @IsPublic()
  @Throttle({default: {limit: 3, ttl: 60_000}})
  @Get('feedback')
  async receiveFeedback(
    @CurrentUser() {clientSubdomain}: CurrentUserDto,
    @Query()
    {
      userFeedback,
      widgetMetadataType,
      widgetMetadataUrl,
      widgetMetadataTimezone,
    }: SubmitProductFeedbackRequestDto,
    @Ip() ip: string,
  ) {
    await this.productsService.submitProductFeedback({
      clientSubdomain,
      userFeedback,
      widgetMetadataType,
      widgetMetadataUrl,
      widgetMetadataTimezone,
      ip,
      submittedAt: DateTime.now().toISO(),
    });
  }

  @Get('feedback/:id')
  async getFeedbackForProductById(
    @CurrentUser() {requestingUserId}: CurrentUserDto,
    @Param() {id: projectId}: IdParamDto,
  ) {
    return this.productsService.getProductFeedbackForProjectId(
      requestingUserId,
      projectId,
    );
  }
}
