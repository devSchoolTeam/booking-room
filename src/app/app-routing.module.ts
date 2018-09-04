import { NgModule } from '@angular/core';
import { RouterModule, Routes } from  '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { BookingPageComponent } from './components/booking-page/booking-page.component';

const routes: Routes = [
  { path: 'main-page', component: MainPageComponent },
  { path: 'booking-page', component: BookingPageComponent},
  { path: '', redirectTo: '/main-page', pathMatch: 'full' },
];
@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
