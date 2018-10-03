import { TimeService } from './../../services/time/time.service';

import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Injectable()
export class DataResolver implements Resolve<Observable<string>> {
  constructor(private timeService: TimeService) {}

  resolve() {
    return this.timeService.loadEvents();
  }
}
