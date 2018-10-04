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
  public subscription;
  public isEventsFoundSubscription;
  public timerString: string;
  public timerStringSubscription: Subscription;

  public loaderIsShown = true;

  constructor(
    private timeService: TimeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.timeService.loadEvents().subscribe();

    this.subscription = this.timeService.data.subscribe(data => {
      this.currentStatus = data.status;
      this.timerString = data.timer;
      this.loaderIsShown = false;

    });
  }

  ngOnDestroy(): void {
    if (this.isEventsFoundSubscription) {
      this.isEventsFoundSubscription.unsubscribe();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
