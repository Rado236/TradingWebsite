import { Component,OnInit  } from '@angular/core';
import { AuthService } from '../services/authenication.service';
import { Wallets } from '../profile-page/profile-page.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})


export class NavbarComponent implements OnInit{
  wallets:Wallets[]=[];
  public_address:string='';
  username:string='';
  deposit:number=0.00;
  

  constructor(public authService: AuthService,private http:HttpClient) {
  }

  ngOnInit(){
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.username=user.username;
          this.public_address=user.public_address;
          this.getWalletContents(this.public_address);
        }
      });
  }

    getWalletContents(public_address:string){
    this.http.get<any>(`http://localhost:8080/transfer/getWallet?public_address=${public_address}`)
      .subscribe((data:any)=>{
        this.wallets = data
        console.log(this.wallets);
        for (const wallet of this.wallets) {
          if (wallet.crypto_id=4) { 
            this.deposit=wallet.amount
          }
        }
      });
    }
  

  logout(): void {
    this.authService.logout();
  }

}

