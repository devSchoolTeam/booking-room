import { Component, OnDestroy, OnInit } from '@angular/core';
import { TimeService } from '../../../services/time/time.service';
import { Event } from '../../../models/event';

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

  constructor(private timeService: TimeService) {
  }

  ngOnInit() {
    this.subscription = this.timeService.events$.subscribe((events: Event[]) => {
      this.events = events;
      this.eventDurations = [];
      for (let i = 0; i < this.events.length; i++) {
        const startTime = new Date(events[i].start.dateTime);
        const endTime = new Date(events[i].end.dateTime);
        this.eventDuration =
          startTime.toLocaleTimeString().slice(0, 5) +
          '-' +
          endTime.toLocaleTimeString().slice(0, 5);
        this.eventDurations.push(this.eventDuration);
      }
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
