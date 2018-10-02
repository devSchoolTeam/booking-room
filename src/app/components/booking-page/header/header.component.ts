import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TimeService } from '../../../services/time/time.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() initialStatus;
  public statusSubscription: Subscription;
  public currentStatus;

  constructor(private timeService: TimeService) {
  }

  ngOnInit() {
    this.currentStatus = this.initialStatus;
    this.statusSubscription = this.timeService.getStatus(currentStatus => {
      this.currentStatus = currentStatus;
    });
  }

  ngOnDestroy(): void {
    this.statusSubscription.unsubscribe();
  }
}
