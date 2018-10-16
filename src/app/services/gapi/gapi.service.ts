import { Injectable } from '@angular/core';
import { GoogleApiService } from 'ng-gapi';
import 'rxjs/add/observable/fromPromise';

@Injectable({
  providedIn: 'root'
})
export class GapiService {
  constructor(private gapiService: GoogleApiService) {
  }

  config = {
    clientId:
      '1021277222775-3k2hkvmlbbh2sd8cok5ps4uin4nbsoj3.apps.googleusercontent.com',
    apiKey: 'AIzaSyCX9rlRKtTdVnl7hmOxfeIZkNreGa1xJ3g',
    discoveryDocs: [
      `https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest`
    ],
    scope: `https://www.googleapis.com/auth/calendar`
  };

  handleClientLoad() {
    return this.gapiService.onLoad();
  }

  clientLoad() {
    return new Promise((resolve, reject) => {
      gapi.load('client', () => {
        gapi.client.init(this.config).then(
          res => {
            resolve();
          },
          rej => {
            reject();
          }
        );
      });
    });
  }

  getSigninStatus() {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  signIn() {
    return gapi.auth2.getAuthInstance().signIn();
  }

  listUpcomingEvents(requiredDate: Date, endTime: Date) {
    return gapi.client['calendar'].events.list({
      calendarId: 'primary',
      timeMin: requiredDate.toISOString(),
      timeMax: endTime.toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime'
    });
  }

  createEvent(startTime: Date, endTime: Date) {
    const start = startTime.toISOString();
    const end = endTime.toISOString();

    const event = {
      calendarId: 'primary',
      summary: 'Event',
      start: {
        dateTime: start
      },
      end: {
        dateTime: end
      }
    };

    return gapi.client['calendar'].events.insert({
      calendarId: 'primary',
      resource: event
    });
  }
}
