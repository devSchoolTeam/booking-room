import { Injectable } from '@angular/core';
import { GapiService } from '../gapi/gapi.service';
import { from, interval, Subject } from 'rxjs';
import { meetingStatuses } from '../../shared/constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private events;
  private timer = interval(1000);
  private eventsSource = new Subject<any>();
  public events$ = this.eventsSource.asObservable();
  public timerString = new Subject<any>();
  public isEventFound = new Subject<any>();
  public currentStatus = new Subject<any>();
  public intervalForBooking = new Subject<any>();


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
    const endTime: Date = new Date(
      requiredDate.getFullYear(),
      requiredDate.getMonth(),
      requiredDate.getDate(),
      23,
      59,
      59
    );
    return from(this.gapiService.listUpcomingEvents(requiredDate, endTime)).pipe(
      map((res) => {
        this.eventsSource.next(res['result']['items']);
        return this.events = res['result']['items'];
      })
    );
  }

  createEvent(startTime: Date, duration: number) {
    const endTime = new Date(startTime.getTime() + duration);
    return this.gapiService.createEvent(startTime, endTime);
  }

  // METHODS FOR CALCULATING DATA

  private calculateIntervalForBooking(currentTime: Date) {
    const todaysMidnight = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      23,
      59,
      59
    );

    if (this.events) {
      if (this.events.length > 0) {
        const timeToFirstEvent =
          new Date(this.events[0].start.dateTime).getTime() -
          new Date(currentTime).getTime();
        if (timeToFirstEvent > 900000) {
          this.intervalForBooking.next({
            startTime: currentTime,
            endTime: new Date(this.events[0].start.dateTime),
            interval: timeToFirstEvent
          });
          return true;
        }

        for (let i = 0; i < this.events.length - 1; i++) {
          const timeBetweenEvents =
            new Date(this.events[i + 1].start.dateTime).getTime() -
            new Date(this.events[i].end.dateTime).getTime();
          if (timeBetweenEvents > 900000) {
            this.intervalForBooking.next({
              startTime: new Date(this.events[i].end.dateTime),
              endTime: new Date(this.events[i + 1].start.dateTime),
              interval: timeBetweenEvents
            });
            return true;
          }
        }
        const timeAfterLast =
          todaysMidnight.getTime() - new Date(this.events[this.events.length - 1].end.dateTime).getTime();
        if (timeAfterLast > 900000) {
          this.intervalForBooking.next({
            startTime: new Date(this.events[this.events.length - 1].end.dateTime),
            endTime: todaysMidnight,
            interval: timeAfterLast
          });
          return true;
        } else {
          this.intervalForBooking.next(false);
        }
      } else {
        const timeToDayEnd = todaysMidnight.getTime() - currentTime.getTime();

        if (timeToDayEnd > 900000) {
          this.intervalForBooking.next({
            startTime: currentTime,
            endTime: todaysMidnight,
            interval: timeToDayEnd
          });
        }
      }
    }
  }

  private calculateTimerString(currentTime) {
    if (this.events) {
      if (this.events.length > 0) {
        const event = this.events[0];
        const startTime = new Date(event.start.dateTime),
          endTime = new Date(event.end.dateTime),
          timeToStart = startTime.getTime() - currentTime.getTime(),
          timeToEnd = endTime.getTime() - currentTime.getTime();
        if (timeToStart > 0) {
          this.timerString.next(this.timeConverter(timeToStart));
        } else {
          if (timeToEnd > 0) {
            this.timerString.next(this.timeConverter(timeToEnd));
          } else {
            this.loadEvents().subscribe();
          }
        }
      } else {
        this.timerString.next('No upcoming events');
      }
    }
  }

  private timeConverter(miliseconds: number) {
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

  private foundingEvents() {
    if (this.events) {
      if (this.events.length > 0) {
        this.isEventFound.next(true);
      } else {
        this.isEventFound.next(false);
      }
    } else {
      this.isEventFound.next(true);
    }
  }


  private updateData() {
    if (this.events) {
      const currentTime = new Date();
      this.calculateTimerString(currentTime);
      this.calculateIntervalForBooking(currentTime);
      this.foundingEvents();
    }
  }

  // PUBLIC METHODS
  public getTimerString(observer) {
    return this.timerString.subscribe(observer);
  }

  public getStatus(observer) {
    return this.currentStatus.subscribe(observer);
  }

  public getIntervalForBooking(observer) {
    return this.intervalForBooking.subscribe(observer);
  }

  public getBooleanIsEventsFound(observer) {
    return this.isEventFound.subscribe(observer);
  }
}
