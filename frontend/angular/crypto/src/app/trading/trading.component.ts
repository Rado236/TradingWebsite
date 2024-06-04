import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective, baseColors } from 'ng2-charts';
import {Order} from "../interfaces/Order";
import {FormBuilder, FormControl, FormControlName, FormGroup} from "@angular/forms";
import {AuthService} from "../services/authenication.service";
import formatters from "chart.js/dist/core/core.ticks";

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss'],
  providers: [BaseChartDirective]
})
export class TradingComponent implements OnInit {
  //crypto:Crypto | null = null;// Ne znam Rado go sloji

  order:Order = {} as Order;//This will hold the input data - Order is an interface created in the folder interfaces

  orderForm: FormGroup;

  selectedOrder:string = "Buy/Sell";//This will gold the title above the form

  constructor(private http:HttpClient,private builder:FormBuilder,private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.order.public_address = user.public_address;//getting the logged user's public address
      }
    });
    //creating values for the form
    this.orderForm=builder.group({
      crypto_name:new FormControl(""),
      amount:new FormControl(""),
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
  }
  submitOrder(){
    //assigning values to the object
    this.order.crypto_name = this.orderForm.get('crypto_name')?.value;
    this.order.amount = this.orderForm.get('amount')?.value;
    //The order object has been filled, we pass it as argument since the controller requires the same object(check priceController.ts)
    this.http.put(`http://localhost:8080/transfer/${this.orderForm.get('operation')?.value}`,this.order,{responseType:"text"})
      .subscribe((data)=>{
        const response = JSON.parse(data);
        console.log(response["status"])
        if(response["status"]==="success"){//checking what is the message we receive from the controller
          alert("Successful Transaction")
        }
        else{
          alert("Transaction Failed - Not enough funds")
        }
        location.reload()
      })

  }

}


