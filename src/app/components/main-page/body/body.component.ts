import { Component, OnDestroy, OnInit } from '@angular/core';
import { meetingStatuses } from '../../../shared/constants';
import { TimeService } from '../../../services/time/time.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.sass']
})
export class BodyComponent implements OnInit, OnDestroy {
  public currentStatus = meetingStatuses.available;
  public eventsAvailability = true;
  public eventsSubscription;
  public isEventsFoundSubscription;

  constructor(private timeService: TimeService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log(this.route.snapshot.data);
    this.currentStatus = this.route.snapshot.data.currentStatus;
  /*  this.eventsSubscription = this.timeService.getStatus(currentStatus => {
      this.currentStatus = currentStatus;
    });*/
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
