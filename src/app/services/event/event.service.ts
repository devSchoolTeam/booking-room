import { Injectable } from '@angular/core';
import { TimeService } from '../time/time.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events;
  constructor(private timeService: TimeService) {
    this.timeService.events$.subscribe({
      next: x => {
        this.events = x;
      }
    });
  }
}
