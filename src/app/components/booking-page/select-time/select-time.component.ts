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
  public interval = 0;
  constructor(private timeService: TimeService) {  }

  ngOnInit() {
    this.currentStatus = meetingStatuses.available;
    this.timeService.currentStatus.subscribe(currentStatus => {
      this.currentStatus = currentStatus;
    });
    this.timeService.intervalForBooking.subscribe({
      next: gotInterval => {
        console.log(gotInterval.interval);
     this.interval = gotInterval.interval;
      }
    });
  }

  selectMeetingDuration(availableMeetingDuration: any) {
    this.selectedDuration = availableMeetingDuration;
  }
}
