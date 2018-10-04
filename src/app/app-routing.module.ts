import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { BookingPageComponent } from './components/booking-page/booking-page.component';
import { DataResolver } from './shared/resolvers/data.resolver';
import { AuthGuard } from './shared/resolvers/auth.guard';
<<<<<<< HEAD

=======
>>>>>>> 99fec92c6e802ebaa07fb7208d5df6dcd8710880
const routes: Routes = [
  {
    path: 'main-page',
    component: MainPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'booking-page',
    component: BookingPageComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/main-page', pathMatch: 'full' }
];
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  providers: [DataResolver]
})
export class AppRoutingModule {}
