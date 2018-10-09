import { Event } from './../../../models/event';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { TimeService } from '../../../services/time/time.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.sass']
})
export class EventComponent implements OnInit, OnDestroy {
  blocks;
  @Input()
  events;
  interval;
  @Input()
  event;
  @ViewChild('pidar')
  newEvent;

  subscription;
  public measure;

  constructor(private timeService: TimeService) {}

  ngOnInit() {
    this.subscription = this.timeService.events$.subscribe({
      next: events => {
        const date = new Date();
        this.blocks = this.calculateBlocks(events, date);
        this.interval = this.calculateInterval(date);
        this.calculateMeasure(this.interval.start, this.interval.end);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  calculateMeasure(startTime: Date, endTime: Date) {
    const objects = [];
    while (startTime <= endTime) {
      if (startTime.getMinutes() !== 0) {
        objects.push({
          time: startTime,
          type: 'small',
          height: this.pxStringBuider(900000)
        });
      } else {
        objects.push({
          time: startTime,
          type: 'big',
          height: this.pxStringBuider(900000)
        });
      }

      startTime = new Date(startTime.getTime() + 900000);
    }
    this.measure = objects;
  }

  pxStringBuider(miliseconds) {
    const x = (miliseconds * 100) / this.interval.interval;

    const string = x.toString() + '%';
    return string;
  }

  calculateEventHeight(miliseconds) {
    const x = (miliseconds * 100) / this.interval.interval - 0.3;

    const string = x.toString() + '%';
    return string;
  }

  calculateEventOffset(miliseconds) {
    const x = (miliseconds * 100) / this.interval.interval + 0.3;

    const string = x.toString() + '%';
    return string;
  }
  scrollToNewEvent() {
    console.log(this.newEvent);
    this.newEvent.nativeElement.scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    });
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
      if (
        new Date(events[i].start.dateTime).getTime() -
          new Date(currentTime).getTime() >
        900000
      ) {
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
      } else if (
        new Date(events[i].start.dateTime).getTime() -
          new Date(currentTime).getTime() <
          900000 &&
        new Date(events[i].start.dateTime).getTime() -
          new Date(currentTime).getTime() >
          0
      ) {
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
      } else if (
        new Date(events[i].end.dateTime).getTime() <
        new Date(currentTime).getTime()
      ) {
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
      } else if (
        new Date(events[i].start.dateTime).getTime() <
          new Date(currentTime).getTime() &&
        new Date(events[i].end.dateTime).getTime() >
          new Date(currentTime).getTime()
      ) {
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
