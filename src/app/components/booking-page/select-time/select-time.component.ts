import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { availableMeetingDurations } from '../../../shared/constants';
import { TimeService } from '../../../services/time/time.service';
import { Subscription } from 'rxjs';
import { EventService } from '../../../services/event/event.service';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class SelectTimeComponent implements OnInit, OnDestroy {
  public intervalSubscription: Subscription;
  public statusSubscription: Subscription;
  public selectedDuration = 0;
  public availableMeetingDurations = availableMeetingDurations;
  public currentStatus;
  public gotInterval: any;
  public abilityToBook = true;
  public loaderIsShown;
  currentDate;

  constructor(private timeService: TimeService, private eventService: EventService) {
  }

  ngOnInit() {
    this.statusSubscription = this.timeService.currentStatus.subscribe(
      currentStatus => {
        this.currentStatus = currentStatus;
      }
    );
    this.intervalSubscription = this.timeService.getIntervalForBooking({
      next: gotInterval => {
        this.gotInterval = gotInterval;
        if (this.selectedDuration >= this.gotInterval.value) {
          this.selectedDuration = 0;
        }
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
    this.eventService.calculateInterval(new Date());
    this.eventService.calculateBlocks(new Date(), {
      start: this.gotInterval.startTime,
      endTime: new Date(
        this.gotInterval.startTime.getTime() + this.selectedDuration
      )
    });
  }

  createEvent() {
    if (this.selectedDuration > 0) {
      this.loaderIsShown = true;
      this.timeService
        .createEvent(this.gotInterval.startTime, this.selectedDuration)
        .then(
          res => {
            console.log('Success:' + res);
            this.timeService.loadEvents().subscribe({
              next: x => {
                this.currentDate = new Date();
                this.eventService.calculateInterval(this.currentDate);
                this.eventService.calculateBlocks(this.currentDate);
              }
            });
            this.selectedDuration = 0;
            this.loaderIsShown = false;
          },
          err => {
            console.error(err);
          }
        );
    }
  }
}
