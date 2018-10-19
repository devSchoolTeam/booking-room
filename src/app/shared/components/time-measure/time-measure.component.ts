import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-time-measure',
  templateUrl: './time-measure.component.html',
  styleUrls: ['./time-measure.component.scss']
})
export class TimeMeasureComponent implements OnInit, OnChanges {
  @Input()
  start: Date;
  @Input()
  end: Date;
  @Input()
  typeInput: string;
  type;
  measure;
  interval;
  constructor() {}

  ngOnInit() {
    if (this.typeInput) {
      this.type = this.typeInput;
    }
    this.interval = this.calculateInterval();
    this.measure = this.calculateMeasure(
      this.interval.start,
      this.interval.end
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

  calculateMeasure(startTime: Date, endTime: Date) {
    const objects = [];
    while (startTime <= endTime) {
      if (startTime.getMinutes() !== 0) {
        objects.push({
          time: startTime,
          type: 'small'
        });
      } else {
        objects.push({
          time: startTime,
          type: 'big'
        });
      }

      startTime = new Date(startTime.getTime() + 900000);
    }

    const height = 100 / objects.length;
    objects.forEach(elem => {
      elem.height = height.toString() + '%';
    });

    return objects;
  }

  calculateHeight(milliseconds: number, type?: 'height' | 'offset') {
    let x = (milliseconds * 100) / this.interval.interval;
    if (type === 'height') {
      x -= 0.1;
    }
    if (type === 'offset') {
      x += 0.1;
    }
    return x.toString() + '%';
  }

  calculateInterval() {
    const today = new Date();
    let start, end;
    if (this.start) {
      start = this.start;
    } else {
      start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        9,
        0,
        0
      );
    }

    if (this.end) {
      end = this.start;
    } else {
      end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        22,
        0,
        0
      );
    }

    return {
      start: start,
      end: end,
      interval: end.getTime() - start.getTime()
    };
  }
}
