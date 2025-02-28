import {NgIf} from '@angular/common';
import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';

import {RoutePath} from '../../../../app.routes';
import {rebaseRoutePath} from '../../../../util/router/Router.utils';

@Component({
  selector: 'app-pricing-display',
  imports: [
    RouterLink,
    NgIf,
  ],
  templateUrl: './pricing-display.component.html',
  styleUrl: './pricing-display.component.scss',
  standalone: true,
})
export class PricingDisplayComponent {
  protected readonly rebaseRoutePath = rebaseRoutePath;
  protected readonly RoutePath = RoutePath;
  name = input.required<string>();
  description = input.required<string>();
  monthlyPrice = input.required<string>();
  features = input.required<string[]>();
  tag = input<string | undefined>(undefined);
}
