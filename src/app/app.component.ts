import { Component, OnInit } from '@angular/core';
import { GapiService } from './services/gapi/gapi.service';
import { TimeService } from './services/time/time.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'Hall Room';

  constructor(private gapiService: GapiService, private timeService: TimeService) {

  }

  ngOnInit() {
    this.gapiService.handleClientLoad();
    this.timeService.eventHandler();
  }

  signIn() {
    this.gapiService.handleAuthClick();
  }

  signOut() {
    this.gapiService.handleSignoutClick();
  }

  listEvents() {
    this.gapiService.listUpcomingEvents();

  }
  eventCreating() {
    this.gapiService.createEvent();
  }
  getEvent() {
    this.gapiService.getNextEvent();
  }
  handleEvent() {
    this.timeService.eventHandler();
  }

}
