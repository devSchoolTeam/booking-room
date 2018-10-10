import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { GapiService } from './../../services/gapi/gapi.service';
import { CanActivate, Router } from '@angular/router';
=======
import { GapiService } from '../../services/gapi/gapi.service';
import { CanActivate } from '@angular/router';
>>>>>>> fb4c552682d938bc860e71b98890361fd7da4c26

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
