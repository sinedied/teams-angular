import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MsalInterceptor, MsalModule } from "@azure/msal-angular";
import { BrowserCacheLocation, InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: environment.aadAppId,
        authority: `https://login.microsoftonline.com/${environment.tenantId}`,
        redirectUri: 'https://myuniquedomain.loca.lt/auth',
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: false
      }
    }), {
      interactionType: InteractionType.Redirect,
    }, {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map([
        ['https://myuniquedomain-api.loca.lt', ['access_as_user']]
      ])
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
