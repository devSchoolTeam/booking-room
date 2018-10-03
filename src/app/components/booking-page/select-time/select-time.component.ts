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
  public events;
  public blocks;

  constructor(private timeService: TimeService) {
  }

  ngOnInit() {
    this.statusSubscription = this.timeService.currentStatus.subscribe(
      currentStatus => {
        this.currentStatus = currentStatus;
      }
    );

    this.timeService.events$.subscribe({
      next: events => {
        this.events = events;
        const date = new Date();
        this.blocks = this.calculateBlocks(events, date);
        console.log(this.blocks);
      }
    });

    this.intervalSubscription = this.timeService.intervalForBooking.subscribe({
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
    this.blocks = this.calculateBlocks(this.events, new Date(), {
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
            this.timeService.loadEvents().subscribe();
            this.selectedDuration = 0;
            this.loaderIsShown = false;
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
    const pxString = string.toString() + 'px';
    return pxString;
  }

  calculateBlocks(
    events,
    currentTime: Date,
    eventAboutToCreate?: { start: Date; endTime: Date }
  ) {
    const eventBlock = [];
    const endTime = new Date(
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
        eventBlock.push({
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
          eventBlock.push({
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
          eventBlock.push({
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
        eventBlock.push({
          type: 'event',
          string: 'In process',
          start: currentTime,
          end: new Date(events[0].end.dateTime),
          duration:
            new Date(events[0].end.dateTime).getTime() - currentTime.getTime()
        });
      }
      if (events.length > 1) {
        eventBlock.push({
          type: 'space',
          string: '',
          start: new Date(events[0].end.dateTime),
          end: new Date(events[1].start.dateTime),
          duration:
            new Date(events[1].start.dateTime).getTime() -
            new Date(events[0].end.dateTime).getTime()
        });
      } else {
        eventBlock.push({
          type: 'space',
          string: '',
          start: new Date(events[0].end.dateTime),
          end: endTime,
          duration:
            endTime.getTime() - new Date(events[0].end.dateTime).getTime()
        });
      }

      for (let i = 1; i < events.length; i++) {
        eventBlock.push({
          type: 'event',
          string: 'Next event',
          start: new Date(events[i].start.dateTime),
          end: new Date(events[i].end.dateTime),
          duration:
            new Date(events[i].end.dateTime).getTime() -
            new Date(events[i].start.dateTime).getTime()
        });

        if (i < events.length - 1) {
          eventBlock.push({
            type: 'space',
            string: '',
            start: new Date(events[i].end.dateTime),
            end: new Date(events[i + 1].start.dateTime),
            duration:
              new Date(events[i + 1].start.dateTime).getTime() -
              new Date(events[i].end.dateTime).getTime()
          });
        } else {
          eventBlock.push({
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
      eventBlock.push({
        type: 'space',
        string: '',
        start: currentTime,
        end: endTime,
        duration: endTime.getTime() - currentTime.getTime()
      });
    }

    if (eventAboutToCreate) {
      for (let i = 0; i < eventBlock.length; i++) {
        if (
          eventBlock[i].type === 'space' &&
          eventBlock[i].end.getTime() - eventBlock[i].start.getTime() >=
            eventAboutToCreate.endTime.getTime() -
              eventAboutToCreate.start.getTime()
        ) {
          const array = [
            {
              type: 'space',
              string: '',
              start: eventBlock[i].start,
              end: eventAboutToCreate.start,
              duration:
                eventAboutToCreate.start.getTime() - eventBlock[i].start
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
              end: eventBlock[i].end,
              duration:
                eventBlock[i].end.getTime() -
                eventAboutToCreate.endTime.getTime()
            }
          ];

          eventBlock.splice(i, 1, array[0], array[1], array[2]);
          break;
        }
      }
    }

    return eventBlock;
  }
}
