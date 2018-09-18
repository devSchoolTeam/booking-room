import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TimeService } from '../../../../services/time/time.service';

@Component({
  selector: 'app-time-counting',
  templateUrl: './time-counting.component.html',
  styleUrls: ['./time-counting.component.sass']
})
export class TimeCountingComponent implements OnInit {
  @Output() time = new EventEmitter<number>();
  countDown;
  endTime;
  now;
  event;
  constructor(private timeService: TimeService) { }

  ngOnInit() {
    // this.timeService.nextEvent.subscribe((event) => {
    // this.event = event;
    // setInterval(() => {
    //   this.now = new Date();
    //   this.countDown = new Date(this.event.start);
    //   this.endTime = new Date(this.event.end);
    //   const time = this.countDown - this.now;
    //   this.time.emit(time);
    //   }, 1000); });
  }

}
