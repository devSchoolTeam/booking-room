import { Component, OnInit } from '@angular/core';
import { GapiService } from './services/gapi/gapi.service';

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

  signIn() {
    this.gapiService.handleAuthClick();
  }

  signOut() {
    this.gapiService.handleSignoutClick();
  }

  listEvents(){
    this.gapiService.listUpcomingEvents(new Date());

  }
}
