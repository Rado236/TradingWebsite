import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/authenication.service';
import {Deposit} from "../interfaces/Deposit";
import { delay, timeout } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit{
  dep:Deposit = {} as Deposit
  min_deposit:number=5;
  isLoading:boolean=false;
  deposit_listener:number | undefined=undefined;
  constructor(private http:HttpClient,private authService: AuthService,private toastrService:ToastrService ){
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.dep.public_address = user.public_address;
      }
    });

  }
  ngOnInit(): void {
    if(this.dep.deposit_amount){
      this.deposit_listener=this.dep.deposit_amount
    }
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
  deposit(){
    this.isLoading=true;
    if(Number(this.dep.deposit_amount) > this.min_deposit){
      this.http.post('https://tradingbackend.vercel.app/transfer/deposit', this.dep,{headers: { 'Content-Type': 'application/json' },responseType:"text"}).subscribe(
        (response) => {
          this.isLoading=false;
          const messageSuccess = `Successfully added ${this.dep.deposit_amount} USDT to your account`;
          localStorage.setItem('toastrMessage', messageSuccess);
          location.reload();
        },
          (error) => {
            this.toastrService.error(`There was an error while taking your request!`,'Error',{timeOut:3000,closeButton: true, 
              progressBar: true,})
            this.isLoading=false;
          }
        );
    }else {
      //alert("The deposit amount is invalid! The minimum deposit amount is " +this.min_deposit+ " USDT");
      this.isLoading=false;
      this.toastrService.error(`The deposit amount is invalid! The minimum deposit amount is ${this.min_deposit} USDT`,'Error',{timeOut:3000,closeButton: true, 
        progressBar: true,})
    }     
  }



  depositChange(value: number): void {
    this.deposit_listener = value;
  }
}
