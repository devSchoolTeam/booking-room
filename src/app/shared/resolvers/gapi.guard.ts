import { Injectable } from '@angular/core';
import { GapiService } from '../../services/gapi/gapi.service';
import { CanActivate } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GapiGuard implements CanActivate {
  constructor(private gapiService: GapiService) {
  }

  canActivate(route: Route): Observable<boolean> {
    const obs = new Subject<boolean>();
    this.gapiService.handleClientLoad().subscribe(() => {
      this.gapiService.clientLoad().then(
        res => {
          obs.next(true);
        },
        rej => {
          obs.next(false);
        }
      );
    });
    return obs.asObservable();
  }
}
