import { Component, OnInit } from '@angular/core';
import { availableMeetingDurations, buttonStatuses } from '../../../shared/constants';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.sass']
})
export class SelectTimeComponent implements OnInit {
  public selectedDuration: any;
  public availableMeetingDurations = availableMeetingDurations;
  public buttonStatus = buttonStatuses.unclicked;
  constructor() { }

  ngOnInit() {
  }
  selectMeetingDuration(availableMeetingDuration: any) {
    this.selectedDuration = availableMeetingDuration;
    console.log(this.selectedDuration);
  }
}
