import { Injectable } from '@angular/core';
import { Config } from '../../models/config';
import { GoogleApiService } from 'ng-gapi';
import 'rxjs/add/observable/fromPromise';

@Injectable({
  providedIn: 'root'
})
export class GapiService {
  constructor(private gapiService: GoogleApiService) {}

  config: Config = {
    CLIENT_ID:
      '1021277222775-3k2hkvmlbbh2sd8cok5ps4uin4nbsoj3.apps.googleusercontent.com',
    API_KEY: 'AIzaSyCX9rlRKtTdVnl7hmOxfeIZkNreGa1xJ3g',
    DISCOVERY_DOCS: [
      `https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest`
    ],
    SCOPES: `https://www.googleapis.com/auth/calendar`
  };

  handleClientLoad() {
    return new Promise((resolve, reject) => {
      this.gapiService.onLoad().subscribe(() => {
        gapi.load('client', () => {
          gapi.client
            .init({
              apiKey: this.config.API_KEY,
              clientId: this.config.CLIENT_ID,
              discoveryDocs: this.config.DISCOVERY_DOCS,
              scope: this.config.SCOPES
            })
            .then(
              response => {
                resolve();
              },
              error => {
                reject();
                console.log(error);
              }
            );
        });
      });
    });
  }

  checkOutGapi() {
    return new Promise((resolve, reject) => {
      if (gapi.auth2) {
        resolve();
      } else {
        return this.handleClientLoad().then(
          res => {
            resolve();
          },
          rej => {
            reject();
          }
        );
      }
    });
  }

  getSigninStatus() {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  signIn() {
    return gapi.auth2.getAuthInstance().signIn();
  }

  signOut() {
    return gapi.auth2.getAuthInstance().signOut();
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
