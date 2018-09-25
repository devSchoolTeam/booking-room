import { Injectable } from '@angular/core';
import { GapiService } from '../gapi/gapi.service';
import { Subject, interval, timer, Observable } from 'rxjs';
import { meetingStatuses } from '../../shared/constants';
import { endTimeRange } from '@angular/core/src/profile/wtf_impl';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private events;
  public timer = interval(1000);

  public currentStatus = new Subject<any>();
  public timeToStart = new Subject<any>();
  public timeToEnd = new Subject<any>();
  public intervalForBooking = new Subject<any>();

  constructor(private gapiService: GapiService) {
    this.timer.subscribe({
      next: () => {
        this.updateData();
      }
    });
  }

  loadEvents() {
    const requiredDate: Date = new Date();
    const endTime: Date = new Date(
      requiredDate.getFullYear(),
      requiredDate.getMonth(),
      requiredDate.getDate(),
      23,
      59,
      59
    );
    return new Promise((resolve, reject) => {
      this.gapiService.listUpcomingEvents(requiredDate, endTime).then(
        res => {
          this.events = res['result']['items'];
          resolve();
        },
        rej => {
          reject(rej);
        }
      );
    });
  }

  getEvents(observer) {
    return Observable.of(this.events).subscribe(observer);
  }

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

  calculateIntervalForBooking(currentTime: Date) {
    if (this.events) {
      const timeToFirst =
        new Date(this.events[0].start.dateTime).getTime() -
        new Date(currentTime).getTime();
      if (timeToFirst > 900000) {
        this.intervalForBooking.next({
          startTime: currentTime,
          endTime: new Date(this.events[0].start.dateTime),
          interval: timeToFirst
        });
        return true;
      }

      for (let i = 0; i < this.events.length - 1; i++) {
        const timeToStart =
          new Date(this.events[i + 1].start.dateTime).getTime() -
          new Date(this.events[i].end.dateTime).getTime();
        if (timeToStart > 900000) {
          this.intervalForBooking.next({
            startTime: new Date(this.events[i].start.dateTime),
            endTime: new Date(this.events[i + 1].start.dateTime),
            interval: timeToStart
          });
          return true;
        }
      }
      const timeAfterLast =
        new Date(
          new Date(
            currentTime.getFullYear(),
            currentTime.getMonth(),
            currentTime.getDate(),
            23,
            59,
            59
          )
        ).getTime() -
        new Date(this.events[this.events.length - 1].end.dateTime).getTime();

      if (timeAfterLast > 900000) {
        this.intervalForBooking.next({
          startTime: new Date(
            this.events[this.events.length - 1].end.dateTime
          ).getTime(),
          endTime: new Date(
            new Date(
              currentTime.getFullYear(),
              currentTime.getMonth(),
              currentTime.getDate(),
              23,
              59,
              59
            )
          ).getTime(),
          interval: timeAfterLast
        });
        return true;
      }
    }
  }

  updateData() {
    if (this.events[0]) {
      const event = this.events[0];
      const startTime = new Date(event.start.dateTime),
        endTime = new Date(event.end.dateTime),
        currentTime = new Date(),
        timeToStart = startTime.getTime() - currentTime.getTime(),
        timeToEnd = endTime.getTime() - currentTime.getTime();
      this.timeToStart.next(timeToStart);
      this.timeToEnd.next(timeToEnd);
      this.changeStatusByTime(startTime, endTime);
      this.calculateIntervalForBooking(currentTime);
    }
  }

  createEvent(startTime: Date, duration: number) {
    let endTime = new Date(startTime.getTime() + duration);
    return this.gapiService.createEvent(startTime, endTime);
  }
}
