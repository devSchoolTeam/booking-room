import { Component, OnInit } from '@angular/core';
import { meetingStatuses } from '../../../shared/constants';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.sass']
})
export class BodyComponent implements OnInit {
  public currentStatus =  meetingStatuses.available;

  constructor() { }

  ngOnInit() {}

  changeStylesByTime(time) {
    if ( time > 900000) {
      this.currentStatus = meetingStatuses.available;
    } else if (time < 900000  && time > 0) {
      this.currentStatus = meetingStatuses.soon;
    } else if (time < 0 ) {
      this.currentStatus = meetingStatuses.inProcess;
    }
 }
}
