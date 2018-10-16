import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  public popupState = new BehaviorSubject<boolean>(false);
  public popupContent = new Subject<any>();

  constructor() {
  }

  hidePopup() {
    this.popupState.next(false);
    this.popupContent.next({});
  }

  showPopup(popupContent?) {
    this.popupState.next(true);
    if (popupContent) {
      this.popupContent.next(popupContent);
    }
  }
}
