import { TimeService } from '../../services/time/time.service';
import { availableMeetingDurations } from '../../shared/constants';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.sass']
})
export class BookingPageComponent implements OnInit {
  currentStatus;
  interval;
  availableMeetingDurations = availableMeetingDurations;
  selectedDuration;
  tempEvent;
  loaderIsShown = false;
  public subscription: Subscription;
  constructor(private route: ActivatedRoute, private timeService: TimeService, private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe({
      next: data => {
        this.currentStatus = data['data'].status;
        this.interval = data['data'].intervalForBooking;
      }
    });
    this.subscription = this.timeService.dataSubject.subscribe(data => {
      this.currentStatus = data.status;
      this.interval = data.intervalForBooking;
    });
  }

  selectMeetingDuration(availableMeetingDuration: any) {
    this.selectedDuration = availableMeetingDuration.value;
    this.tempEvent = {
      start: this.interval.startTime,
      end: new Date(this.interval.startTime.getTime() + this.selectedDuration),
      duration:
        new Date(
          this.interval.startTime.getTime() + this.selectedDuration
        ).getTime() - this.interval.startTime.getTime(),
      timeFromStart:
        this.interval.startTime.getTime() -
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          9,
          0,
          0
        ).getTime()
    };
  }
  swipe() {
    return this.router.navigate(['/main-page']);
  }
  createEvent() {
    if (this.selectedDuration > 0) {
      this.loaderIsShown = true;
      this.timeService
        .createEvent(this.interval.startTime, this.selectedDuration)
        .then(
          res => {
            console.log('Success:' + res);
            this.timeService.loadEvents().subscribe();
            this.selectedDuration = 0;
            this.tempEvent = undefined;
            this.loaderIsShown = false;
          },
          err => {
            console.error(err);
          }
        );
    }
  }
}
