import { ErrorPageComponent } from './components/error-page/error-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { BookingPageComponent } from './components/booking-page/booking-page.component';
import { DataResolver } from './shared/resolvers/data.resolver';
import { AuthGuard } from './shared/resolvers/auth.guard';
import { LoginComponentComponent } from './components/login-component/login-component.component';
import { GapiGuard } from './shared/resolvers/gapi.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [GapiGuard],
    resolve: {
      data: DataResolver
    },
    children: [
      {
        path: 'book',
        component: BookingPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '',
        component: MainPageComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'login',
    canActivate: [GapiGuard],
    component: LoginComponentComponent
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  providers: [DataResolver]
})
export class AppRoutingModule {}
