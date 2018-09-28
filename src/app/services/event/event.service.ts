import { Injectable } from '@angular/core';
import { availableMeetingDurations } from '../../shared/constants';
import { Subject } from 'rxjs';
import { TimeService } from '../time/time.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events;
  interval;

  dayInterval = new Subject<any>();
  blocksForRendering = new Subject<any>();

  constructor(private timeService: TimeService) {
    this.timeService.events$.subscribe({
      next: x => {
        let time = new Date();
        this.events = x;
        this.calculateInterval(time);
        this.calculateBlocks(x, time);
      }
    });
  }

  calculateInterval(currentTime: Date) {
    let endTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      23,
      59,
      59
    );

    this.dayInterval.next(endTime.getTime() - currentTime.getTime());

    return endTime.getTime() - currentTime.getTime();
  }

  pxSringBuilder(miliseconds) {
    miliseconds = miliseconds / 10000;
    return miliseconds.toString() + 'px';
  }

  calculateBlocks(events, currentTime: Date) {
    let fuckingBloks = [];
    let endTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      23,
      59,
      59
    );

    if (events.length > 0) {
      if (
        new Date(events[0].start.datetime).getTime() > currentTime.getTime()
      ) {
        fuckingBloks.push({
          type: 'space',
          string: '',
          interval:this.pxSringBuilder(
            new Date(events[0].start.datetime).getTime() - currentTime.getTime())
        });

        fuckingBloks.push({
          type: 'event',
          string: '',
          interval:
            this.pxSringBuilder(
              new Date(events[0].end.dateTime).getTime() -
                new Date(events[0].start.dateTime).getTime()
            ).toString() + 'px'
        });
        if (this.events.length > 1) {
          fuckingBloks.push({
            type: 'space',
            string: '',
            interval: this.pxSringBuilder(
              new Date(events[0].end.dateTime).getTime() -
                new Date(events[1].start.dateTime).getTime()
            )
          });
        } else {
          fuckingBloks.push({
            type: 'space',
            string: '',
            interval: this.pxSringBuilder(
              new Date(events[0].end.dateTime).getTime() - endTime.getTime()
            )
          });
        }
      }

      for (let i = 1; i < events.length; i++) {
        fuckingBloks.push({
          type: 'event',
          string: '',
          interval:
          this.pxSringBuilder(
            new Date(events[i].end.dateTime).getTime() -
            new Date(events[i].start.dateTime).getTime())
        });

        if (i < events.length - 1) {
          fuckingBloks.push({
            type: 'space',
            string: '',
            interval:
            this.pxSringBuilder(
              new Date(events[i].end.dateTime).getTime() -
              new Date(events[i].start.dateTime).getTime())
          });
        } else {
          fuckingBloks.push({
            type: 'space',
            string: '',
            interval:this.pxSringBuilder(
              endTime.getTime() - new Date(events[i].start.dateTime).getTime())
          });
        }
      }
      this.blocksForRendering.next(fuckingBloks);
      return fuckingBloks;
    }
  }
}
