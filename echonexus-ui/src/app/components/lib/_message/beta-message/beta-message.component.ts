import {NgIf} from '@angular/common';
import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {Message} from 'primeng/message';
import {FlagService} from 'zenigo-client-sdk';

@Component({
  selector: 'app-beta-message',
  imports: [
    Message,
    NgIf,
  ],
  templateUrl: './beta-message.component.html',
  styleUrl: './beta-message.component.scss',
})
export class BetaMessageComponent implements OnInit {
  static readonly BETA_MESSAGE_CLOSED_KEY = 'beta-message-closed';

  private readonly flagService = inject(FlagService);
  protected readonly isBetaMessageEnabled = computed(() => this.flagService.flags().find((flag) => flag.key === 'BETA_MESSAGE_ENABLED')?.isEnabled ?? false);

  protected readonly isShown = signal(true);

  ngOnInit() {
    this.isShown.set(localStorage.getItem(BetaMessageComponent.BETA_MESSAGE_CLOSED_KEY) !== 'true');
  }

  handleBetaMessageClosed() {
    localStorage.setItem(BetaMessageComponent.BETA_MESSAGE_CLOSED_KEY, 'true');
    this.isShown.set(false);
  }
}
