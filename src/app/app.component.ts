import { Component, OnInit } from '@angular/core';
import { GapiService } from './services/gapi/gapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  constructor(private gapiService: GapiService) {}
  gapiIsLoaded: Boolean = false;
  ngOnInit() {}
}
