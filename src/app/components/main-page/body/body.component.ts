import { Component, OnDestroy, OnInit } from '@angular/core';
import { meetingStatuses } from '../../../shared/constants';
import { TimeService } from '../../../services/time/time.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.sass']
})
export class BodyComponent implements OnInit, OnDestroy {
  public currentStatus;
  public eventsAvailability = true;
  public eventsSubscription;
  public isEventsFoundSubscription;

  constructor(private timeService: TimeService) {}

  ngOnInit() {
    this.eventsSubscription = this.timeService.currentStatus.subscribe(
      currentStatus => {
        this.currentStatus = currentStatus;
      }
    );
    this.isEventsFoundSubscription = this.timeService.isEventFound.subscribe(
      eventsAvailability => {
        this.eventsAvailability = eventsAvailability;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.isEventsFoundSubscription) {
      this.isEventsFoundSubscription.unsubscribe();
    }

    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }
}
