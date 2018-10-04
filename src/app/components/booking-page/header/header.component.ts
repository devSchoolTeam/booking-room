import { Component, OnDestroy, OnInit } from '@angular/core';
import { TimeService } from '../../../services/time/time.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public statusSubscription: Subscription;
  public currentStatus;

  constructor(private timeService: TimeService) {}

  ngOnInit() {
    this.statusSubscription = this.timeService.dataSubject.subscribe(
      data => {
        this.currentStatus = data.status;
      }
    );
  }

  ngOnDestroy(): void {
    this.statusSubscription.unsubscribe();
  }
}
