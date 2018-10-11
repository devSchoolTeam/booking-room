import { GapiService } from 'src/app/services/gapi/gapi.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.sass']
})
export class LoginComponentComponent implements OnInit {
  constructor(private gapiService: GapiService, private router: Router) {}

  ngOnInit() {}

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
