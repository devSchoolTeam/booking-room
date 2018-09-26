import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Route } from "@angular/compiler/src/core";
import { TimeService } from "../../services/time/time.service";
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: "root"
})
export class DataGuard implements CanActivate {
  constructor(private timeService: TimeService) {}
  canActivate(route: Route): Observable<boolean> {
    return this.timeService.loadEvents().pipe(
      map(events => {
        return true;
      }),
      catchError( (err) => {
        return of(false);
      })
    );
  }
}
