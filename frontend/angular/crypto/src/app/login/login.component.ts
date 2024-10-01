import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router"
import { AuthService } from '../services/authenication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  isLoading:boolean=false;

  constructor(private http: HttpClient,private authService:AuthService,private router:Router,private toastrService:ToastrService) { 
    
  }

  ngOnInit(): void {
    const messageSuccess = localStorage.getItem('toastrMessage');
    if (messageSuccess) {
      this.toastrService.success(messageSuccess, 'Success', {
        timeOut: 3000, 
        closeButton: true, 
        progressBar: true, 
      });
      localStorage.removeItem('toastrMessage');
  }
}

  onSubmit() {
    this.isLoading=true;
    // send login data to backend
    this.http.post('https://tradingbackend.vercel.app/api/login',{username:this.username, password:this.password})
      .subscribe((response:any) => {
        if(response.message==='User exists') {
        // login successful
          this.authService.login(this.username);
          this.isLoading=false;
          this.router.navigate(['/']);
        }
        else {
          this.isLoading=false;
          this.toastrService.error(response.message, 'Error', {
            timeOut: 3000, 
            closeButton: true, 
            progressBar: true, 
          });
        }
      }, error => {
        this.isLoading=false;
        console.error(error);
      });
  }
}