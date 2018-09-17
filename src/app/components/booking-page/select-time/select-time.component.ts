import { Component, OnInit } from '@angular/core';
import { availableMeetingDurations, meetingStatuses } from '../../../shared/constants';
import { TimeService } from '../../../services/time/time.service';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.sass']
})
export class SelectTimeComponent implements OnInit {
  public selectedDuration: any;
  public availableMeetingDurations = availableMeetingDurations;
  public currentStatus;
  constructor(private timeService: TimeService) {  }

  ngOnInit() {
    this.currentStatus = meetingStatuses.available;
    this.timeService.change.subscribe(currentStatus => {
      this.currentStatus = currentStatus;
    });
  }
  changeStyle(time) {
    this.timeService.changeStatusByTime(time);
  }
  selectMeetingDuration(availableMeetingDuration: any) {
    this.selectedDuration = availableMeetingDuration;
  }
}
