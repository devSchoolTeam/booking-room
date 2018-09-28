import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { meetingStatuses } from '../../../shared/constants';
import { TimeService } from '../../../services/time/time.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() initialStatus;
  public statusSubscription: Subscription;
  public currentStatus;

  constructor(private timeService: TimeService, private route: ActivatedRoute) {}
  ngOnInit() {
    this.currentStatus = this.initialStatus;
    this.statusSubscription = this.timeService.getStatus(currentStatus => {
      this.currentStatus = currentStatus;
    });
  }

  ngOnDestroy(): void {
    this.statusSubscription.unsubscribe();
  }
}
