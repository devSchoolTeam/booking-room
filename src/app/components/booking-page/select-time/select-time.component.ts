import { Component, OnDestroy, OnInit } from '@angular/core';
import { availableMeetingDurations, meetingStatuses } from '../../../shared/constants';
import { TimeService } from '../../../services/time/time.service';
import { Subject, Subscription } from 'rxjs';
import { EventService } from '../../../services/event/event.service';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.sass']
})
export class SelectTimeComponent implements OnInit, OnDestroy {
  public intervalSubscription: Subscription;
  public statusSubscription: Subscription;
  public selectedDuration: any;
  public availableMeetingDurations = availableMeetingDurations;
  public currentStatus;
  public gotInterval: any = 0;
  public abilityToBook = true;
  public blockHeightSource = new Subject<any>();
  public blockHeight$ = this.blockHeightSource.asObservable();

  constructor(private timeService: TimeService, private eventService: EventService) {}

  ngOnInit() {
    this.currentStatus = meetingStatuses.available;
    this.statusSubscription = this.timeService.currentStatus.subscribe(
      currentStatus => {
        this.currentStatus = currentStatus;
      }
    );
    this.intervalSubscription = this.timeService.getIntervalForBooking({
      next: gotInterval => {
        if (gotInterval === false) {
          this.abilityToBook = false;
        }
        this.gotInterval = gotInterval;
      }
    });
    this.eventService.selectedDuration$.subscribe(
      value => {

      }
    );
  }
  ngOnDestroy(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  selectMeetingDuration(availableMeetingDuration: any) {
    this.selectedDuration = availableMeetingDuration.value;
   this.eventService.selectMeetingDuration(availableMeetingDuration);
  }

  createEvent() {
    if (this.selectedDuration) {
      this.timeService
        .createEvent(this.gotInterval.startTime, this.selectedDuration)
        .then(
          res => {
            console.log('Success:' + res);
            this.timeService.loadEvents().subscribe();
            this.selectedDuration = 0;
          },
          err => {
            console.error(err);
          }
        );
    }
  }
}
