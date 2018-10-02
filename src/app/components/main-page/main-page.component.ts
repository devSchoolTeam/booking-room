import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TimeService } from '../../services/time/time.service';
import { ActivatedRoute } from '@angular/router';
import { meetingStatuses } from '../../shared/constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class MainPageComponent implements OnInit, OnDestroy {
  public currentStatus = meetingStatuses.available;
  public eventsAvailability = true;
  public eventsSubscription;
  public isEventsFoundSubscription;
  public timerString: string;
  public timerStringSubscription: Subscription;

  constructor(private timeService: TimeService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.currentStatus = this.route.snapshot.data.currentStatus;
    this.timerStringSubscription = this.timeService.getTimerString({
      next: timerString => {
        this.timerString = timerString;
      }
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
