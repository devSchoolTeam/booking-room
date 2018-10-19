import { Component, Input, OnInit } from '@angular/core';
import { TimeService } from '../../../services/time/time.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input()
  currentClass: string;

  constructor(private timeService: TimeService) {}

  ngOnInit() {}
}
