import { GapiService } from "./../../services/gapi/gapi.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";

@Injectable()
export class DataResolver implements Resolve<any> {
  constructor(private gapiService: GapiService) {}

  resolve(router: ActivatedRouteSnapshot, rstate: RouterStateSnapshot) {
    console.log(true);
    this.gapiService.loader.next(true);
    return this.gapiService.listUpcomingEvents();
  }
}
