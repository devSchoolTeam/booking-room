import { TimeService } from '../../services/time/time.service';

import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { map } from 'rxjs/operators';

@Injectable()
export class DataResolver implements Resolve<Observable<any>> {
  constructor(private timeService: TimeService) {}

  resolve() {
    return this.timeService.loadEvents().pipe(
      map(res => {
        let date = new Date();
        return {
          status: this.timeService.changeStatusByTime(res, date),
          timer: this.timeService.calculateTimerString(res, date),
          intervalForBooking: this.timeService.calculateIntervalForBooking(res, date)
        };
      })
    );
  }
}
