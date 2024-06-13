import { Component } from '@angular/core';
import { Transaction } from '../interfaces/Transaction';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/authenication.service';

@Component({
  selector: 'app-sendcrypto',
  templateUrl: './sendcrypto.component.html',
  styleUrls: ['./sendcrypto.component.scss']
})
export class SendcryptoComponent {

  transaction:Transaction={} as Transaction;
  transactionForm: FormGroup;

  constructor(private http:HttpClient,private builder:FormBuilder,private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.transaction.public_address_sender = user.public_address;//getting the logged user's public address
      }
    });
    this.transactionForm=builder.group({
      amount:new FormControl(""),
      public_address_reciever:new FormControl(""),
      crypto_name:new FormControl("")
    })
  }
  sendCrypto(){
    this.transaction.crypto_name=this.transactionForm.get('crypto_name')?.value;
    this.transaction.public_address_reciever=this.transactionForm.get('public_address_reciever')?.value;
    this.transaction.amount=this.transactionForm.get('amount')?.value;
    this.http.put(`http://localhost:8080/transfer/send`,this.transaction,{responseType:"text"})
      .subscribe((data)=>{
        const response = JSON.parse(data);
        console.log(response["status"])
        if(response["status"]==="success"){//checking what is the message we receive from the controller
          alert("Successful Transaction")
          location.reload()
        }
        else{
          alert("Transaction Failed. Please check the details!")
        }
      })
  }

 getFormattedDateForSQL(date: Date): string {
   const year = date.getFullYear();
   const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-based, so add 1
   const day = ('0' + date.getDate()).slice(-2);
   const hours = ('0' + date.getHours()).slice(-2);
   const minutes = ('0' + date.getMinutes()).slice(-2);
   const seconds = ('0' + date.getSeconds()).slice(-2);

   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
 }

}
