import { Component, OnInit } from '@angular/core';
import { meetingStatuses } from '../../../shared/constants';
import { TimeService } from '../../../services/time/time.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  public currentStatus;
  public statusSubscription: Subscription;

  constructor(private timeService: TimeService) {}
  ngOnInit() {
    this.currentStatus = meetingStatuses.available;
    this.statusSubscription = this.timeService.getStatus(currentStatus => {
      this.currentStatus = currentStatus;
    });
  }

  ngOnDestroy(): void {
    this.statusSubscription.unsubscribe();
  }
}
