import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/authenication.service';
import {Deposit} from "../interfaces/Deposit";

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent {
  dep:Deposit = {} as Deposit
  min_deposit:number=5;
  constructor(private http:HttpClient,private authService: AuthService ){
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.dep.public_address = user.public_address;
      }
    });

  }
  deposit(){
    if(Number(this.dep.deposit_amount) > this.min_deposit){
      this.http.post('http://localhost:8080/transfer/deposit', this.dep,{responseType:"text"}).subscribe(
        (response) => {
          alert(`Successfully added ${this.dep.deposit_amount} USDT to your account`);
          location.reload()
        },
          (error) => {
            alert("There was an error while taking your request! ");
          }
        );
    }else {
      alert("The deposit amount is invalid! The minimum deposit amount is " +this.min_deposit+ " USDT");
    }     
  }
}
