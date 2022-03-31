import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MsalBroadcastService, MsalGuard, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { AccessTokenEntity, AccountEntity } from '@azure/msal-common';
import * as microsoftTeams from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";
import { Observable, of } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TeamsService } from './teams.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsGuard implements CanActivate {
  constructor(private msalService: MsalService,
    private authService: AuthService,
    private router: Router,
    private msalBroadcastService: MsalBroadcastService,
    private msalGuard: MsalGuard,
    private teamsService: TeamsService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.msalService.instance.getAllAccounts().length > 0) {
      return true;
    }

    return this.teamsService
      .inTeams()
      .then((inTeams): Promise<boolean | UrlTree> => {
        if (inTeams) {
          return new Promise<boolean | UrlTree>((resolve) => {
            microsoftTeams.authentication.getAuthToken({
              successCallback: (token: string) => {
                const decodedToken: { [key: string]: any; } = jwtDecode(token) as { [key: string]: any; };
                this.registerTeamsTokenWithMsal(decodedToken, token);

                microsoftTeams.appInitialization.notifySuccess();
                resolve(true);
              },
              failureCallback: (message: string) => {
                microsoftTeams.appInitialization.notifyFailure({
                  reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
                  message
                });

                this.authService.redirectUrl = state.url;
                resolve(this.router.parseUrl('/login'));
              },
              resources: ['https://myuniquedomain.loca.lt']
            });
          });
        }

        this.msalGuard.canActivate(route, state);

        return this.msalBroadcastService.inProgress$
          .pipe(
            filter((status: InteractionStatus) => status === InteractionStatus.None),
            switchMap(() => {
              if (this.msalService.instance.getAllAccounts().length > 0) {
                return of(true);
              }

              this.authService.redirectUrl = state.url;
              return of(this.router.parseUrl('/login'));
            }),
            first()
          ).toPromise();
      });
  }

  private registerTeamsTokenWithMsal(accessToken: { [key: string]: any; }, accessTokenString: string): void {
    const accountEntity = this.getAccountEntity(accessToken);
    const accessTokenEntity = this.getAccessTokenEntity(accessToken, accessTokenString);

    const browserStorage = (this.msalService.instance as any).browserStorage;
    browserStorage.setAccount(accountEntity);
    browserStorage.setAccessTokenCredential(accessTokenEntity);

    this.msalService.instance.setActiveAccount(this.msalService.instance.getAllAccounts()[0]);
  }

  private getAccountEntity(accessToken: { [key: string]: any; }): AccountEntity {
    const account = new AccountEntity();
    Object.assign(account, {
      authorityType: 'MSSTS',
      // fixed
      environment: 'login.windows.net',
      // oid.tid
      homeAccountId: `${accessToken['oid']}.${accessToken['tid']}`,
      // oid
      localAccountId: accessToken['oid'],
      idTokenClaims: accessToken,
      // tid
      realm: accessToken['tid'],
      // upn
      username: accessToken['upn']
    });

    return account;
  }

  private getAccessTokenEntity(accessToken: { [key: string]: any; }, accessTokenString: string): AccessTokenEntity {
    const accessTokenEntity = new AccessTokenEntity();
    Object.assign(accessTokenEntity, {
      cachedAt: accessToken['iat'],
      clientId: (accessToken['aud'] as string).substring((accessToken['aud'] as string).lastIndexOf('/') + 1),
      credentialType: 'AccessToken',
      environment: 'login.windows.net',
      expiresOn: accessToken['exp'],
      extendedExpiresOn: accessToken['exp'],
      homeAccountId: `${accessToken['oid']}.${accessToken['tid']}`,
      realm: accessToken['tid'],
      secret: accessTokenString,
      target: accessToken['scp'],
      tokenType: 'Bearer'
    });

    return accessTokenEntity;
  }
}
