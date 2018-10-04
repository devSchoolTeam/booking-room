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
  public currentStatus;
  public eventsAvailability = true;
  public eventsSubscription;
  public isEventsFoundSubscription;
  public timerString: string;
  public timerStringSubscription: Subscription;
  public loaderIsShown = true;

  constructor(private timeService: TimeService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.timeService.currentStatus$.subscribe(currentStatus => {
      this.currentStatus = currentStatus;
    });
    this.timerStringSubscription = this.timeService.timerString.subscribe({
      next: timerString => {
        this.timerString = timerString;
      }
    });
    this.isEventsFoundSubscription = this.timeService.isEventFound.subscribe(
      eventsAvailability => {
        this.eventsAvailability = eventsAvailability;
        if (this.eventsAvailability === false) {
          this.currentStatus = meetingStatuses.available;
        }
      }
    );
    this.loaderIsShown = false;
  }

  ngOnDestroy(): void {
    if (this.isEventsFoundSubscription) {
      this.isEventsFoundSubscription.unsubscribe();
    }
  }
}
