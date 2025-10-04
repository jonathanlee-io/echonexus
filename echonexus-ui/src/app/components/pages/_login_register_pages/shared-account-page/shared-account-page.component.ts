import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {Component, computed, inject, input, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {FlagService} from 'zenigo-client-sdk';

import {UserAuthenticationStore} from '../../../../+state/auth/user-auth.store';

@Component({
  selector: 'app-shared-account-page',
  imports: [
    ProgressSpinnerModule,
    NgIf,
    ButtonModule,
    RouterLink,
    NgClass,
    NgOptimizedImage,
  ],
  templateUrl: './shared-account-page.component.html',
  styleUrl: './shared-account-page.component.scss',
  standalone: true,
})
export class SharedAccountPageComponent implements OnInit {
  headingText = input.required<string>();
  accountPrompt = input.required<string>();
  accountPromptRoute = input.required<string>();
  redirectAnchorText = input.required<string>();
  protected readonly userAuthenticationStore = inject(UserAuthenticationStore);
  private readonly flagService = inject(FlagService);
  protected readonly isSignInWithGoogleEnabled = computed(() => this.flagService.flags().find((flag) => flag.key === 'SIGN_IN_WITH_GOOGLE')?.isEnabled ?? false);
  protected readonly isSignInWithGithubEnabled = computed(() => this.flagService.flags().find((flag) => flag.key === 'SIGN_IN_WITH_GITHUB')?.isEnabled ?? false);

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  doGoogleLogin() {
    if (!this.isSignInWithGoogleEnabled()) {
      return;
    }
    this.userAuthenticationStore.attemptSupabaseLoginWithGoogle();
  }

  doGithubLogin() {
    if (!this.isSignInWithGoogleEnabled()) {
      return;
    }
    this.userAuthenticationStore.attemptSupabaseLoginWithGitHub();
  }
}
