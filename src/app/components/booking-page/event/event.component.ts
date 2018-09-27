import { Component, OnDestroy, OnInit } from '@angular/core';
import { TimeService } from '../../../services/time/time.service';
import { Event } from '../../../models/event';
import { EventService } from '../../../services/event/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.sass']
})
export class EventComponent implements OnInit, OnDestroy {
  public subscription;
  public events;
  eventDuration;
  public eventDurations = [];
  public eventHeight;
  public eventHeights = [];

  constructor(private timeService: TimeService, private eventService: EventService) {
  }

  ngOnInit() {
    this.subscription = this.timeService.events$.subscribe((events) => {
      this.eventService.blockHeight$.subscribe(
        eventHeight => {
          this.eventHeight = eventHeight + 'px';
        }
      );
      this.events = events;
      this.eventDurations = [];
      this.eventHeights = [];
      for (let i = 0; i < this.events.length; i++) {
        const startTime = new Date(events[i].start.dateTime);
        const endTime = new Date(events[i].end.dateTime);
        this.eventDuration =
          startTime.toLocaleTimeString().slice(0, 5) +
          '-' +
          endTime.toLocaleTimeString().slice(0, 5);
        this.eventDurations.push(this.eventDuration);
        this.eventHeights.push(this.eventHeight);
      }
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
