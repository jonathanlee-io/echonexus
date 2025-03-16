import {
  Controller,
  Get,
  HttpStatus,
  Ip,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
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

  @IsPublic()
  @Get('config')
  async getProductConfig(
    @CurrentUser() {clientSubdomain}: CurrentUserDto,
    @Query()
    {flag}: {flag: string},
    @Res({passthrough: true}) res: any,
  ) {
    const flagStatus = await this.productsService.getProductConfigFlagStatus(
      clientSubdomain,
      flag,
    );
    if (flagStatus) {
      res.status(HttpStatus.OK);
    } else {
      res.status(HttpStatus.NO_CONTENT);
    }
    return {flagStatus};
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
