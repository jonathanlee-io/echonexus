import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Divider} from 'primeng/divider';
import {Subscription, tap} from 'rxjs';

import {RoutePath} from '../../../../app.routes';
import {ProductPostDto} from '../../../../dtos/projects/ProductPostDto';
import {rebaseRoutePath, rebaseRoutePathAsString} from '../../../../util/router/Router.utils';
import {ProductPostComponent} from '../../../lib/_product/product-post/product-post.component';

@Component({
  selector: 'app-product-page',
  imports: [
    ProductPostComponent,
    Divider,
    RouterLink,
  ],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent implements OnInit, OnDestroy {
  posts = signal<ProductPostDto[]>([
    {
      id: '1',
      title: 'Upcoming Dark Mode Support',
      summary: 'We heard your requests! Dark mode is in development and will be released next quarter to make browsing easier on the eyes.',
      upVotes: 120,
      comments: 45,
    },
    {
      id: '2',
      title: 'New AI-Powered Content Recommendations',
      summary: 'Introducing a smarter browsing experience with AI-powered recommendations tailored to your interests.',
      upVotes: 89,
      comments: 30,
    },
    {
      id: '4',
      title: 'Enhanced User Dashboard',
      summary: 'A complete overhaul of the user dashboard with easier navigation and advanced analytics to better track your progress.',
      upVotes: 132,
      comments: 25,
    },
  ]);
  protected readonly route = inject(ActivatedRoute);
  protected readonly rebaseRoutePath = rebaseRoutePath;
  protected readonly RoutePath = RoutePath;
  protected readonly rebaseRoutePathAsString = rebaseRoutePathAsString;
  protected readonly subdomain = signal<string>('');

  private routeParamsSubscription?: Subscription;

  ngOnInit() {
    this.routeParamsSubscription = this.route.params.pipe(
        tap((params) => {
          this.subdomain.set(params['subdomain']);
        }),
    ).subscribe();
  }

  ngOnDestroy() {
    this.routeParamsSubscription?.unsubscribe();
  }
}
