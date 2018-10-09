import { Injectable } from '@angular/core';
import { GapiService } from '../gapi/gapi.service';
import { from, interval, Subject, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { meetingStatuses } from '../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private events;
  private timer = interval(1000);

  public dataSubject = new Subject<any>();
  public data = this.dataSubject.asObservable();

  private eventsSource = new BehaviorSubject<any>(undefined);
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
        return res['result']['items'];
      }),
      tap(res => {
        this.events = res;
        this.updateData();
        this.eventsSource.next(res);
      })
    );
  }

  createEvent(startTime: Date, duration: number) {
    const endTime = new Date(startTime.getTime() + duration);
    return this.gapiService.createEvent(startTime, endTime);
  }

  // METHODS FOR CALCULATING DATA
  changeStatusByTime(events, currentTime: Date) {
    const startTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      8,
      0,
      0
    );

    if (events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const eventStartTime = new Date(event.start.dateTime),
          eventEndTime = new Date(event.end.dateTime),
          timeToStart = eventStartTime.getTime() - currentTime.getTime(),
          timeToEnd = eventEndTime.getTime() - currentTime.getTime();

        if (timeToEnd > 0) {
          if (timeToStart >= 900000) {
            return meetingStatuses.available;
          } else if (timeToStart < 900000 && timeToStart > 0) {
            return meetingStatuses.soon;
          } else if (timeToStart < 0) {
            return meetingStatuses.inProcess;
          }
        }
      }
      return meetingStatuses.inProcess;
    } else {
      return meetingStatuses.available;
    }
  }

  calculateIntervalForBooking(events: Array<any>, currentTime: Date) {
    const todaysMidnight = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      22,
      0,
      0
    );
    if (events.length > 0) {
      const timeToFirstEvent =
        new Date(events[0].start.dateTime).getTime() - currentTime.getTime();
      if (timeToFirstEvent > 900000) {
        return {
          startTime: currentTime,
          endTime: new Date(events[0].start.dateTime),
          interval: timeToFirstEvent
        };
      }

      for (let i = 0; i < events.length - 1; i++) {
        const timeBetweenEvents =
          new Date(events[i + 1].start.dateTime).getTime() -
          new Date(events[i].end.dateTime).getTime();
        const timeFromStart =
          new Date(events[i].end.dateTime).getTime() - currentTime.getTime();
        const timeFromEnd =
          new Date(events[i + 1].start.dateTime).getTime() -
          currentTime.getTime();

        if (timeBetweenEvents > 900000 && timeFromStart >= 0) {
          return {
            startTime: new Date(events[i].end.dateTime),
            endTime: new Date(events[i + 1].start.dateTime),
            interval: timeBetweenEvents
          };
        } else if (
          timeBetweenEvents > 900000 &&
          timeFromStart < 0 &&
          timeFromEnd >= 900000
        ) {
          return {
            startTime: currentTime,
            endTime: new Date(events[i + 1].start.dateTime),
            interval: timeBetweenEvents
          };
        }
      }

      const timeAfterLast =
        todaysMidnight.getTime() -
        new Date(events[events.length - 1].end.dateTime).getTime();
      const lastEventStartTime = new Date(
        events[events.length - 1].end.dateTime
      );

      if (
        timeAfterLast > 900000 &&
        lastEventStartTime.getTime() - currentTime.getTime() >= 0
      ) {
        return {
          startTime: lastEventStartTime,
          endTime: todaysMidnight,
          interval: timeAfterLast
        };
      } else if (
        timeAfterLast > 900000 &&
        lastEventStartTime.getTime() - currentTime.getTime() < 0
      ) {
        return {
          startTime: currentTime,
          endTime: todaysMidnight,
          interval: todaysMidnight.getTime() - currentTime.getTime()
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

  calculateTimerString(events, currentTime) {
    if (events) {
      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          const event = events[i];
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
    const hours = Math.floor(
        (miliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes = Math.floor((miliseconds % (1000 * 60 * 60)) / (1000 * 60)),
      seconds = Math.floor((miliseconds % (1000 * 60)) / 1000);
    let hoursString = hours.toString(),
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
        status: this.changeStatusByTime(this.events, currentTime),
        timer: this.calculateTimerString(this.events, currentTime),
        intervalForBooking: this.calculateIntervalForBooking(
          this.events,
          currentTime
        )
      });
    }
  }

  // public getStatus(currentTime) {
  //   return this.changeStatusByTime(this.events, currentTime);
  // }

  // public getIntervalForBooking(currentTime) {
  //   return this.calculateIntervalForBooking(this.events, currentTime);
  // }

  // public getTimerString(currentTime) {
  //   return this.calculateTimerString(this.events, currentTime);
  // }
}
