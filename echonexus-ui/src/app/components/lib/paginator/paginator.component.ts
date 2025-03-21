import {Component, EventEmitter, input, OnInit, Output} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {ArrowLeftIcon, ArrowRightIcon} from 'primeng/icons';

export type PageChangedEvent = {
  pageChangedTo: number;
}

@Component({
  selector: 'app-paginator',
  imports: [
    ButtonDirective,
    ArrowRightIcon,
    ArrowLeftIcon,
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent implements OnInit {
  totalItems = input.required<number>();
  itemsPerPage = input.required<number>();
  currentPage = input.required<number>();

  @Output() pageChanged = new EventEmitter<PageChangedEvent>();

  protected startItemIndex: number = 0;
  protected endItemIndex: number = 0;

  ngOnInit() {
    this.endItemIndex = Math.min(this.itemsPerPage(), this.totalItems());
    if (this.currentPage() === 0) {
      this.startItemIndex = 0;
      return;
    }
    this.startItemIndex = this.itemsPerPage() * (this.currentPage() - 1);
  }

  onClickPrev() {
    this.pageChanged.emit({pageChangedTo: this.currentPage() - 1});
  }

  onClickNext() {
    if (this.currentPage() === (this.totalItems() / this.itemsPerPage()) - 1) {
      return;
    }
    this.startItemIndex += this.itemsPerPage();
    this.pageChanged.emit({pageChangedTo: this.currentPage() + 1});
  }
}
