import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/authenication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'crypto';
  //currentUser: string | null = null;
  constructor(private authService:AuthService){}

}
