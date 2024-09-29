import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/authenication.service';
import {Deposit} from "../interfaces/Deposit";

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit{
  dep:Deposit = {} as Deposit
  min_deposit:number=5;
  deposit_listener:number | undefined=undefined;
  constructor(private http:HttpClient,private authService: AuthService ){
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
  }
  deposit(){
    if(Number(this.dep.deposit_amount) > this.min_deposit){
      this.http.post('https://tradingbackend.vercel.app/transfer/deposit', this.dep,{headers: { 'Content-Type': 'application/json' },responseType:"text"}).subscribe(
        (response) => {
          alert(`Successfully added ${this.dep.deposit_amount} USDT to your account`);
          location.reload();
        },
          (error) => {
            alert("There was an error while taking your request! ");
          }
        );
    }else {
      alert("The deposit amount is invalid! The minimum deposit amount is " +this.min_deposit+ " USDT");
    }     
  }

  depositChange(value: number): void {
    this.deposit_listener = value;
  }
}
