import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TimeService } from '../../../services/time/time.service';
import { EventService } from '../../../services/event/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.sass']
})
export class EventComponent implements OnInit, OnDestroy {
  blocks;

  constructor(
    private timeService: TimeService,
    private eventService: EventService,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.eventService.blocksForRendering.subscribe({
      next: x => {
        this.blocks = x;
        this.ref.detectChanges();
      }
    });
  }

  pxStringBuider(miliseconds) {
    let string = Math.ceil(miliseconds / 20000);
    string = Math.abs(string);
    const pxString = string.toString() + 'px';
    return pxString;
  }

  ngOnDestroy(): void {
  }
}
