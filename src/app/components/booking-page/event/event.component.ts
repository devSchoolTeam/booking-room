import { ChangeDetectorRef, Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TimeService } from '../../../services/time/time.service';
import { EventService } from '../../../services/event/event.service';
import { el } from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.sass']
})
export class EventComponent implements OnInit, OnDestroy {
  blocks;
  measure = [];
  interval;
  @Input()
  event;
  subscription;


  constructor(private timeService: TimeService) {}

  ngOnInit() {
    this.timeService.loadEvents().subscribe()

    this.subscription = this.timeService.events$.subscribe({
      next: events => {
        const date = new Date();
        this.blocks = this.calculateBlocks(events, date);
        this.interval = this.calculateInterval(date);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  calculateMeasure() {
    const startDate = this.interval.start,
      endDate = this.interval.end,
      arr = [];

    while (startDate <= endDate) {
      startDate.setDate(startDate.getMinutes() + 15);
    }
  }

  pxStringBuider(miliseconds) {
    const x = (miliseconds * 100) / this.interval.interval;

    const string = x.toString() + '%';
    return string;
  }

  calculateBlocks(events, currentTime: Date) {
    const eventBlock = [];
    const startTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      9,
      0,
      0
    );
    for (let i = 0; i < events.length; i++) {
      if ((new Date(events[i].start.dateTime).getTime()) - new Date(currentTime).getTime() > 900000) {
        eventBlock.push({
          type: 'event',
          string: 'Next event, ',
          start: new Date(events[i].start.dateTime),
          end: new Date(events[i].end.dateTime),
          duration:
            new Date(events[i].end.dateTime).getTime() -
            new Date(events[i].start.dateTime).getTime(),
          fromStart:
            new Date(events[i].start.dateTime).getTime() - startTime.getTime()
        });
      } else if ((new Date(events[i].start.dateTime).getTime()) - new Date(currentTime).getTime() < 900000 &&
        (new Date(events[i].start.dateTime).getTime()) - new Date(currentTime).getTime() > 0) {
        eventBlock.push({
          type: 'event',
          string: 'Soon, ',
          start: new Date(events[i].start.dateTime),
          end: new Date(events[i].end.dateTime),
          duration:
            new Date(events[i].end.dateTime).getTime() -
            new Date(events[i].start.dateTime).getTime(),
          fromStart:
            new Date(events[i].start.dateTime).getTime() - startTime.getTime()
        });
      } else if ((new Date(events[i].end.dateTime).getTime()) < new Date(currentTime).getTime()) {
        eventBlock.push({
          type: 'event',
          string: 'Finished event, ',
          start: new Date(events[i].start.dateTime),
          end: new Date(events[i].end.dateTime),
          duration:
            new Date(events[i].end.dateTime).getTime() -
            new Date(events[i].start.dateTime).getTime(),
          fromStart:
            new Date(events[i].start.dateTime).getTime() - startTime.getTime()
        });
      } else if (new Date(events[i].start.dateTime).getTime() < new Date(currentTime).getTime() &&
      (new Date(events[i].end.dateTime).getTime()) > new Date(currentTime).getTime()) {
        eventBlock.push({
          type: 'event',
          string: 'In process, ',
          start: new Date(events[i].start.dateTime),
          end: new Date(events[i].end.dateTime),
          duration:
            new Date(events[i].end.dateTime).getTime() -
            new Date(events[i].start.dateTime).getTime(),
          fromStart:
            new Date(events[i].start.dateTime).getTime() - startTime.getTime()
        });
      }
        }
    return eventBlock;
  }

  calculateInterval(currentTime: Date) {
    const startTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      9,
      0,
      0
    );
    const endTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      22,
      0,
      0
    );

    return {
      start: startTime,
      end: endTime,
      interval: endTime.getTime() - startTime.getTime()
    };
  }
}
