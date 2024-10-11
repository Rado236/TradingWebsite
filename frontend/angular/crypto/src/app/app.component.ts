import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/authenication.service';
import { Wallets } from './profile-page/profile-page.component';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  wallets:Wallets[]=[];
  constructor(private authService:AuthService,private translateService:TranslateService){
    this.translateService.defaultLang='en';
    this.translateService.use(localStorage.getItem('lang') || 'en');
  }

}
