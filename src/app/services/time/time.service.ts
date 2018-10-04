import { Injectable } from '@angular/core';
import { GapiService } from '../gapi/gapi.service';
import { from, interval, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { meetingStatuses } from '../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private events;
  private timer = interval(1000);

  public dataSubject = new Subject<any>();
  public data = this.dataSubject.asObservable();

  private eventsSource = new Subject<any>();
  public events$ = this.eventsSource.asObservable();

  constructor(private gapiService: GapiService) {
    this.timer.subscribe({
      next: () => {
        this.updateData();
      }
    });
  }

  // METHODS FOR WORKING WITH API

  loadEvents() {
    const requiredDate: Date = new Date();
    const startTime: Date = new Date(
      requiredDate.getFullYear(),
      requiredDate.getMonth(),
      requiredDate.getDate(),
      9,
      0,
      0
    );
    const endTime: Date = new Date(
      requiredDate.getFullYear(),
      requiredDate.getMonth(),
      requiredDate.getDate(),
      22,
      0,
      0
    );
    return from(this.gapiService.listUpcomingEvents(startTime, endTime)).pipe(
      map(res => {
        this.eventsSource.next(res['result']['items']);
        this.updateData();
        return (this.events = res['result']['items']);
      })
    );
  }

  createEvent(startTime: Date, duration: number) {
    const endTime = new Date(startTime.getTime() + duration);
    return this.gapiService.createEvent(startTime, endTime);
  }

  // METHODS FOR CALCULATING DATA
  changeStatusByTime(currentTime: Date) {
    if (this.events) {
      if (this.events.length > 0) {
        for (let i = 0; i < this.events.length; i++) {
          const event = this.events[i];
          const startTime = new Date(event.start.dateTime),
            timeToStart = startTime.getTime() - currentTime.getTime();
          if (timeToStart >= 900000) {
            return meetingStatuses.available;
          } else if (timeToStart < 900000 && timeToStart > 0) {
            return meetingStatuses.soon;
          } else if (timeToStart < 0) {
            return meetingStatuses.inProcess;
          }
        }
      } else {
        return meetingStatuses.available;
      }
    }
  }

  private calculateIntervalForBooking(currentTime: Date) {
    const todaysMidnight = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      22,
      0,
      0
    );

    if (this.events) {
      if (this.events.length > 0) {
        const timeToFirstEvent =
          new Date(this.events[0].start.dateTime).getTime() -
          new Date(currentTime).getTime();
        if (timeToFirstEvent > 900000) {
          return {
            startTime: currentTime,
            endTime: new Date(this.events[0].start.dateTime),
            interval: timeToFirstEvent
          };
        }

        for (let i = 0; i < this.events.length - 1; i++) {
          const timeBetweenEvents =
            new Date(this.events[i + 1].start.dateTime).getTime() -
            new Date(this.events[i].end.dateTime).getTime();
          if (timeBetweenEvents > 900000) {
            return {
              startTime: new Date(this.events[i].end.dateTime),
              endTime: new Date(this.events[i + 1].start.dateTime),
              interval: timeBetweenEvents
            };
          }
        }
        const timeAfterLast =
          todaysMidnight.getTime() -
          new Date(this.events[this.events.length - 1].end.dateTime).getTime();
        if (timeAfterLast > 900000) {
          return {
            startTime: new Date(
              this.events[this.events.length - 1].end.dateTime
            ),
            endTime: todaysMidnight,
            interval: timeAfterLast
          };
        } else {
          return false;
        }
      } else {
        const timeToDayEnd = todaysMidnight.getTime() - currentTime.getTime();

        if (timeToDayEnd > 900000) {
          return {
            startTime: currentTime,
            endTime: todaysMidnight,
            interval: timeToDayEnd
          };
        }
      }
    }
  }

  private calculateTimerString(currentTime) {
    if (this.events) {
      if (this.events.length > 0) {
        for (let i = 0; i < this.events.length; i++) {
          const event = this.events[i];
          const startTime = new Date(event.start.dateTime),
            endTime = new Date(event.end.dateTime),
            timeToStart = startTime.getTime() - currentTime.getTime(),
            timeToEnd = endTime.getTime() - currentTime.getTime();
          if (timeToStart > 0) {
            return this.timeConverter(timeToStart);
          } else {
            if (timeToEnd > 0) {
              return this.timeConverter(timeToEnd);
            }
          }
        }
      } else {
        return undefined;
      }
    }
  }

  public timeConverter(miliseconds: number) {
    let hours = Math.floor(
        (miliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes = Math.floor((miliseconds % (1000 * 60 * 60)) / (1000 * 60)),
      seconds = Math.floor((miliseconds % (1000 * 60)) / 1000),
      hoursString = hours.toString(),
      minutesString = minutes.toString(),
      secondsString = seconds.toString();
    if (hours < 10) {
      hoursString = '0' + hoursString;
    }
    if (minutes < 10) {
      minutesString = '0' + minutesString;
    }
    if (seconds < 10) {
      secondsString = '0' + secondsString;
    }

    return hoursString + ':' + minutesString + ':' + secondsString;
  }

  public updateData() {
    if (this.events) {
      const currentTime = new Date();
      this.dataSubject.next({
        status: this.changeStatusByTime(currentTime),
        timer: this.calculateTimerString(currentTime),
        intervalForBooking: this.calculateIntervalForBooking(currentTime)
      });
    }
  }
}
