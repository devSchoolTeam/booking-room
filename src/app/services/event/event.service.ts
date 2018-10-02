import { Injectable } from '@angular/core';
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
        this.events = x;
      }
    });
  }

  calculateInterval(currentTime: Date) {
    console.log(1)
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

  calculateBlocks(
    currentTime: Date,
    eventAboutToCreate?: { start: Date; endTime: Date }
  ) {
    let fuckingBloks = [];
    let endTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      23,
      59,
      59
    );

    if (this.events.length > 0) {
      if (
        new Date(this.events[0].start.dateTime).getTime() >
        currentTime.getTime()
      ) {
        fuckingBloks.push({
          type: 'space',
          string: '',
          start: currentTime,
          end: new Date(this.events[0].start.dateTime),
          duration:
            new Date(this.events[0].start.dateTime).getTime() -
            currentTime.getTime()
        });

        if (
          new Date(this.events[0].start.dateTime).getTime() -
            currentTime.getTime() >
          900000
        ) {
          fuckingBloks.push({
            type: 'event',
            string: 'Next event',
            start: new Date(this.events[0].start.dateTime),
            end: new Date(this.events[0].end.dateTime),
            duration:
              new Date(this.events[0].end.dateTime).getTime() -
              new Date(this.events[0].start.dateTime).getTime()
          });
        } else if (
          new Date(this.events[0].start.dateTime).getTime() -
            currentTime.getTime() <
            900000 &&
          new Date(this.events[0].start.dateTime).getTime() -
            currentTime.getTime() >
            0
        ) {
          fuckingBloks.push({
            type: 'event',
            string: 'Soon',
            start: new Date(this.events[0].end.dateTime),
            end: new Date(this.events[0].start.dateTime),
            duration:
              new Date(this.events[0].end.dateTime).getTime() -
              new Date(this.events[0].start.dateTime).getTime()
          });
        }
      } else {
        fuckingBloks.push({
          type: 'event',
          string: 'In procces',
          start: currentTime,
          end: new Date(this.events[0].end.dateTime),
          duration:
            new Date(this.events[0].end.dateTime).getTime() -
            currentTime.getTime()
        });
      }
      if (this.events.length > 1) {
        fuckingBloks.push({
          type: 'space',
          string: '',
          start: new Date(this.events[0].end.dateTime),
          end: new Date(this.events[1].start.dateTime),
          duration:
            new Date(this.events[1].start.dateTime).getTime() -
            new Date(this.events[0].end.dateTime).getTime()
        });
      } else {
        fuckingBloks.push({
          type: 'space',
          string: '',
          start: new Date(this.events[0].end.dateTime),
          end: endTime,
          duration:
            endTime.getTime() - new Date(this.events[0].end.dateTime).getTime()
        });
      }

      for (let i = 1; i < this.events.length; i++) {
        fuckingBloks.push({
          type: 'event',
          string: 'Next event',
          start: new Date(this.events[i].start.dateTime),
          end: new Date(this.events[i].end.dateTime),
          duration:
            new Date(this.events[i].end.dateTime).getTime() -
            new Date(this.events[i].start.dateTime).getTime()
        });

        if (i < this.events.length - 1) {
          fuckingBloks.push({
            type: 'space',
            string: '',
            start: new Date(this.events[i].end.dateTime),
            end: new Date(this.events[i + 1].start.dateTime),
            duration:
              new Date(this.events[i + 1].start.dateTime).getTime() -
              new Date(this.events[i].end.dateTime).getTime()
          });
        } else {
          fuckingBloks.push({
            type: 'space',
            string: '',
            start: new Date(this.events[i].end.dateTime),
            end: endTime,
            duration:
              endTime.getTime() -
              new Date(this.events[i].end.dateTime).getTime()
          });
        }
      }
    } else {
      fuckingBloks.push({
        type: 'space',
        string: '',
        start: currentTime,
        end: endTime,
        duration: endTime.getTime() - currentTime.getTime()
      });
    }

    if (eventAboutToCreate) {
      for (let i = 0; i < fuckingBloks.length; i++) {
        if (
          fuckingBloks[i].type === 'space' &&
          fuckingBloks[i].end.getTime() - fuckingBloks[i].start.getTime() >=
            eventAboutToCreate.endTime.getTime() -
              eventAboutToCreate.start.getTime()
        ) {
    

          let array = [
            {
              type: 'space',
              string: '',
              start: fuckingBloks[i].start,
              end: eventAboutToCreate.start,
              duration:
                eventAboutToCreate.start.getTime() - fuckingBloks[i].start
            },
            {
              type: 'tempEvent',
              string: 'New event',
              start: eventAboutToCreate.start,
              end: eventAboutToCreate.endTime,
              duration:
                eventAboutToCreate.endTime.getTime() -
                eventAboutToCreate.start.getTime()
            },
            {
              type: 'space',
              string: '',
              start: eventAboutToCreate.endTime,
              end: fuckingBloks[i].end,
              duration:
                fuckingBloks[i].end.getTime() -
                eventAboutToCreate.endTime.getTime()
            }
          ];

          fuckingBloks.splice(i, 1, array[0], array[1], array[2]);
          break;
        }
      }
    }

    this.blocksForRendering.next(fuckingBloks);
    return fuckingBloks;
  }
}
