import {  Injectable } from '@angular/core';
import { Config } from '../../models/config';
import { GoogleApiService } from 'ng-gapi';


@Injectable({
  providedIn: 'root'
})
export class GapiService {

  constructor(private gapiService: GoogleApiService) {

  }

  config: Config = {
    CLIENT_ID: '1021277222775-3k2hkvmlbbh2sd8cok5ps4uin4nbsoj3.apps.googleusercontent.com',
    API_KEY: 'AIzaSyCX9rlRKtTdVnl7hmOxfeIZkNreGa1xJ3g',
    DISCOVERY_DOCS: [`https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest`],
    SCOPES: `https://www.googleapis.com/auth/calendar`,
  }
  private gapi;

  handleClientLoad() {
    this.gapiService.onLoad().subscribe(() => {
      gapi.load('client', () => {
        gapi.client.init({
          apiKey: this.config.API_KEY,
          clientId: this.config.CLIENT_ID,
          discoveryDocs: this.config.DISCOVERY_DOCS,
          scope: this.config.SCOPES
        }).then(() => {
          this.gapi = gapi;

        }
        );
      });
    });
  }


  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {


    } else {
      alert('Sign in first');
    }
  }

  handleAuthClick() {

    gapi.auth2.getAuthInstance().signIn();

  }

  handleSignoutClick() {

    gapi.auth2.getAuthInstance().signOut();

  }



  listUpcomingEvents(requiredDate: Date) {
    let endTime: Date = new Date(requiredDate.getFullYear(), requiredDate.getMonth(), requiredDate.getDate(), 23, 59, 59)
    console.log(requiredDate);
    console.log(endTime);
    this.gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': requiredDate.toISOString(),
      'timeMax': endTime.toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(function (response) {
      let events = response.result.items;
      console.log('Upcoming events:');

      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          let event = events[i];
          let when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          console.log(event.summary + ' (' + when + ')');
          console.log(JSON.stringify(event));



        };
      } else {
        console.log('No upcoming events found.');
      }


    });
  }



  createEvent() {

    let start = new Date('2018-09-03T08:00:00+03:00');
    let end = new Date('2018-09-03T09:00:00+03:00');

    let event = {
      'calendarId': 'primary',
      'summary': 'test',
      'description': 'If it works, I am happy',
      'start': {
        'dateTime': start.toISOString(),
        'timeZone': 'America/Los_Angeles'
      },
      'end': {
        'dateTime': end.toISOString(),
        'timeZone': 'America/Los_Angeles'
      }
    };

    this.gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    }).execute(function (event) {
      console.log('Event created: ' + event.htmlLink);
    });

  }

  deleteEvent(eventId: string) {
    this.gapi.client.calendar.events.delete({
      'calendarId': 'primary',
      'eventId': eventId
    }).then(function (response) {
      console.log('Response', response);
    },
      function (err) { console.error('Execute error', err); });
  }

}
