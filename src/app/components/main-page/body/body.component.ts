import { Component, OnInit } from "@angular/core";
import { meetingStatuses } from "../../../shared/constants";
import { TimeService } from "../../../services/time/time.service";

@Component({
  selector: "app-body",
  templateUrl: "./body.component.html",
  styleUrls: ["./body.component.sass"]
})
export class BodyComponent implements OnInit {
  public currentStatus = meetingStatuses.available;

  constructor(private timeService: TimeService) {}

  ngOnInit() {
    this.timeService.currentStatus.subscribe(currentStatus => {
      this.currentStatus = currentStatus;
      console.log(this.currentStatus)
    });
  }
  changeStyle() {
    console.log(this.currentStatus)
  }
}
