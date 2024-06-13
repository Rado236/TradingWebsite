import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/authenication.service';
import { Wallets } from './profile-page/profile-page.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'crypto';
  wallets:Wallets[]=[];
  //currentUser: string | null = null;
  constructor(private authService:AuthService){}

}
