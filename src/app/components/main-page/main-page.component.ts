import { GapiService } from "./../../services/gapi/gapi.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TimeService } from "../../services/time/time.service";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.sass"]
})
export class MainPageComponent implements OnInit {
  constructor(
    private active: ActivatedRoute,
    private gapiService: GapiService,
    private timeService: TimeService
  ) {
    this.active.data.subscribe({
      next: x => {
        this.gapiService.loader.next(false);
 
        setInterval(()=>{
          this.timeService.updateData()
        },1000)
      }
    });
  }

  ngOnInit() {
    this.timeService.timeToStart.subscribe({
      next:x=>{
        console.log(x)
      }
    })
  }
}
