import { Component, OnInit, Input } from '@angular/core';
import { EventBlock } from '../../eventBlock';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.sass']
})
export class EventInfoComponent implements OnInit {
  @Input() event: EventBlock;
  eventSubscription: Subscription;
  constructor() {}

  ngOnInit() {
    console.log(this.event);
  }
}
