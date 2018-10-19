import { TimeService } from '../../services/time/time.service';
import { availableMeetingDurations } from '../../shared/constants';
import { fromEvent, interval, merge, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { startWith, switchMap, throttle } from 'rxjs/operators';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss']
})
export class BookingPageComponent implements OnInit, AfterViewInit {
  currentStatus;
  interval;
  events: object;
  availableMeetingDurations = availableMeetingDurations;
  selectedDuration = 0;
  tempEvent: object;
  @ViewChild('eventScroll')
  eventScroll;
  eventIsCreating = false;
  @ViewChild('eventBlocks')
  eventBlocks;
  public subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private timeService: TimeService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    const click$ = fromEvent(document, 'click');
    const scroll$ = fromEvent(this.eventScroll.nativeElement, 'scroll');
    const userEvent = merge(
      click$,
      scroll$.pipe(throttle(value => interval(1000)))
    ).pipe(startWith(0));
    userEvent.pipe(switchMap(() => interval(60000))).subscribe(() => {
      this.eventBlocks.scrollToCurrentTime();
      this.selectMeetingDuration(0);
    });
  }

  ngOnInit() {
    this.timeService.events$.subscribe({
      next: events => {
        this.events = events;
      }
    });
    this.route.data.subscribe({
      next: data => {
        this.currentStatus = data['data'].status;
        this.interval = data['data'].intervalForBooking;
      }
    });
    this.subscription = this.timeService.data.subscribe(data => {
      this.currentStatus = data.status;
      this.interval = data.intervalForBooking;
    });
  }

  selectMeetingDuration(meetingDuration: number) {
    if (meetingDuration > 0) {
      this.selectedDuration = meetingDuration;
      this.tempEvent = {
        start: this.interval.start,
        end: new Date(this.interval.start.getTime() + this.selectedDuration),
        duration:
          new Date(
            this.interval.start.getTime() + this.selectedDuration
          ).getTime() - this.interval.start.getTime(),
        timeFromStart:
          this.interval.start.getTime() -
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            9,
            0,
            0
          ).getTime()
      };
      setTimeout(() => {
        this.eventBlocks.scrollToNewEvent();
      });
    } else {
      this.selectedDuration = meetingDuration;
      this.tempEvent = null;
    }
  }

  swipe() {
    this.router.navigate(['/']);
  }

  createEvent() {
    if (this.selectedDuration > 0 && !this.eventIsCreating) {
      this.eventIsCreating = true;
      setTimeout(() => {
        this.eventBlocks.scrollToNewEvent();
      }, 0);
      this.timeService
        .createEvent(this.interval.start, this.selectedDuration)
        .then(
          res => {
            this.timeService.loadEvents().subscribe();
            this.selectedDuration = 0;
            this.tempEvent = undefined;
            this.eventIsCreating = false;
          },
          err => {
            console.error(err);
          }
        );
    }
  }
}
