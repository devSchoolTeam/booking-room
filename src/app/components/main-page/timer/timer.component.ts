import { GapiService } from './../../../services/gapi/gapi.service';
import { TimeService } from "./../../../services/time/time.service";
import { Component, OnInit } from "@angular/core";
import { Input } from "@angular/core";
import { Output } from "@angular/core";
import { EventEmitter } from "@angular/core";

import { TimeCountingComponent } from "./time-counting/time-counting.component";

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.sass"]
})
export class TimerComponent implements OnInit {
  hours;
  minutes;
  seconds;
  constructor(private timeService: TimeService, private gapiService:GapiService) {}
  ngOnInit() {
    this.timeService.timeToStart.subscribe({
      next: x => {
        if (x > 0) {
          this.countTime(x);
        } else {
          this.timeService.timeToEnd.subscribe({
            next: y => {
              if (y > 0) {
                this.countTime(y);
              } else {
                this.gapiService.listUpcomingEvents().subscribe()
              }
            }
          });
        }
      }
    });
  }
  countTime(time) {
    this.hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((time % (1000 * 60)) / 1000);
    if (this.hours < 10) {
      this.hours = "0" + this.hours;
    }
    if (this.minutes < 10) {
      this.minutes = "0" + this.minutes;
    }
    if (this.seconds < 10) {
      this.seconds = "0" + this.seconds;
    }
  }
}
