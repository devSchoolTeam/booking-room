import { EventEmitter, Injectable, Output } from '@angular/core';
import { meetingStatuses } from '../../shared/constants';
import { GapiService } from '../gapi/gapi.service';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  currentStatus = meetingStatuses.available;
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() nextEvent: EventEmitter<any> = new EventEmitter();
  constructor(private gapiService: GapiService) {
  }

  changeStatusByTime(time) {
    if (time > 900000) {
      this.currentStatus = meetingStatuses.available;
    } else if (time < 900000 && time > 0) {
      this.currentStatus = meetingStatuses.soon;
    } else if (time < 0) {
      this.currentStatus = meetingStatuses.inProcess;
    }
    this.change.emit(this.currentStatus);
  }
  eventHandler() {
    setInterval(() => {this.gapiService.getNextEvent().then((response) => {
      this.nextEvent.emit(response); }); }, 1000);
    }
    }
