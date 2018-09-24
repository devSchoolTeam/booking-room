import { Injectable } from "@angular/core";
import { GapiService } from "./../../services/gapi/gapi.service";
import { CanActivate } from "@angular/router";

import { Route } from "@angular/compiler/src/core";
import { TimeService } from "../../services/time/time.service";
@Injectable({
  providedIn: "root"
})
export class DataGuard implements CanActivate {
  constructor(private timeService: TimeService) {}
  canActivate(route: Route): Promise<boolean> {
    return this.timeService.loadEvents().then(
      result => {
        this.timeService.updateData()
        return true;
      },
      error => {
        return false;
      }
    );
  }
}
