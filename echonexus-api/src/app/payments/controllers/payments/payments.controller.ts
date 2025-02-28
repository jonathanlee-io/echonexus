import {CacheInterceptor} from '@nestjs/cache-manager';
import {Controller, Get, UseInterceptors} from '@nestjs/common';
import {CacheTTL} from '@nestjs/common/cache';

import {oneDayInMilliseconds} from '../../../../lib/constants/time/time.constants';
import {PaymentsService} from '../../services/payments/payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('plans')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(oneDayInMilliseconds)
  async getPlans() {
    return this.paymentsService.getPlans();
  }
}
