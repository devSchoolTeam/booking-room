import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.sass']
})
export class BodyComponent implements OnInit {
public status = '#43b799';
  constructor() { }

  ngOnInit() {
  }
  // colors:string[]=['#43b799','#f3bf49','#c0392b'];
  getTime(time) {
    console.log(time < 0);

    if ( time > 900000) {
      this.status = '#43b799';
    } else if (time < 900000  && time > 0) {
      this.status = '#f3bf49';
    } else if (time < 0 ) {
      this.status = '#c0392b';
    }
 }
}
