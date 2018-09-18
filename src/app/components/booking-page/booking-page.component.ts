import { GapiService } from "./../../services/gapi/gapi.service";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-booking-page",
  templateUrl: "./booking-page.component.html",
  styleUrls: ["./booking-page.component.sass"]
})
export class BookingPageComponent implements OnInit {
  constructor(
    private active: ActivatedRoute,
    private gapiService: GapiService
  ) {
    this.active.data.subscribe({
      next: x => {
        this.gapiService.loader.next(false);
        console.log(x);
      }
    });
  }

  ngOnInit() {}
}
