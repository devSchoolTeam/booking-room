import { Component, OnInit } from '@angular/core';
import { TimeService } from '../../../services/time/time.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.sass']
})
export class EventComponent implements OnInit {
  public subscription;
  public events;
  eventDuration;
  public eventDurations = [];

  constructor(private timeService: TimeService) {}

  ngOnInit() {
    this.subscription = this.timeService.getEvents({
      next: events => {
        this.events = events;
        for (let i = 0; i < this.events.length; i++) {
          const startTime = new Date(events[i].start.dateTime);
          const endTime = new Date(events[i].end.dateTime);
          this.eventDuration =
            startTime.toLocaleTimeString().slice(0, 5) +
            '-' +
            endTime.toLocaleTimeString().slice(0, 5);
          this.eventDurations.push(this.eventDuration);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
