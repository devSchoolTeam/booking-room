import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SelectTimeComponent } from './components/booking-page/select-time/select-time.component';
import { HeaderComponent } from './components/booking-page/header/header.component';
import { BodyComponent } from './components/main-page/body/body.component';
import { BookingPageComponent } from './components/booking-page/booking-page.component';
import { TimerComponent } from './components/main-page/timer/timer.component';
import { AppRoutingModule } from './app-routing.module';
import { GapiService } from './services/gapi/gapi.service';
import {
  GoogleApiModule,
  GoogleApiService,
  GoogleAuthService,
  NgGapiClientConfig,
  NG_GAPI_CONFIG,
  GoogleApiConfig
} from 'ng-gapi';
import { SharedModule } from './shared/shared.module';
import { AuthGuard } from './shared/resolvers/auth.guard';
import { EventComponent } from './components/booking-page/event/event.component';

const gapiClientConfig: NgGapiClientConfig = {
  client_id:
    '1021277222775-3k2hkvmlbbh2sd8cok5ps4uin4nbsoj3.apps.googleusercontent.com',
  discoveryDocs: [
    `https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest`
  ],
  scope: [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar'
  ].join(' ')
};

export function loadConfig(gapi: GapiService) {
  return () => {
    return gapi.handleClientLoad();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    SelectTimeComponent,
    HeaderComponent,
    BodyComponent,
    BookingPageComponent,
    TimerComponent,
    EventComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    })
  ],
  providers: [
    GapiService,
    GapiService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [GapiService],
      multi: true
    },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
