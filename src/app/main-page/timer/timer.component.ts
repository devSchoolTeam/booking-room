import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.sass']
})
export class TimerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const countDownDate = new Date('Jan 5, 2019 15:37:25').getTime();
    // @ts-ignore
    let x = setInterval(function() {
      let now = new Date().getTime();
      let distance = countDownDate - now;
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      document.getElementById('timer').innerHTML = hours + 'h'
        + minutes + 'm' + seconds + 's';
    }, 1000);
  }
   }
