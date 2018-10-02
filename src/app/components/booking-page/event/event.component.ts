import { interval } from 'rxjs';
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { TimeService } from '../../../services/time/time.service';
import { Event } from '../../../models/event';
import { EventService } from '../../../services/event/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.sass']
})
export class EventComponent implements OnInit, OnDestroy {
  blocks ;
  dayInterval;

  constructor(
    private timeService: TimeService,
    private eventService: EventService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.eventService.blocksForRendering.subscribe({
      next: x => {
        this.blocks = x;
        this.ref.detectChanges();
        console.log(this.blocks)
      }
    });

    this.eventService.dayInterval.subscribe({
      next: x => {
        console.log(x)
      }
    });
  }

  pxStringBuider(miliseconds) {
    let string = Math.ceil(miliseconds / 20000);
    string = Math.abs(string);
    let pxString = string.toString() + 'px';
    return pxString
  }

  ngOnDestroy(): void {}
}
