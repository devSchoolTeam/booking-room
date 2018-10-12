import { Component, OnInit } from '@angular/core';
import { PopupService } from 'src/app/services/popup/popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.sass']
})
export class PopupComponent implements OnInit {
  constructor(private popupService: PopupService) {}
  popUpState: Boolean;
  event;
  ngOnInit() {
    this.popupService.popupState.subscribe({
      next: state => {
        this.popUpState = state;
      }
    });

    this.popupService.popupContent.subscribe({
      next: event => {
        this.event = event;
      }
    });
  }

  onCloseClick() {
    this.popupService.hidePopup();
  }
}
