import { Injectable } from '@angular/core';
import { GapiService } from '../../services/gapi/gapi.service';
import { CanActivate, Router } from '@angular/router';

import { Route } from '@angular/compiler/src/core';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private gapiService: GapiService, private router: Router) {}
  canActivate(route: Route): boolean | Promise<boolean> {
    const status = this.gapiService.getSigninStatus();

    if (status) {
      return true;
    } else {
      return this.gapiService.signIn().then(
        res => {
          return true;
        },
        rej => {
          console.log(rej);
          this.router.navigate(['/login']);
          return false;
        }
      );
    }
  }
}
