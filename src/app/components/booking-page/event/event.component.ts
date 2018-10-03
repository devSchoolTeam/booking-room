import { interval } from 'rxjs';
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { TimeService } from '../../../services/time/time.service';
import { Event } from '../../../models/event';
import { EventService } from '../../../services/event/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.sass']
})
export class EventComponent implements OnInit {
  blocks;
  dayInterval;

  constructor(
    private timeService: TimeService,
    private eventService: EventService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.timeService.events$.subscribe({
      next: events => {
        let date = new Date();
        this.blocks = this.calculateBlocks(events, date);
        console.log(this.blocks);
      }
    });
  }






  
  pxStringBuider(miliseconds) {
    let string = Math.ceil(miliseconds / 20000);
    string = Math.abs(string);
    let pxString = string.toString() + 'px';
    return pxString;
  }


  calculateBlocks(
    events,
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

    if (events.length > 0) {
      if (
        new Date(events[0].start.dateTime).getTime() > currentTime.getTime()
      ) {
        fuckingBloks.push({
          type: 'space',
          string: '',
          start: currentTime,
          end: new Date(events[0].start.dateTime),
          duration:
            new Date(events[0].start.dateTime).getTime() - currentTime.getTime()
        });

        if (
          new Date(events[0].start.dateTime).getTime() - currentTime.getTime() >
          900000
        ) {
          fuckingBloks.push({
            type: 'event',
            string: 'Next event',
            start: new Date(events[0].start.dateTime),
            end: new Date(events[0].end.dateTime),
            duration:
              new Date(events[0].end.dateTime).getTime() -
              new Date(events[0].start.dateTime).getTime()
          });
        } else if (
          new Date(events[0].start.dateTime).getTime() - currentTime.getTime() <
            900000 &&
          new Date(events[0].start.dateTime).getTime() - currentTime.getTime() >
            0
        ) {
          fuckingBloks.push({
            type: 'event',
            string: 'Soon',
            start: new Date(events[0].end.dateTime),
            end: new Date(events[0].start.dateTime),
            duration:
              new Date(events[0].end.dateTime).getTime() -
              new Date(events[0].start.dateTime).getTime()
          });
        }
      } else {
        fuckingBloks.push({
          type: 'event',
          string: 'In procces',
          start: currentTime,
          end: new Date(events[0].end.dateTime),
          duration:
            new Date(events[0].end.dateTime).getTime() - currentTime.getTime()
        });
      }
      if (events.length > 1) {
        fuckingBloks.push({
          type: 'space',
          string: '',
          start: new Date(events[0].end.dateTime),
          end: new Date(events[1].start.dateTime),
          duration:
            new Date(events[1].start.dateTime).getTime() -
            new Date(events[0].end.dateTime).getTime()
        });
      } else {
        fuckingBloks.push({
          type: 'space',
          string: '',
          start: new Date(events[0].end.dateTime),
          end: endTime,
          duration:
            endTime.getTime() - new Date(events[0].end.dateTime).getTime()
        });
      }

      for (let i = 1; i < events.length; i++) {
        fuckingBloks.push({
          type: 'event',
          string: 'Next event',
          start: new Date(events[i].start.dateTime),
          end: new Date(events[i].end.dateTime),
          duration:
            new Date(events[i].end.dateTime).getTime() -
            new Date(events[i].start.dateTime).getTime()
        });

        if (i < events.length - 1) {
          fuckingBloks.push({
            type: 'space',
            string: '',
            start: new Date(events[i].end.dateTime),
            end: new Date(events[i + 1].start.dateTime),
            duration:
              new Date(events[i + 1].start.dateTime).getTime() -
              new Date(events[i].end.dateTime).getTime()
          });
        } else {
          fuckingBloks.push({
            type: 'space',
            string: '',
            start: new Date(events[i].end.dateTime),
            end: endTime,
            duration:
              endTime.getTime() - new Date(events[i].end.dateTime).getTime()
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

    return fuckingBloks;
  }
}
