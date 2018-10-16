import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { HeaderComponent } from './components/booking-page/header/header.component';
import { BookingPageComponent } from './components/booking-page/booking-page.component';
import { AppRoutingModule } from './app-routing.module';
import { GapiService } from './services/gapi/gapi.service';
import {
  GoogleApiModule,
  NgGapiClientConfig,
  NG_GAPI_CONFIG
} from 'ng-gapi';
import { SharedModule } from './shared/shared.module';
import { AuthGuard } from './shared/resolvers/auth.guard';
import { EventComponent } from './components/booking-page/event/event.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { PopupComponent } from './shared/components/popup/popup.component';
import { LoginComponent } from './components/login/login.component';
import { EventInfoComponent } from './shared/components/event-info/event-info.component';

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



@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    HeaderComponent,
    BookingPageComponent,
    EventComponent,
    ErrorPageComponent,
    PopupComponent,
    LoginComponent,
    EventInfoComponent
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
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
