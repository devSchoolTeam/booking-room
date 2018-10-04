import { Component, OnInit } from '@angular/core';
import { TimeService } from '../../../services/time/time.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  public currentStatus;

  constructor(private timeService: TimeService) {
  }

  ngOnInit() {
    this.timeService.data.subscribe(
      data => {
        this.currentStatus = data.status;
      }
    );
  }
}
