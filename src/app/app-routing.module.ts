import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { BookingPageComponent } from './components/booking-page/booking-page.component';
import { DataResolver } from './shared/resolvers/data.resolver';
import { AuthGuard } from './shared/resolvers/auth.guard';
import { StatusResolver } from './shared/resolvers/status.resolver';
const routes: Routes = [
  {
    path: 'main-page',
    component: MainPageComponent,
    canActivate: [AuthGuard],
    resolve:{
      data:DataResolver
    }

  },
  {
    path: 'booking-page',
    component: BookingPageComponent,
    canActivate: [AuthGuard],
    resolve:{
      data:DataResolver
    }

  },
  { path: '', redirectTo: '/main-page', pathMatch: 'full' }
];
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  providers: [DataResolver, StatusResolver]
})
export class AppRoutingModule {}
