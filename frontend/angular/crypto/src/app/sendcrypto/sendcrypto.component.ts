import { Component, OnInit } from '@angular/core';
import { Transaction } from '../interfaces/Transaction';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/authenication.service';
import { UserCrypto } from '../trading/trading.component';
import { ToastrService } from 'ngx-toastr';

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
  isLoading:boolean=false;

  constructor(private http:HttpClient,private builder:FormBuilder,private authService: AuthService,private toastrService:ToastrService) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.transaction.public_address_sender = this.userAddress= user.public_address;//getting the logged user's public address
      }
    });
    this.transactionForm=builder.group({
      amount: new FormControl(null, [Validators.required]),
      public_address_reciever: new FormControl("", Validators.required),
      crypto_name: new FormControl("", Validators.required)
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

    if (this.transactionForm.invalid) {
      this.toastrService.error('Please fill all the fields correctly!', 'Error', {
        timeOut: 3000, 
        closeButton: true, 
        progressBar: true, 
      });
      return;
    }
    this.transaction.crypto_name = cryptoNameControl?.value;
    this.transaction.public_address_reciever = publicAddressReceiverControl?.value;
    this.transaction.amount = amountControl?.value;
    if (this.transaction.public_address_sender === this.transaction.public_address_reciever) {
      this.toastrService.error('You cant transfer crypto to yourself!', 'Error', {
        timeOut: 3000, 
        closeButton: true, 
        progressBar: true, 
      });
      return;
    }
    this.isLoading=true;
    // Send the PUT request with the populated transaction object
    this.http.put(`https://tradingbackend.vercel.app/transfer/send`, this.transaction, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text'
    })
    .subscribe((data) => {
        const response = JSON.parse(data);
        console.log(response["status"]);
        
        if (response["status"] === "success") { // Checking what is the message we receive from the controller
            this.isLoading=false;
            const messageSuccess = `Successful Transaction`;
            localStorage.setItem('toastrMessage', messageSuccess);
            location.reload();
        } else {
          this.isLoading=false;
            //alert("Transaction Failed. Please check the details!");
            this.toastrService.error('Transaction failed', 'Error', {
              timeOut: 3000, 
              closeButton: true, 
              progressBar: true, 
            });
        }
    }, (error) => {
        this.isLoading=false;
        // Handle errors from the HTTP request
        console.error("Error occurred during transaction:", error);
        this.toastrService.error('An error occurred while processing your transaction. Please try again.', 'Error', {
          timeOut: 3000, 
          closeButton: true, 
          progressBar: true, 
        });
    });
}


  getWalletContents(public_address:string){
    this.http.get<any>(`https://tradingbackend.vercel.app/transfer/getWallet?public_address=${public_address}`)
      .subscribe((data:any)=>{
        this.userCrypto = data
      });
    }
  

}
