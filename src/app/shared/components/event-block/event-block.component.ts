import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-block',
  templateUrl: './event-block.component.html',
  styleUrls: ['./event-block.component.sass']
})
export class EventBlockComponent implements OnInit {
  @Input() public text: string;
  @Input() public backgroundColor: string;
  @Input() public fontColor: string;
  @Input() public classList: string;
  @Input() public eventHeight;
  constructor() { }
  ngOnInit() {
  }

}
