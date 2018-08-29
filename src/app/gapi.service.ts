import { NgZone, Injectable, Optional } from '@angular/core';
/// <reference path="../../node_modules/@types/gapi/index.d.ts" />
import {Config} from './config';


declare var gapi: any

@Injectable({
  providedIn: 'root'
})
export class GapiService {

	//maw63brfLvSBZfJnB8QxS0mr
  constructor(private NgZone: NgZone) {
  	
  }
  getGapi() {
  	this.NgZone.run(() => {
  		console.log(gapi)
  	})
  }

  handleClientLoad() {
  	console.log(1)
    gapi.load('client:auth2', this.initClient.bind(this));
    console.log(gapi)
    console.log()
    
  }

  initClient() {
  	let config: Config = {
		CLIENT_ID: '722714492512-hduvlhnbm57gei6gham6klhhqui5eqs0.apps.googleusercontent.com',
    	API_KEY: 'AIzaSyA8b_AU-HPWy02wCRsgRb4mIL2bzFVM-wE',
    	DISCOVERY_DOCS: [`https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest`],
    	SCOPES: `https://www.googleapis.com/auth/calendar.readonly`,
     	authorizeButton: document.getElementById('authorize_button'),
     	signoutButton: document.getElementById('signout_button'),
	}
    gapi.client.init({
      apiKey: config.API_KEY,
      clientId: config.CLIENT_ID,
      discoveryDocs: config.DISCOVERY_DOCS,
      scope: config.SCOPES
    }).then(() => {
    	this.listUpcomingEvents()
      // Listen for sign-in state changes.
      // gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

      // Handle the initial sign-in state.
      // this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

    });
  }

  // updateSigninStatus(isSignedIn) {
  //   if (isSignedIn) {
  //     authorizeButton.style.display = 'none';
  //     signoutButton.style.display = 'block';
  //     this.listUpcomingEvents();
  //   } else {
  //     authorizeButton.style.display = 'block';
  //     signoutButton.style.display = 'none';
  //   }
  // }

  handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }

  listUpcomingEvents() {
  	console.log(gapi, 'gapi')
  	let gapigapi = Object.assign({}, gapi);
  	console.log(gapigapi, 'gapigapi')
  	console.log(gapigapi.client, 'gapigapi client')

    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(function(response) {
      var events = response.result.items;
      console.log('Upcoming events:');
      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          var event = events[i];
          var when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          console.log(event.summary + ' (' + when + ')')
        }
      } else {
        console.log('No upcoming events found.');
      }
    });
  }

}
