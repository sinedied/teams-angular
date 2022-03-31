import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalRedirectComponent } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TeamsGuard } from './teams.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [TeamsGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'auth', component: MsalRedirectComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
