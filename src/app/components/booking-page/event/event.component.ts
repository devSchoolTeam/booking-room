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
  blocks = [];
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

        
      }
    });

    this.eventService.dayInterval.subscribe({
      next: x => {
        x=x/10000
        this.dayInterval=x.toString()+'px';
        console.log(this.dayInterval);
        this.ref.detectChanges()
      }
    });
  }

  ngOnDestroy(): void {}
}
