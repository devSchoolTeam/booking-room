import { NgZone, Injectable, Optional } from '@angular/core';
/// <reference path="../../node_modules/@types/gapi/index.d.ts" />
import {Config} from './config';




declare var gapi: any

@Injectable({
  providedIn: 'root'
})
export class GapiService {

  constructor(private NgZone: NgZone) {
  	
  }
  




  handleClientLoad() {
    gapi.load('client:auth2', this.initClient.bind(this));

    
  }

  initClient() {
  	let config: Config = {
		CLIENT_ID: '1021277222775-3k2hkvmlbbh2sd8cok5ps4uin4nbsoj3.apps.googleusercontent.com',
    	API_KEY: 'AIzaSyCX9rlRKtTdVnl7hmOxfeIZkNreGa1xJ3g',
    	DISCOVERY_DOCS: [`https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest`],
    	SCOPES: `https://www.googleapis.com/auth/calendar`,
     	authorizeButton: document.getElementById('authorize_button'),
     	signoutButton: document.getElementById('signout_button'),
	}
    gapi.client.init({
      apiKey: config.API_KEY,
      clientId: config.CLIENT_ID,
      discoveryDocs: config.DISCOVERY_DOCS,
      scope: config.SCOPES
    }).then(() => {
      
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

      // Handle the initial sign-in state.
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

    });
  }

  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      // this.listUpcomingEvents(new Date());
      this.createEvent();
    } else {
     alert('Sign in first')
    }
  }

  handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

 

  listUpcomingEvents(requiredDate:Date) {

    let gapigapi = Object.assign({}, gapi);
    let endTime:Date=  new Date(requiredDate.getFullYear(),requiredDate.getMonth(), requiredDate.getDate()+2,23,59,59)
    console.log(requiredDate);
    console.log(endTime)

    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': requiredDate.toISOString(),
      'timeMax':endTime.toISOString(),
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
        };
      } else {
        console.log('No upcoming events found.');
      }

      
    });
  }



  createEvent(){
    console.log('init')

// Refer to the JavaScript quickstart on how to setup the environment:
// https://developers.google.com/calendar/quickstart/js
// Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
// stored credentials.

var event = {
  'summary': 'Google I/O 2015',
  'location': '800 Howard St., San Francisco, CA 94103',
  'description': 'A chance to hear more about Google\'s developer products.',
  'start': {
    'dateTime': '2018-08-30T022:00:00-07:00',
    'timeZone': 'America/Los_Angeles'
  },
  'end': {
    'dateTime': '2018-08-30T023:00:00-07:00',
    'timeZone': 'America/Los_Angeles'
  },
  'recurrence': [
    'RRULE:FREQ=DAILY;COUNT=2'
  ],
  'attendees': [
    {'email': 'danilkadidenko@gmail.com'},

  ],
  'reminders': {
    'useDefault': false,
    'overrides': [
      {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10}
    ]
  }
};
console.log(gapi)
var request = gapi.client.calendar.events.insert({
  'calendarId': 'primary',
  'resource': event
});

request.execute(function(event) {
  console.log('Event created: ' + event.htmlLink);
});

  }

}
