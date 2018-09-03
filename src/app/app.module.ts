import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SelectTimeComponent } from './booking-page/select-time/select-time.component';
import { HeaderComponent } from './booking-page/header/header.component';
import { BodyComponent } from './main-page/body/body.component';
import { BookingPageComponent } from './booking-page/booking-page.component';
import { TimerComponent } from './main-page/timer/timer.component';
import { AppRoutingModule } from './app-routing module/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    SelectTimeComponent,
    HeaderComponent,
    BodyComponent,
    BookingPageComponent,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
