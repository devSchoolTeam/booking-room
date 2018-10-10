import { Component, OnInit } from '@angular/core';
import { GapiService } from 'src/app/services/gapi/gapi.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.sass']
})
export class ErrorPageComponent implements OnInit {
  constructor(private gapiService: GapiService) {}

  ngOnInit() {}

  onSignIn() {
    this.gapiService.signIn();
  }
}
