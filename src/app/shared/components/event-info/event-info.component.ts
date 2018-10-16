import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../Event';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.sass']
})
export class EventInfoComponent implements OnInit {
  @Input()
  event: Event;
  eventSubscription: Subscription;
  constructor() {}

  ngOnInit() {}
}
