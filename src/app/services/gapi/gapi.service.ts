import { Injectable } from '@angular/core';
import { GoogleApiService } from 'ng-gapi';
import 'rxjs/add/observable/fromPromise';
import { clientConfig } from 'src/app/shared/config';

@Injectable({
  providedIn: 'root'
})
export class GapiService {
  constructor(private gapiService: GoogleApiService) {}

  handleClientLoad() {
    return this.gapiService.onLoad();
  }

  clientLoad() {
    return new Promise((resolve, reject) => {
      gapi.load('client', () => {
        gapi.client.init(clientConfig).then(
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
