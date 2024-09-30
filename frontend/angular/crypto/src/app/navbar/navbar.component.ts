import { Component,Input,OnInit  } from '@angular/core';
import { AuthService } from '../services/authenication.service';
import { Wallets } from '../profile-page/profile-page.component';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';


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
  lang:string = '';

  constructor(public authService: AuthService,private http:HttpClient,private translateService:TranslateService) {
  }
  ngOnInit(){
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.username=user.username;
          this.public_address=user.public_address;
          console.log("Pub",this.public_address)
          console.log(user)
          this.getWalletContents(this.public_address);
        }
      });
      this.lang=localStorage.getItem('lang') || 'en';
  }

    getWalletContents(public_address:string){
    const string_pub=public_address.trim();
    this.http.get<any>(`https://tradingbackend.vercel.app/transfer/getWallet?public_address=${string_pub}`)
      .subscribe((data:any)=>{
        this.wallets = data
        console.log(this.wallets);
        for (const wallet of this.wallets) {
          if (wallet.crypto_id===4) { 
            this.deposit=wallet.amount
          }
        }
      });
    }
  

  logout(): void {
    this.authService.logout();
  }

  changeLanguage(lang:any){
    const selectedLang=lang.target.value;
    localStorage.setItem('lang',selectedLang);
    this.translateService.use(selectedLang);
  }

}

