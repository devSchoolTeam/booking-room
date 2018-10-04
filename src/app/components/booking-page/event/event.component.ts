import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TimeService } from '../../../services/time/time.service';
import { EventService } from '../../../services/event/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.sass']
})
export class EventComponent implements OnInit {
  blocks;
  measure = [];
  interval;
  date1 = new Date(
    'Thu Oct 04 2018 09:00:00 GMT+0300 (Eastern European Summer Time)'
  );
  date2 = new Date(
    'Thu Oct 04 2018 22:00:00 GMT+0300 (Eastern European Summer Time)'
  );

  event;

  constructor(private timeService: TimeService) {}

  ngOnInit() {
    this.timeService.loadEvents().subscribe(()=>{
      this.timeService.updateData()
    });
    this.timeService.events$.subscribe({
      next: events => {
        console.log(events)
        const date = new Date();
        this.blocks = this.calculateBlocks(events, date);
        this.interval = this.calculateInterval(date);
      }
    });
  }

  calculateMeasure() {


    let startDate = this.interval.start,
      endDate = this.interval.end,
      arr = [];

    while (startDate <= endDate) {

      startDate.setDate(startDate.getMinutes() + 15);
    }
  }

  pxStringBuider(miliseconds) {
    let x = (miliseconds * 100) / this.interval.interval;

    let string = x.toString() + '%';
    return string;
  }

  calculateBlocks(events, currentTime: Date) {
    const eventBlock = [];
    const startTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      9,
      0,
      0
    );
    for (let i = 0; i < events.length; i++) {
      eventBlock.push({
        type: 'event',
        string: 'Next event',
        start: new Date(events[i].start.dateTime),
        end: new Date(events[i].end.dateTime),
        duration:
          new Date(events[i].end.dateTime).getTime() -
          new Date(events[i].start.dateTime).getTime(),
        fromStart:
          new Date(events[i].start.dateTime).getTime() - startTime.getTime()
      });
    }

    return eventBlock;
  }

  calculateInterval(currentTime: Date) {
    let startTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      9,
      0,
      0
    );
    let endTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      22,
      0,
      0
    );

    return {
      start: startTime,
      end: endTime,
      interval: endTime.getTime() - startTime.getTime()
    };
  }
}
