import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { availableMeetingDurations } from '../../../shared/constants';
import { TimeService } from '../../../services/time/time.service';
import { Subject, Subscription } from 'rxjs';
import { EventService } from '../../../services/event/event.service';
import set = Reflect.set;

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.sass']
})
export class SelectTimeComponent implements OnInit, OnDestroy {
  @Input() initialStatus;
  public intervalSubscription: Subscription;
  public statusSubscription: Subscription;
  public selectedDuration: any;
  public availableMeetingDurations = availableMeetingDurations;
  public currentStatus;
  public gotInterval: any = 0;
  public abilityToBook = true;
  public loaderIsShown = false;

  constructor(private timeService: TimeService, private eventService: EventService) {
  }

  ngOnInit() {
    this.currentStatus = this.initialStatus;
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
            this.loaderIsShown = true;
            console.log('Success:' + res);
            this.timeService.loadEvents().subscribe();
            this.loaderIsShown = false;
          },
          err => {
            console.error(err);
          }
        );
    }
  }
}
