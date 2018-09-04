import { Component, OnInit } from '@angular/core';
import {Input} from '@angular/core';
import { Output} from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.sass']
})
export class TimerComponent implements OnInit {
  hours;
  minutes;
  seconds;
  countDown;
  endTime;
  now;
  constructor() { }
  ngOnInit() {
    this.countDown = new Date('Sep 5, 2018 16:53:00');
    this.endTime = new Date('Sep 10, 2018 15:53:00');
    setInterval(() => {
      this.now = new Date();
      let distance = this.countDown - this.now;
      this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (this.hours < 10) {
        this.hours = '0' + this.hours;
      }
      if (this.minutes < 10) {
        this.minutes = '0' + this.minutes;
      }
      if (this.seconds < 10) {
        this.seconds = '0' + this.seconds;
      }
  }, 1000);
   }
}
