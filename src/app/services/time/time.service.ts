import { Injectable } from '@angular/core';
import { GapiService } from '../gapi/gapi.service';
import { Subject } from 'rxjs';
import { meetingStatuses } from '../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  currentStatus = new Subject<any>();
  nextEvent;
  timeToStart = new Subject<any>();
  timeToEnd = new Subject<any>();

  constructor(private gapiService: GapiService) {}

  changeStatusByTime(startTime: Date, endTime: Date) {
    const currentTime: Date = new Date();
    const timeToStart = startTime.getTime() - currentTime.getTime();

    const timeToEnd = endTime.getTime() - currentTime.getTime();

    if (timeToStart >= 900000) {
      this.currentStatus.next(meetingStatuses.available);
    } else if (timeToStart < 900000 && timeToStart > 0) {
      this.currentStatus.next(meetingStatuses.soon);
    } else if (timeToStart < 0) {
      this.currentStatus.next(meetingStatuses.inProcess);
    }
  }

  updateData() {
    this.gapiService.getEvents().subscribe({
      next: x => {
        const startTime = new Date(x[0].start.dateTime),
          endTime = new Date(x[0].end.dateTime),
          currentTime = new Date(),
          timeToStart = startTime.getTime() - currentTime.getTime(),
          timeToEnd = endTime.getTime() - currentTime.getTime();
        this.timeToStart.next(timeToStart);
        this.timeToEnd.next(timeToEnd);
        this.changeStatusByTime(startTime, endTime);
      }
    });
  }
}