import { Component, OnInit } from '@angular/core';
import { Transaction } from '../interfaces/Transaction';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/authenication.service';
import { UserCrypto } from '../trading/trading.component';

@Component({
  selector: 'app-sendcrypto',
  templateUrl: './sendcrypto.component.html',
  styleUrls: ['./sendcrypto.component.scss']
})
export class SendcryptoComponent  implements OnInit{

  transaction:Transaction={} as Transaction;
  transactionForm: FormGroup;
  crypto_amount:number=0;
  selectedCrypto:string='';
  userCrypto:UserCrypto[] = [];
  userAddress:string='';

  constructor(private http:HttpClient,private builder:FormBuilder,private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.transaction.public_address_sender = this.userAddress= user.public_address;//getting the logged user's public address
      }
    });
    this.transactionForm=builder.group({
      amount:new FormControl(null),
      public_address_reciever:new FormControl(""),
      crypto_name:new FormControl("")
    })
  }

  ngOnInit(): void {
    this.getWalletContents(this.userAddress);
    this.transactionForm.controls['crypto_name'].valueChanges.subscribe(crypto_name=> {
      if(crypto_name !=null && crypto_name !== ''){
        this.findUserCryptoAmount(crypto_name);
      }else {
        this.crypto_amount=0;
      }
    })
  }
  sendCrypto1(){
    this.transaction.crypto_name=this.transactionForm.get('crypto_name')?.value;
    this.transaction.public_address_reciever=this.transactionForm.get('public_address_reciever')?.value;
    this.transaction.amount=this.transactionForm.get('amount')?.value;
    if(this.transaction.public_address_sender===this.transaction.public_address_reciever){
      alert("You cant transfer crypto to yourself!")
      return;
    }else{
      console.log(this.transaction);
      this.http.put(`https://tradingbackend.vercel.app/transfer/send`,this.transaction,{headers: { 'Content-Type': 'application/json' },responseType:"text"})
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
  }

  findUserCryptoAmount(crypto_name:string){
    if(crypto_name){
      let selectedCrypto = this.userCrypto.find(userCrypto => userCrypto.crypto_name === crypto_name);
      if(selectedCrypto && typeof selectedCrypto.amount==='number'){
        const amount = selectedCrypto.amount;
        this.crypto_amount=amount;
        this.selectedCrypto = selectedCrypto.crypto_name;
        console.log("Sel cr:",this.selectedCrypto);
      }else {
        this.crypto_amount=0;
      }
    }
  }
  sendCrypto() {
    // Ensure the form controls are properly defined and get their values
    const cryptoNameControl = this.transactionForm.get('crypto_name');
    const publicAddressReceiverControl = this.transactionForm.get('public_address_reciever');
    const amountControl = this.transactionForm.get('amount');

    // Check if all form controls are present and get their values
    if (!cryptoNameControl || !publicAddressReceiverControl || !amountControl) {
        alert("Please fill out all fields correctly.");
        return;
    }

    // Populate the transaction object
    this.transaction.crypto_name = cryptoNameControl.value;
    this.transaction.public_address_reciever = publicAddressReceiverControl.value;
    this.transaction.amount = amountControl.value;

    // Check if the sender and receiver addresses are the same
    if (this.transaction.public_address_sender === this.transaction.public_address_reciever) {
        alert("You can't transfer crypto to yourself!");
        return;
    }
    // Send the PUT request with the populated transaction object
    this.http.put(`https://tradingbackend.vercel.app/transfer/send`, this.transaction, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text'
    })
    .subscribe((data) => {
        const response = JSON.parse(data);
        console.log(response["status"]);
        
        if (response["status"] === "success") { // Checking what is the message we receive from the controller
            alert("Successful Transaction");
            location.reload();
        } else {
            alert("Transaction Failed. Please check the details!");
        }
    }, (error) => {
        // Handle errors from the HTTP request
        console.error("Error occurred during transaction:", error);
        alert("An error occurred while processing your transaction. Please try again.");
    });
}


  getWalletContents(public_address:string){
    this.http.get<any>(`https://tradingbackend.vercel.app/transfer/getWallet?public_address=${public_address}`)
      .subscribe((data:any)=>{
        this.userCrypto = data
      });
    }
  

}
