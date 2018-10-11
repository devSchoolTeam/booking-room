import { GapiService } from 'src/app/services/gapi/gapi.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  constructor(private gapiService: GapiService, private router: Router) {
  }

  ngOnInit() {
  }

  onSignIn() {
    this.gapiService.signIn().then(
      res => {
        this.router.navigate(['/']);
      },
      rej => {
        console.log(rej);
      }
    );
  }
}
