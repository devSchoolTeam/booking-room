import { TimeService } from './../../../services/time/time.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.sass']
})
export class TimerComponent implements OnInit {
  public timerString: string;
  public timerStringSubscription: Subscription;
  constructor(private timeService: TimeService) {}
  ngOnInit() {
    this.timerStringSubscription = this.timeService.getTimerString({
      next: timerString => {
        this.timerString = timerString;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerStringSubscription) {
      this.timerStringSubscription.unsubscribe();
    }
  }
}
