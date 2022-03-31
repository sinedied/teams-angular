import { Component, Inject, OnInit } from '@angular/core';
import { MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: AuthService,
    private msalService: MsalService
  ) { }

  ngOnInit(): void {
  }

  login() {
    const authRequest = { ...this.msalGuardConfig.authRequest };
    this.msalService.loginRedirect({
      redirectStartPage: this.authService.redirectUrl,
      ...authRequest
    } as RedirectRequest);
  }
}
