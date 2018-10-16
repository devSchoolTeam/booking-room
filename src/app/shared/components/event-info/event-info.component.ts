import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../Event';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.sass']
})
export class EventInfoComponent implements OnInit {
  @Input() event: Event;

  constructor() {
  }

  ngOnInit() {
  }
}
