import { Component, OnInit } from '@angular/core';
import {GapiService} from './gapi.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'Booking room';

  constructor(private GapiService: GapiService) {

  }
  ngOnInit() {
  	this.GapiService.handleClientLoad()
  }

  signIn($event) {
  	this.GapiService.handleAuthClick($event)
  }

  signOut($event) {
  	this.GapiService.handleSignoutClick($event)
  }
}
