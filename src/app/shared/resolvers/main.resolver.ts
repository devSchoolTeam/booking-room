import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TimeService } from '../../services/time/time.service';
import { meetingStatuses } from '../constants';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable()
export class HnResolver implements Resolve <Observable<object>> {
  constructor(private timeService: TimeService) {}

  resolve() {
      return from(this.timeService.loadEvents().pipe(
        map(events => {
          let status = meetingStatuses.available;
          if (events.length > 0) {
            const event = events[0];
            const currentTime = new Date();
            const startTime = new Date(event.start.dateTime),
              timeToStart = startTime.getTime() - currentTime.getTime();

            if (timeToStart >= 900000) {
              status = meetingStatuses.available;
            } else if (timeToStart < 900000 && timeToStart > 0) {
              status = meetingStatuses.soon;
            } else if (timeToStart < 0) {
              status = meetingStatuses.inProcess;
            }
          }
          return status;
        })
      ));
  }
}
