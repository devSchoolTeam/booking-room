import { Component, OnInit, Input } from '@angular/core';
import { meetingStatuses } from '../../../shared/constants';
import { TimeService } from '../../../services/time/time.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  public currentStatus;

  constructor(private timeService: TimeService) { }
  ngOnInit() {
    this.currentStatus = meetingStatuses.available;
    this.timeService.currentStatus.subscribe(currentStatus => {
      this.currentStatus = currentStatus;
    });
  }
}
