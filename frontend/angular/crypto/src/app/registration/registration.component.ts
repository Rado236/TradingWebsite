import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
    registrationForm:FormGroup;
    username:string ='';
    password:string = '';
    email:string = '';

  constructor(private http: HttpClient,private router:Router,private formBuilder:FormBuilder,private toastrService:ToastrService) {  
    this.registrationForm = this.formBuilder.group({
      username: ['',Validators.required],
      email: ['',Validators.required],
      password: ['',Validators.required],
    });
  }

  onSubmit() {
    if(!this.registrationForm.valid) {
      this.toastrService.error('Please fill all the fields!', 'Error', {
        timeOut: 3000, 
        closeButton: true, 
        progressBar: true, 
      });
      return;
    }
    else{// send login data to backend
      this.http.post('https://tradingbackend.vercel.app/api/user/register',{username:this.username, password:this.password,email:this.email},)
        .subscribe(() => {
          const messageSuccess = `successfully registered user! You will be redirected to the login page!`;
          localStorage.setItem('toastrMessage', messageSuccess);
          this.router.navigate(['/login']);
        }, error => {
          this.toastrService.error(error, 'Error', {
            timeOut: 3000, 
            closeButton: true, 
            progressBar: true, 
          });
        });}
  }
}
