import { Component, OnInit } from '@angular/core';
import { GapiService } from './services/gapi/gapi.service';
import { TimeService } from './services/time/time.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  // loader = false;

  constructor(
    private gapiService: GapiService,
    private timeService: TimeService
  ) {}
  ngOnInit() {}

  signOut() {
    this.gapiService.signOut();
  }
  signIn() {
    this.gapiService.signIn();
  }
}
