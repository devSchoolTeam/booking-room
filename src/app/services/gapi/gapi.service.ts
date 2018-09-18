import { Injectable } from "@angular/core";
import { Config } from "../../models/config";
import { GoogleApiService } from "ng-gapi";
import { Observable, Subject } from "rxjs";
import "rxjs/add/observable/fromPromise";
import { map } from "rxjs/operators/map";
import { tap } from "rxjs/operators/tap";

@Injectable({
  providedIn: "root"
})
export class GapiService {
  private events;

  constructor(private gapiService: GoogleApiService) {}

  config: Config = {
    CLIENT_ID:
      "1021277222775-3k2hkvmlbbh2sd8cok5ps4uin4nbsoj3.apps.googleusercontent.com",
    API_KEY: "AIzaSyCX9rlRKtTdVnl7hmOxfeIZkNreGa1xJ3g",
    DISCOVERY_DOCS: [
      `https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest`
    ],
    SCOPES: `https://www.googleapis.com/auth/calendar`
  };

  loader = new Subject<boolean>();

  showLoader() {
    this.loader.next(true);
  }

  hideLoader() {
    this.loader.next(false);
  }

  handleClientLoad() {
    return new Promise((resolve, reject) => {
      this.gapiService.onLoad().subscribe(() => {
        gapi.load("client", () => {
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
              }
            );
        });
      });
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

  listUpcomingEvents() {
    let requiredDate: Date = new Date();
    let endTime: Date = new Date(
      requiredDate.getFullYear(),
      requiredDate.getMonth(),
      requiredDate.getDate(),
      23,
      59,
      59
    );

    return Observable.fromPromise(
      gapi.client["calendar"].events.list({
        calendarId: "primary",
        timeMin: requiredDate.toISOString(),
        timeMax: endTime.toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime"
      })
    ).pipe(
      map(data => {
        return data["result"]["items"];
      }),
      tap(data => {
        this.events = data;
      })
    );
  }

  getEvents(): Observable<any> {
    if (this.events) {

      return Observable.of(this.events);
    } else {

      return this.listUpcomingEvents();
    }
  }

  createEvent() {
    let start = new Date("2018-09-03T08:00:00+03:00");
    let end = new Date("2018-09-03T09:00:00+03:00");

    let event = {
      calendarId: "primary",
      summary: "Pizda",
      description: "If it works, I am happy",
      start: {
        dateTime: "2018-09-05T14:00:00+03:00"
      },
      end: {
        dateTime: "2018-09-05T15:00:00+03:00"
      }
    };

    gapi.client["calendar"].events
      .insert({
        calendarId: "primary",
        resource: event
      })
      .execute(function(event) {
        console.log(event);
      });
  }
}
