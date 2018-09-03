import { NgZone, Injectable, Optional } from '@angular/core';
/// <reference path="../../node_modules/@types/gapi/index.d.ts" />
import {Config} from './config';
import * as moment from 'moment'

declare var gapi: any

@Injectable({
  providedIn: 'root'
})
export class GapiService {

  constructor(private ngZone: NgZone) {}
  handleClientLoad() {
    gapi.load('client:auth2', this.initClient.bind(this));
  }

  initClient() {
    const config: Config = {
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

  }

  handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  deleteEvents(eventId: string) {
    return gapi.client.calendar.events.delete({
      'calendarId' : 'primary',
      'eventId': eventId
    })
      .then(function(response) {
          // Handle the results here (response.result has the parsed body).
          console.log('Response', response);
        },
        function(err) { console.error('Executre error', err); });
  }

  listUpcomingEvents() {
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(function(response) {
      const events = response.result.items;
      console.log('Upcoming events:');

      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          const event = events[i];
          let when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          console.log(event.summary + ' (' + when + ')');
        }
      } else {
        console.log('No upcoming events found.');
      }
    });
  }
//   setTimer() {
//     let countDownDate = new Date('Jan 5, 2019 15:37:25').getTime();
//
// // Update the count down every 1 second
//     let x = setInterval(function() {
//
//       // Get todays date and time
//       let now = new Date().getTime();
//
//       // Find the distance between now and the count down date
//       let distance = countDownDate - now;
//
//       // Time calculations for days, hours, minutes and seconds
//       let days = Math.floor(distance / (1000 * 60 * 60 * 24));
//       let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//       let seconds = Math.floor((distance % (1000 * 60)) / 1000);
//
//       // Display the result in the element with id="demo"
//       document.getElementById('demo').innerHTML = days + 'd' + hours + 'h'
//         + minutes + 'm' + seconds + 's';
//   };
//   }
  createEvent() {
// Refer to the JavaScript quickstart on how to setup the environment:
// https://developers.google.com/calendar/quickstart/js
// Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
// stored credentials.
const name = prompt('Enter name:');
const enteredDatestart = prompt('Enter date start: ');
console.log(enteredDatestart);
const datestart = moment(enteredDatestart);
    console.log(datestart);
    const enteredDateend = prompt('Enter date end: ');
    console.log(enteredDateend);
    const dateend = moment(enteredDateend);
    console.log(dateend);
const event = {
  'summary': name,
  'location': '800 Howard St., San Francisco, CA 94103',
  'description': 'A chance to hear more about Google\'s developer products.',
  'start': {
    'dateTime': datestart,
    'timeZone': 'Europe/Zurich'
  },
  'end': {
    'dateTime': dateend,
    'timeZone': 'Europe/Zurich'
  }
};
const request = gapi.client.calendar.events.insert({
  'calendarId': 'primary',
  'resource': event
});

request.execute(function(event) {
  console.log('Event created: ' + event.htmlLink);
});

  }

}
