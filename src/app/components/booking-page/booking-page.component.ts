import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TimeService } from '../../services/time/time.service';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.sass']
})
export class BookingPageComponent implements OnInit {
  public currentStatus;
  public eventsSubscription;
  constructor(private route: ActivatedRoute, private timeService: TimeService) {}

  ngOnInit() {
    this.eventsSubscription = this.timeService.getStatus(currentStatus => {
      this.currentStatus = currentStatus;
    });
    this.timeService.loadEvents().subscribe();
  }
}
