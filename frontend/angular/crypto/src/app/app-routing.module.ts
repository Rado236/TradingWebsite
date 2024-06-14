import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { TradingComponent } from './trading/trading.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { DepositComponent } from './deposit/deposit.component';
import { AuthGuardGuard } from './services/auth-guard.guard';
import { SendcryptoComponent } from './sendcrypto/sendcrypto.component';

const routes: Routes = [
  {path: "",component: HomepageComponent},
  {path: "login",component: LoginComponent},
  {path: "registration", component: RegistrationComponent},
  {path: "profile", component: ProfilePageComponent,canActivate:[AuthGuardGuard]},
  {path: "trading", component: TradingComponent,canActivate:[AuthGuardGuard]},
  {path: "deposit", component: DepositComponent,canActivate:[AuthGuardGuard]},
  {path: "sendcrypto", component: SendcryptoComponent,canActivate:[AuthGuardGuard]},
  {path: "**", component: NotfoundComponent},
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration:'enabled'})],
  exports: [RouterModule],
  providers:[AuthGuardGuard] 
})
export class AppRoutingModule { }
