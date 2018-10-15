import { Component, OnInit } from '@angular/core';
import { PopupService } from 'src/app/services/popup/popup.service';
import { EventBlock } from '../../eventBlock';
import { TimeService } from 'src/app/services/time/time.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.sass']
})
export class PopupComponent implements OnInit {
  constructor(
    private popupService: PopupService,
    private timeService: TimeService
  ) {}
  popUpState: Boolean;
  eventId;
  events: Array<EventBlock>;
  ngOnInit() {
    this.timeService.events$.subscribe({
      next: events => {
        this.events = events;
      }
    });

    this.popupService.popupState.subscribe({
      next: state => {
        this.popUpState = state;
      }
    });

    this.popupService.popupContent.subscribe({
      next: content => {
        this.eventId = content.index;
      }
    });
  }

  onCloseClick() {
    this.popupService.hidePopup();
  }

  onSwipeRight() {
    console.log('Swiped right');
    if (this.eventId > 0) {
      this.eventId--;
    } else {
      this.eventId = this.events.length - 1;
    }
    console.log(this.eventId);
  }

  onSwipeLeft() {
    console.log('Swiped left');
    if (this.eventId < this.events.length - 1) {
      this.eventId++;
    } else {
      this.eventId = 0;
    }
    console.log(this.eventId);
  }
}
