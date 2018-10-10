import { Injectable } from '@angular/core';
import { GapiService } from '../../services/gapi/gapi.service';
import { CanActivate } from '@angular/router';

import { Route } from '@angular/compiler/src/core';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private gapiService: GapiService) {}
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
          return false;
        }
      );
    }
  }
}
