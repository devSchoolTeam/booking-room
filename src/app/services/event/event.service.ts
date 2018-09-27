import { Injectable } from '@angular/core';
import { availableMeetingDurations } from '../../shared/constants';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  public availableMeetingDuration = availableMeetingDurations;
  private durationSource = new Subject<any>();
  public selectedDuration$ = this.durationSource.asObservable();
  private blockHeightSource = new Subject<any>();
  public blockHeight$ = this.blockHeightSource.asObservable();
  constructor() { }

  selectMeetingDuration(availableMeetingDuration) {
    this.durationSource.next( availableMeetingDuration.value);
    this.blockHeightSource.next(availableMeetingDuration.blockHeight);
  }
}
