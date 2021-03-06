import { Injectable } from '@angular/core';
import { GapiService } from '../gapi/gapi.service';
import { BehaviorSubject, from, interval } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { meetingStatuses } from '../../shared/constants';
import { Event } from '../../shared/Event';
import { BookingTime } from '../../shared/bookingTime';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private events;
  private intervalForDataUpdate = interval(1000);
  private intervalForEventsUpload = interval(60000);
  private dataSubject = new BehaviorSubject<any>(null);
  public data$ = this.dataSubject.asObservable();
  private eventsSource = new BehaviorSubject<any>(null);
  public events$ = this.eventsSource.asObservable();

  constructor(private gapiService: GapiService) {
    this.intervalForDataUpdate.subscribe({
      next: () => {
        this.updateData();
      }
    });
    this.intervalForEventsUpload.subscribe({
      next: () => {
        this.loadEvents().subscribe();
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
        const date = new Date();
        const events = [];
        const gapiEvents = res['result']['items'];
        gapiEvents.map(event => {
          events.push(new Event(event, date));
        });
        return events;
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
    if (events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const eventStartTime = new Date(event.start),
          eventEndTime = new Date(event.end),
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
      return meetingStatuses.available;
    } else {
      return meetingStatuses.available;
    }
  }

  calculateIntervalForBooking(events: Array<Event>, currentTime: Date) {
    const todaysMidnight = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      22,
      0,
      0
    );
    if (currentTime.getHours() < 9) {
      currentTime = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate(),
        9,
        0,
        0
      );
    }
    if (events.length > 0) {
      const timeToFirstEvent =
        new Date(events[0].start).getTime() - currentTime.getTime();
      if (timeToFirstEvent > 900000) {
        return new BookingTime(currentTime, new Date(events[0].start));
      }

      for (let i = 0; i < events.length - 1; i++) {
        const timeBetweenEvents =
          new Date(events[i + 1].start).getTime() -
          new Date(events[i].end).getTime();
        const timeFromStart =
          new Date(events[i].end).getTime() - currentTime.getTime();
        const timeFromEnd =
          new Date(events[i + 1].start).getTime() - currentTime.getTime();

        if (timeBetweenEvents > 900000 && timeFromStart >= 0) {
          return new BookingTime(
            new Date(events[i].end),
            new Date(events[i + 1].start)
          );
        } else if (
          timeBetweenEvents > 900000 &&
          timeFromStart < 0 &&
          timeFromEnd >= 900000
        ) {
          return new BookingTime(currentTime, new Date(events[i + 1].start));
        }
      }

      const timeAfterLast =
        todaysMidnight.getTime() -
        new Date(events[events.length - 1].end).getTime();
      const lastEventStartTime = new Date(events[events.length - 1].end);

      if (
        timeAfterLast > 900000 &&
        lastEventStartTime.getTime() - currentTime.getTime() >= 0
      ) {
        return new BookingTime(lastEventStartTime, todaysMidnight);
      } else if (
        timeAfterLast > 900000 &&
        lastEventStartTime.getTime() - currentTime.getTime() < 0
      ) {
        return new BookingTime(currentTime, todaysMidnight);
      } else {
        return false;
      }
    } else {
      const timeToDayEnd = todaysMidnight.getTime() - currentTime.getTime();
      if (timeToDayEnd > 900000) {
        return new BookingTime(currentTime, todaysMidnight);
      }
    }
  }

  calculateTimerString(events, currentTime) {
    if (events) {
      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          const event = events[i];
          const startTime = new Date(event.start),
            endTime = new Date(event.end),
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
}
