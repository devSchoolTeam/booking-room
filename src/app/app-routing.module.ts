import { ErrorPageComponent } from './components/error-page/error-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { BookingPageComponent } from './components/booking-page/booking-page.component';
import { DataResolver } from './shared/resolvers/data.resolver';
import { AuthGuard } from './shared/resolvers/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ClientLoadingGuard } from './shared/resolvers/client-loading.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ClientLoadingGuard],
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
    canActivate: [ClientLoadingGuard],
    component: LoginComponent
  },
  {
    path: 'error',
    component: ErrorPageComponent
  },
  {
    path: '**',
    component: ErrorPageComponent
  }

];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  providers: [DataResolver]
})
export class AppRoutingModule {}
