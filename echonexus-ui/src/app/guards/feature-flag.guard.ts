import {inject} from '@angular/core';
import {CanActivateFn} from '@angular/router';
import {FlagService} from 'zenigo-client-sdk';

import {FeatureFlagEnum} from '../enums/FeatureFlag.enum';

export const featureFlagGuard: CanActivateFn = (route) => {
  const flagService = inject(FlagService);
  const featureFlagEnum = route.data['feature'] as FeatureFlagEnum;
  const feature = flagService.flags()
      .find((featureFlag) => featureFlag.key === featureFlagEnum);
  return feature?.isEnabled ?? false;
};
