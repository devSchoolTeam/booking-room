import { Injectable } from "@angular/core";
import { GapiService } from "../gapi/gapi.service";
import { Subject, interval, timer, Observable } from "rxjs";
import { meetingStatuses } from "../../shared/constants";

@Injectable({
  providedIn: "root"
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
      next: x => {
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
          this.events = res["result"]["items"];
          resolve();
        },
        rej => {
          console.log(rej);
          reject();
        }
      );
    });
  }

  getEvents(observer) {
    return Observable.of(this.events);
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

  calculateIntervalForBoocking(currentTime: Date) {
    if (this.events) {
      if (
        new Date(event[0].start.dateTime).getTime() -
          new Date(currentTime).getTime() >
        900000
      ) {
        this.intervalForBooking.next(
          new Date(event[0].start.dateTime).getTime() -
            new Date(currentTime).getTime()
        );
        return true;
      }

      for (let i = 1; i < this.events.length; i++) {
        if (
          this.events[i].start.dateTime.getTime() - currentTime.getTime() >
          900000
        ) {
          this.intervalForBooking.next(
            new Date(event[i].start.dateTime).getTime() -
              new Date(currentTime).getTime()
          );
          return true;
        }
      }
    }
  }

  updateData() {
    if (this.events[0]) {
      let event = this.events[0];
      const startTime = new Date(event.start.dateTime),
        endTime = new Date(event.end.dateTime),
        currentTime = new Date(),
        timeToStart = startTime.getTime() - currentTime.getTime(),
        timeToEnd = endTime.getTime() - currentTime.getTime();
      this.timeToStart.next(timeToStart);
      this.timeToEnd.next(timeToEnd);
      this.changeStatusByTime(startTime, endTime);
    }
  }
}
