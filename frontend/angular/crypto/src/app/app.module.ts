import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegistrationComponent } from './registration/registration.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotfoundComponent } from './notfound/notfound.component';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TradingComponent } from './trading/trading.component';
import { FooterComponent } from './footer/footer.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { NgChartsModule } from 'ng2-charts';
import 'chart.js';
import { DepositComponent } from './deposit/deposit.component';



@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    NavbarComponent,
    RegistrationComponent,
    NotfoundComponent,
    TradingComponent,
    FooterComponent,
    ProfilePageComponent,
    DepositComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    NgChartsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
