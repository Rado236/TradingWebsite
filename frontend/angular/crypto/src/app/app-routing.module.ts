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
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { AdminGuardGuard } from './services/admin-guard.guard';

const routes: Routes = [
  {path: "",component: HomepageComponent,title: "Homepage"},
  {path: "login",component: LoginComponent,title: "Login"},
  {path: "registration", component: RegistrationComponent,title: "Registration"},
  {path: "profile", component: ProfilePageComponent,canActivate:[AuthGuardGuard],title: "Profile"},
  {path: "trading", component: TradingComponent,canActivate:[AuthGuardGuard],title: "Trading"},
  {path: "deposit", component: DepositComponent,canActivate:[AuthGuardGuard],title: "Deposit"},
  {path: "sendcrypto", component: SendcryptoComponent,canActivate:[AuthGuardGuard],title: "Send crypto"},
  {path: "adminpanel", component: AdminpanelComponent,canActivate:[AdminGuardGuard],title: "Admin panel"},
  {path: "**", component: NotfoundComponent,title: "Not found"},
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration:'enabled'})],
  exports: [RouterModule],
  providers:[AuthGuardGuard] 
})
export class AppRoutingModule { }
