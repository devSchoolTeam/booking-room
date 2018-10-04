import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { availableMeetingDurations } from '../../../shared/constants';
import { TimeService } from '../../../services/time/time.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class SelectTimeComponent implements OnInit, OnDestroy {
  public subscription: Subscription;
  public selectedDuration = 0;
  public availableMeetingDurations = availableMeetingDurations;
  public currentStatus;
  public gotInterval: any;
  public loaderIsShown;

  constructor(private timeService: TimeService) {}

  ngOnInit() {
    this.subscription = this.timeService.dataSubject.subscribe(data => {
      this.currentStatus = data.status;
      this.gotInterval = data.intervalForBooking;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectMeetingDuration(availableMeetingDuration: any) {
    this.selectedDuration = availableMeetingDuration.value;
  }

  createEvent() {
    if (this.selectedDuration > 0) {
      this.loaderIsShown = true;
      this.timeService
        .createEvent(this.gotInterval.startTime, this.selectedDuration)
        .then(
          res => {
            console.log('Success:' + res);
            this.timeService.loadEvents().subscribe();
            this.selectedDuration = 0;
            this.loaderIsShown = false;
          },
          err => {
            console.error(err);
          }
        );
    }
  }
}
