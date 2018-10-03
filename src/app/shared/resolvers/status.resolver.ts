import { TimeService } from './../../services/time/time.service';

import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { map } from 'rxjs/operators';

@Injectable()
export class StatusResolver implements Resolve<Observable<any>> {
  constructor(private timeService: TimeService) {
    this.currentDate = new Date();
  }
  currentDate;
  resolve() {
    return this.timeService.currentStatus.asObservable().pipe(
      map(res => {
        console.count('huiii');
      })
    );
  }
}
