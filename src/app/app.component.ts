import { Component, OnInit } from '@angular/core';
import { GapiService } from './gapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'Hall Room';

  constructor(private gapiService: GapiService) {

  }
  ngOnInit() {
    this.gapiService.handleClientLoad();
  }

  signIn($event) {
    this.gapiService.handleAuthClick($event);
  }

  signOut($event) {
    this.gapiService.handleSignoutClick($event);
  }
  createEvent() {
    this.gapiService.createEvent();
  }
  showEvents() {
    this.gapiService.listUpcomingEvents();
  }
  setTimer() {
    this.gapiService.setTimer();
  }
}
