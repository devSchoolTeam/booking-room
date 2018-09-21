import { Component, OnInit } from '@angular/core';
import { GapiService } from '../../../services/gapi/gapi.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.sass']
})
export class EventComponent implements OnInit {
  public events;
  eventDuration;
  public eventDurations = [];

  constructor(private gapiService: GapiService) {
  }

  ngOnInit() {
    this.gapiService.getEvents().subscribe({
      next: events => {
        this.events = events;
        for (let i = 0; i < this.events.length; i++) {
          console.log(events[i]);
          const startTime = new Date(events[i].start.dateTime);
          const endTime = new Date(events[i].end.dateTime);
          this.eventDuration = startTime.toLocaleTimeString().slice(0, 5) + '-' + endTime.toLocaleTimeString().slice(0, 5);
          this.eventDurations.push(this.eventDuration);
        }
        console.log(this.eventDurations);
      }
    });
  }
}
