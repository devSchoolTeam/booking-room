import { Component, OnInit } from '@angular/core';
import {
  availableMeetingDurations,
  meetingStatuses
} from '../../../shared/constants';
import { TimeService } from '../../../services/time/time.service';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.sass']
})
export class SelectTimeComponent implements OnInit {
  public subscription;
  public selectedDuration: any;
  public durationValue;
  public availableMeetingDurations = availableMeetingDurations;
  public currentStatus;
  public interval;
  constructor(private timeService: TimeService) {}

  ngOnInit() {
    this.currentStatus = meetingStatuses.available;
    this.timeService.currentStatus.subscribe(currentStatus => {
      this.currentStatus = currentStatus;
    });
    this.subscription = this.timeService.intervalForBooking.subscribe({
      next: gotInterval => {
        this.interval = gotInterval;
        console.log(gotInterval)
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectMeetingDuration(availableMeetingDuration: any) {
    this.selectedDuration = availableMeetingDuration.value;
    
  }

  createEvent() {
    console.log(this.selectedDuration);
    if (this.selectedDuration) {
      this.timeService.createEvent(
        this.interval.startTime,
        this.selectedDuration
      ).then(res=>{
        console.log('Succes:'+res)
      },err=>{
        console.error(err)
      });
    }
  }
}
