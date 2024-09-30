import { Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router"
import { AuthService } from '../services/authenication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent  {
  username: string = '';
  password: string = '';
  isLoading:boolean=false;

  constructor(private http: HttpClient,private authService:AuthService,private router:Router) { 
    
  }

  onSubmit() {
    this.isLoading=true;
    // send login data to backend
    this.http.post('https://tradingbackend.vercel.app/api/login',{username:this.username, password:this.password})
      .subscribe((response:any) => {
        if(response.message==='User exists') {
        // login successful
          console.log("mai stana");
          this.authService.login(this.username);
          this.isLoading=false;
          this.router.navigate(['/']);
        }
        else {
          this.isLoading=false;
          alert(response.message);
        }
      }, error => {
        this.isLoading=false;
        // login failed
        console.error(error);
      });
  }
}