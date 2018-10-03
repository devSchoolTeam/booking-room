import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TimeService } from '../time/time.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events;
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
    const endTime = new Date(
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
    const eventBlock = [];
    const endTime = new Date(
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
        eventBlock.push({
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
          eventBlock.push({
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
          eventBlock.push({
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
        eventBlock.push({
          type: 'event',
          string: 'In process',
          start: currentTime,
          end: new Date(this.events[0].end.dateTime),
          duration:
            new Date(this.events[0].end.dateTime).getTime() -
            currentTime.getTime()
        });
      }
      if (this.events.length > 1) {
        eventBlock.push({
          type: 'space',
          string: '',
          start: new Date(this.events[0].end.dateTime),
          end: new Date(this.events[1].start.dateTime),
          duration:
            new Date(this.events[1].start.dateTime).getTime() -
            new Date(this.events[0].end.dateTime).getTime()
        });
      } else {
        eventBlock.push({
          type: 'space',
          string: '',
          start: new Date(this.events[0].end.dateTime),
          end: endTime,
          duration:
            endTime.getTime() - new Date(this.events[0].end.dateTime).getTime()
        });
      }

      for (let i = 1; i < this.events.length; i++) {
        eventBlock.push({
          type: 'event',
          string: 'Next event',
          start: new Date(this.events[i].start.dateTime),
          end: new Date(this.events[i].end.dateTime),
          duration:
            new Date(this.events[i].end.dateTime).getTime() -
            new Date(this.events[i].start.dateTime).getTime()
        });

        if (i < this.events.length - 1) {
          eventBlock.push({
            type: 'space',
            string: '',
            start: new Date(this.events[i].end.dateTime),
            end: new Date(this.events[i + 1].start.dateTime),
            duration:
              new Date(this.events[i + 1].start.dateTime).getTime() -
              new Date(this.events[i].end.dateTime).getTime()
          });
        } else {
          eventBlock.push({
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
      eventBlock.push({
        type: 'space',
        string: '',
        start: currentTime,
        end: endTime,
        duration: endTime.getTime() - currentTime.getTime()
      });
    }

    if (eventAboutToCreate) {
      for (let i = 0; i < eventBlock.length; i++) {
        if (
          eventBlock[i].type === 'space' &&
          eventBlock[i].end.getTime() - eventBlock[i].start.getTime() >=
            eventAboutToCreate.endTime.getTime() -
              eventAboutToCreate.start.getTime()
        ) {
          const array = [
            {
              type: 'space',
              string: '',
              start: eventBlock[i].start,
              end: eventAboutToCreate.start,
              duration:
                eventAboutToCreate.start.getTime() - eventBlock[i].start
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
              end: eventBlock[i].end,
              duration:
                eventBlock[i].end.getTime() -
                eventAboutToCreate.endTime.getTime()
            }
          ];

          eventBlock.splice(i, 1, array[0], array[1], array[2]);
          break;
        }
      }
    }

    this.blocksForRendering.next(eventBlock);
    return eventBlock;
  }
}
