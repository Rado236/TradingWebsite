import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


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

  constructor(private http: HttpClient,private router:Router,private formBuilder:FormBuilder) {  
    this.registrationForm = this.formBuilder.group({
      username: ['',Validators.required],
      email: ['',Validators.required],
      password: ['',Validators.required],
    });
  }

  onSubmit() {
    if(!this.registrationForm.valid) {
      alert('Please fill all the fields!');
      return;
    }
    else{// send login data to backend
      this.http.post('http://localhost:8080/api/user/register',{username:this.username, password:this.password,email:this.email},)
        .subscribe(() => {
          alert("successfully registered user! You will be redirected to the homepage!");
          this.router.navigate(['/']);
        }, error => {
          // login failed
          console.error(error);
        });}
  }
}
