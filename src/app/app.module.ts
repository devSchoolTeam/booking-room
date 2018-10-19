import { clientConfig } from 'src/app/shared/config';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { HeaderComponent } from './components/booking-page/header/header.component';
import { BookingPageComponent } from './components/booking-page/booking-page.component';
import { AppRoutingModule } from './app-routing.module';
import { GapiService } from './services/gapi/gapi.service';
import { GoogleApiModule, NgGapiClientConfig, NG_GAPI_CONFIG } from 'ng-gapi';
import { SharedModule } from './shared/shared.module';
import { AuthGuard } from './shared/resolvers/auth.guard';
import { EventComponent } from './components/booking-page/event/event.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { LoginComponent } from './components/login/login.component';
import { AngularPageVisibilityModule } from 'angular-page-visibility';

const gapiClientConfig: NgGapiClientConfig = clientConfig;

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    HeaderComponent,
    BookingPageComponent,
    EventComponent,
    ErrorPageComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
    AngularPageVisibilityModule
  ],
  providers: [GapiService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
