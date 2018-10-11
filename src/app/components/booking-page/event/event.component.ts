import { PopupService } from './../../../services/popup/popup.service';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TimeService } from '../../../services/time/time.service';
import { Subscription } from 'rxjs';
import { EventBlock } from '../../../shared/eventBlock';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.sass']
})
export class EventComponent implements OnInit, OnDestroy {
  events;
  blocks;
  interval;
  @Input()
  event;
  @ViewChild('newEvent')
  newEvent;
  @ViewChild('currentTime')
  currentTime;
  subscription: Subscription;
  public measure;
  public lineOffset;

  constructor(
    private timeService: TimeService,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    this.subscription = this.timeService.events$.subscribe({
      next: events => {
        this.events = events;
        const date = new Date();
        this.blocks = this.calculateBlocks(events, date);
        this.interval = this.calculateInterval(date);
        this.lineOffset = this.calculateCurrentTimeLine(date);
        this.calculateMeasure(this.interval.start, this.interval.end);
        setTimeout(() => {
          this.scrollToCurrentTime();
        }, 0);
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

  pxStringBuider(milliseconds: number) {
    const x = (milliseconds * 100) / this.interval.interval;
    return x.toString() + '%';
  }

  calculateEventHeight(milliseconds: number) {
    const x = (milliseconds * 100) / this.interval.interval - 0.1;
    return x.toString() + '%';
  }

  calculateEventOffset(milliseconds: number) {
    const x = (milliseconds * 100) / this.interval.interval + 0.1;
    return x.toString() + '%';
  }

  scrollToNewEvent() {
    this.newEvent.nativeElement.scrollIntoView({
      block: 'center',
      behavior: 'smooth'
    });
  }

  scrollToCurrentTime() {
    this.currentTime.nativeElement.scrollIntoView({
      block: 'center',
      behavior: 'smooth'
    });
  }

  calculateBlocks(events: Array<EventBlock>, currentTime: Date) {
    for (let i = 0; i < events.length; i++) {
      if (new Date(events[i].start).getTime() - new Date(currentTime).getTime() > 900000) {
        events[i].status = 'Next event, ';
      } else if (new Date(events[i].start).getTime() - new Date(currentTime).getTime() < 900000
        && new Date(events[i].start).getTime() - new Date(currentTime).getTime() > 0
      ) {
        events[i].status = 'Soon, ';

      } else if (

        new Date(events[i].end).getTime() < new Date(currentTime).getTime()) {
        events[i].status = 'Finished event, ';
      } else if (new Date(events[i].start).getTime() < new Date(currentTime).getTime()
        && new Date(events[i].end).getTime() > new Date(currentTime).getTime()

      ) {
        events[i].status = 'In process, ';
      }
    }
    return events;
  }

  calculateCurrentTimeLine(currentTime: Date) {

    const currentTimeMilliseconds = currentTime.getTime() - new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      9,
      0,
      0
    ).getTime();
    return this.calculateEventOffset(currentTimeMilliseconds);
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

  onEventClick(content) {
    this.popupService.showPopup(content);
  }
}
