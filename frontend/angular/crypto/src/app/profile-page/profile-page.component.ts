import { Component,OnInit } from '@angular/core';
import { AuthService } from '../services/authenication.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';


export interface Wallets {
  public_address:string;
  crypto_id:number;
  amount:number;
  crypto_name:string;
  value_usdt:number;
}
export interface Transactions{
  id:number;
  amount:number;
  crypto_id:number;
  public_address_reciever:string;
  public_address_sender:string;
  crypto_name:string;
  date:number;
}


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  wallets:Wallets[]=[];
  transactions:Transactions[]=[];
  public_address:string='';
  username:string='';
  total:number=0;
  transactionsFilter:Transactions[]=[];
  updateForm:FormGroup
  isSentTransactionsView:boolean=true;
  constructor(public authService:AuthService,private http:HttpClient,private router:Router,private formBuilder:FormBuilder,) {
    this.updateForm = this.formBuilder.group( {
      username:new FormControl(''),
      password:new FormControl(''),
      email:new FormControl('')
    })
  }
  
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.username=user.username;
        this.public_address=user.public_address;
        this.getWalletContents(this.public_address);
        this.getTransactions(this.public_address);
      }
    });
  }
  getWalletContents(public_address:string){
    this.http.get<any>(`https://tradingbackend.vercel.app/transfer/getWallet?public_address=${public_address}`)
      .subscribe((data:any)=>{
        this.wallets = data
        for (const wallet of this.wallets) {
          if (wallet.amount && wallet.value_usdt) { 
            this.total += wallet.value_usdt * wallet.amount;
            this.wallets=this.wallets.filter(wallet=>wallet.amount && wallet.amount!==0);
          }
        }
      });
    }

    getTransactions(public_address:string){
      this.http.get<any>(`https://tradingbackend.vercel.app/transfer/getTransactions?public_address=${public_address}`)
        .subscribe((data:any)=>{
          this.transactions = data   
          this.showSentTransactions();
        });
      }

      showSentTransactions(){
        this.isSentTransactionsView=true;
        this.transactionsFilter=this.transactions.filter(transaction=>transaction.public_address_sender===this.public_address)
      }
      showRecievedTransactions(){
        this.isSentTransactionsView=false;
        this.transactionsFilter=this.transactions.filter(transaction=>transaction.public_address_reciever===this.public_address)
      }

    deleteUser(public_address:string){
      if (confirm(`Confirm your actions! Are you sure you want to delete user: ${this.username} `)) {
        this.http.delete(`https://tradingbackend.vercel.app/api/user/${public_address}`).subscribe(()=>{
            alert("User is deleted. You will be redirected to the main page!");
            this.logout();
            this.router.navigate(['/']);
        });
      }
    }
    updateUser() {
      const { username, password, email } = this.updateForm.value;
      const currentUser = this.authService.currentUserSubject.getValue();
      const public_address = this.public_address; 
      const requestBody = {
        username: (username !== '') ? username : currentUser?.username,
        password: (password !== '') ? password : undefined,
        email: (email !== '') ? email : undefined
      };
    
      this.http.put(`https://tradingbackend.vercel.app/api/user/update/${public_address}`, requestBody, { responseType: 'text' })
        .subscribe(() => {
          location.reload();
          this.authService.updateUsername(requestBody.username);
        });
    }
    

  logout(): void {
    this.authService.logout();
  }
}
