import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  availableMeetingDurations,
  meetingStatuses
} from '../../../shared/constants';
import { TimeService } from '../../../services/time/time.service';
import { Subject, Subscription } from 'rxjs';
import { EventService } from '../../../services/event/event.service';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['./select-time.component.sass']
})
export class SelectTimeComponent implements OnInit, OnDestroy {
  loading = false;
  blocks;
  events;
  public intervalSubscription: Subscription;
  public statusSubscription: Subscription;
  public selectedDuration: number = 0;
  public availableMeetingDurations = availableMeetingDurations;
  public currentStatus;
  public gotInterval: any;
  public abilityToBook = true;

  currentDate;

  constructor(
    private timeService: TimeService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.currentStatus = meetingStatuses.available;
    this.statusSubscription = this.timeService.currentStatus.subscribe(
      currentStatus => {
        this.currentStatus = currentStatus;
      }
    );

    this.timeService.events$.subscribe({
      next: events => {
        this.events = events;
        let date = new Date();
        this.blocks = this.calculateBlocks(events, date);
        console.log(this.blocks);
      }
    });

    this.intervalSubscription = this.timeService.intervalForBooking.subscribe({
      next: gotInterval => {
        if (gotInterval === false) {
         
          this.abilityToBook = false; console.log(this.abilityToBook);
          this.selectedDuration = 0;
        }
        this.gotInterval = gotInterval;
        if (this.selectedDuration >= this.gotInterval.value) {
          this.selectedDuration = 0;
        }
      }
    });

    this.currentDate = new Date();
    this.eventService.calculateInterval(this.currentDate);
    this.eventService.calculateBlocks(this.currentDate);
  }
  ngOnDestroy(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  selectMeetingDuration(availableMeetingDuration: any) {
    this.selectedDuration = availableMeetingDuration.value;
    this.blocks = this.calculateBlocks(this.events, new Date(), {
      start: this.gotInterval.startTime,
      endTime: new Date(
        this.gotInterval.startTime.getTime() + this.selectedDuration
      )
    });
  }

  createEvent() {
    if (this.selectedDuration > 0) {
      this.loading = true;
      this.timeService
        .createEvent(this.gotInterval.startTime, this.selectedDuration)
        .then(
          res => {
            console.log('Success:' + res);
            this.timeService.loadEvents().subscribe({
              next: x => {

              }
            });
            this.selectedDuration = 0;
            this.loading = false;
          },
          err => {
            console.error(err);
          }
        );
    }
  }

  pxStringBuider(miliseconds) {
    let string = Math.ceil(miliseconds / 20000);
    string = Math.abs(string);
    let pxString = string.toString() + 'px';
    return pxString;
  }

  calculateBlocks(
    events,
    currentTime: Date,
    eventAboutToCreate?: { start: Date; endTime: Date }
  ) {
    let fuckingBloks = [];
    let endTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      23,
      59,
      59
    );

    if (events.length > 0) {
      if (
        new Date(events[0].start.dateTime).getTime() > currentTime.getTime()
      ) {
        fuckingBloks.push({
          type: 'space',
          string: '',
          start: currentTime,
          end: new Date(events[0].start.dateTime),
          duration:
            new Date(events[0].start.dateTime).getTime() - currentTime.getTime()
        });

        if (
          new Date(events[0].start.dateTime).getTime() - currentTime.getTime() >
          900000
        ) {
          fuckingBloks.push({
            type: 'event',
            string: 'Next event',
            start: new Date(events[0].start.dateTime),
            end: new Date(events[0].end.dateTime),
            duration:
              new Date(events[0].end.dateTime).getTime() -
              new Date(events[0].start.dateTime).getTime()
          });
        } else if (
          new Date(events[0].start.dateTime).getTime() - currentTime.getTime() <
            900000 &&
          new Date(events[0].start.dateTime).getTime() - currentTime.getTime() >
            0
        ) {
          fuckingBloks.push({
            type: 'event',
            string: 'Soon',
            start: new Date(events[0].end.dateTime),
            end: new Date(events[0].start.dateTime),
            duration:
              new Date(events[0].end.dateTime).getTime() -
              new Date(events[0].start.dateTime).getTime()
          });
        }
      } else {
        fuckingBloks.push({
          type: 'event',
          string: 'In procces',
          start: currentTime,
          end: new Date(events[0].end.dateTime),
          duration:
            new Date(events[0].end.dateTime).getTime() - currentTime.getTime()
        });
      }
      if (events.length > 1) {
        fuckingBloks.push({
          type: 'space',
          string: '',
          start: new Date(events[0].end.dateTime),
          end: new Date(events[1].start.dateTime),
          duration:
            new Date(events[1].start.dateTime).getTime() -
            new Date(events[0].end.dateTime).getTime()
        });
      } else {
        fuckingBloks.push({
          type: 'space',
          string: '',
          start: new Date(events[0].end.dateTime),
          end: endTime,
          duration:
            endTime.getTime() - new Date(events[0].end.dateTime).getTime()
        });
      }

      for (let i = 1; i < events.length; i++) {
        fuckingBloks.push({
          type: 'event',
          string: 'Next event',
          start: new Date(events[i].start.dateTime),
          end: new Date(events[i].end.dateTime),
          duration:
            new Date(events[i].end.dateTime).getTime() -
            new Date(events[i].start.dateTime).getTime()
        });

        if (i < events.length - 1) {
          fuckingBloks.push({
            type: 'space',
            string: '',
            start: new Date(events[i].end.dateTime),
            end: new Date(events[i + 1].start.dateTime),
            duration:
              new Date(events[i + 1].start.dateTime).getTime() -
              new Date(events[i].end.dateTime).getTime()
          });
        } else {
          fuckingBloks.push({
            type: 'space',
            string: '',
            start: new Date(events[i].end.dateTime),
            end: endTime,
            duration:
              endTime.getTime() - new Date(events[i].end.dateTime).getTime()
          });
        }
      }
    } else {
      fuckingBloks.push({
        type: 'space',
        string: '',
        start: currentTime,
        end: endTime,
        duration: endTime.getTime() - currentTime.getTime()
      });
    }

    if (eventAboutToCreate) {
      for (let i = 0; i < fuckingBloks.length; i++) {
        if (
          fuckingBloks[i].type === 'space' &&
          fuckingBloks[i].end.getTime() - fuckingBloks[i].start.getTime() >=
            eventAboutToCreate.endTime.getTime() -
              eventAboutToCreate.start.getTime()
        ) {
          let array = [
            {
              type: 'space',
              string: '',
              start: fuckingBloks[i].start,
              end: eventAboutToCreate.start,
              duration:
                eventAboutToCreate.start.getTime() - fuckingBloks[i].start
            },
            {
              type: 'tempEvent',
              string: 'New event',
              start: eventAboutToCreate.start,
              end: eventAboutToCreate.endTime,
              duration:
                eventAboutToCreate.endTime.getTime() -
                eventAboutToCreate.start.getTime()
            },
            {
              type: 'space',
              string: '',
              start: eventAboutToCreate.endTime,
              end: fuckingBloks[i].end,
              duration:
                fuckingBloks[i].end.getTime() -
                eventAboutToCreate.endTime.getTime()
            }
          ];

          fuckingBloks.splice(i, 1, array[0], array[1], array[2]);
          break;
        }
      }
    }

    return fuckingBloks;
  }
}
