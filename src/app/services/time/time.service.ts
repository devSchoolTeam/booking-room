import { Injectable } from "@angular/core";
import { GapiService } from "../gapi/gapi.service";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TimeService {
  currentStatus = new Subject<any>();
  nextEvent;
  timeToStart = new Subject<any>();
  timeToEnd = new Subject<any>();

  constructor(private gapiService: GapiService) {}

  changeStatusByTime(startTime: Date, endTime: Date) {
    let currentTime: Date = new Date();
    let timeToStart = startTime.getTime() - currentTime.getTime();

    let timeToEnd = endTime.getTime() - currentTime.getTime();

    if (timeToStart >= 900000) {
      this.currentStatus.next("available");
    } else if (timeToStart < 900000 && timeToStart > 0) {
      this.currentStatus.next("soon");
    } else if (timeToStart < 0) {
      this.currentStatus.next("inProcess");
    }
  }

  updateData() {
    this.gapiService.getEvents().subscribe({
      next: x => {
        let startTime = new Date(x[0].start.dateTime),
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
