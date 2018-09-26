import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  availableMeetingDurations,
  meetingStatuses
} from '../../../shared/constants';
import { TimeService } from '../../../services/time/time.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.sass']
})
export class SelectTimeComponent implements OnInit, OnDestroy {
  public intervalSubscription: Subscription;
  public statusSubscription: Subscription;
  public selectedDuration: any;
  public availableMeetingDurations = availableMeetingDurations;
  public currentStatus;
  public gotInterval: any = 0;
  constructor(private timeService: TimeService) {}

  ngOnInit() {
    this.currentStatus = meetingStatuses.available;
    this.statusSubscription = this.timeService.currentStatus.subscribe(
      currentStatus => {
        this.currentStatus = currentStatus;
      }
    );
    this.intervalSubscription = this.timeService.getIntervalForBooking({
      next: gotInterval => {
        this.gotInterval = gotInterval;
      }
    });
  }
  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  selectMeetingDuration(availableMeetingDuration: any) {
    this.selectedDuration = availableMeetingDuration.value;
  }

  createEvent() {
    if (this.selectedDuration) {
      this.timeService
        .createEvent(this.gotInterval.startTime, this.selectedDuration)
        .then(
          res => {
            console.log('Success:' + res);
            this.timeService.loadEvents().subscribe();
          },
          err => {
            console.error(err);
          }
        );
    }
  }
}
