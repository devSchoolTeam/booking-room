import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { meetingStatuses } from '../../../shared/constants';
import { TimeService } from '../../../services/time/time.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.sass']
})
export class BodyComponent implements OnInit {
  public currentStatus = meetingStatuses.available;
  public eventsAvailability = true;
  public eventsSubscription;
  public isEventsFoundSubscription;
  constructor(private timeService: TimeService) {}

  ngOnInit() {
    this.eventsSubscription = this.timeService.getStatus(currentStatus => {
      this.currentStatus = currentStatus;
    });
    this.isEventsFoundSubscription = this.timeService.getBooleanIsEventsFound(
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
