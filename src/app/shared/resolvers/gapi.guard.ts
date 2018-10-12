import { Injectable } from '@angular/core';
import { GapiService } from '../../services/gapi/gapi.service';
import { CanActivate, Router } from '@angular/router';

import { Route } from '@angular/compiler/src/core';

@Injectable({
  providedIn: 'root'
})
export class GapiGuard implements CanActivate {
  constructor(private gapiService: GapiService, private router: Router) {}
  canActivate(route: Route): Promise<boolean> {
    return this.gapiService.checkOutGapi().then(
      res => {
        return true;
      },
      rej => {
        this.router.navigate(['/error']);
        return false;
      }
    );
  }
}
