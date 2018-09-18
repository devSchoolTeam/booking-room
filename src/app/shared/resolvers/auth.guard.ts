import { Injectable } from "@angular/core";
import { GapiService } from "./../../services/gapi/gapi.service";
import { CanActivate } from "@angular/router";

import { Route } from "@angular/compiler/src/core";
@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private gapiService: GapiService) {}
  canActivate(route: Route): boolean | Promise<boolean>{
    let status = this.gapiService.getSigninStatus();

    if (status) {
      return true;
    } else {
      this.gapiService.showLoader()
      return this.gapiService.signIn().then(
        res => {
          this.gapiService.hideLoader()
          return true;
        },
        rej => {
          return false;
        }
      );
    }
  }
}
