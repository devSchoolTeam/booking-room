import { Component, OnDestroy, OnInit } from '@angular/core';
import { TimeService } from '../../../services/time/time.service';
import { Subscription } from 'rxjs';
import { meetingStatuses } from '../../../shared/constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public statusSubscription: Subscription;
  public currentStatus;

  constructor(private timeService: TimeService) {
  }

  ngOnInit() {
    this.statusSubscription = this.timeService.currentStatus.subscribe(currentStatus => {
      this.currentStatus = currentStatus;
    });
  }

  ngOnDestroy(): void {
    this.statusSubscription.unsubscribe();
  }
}
