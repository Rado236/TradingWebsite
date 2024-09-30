import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, combineLatest, interval } from 'rxjs';
import { map } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective, baseColors } from 'ng2-charts';
import {Order} from "../interfaces/Order";
import {FormBuilder, FormControl, FormControlName, FormGroup} from "@angular/forms";
import {AuthService} from "../services/authenication.service";
import formatters from "chart.js/dist/core/core.ticks";
import { Crypto } from '../homepage/homepage.component';

export interface UserCrypto {
  crypto_name:string;
  amount:number;
}

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss'],
  providers: [BaseChartDirective]
})


export class TradingComponent implements OnInit {
  //crypto:Crypto | null = null;// Ne znam Rado go sloji

  order:Order = {} as Order;//This will hold the input data - Order is an interface created in the folder interfaces

  cryptos:Crypto[] = [];

  userCrypto:UserCrypto[] = [];

  selectedCrypto:string='';

  orderForm: FormGroup;

  neededUSDT: number = 0;

  crypto_amount:number=0;

  selectedOrder:string = "Buy/Sell";//This will gold the title above the form

  private subscriptions: Subscription = new Subscription();
  isLoading:boolean=false;


  userAddress:string='';


  constructor(private http:HttpClient,private builder:FormBuilder,private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.order.public_address = user.public_address;
        this.userAddress=user.public_address;
      }
    });
    //creating values for the form
    this.orderForm=builder.group({
      crypto_name:new FormControl(""),
      amount:new FormControl(null),
      operation:new FormControl("")
    })

  }
  ngOnInit(): void {
    //tracking any change in the order type
    this.orderForm.get('operation')?.valueChanges.subscribe( value => {
      let toUpp:string = value
      this.selectedOrder = toUpp.charAt(0).toUpperCase() + toUpp.slice(1);// before passing the value
      //we change the first letter into an uppercase one
    })
    this.getCryptos();
    this.getWalletContents(this.userAddress)
    this.subscriptions.add(
      combineLatest([
        this.orderForm.controls['amount'].valueChanges,
        this.orderForm.controls['crypto_name'].valueChanges
      ]).subscribe(([amount, crypto_name]) => {
        if (amount != null && amount !== '' && crypto_name != null && crypto_name !== '') {
          this.calculateNeededUSDT(amount, crypto_name);
        } else {
          this.neededUSDT = 0;
        }
      })
    );
    this.orderForm.controls['crypto_name'].valueChanges.subscribe(crypto_name=> {
      if(crypto_name !=null && crypto_name !== ''){
        this.findUserCryptoAmount(crypto_name);
      }else {
        this.crypto_amount=0;
      }
    })
    
  }
  submitOrder(){
    this.isLoading=true;
    //assigning values to the object
    this.order.crypto_name = this.orderForm.get('crypto_name')?.value;
    this.order.amount = this.orderForm.get('amount')?.value;
    if(this.order.amount===0 || this.order.amount === null){
      alert("Please enter valid amount and try again!")
      return
    }
    //The order object has been filled, we pass it as argument since the controller requires the same object(check priceController.ts)
    this.http.put(`https://tradingbackend.vercel.app/transfer/${this.orderForm.get('operation')?.value}`,this.order,{responseType:"text"})
      .subscribe((data)=>{
        const response = JSON.parse(data);
        console.log(response["status"])
        if(response["status"]==="success"){//checking what is the message we receive from the controller
          this.isLoading=false;
          alert("Successful Transaction")
          location.reload()
        }
        else{
          this.isLoading=false;
          alert("Transaction Failed! Please try again!")
        }
      })
  }
  calculateNeededUSDT(amount: number,crypto_name:string): void {
    if (crypto_name) {
      let selectedCrypto = this.cryptos.find(crypto => crypto.crypto_name === crypto_name);
      if (selectedCrypto && typeof selectedCrypto.value_usdt === 'number' ) {
        const crypto_value = selectedCrypto.value_usdt;
        if (amount && !isNaN(amount) && amount > 0) {
          this.neededUSDT = amount * crypto_value;
        } else {
          this.neededUSDT = 0;
        }
      } else {
        console.error(`Selected crypto not found: ${crypto_name}`);
        this.neededUSDT = 0;
      }
    } else {
      this.neededUSDT = 0;
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
  getCryptos(){
    this.http.get("https://tradingbackend.vercel.app/transfer/cryptos")
      .subscribe((data:any)=>{
        this.cryptos = data
        console.log(this.cryptos)
      })
  }

  getWalletContents(public_address:string){
    this.http.get<any>(`https://tradingbackend.vercel.app/getWallet?public_address=${public_address}`)
      .subscribe((data:any)=>{
        this.userCrypto = data
      });
    }

    sellAll(){
      const format=this.crypto_amount.toFixed(10)
      this.orderForm.patchValue({ amount: format });
    }

    get buttonText():string{
      const operation=this.orderForm.get('operation')?.value;
      if(operation==='sell'){
        return `Sell ${this.selectedCrypto}`
      }
      else if(operation==='buy'){
        return `Buy ${this.selectedCrypto}`
      }
      return "Choose order"
    }
}

