import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component,ElementRef,HostListener,Inject,OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/authenication.service';
import { NavbarComponent } from '../navbar/navbar.component';

export interface Crypto{
  crypto_id:string,
  crypto_name:string,
  value_usdt:number
}
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit, AfterViewInit{
  @ViewChild('statsSection') statSection!: ElementRef;
  @ViewChild('tradeVideoEn') tradeVideoEn!: ElementRef<HTMLVideoElement>;
  @ViewChild('tradeVideoBg') tradeVideoBg!: ElementRef<HTMLVideoElement>;
  cryptos:Crypto[] = []
  stat1=0;
  stat2=0;
  stat3=0;
  animated = false;
  private stat1target=145;
  private stat2target=100;
  private stat3target=110;
  private duration=2000;
  lang:string | null = null;
  constructor(private http:HttpClient,public authService:AuthService){

}
  getCryptos(){
    this.http.get("https://tradingbackend.vercel.app/transfer/cryptos")
      .subscribe((data:any)=>{
        this.cryptos = data
      })
    //Here we get all crypto data from the prices table into an array(called cryptos) and loop though the array to visualize all the current values
  }
  
  ngOnInit() {
    this.lang = localStorage.getItem('lang') || 'en';
    //this.playVideo(this.lang);
    this.getCryptos();
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated) {
          this.counter();
          this.animated = true;
        }
      });
    }, {
      threshold: 0.3 
    });
    observer.observe(this.statSection.nativeElement);
  }
  counter(){
    const startTime=performance.now();
    const animate=(currentTime:number)=>{
      const elTime=currentTime-startTime;
      const progress=Math.min(elTime/this.duration,1);
      this.stat1 = Math.floor(this.stat1target * progress);
      this.stat2 = Math.floor(this.stat2target * progress);
      this.stat3 = Math.floor(this.stat3target * progress);
      if(progress<1){
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  playVideo(language: string | null): void {
    setTimeout(() => {
      if (language === 'en' && this.tradeVideoEn) {
        this.tradeVideoEn.nativeElement.play();
      } else if (language === 'bg' && this.tradeVideoBg) {
        this.tradeVideoBg.nativeElement.play();
      }
    }, 2000);
  }

  onLanguageChange(newLang: string): void {
    this.lang = newLang; 
    //this.playVideo(this.lang);
  }
}
  //   this.http.get<any>(`http://localhost:8080/api/price/${this.btc}`).subscribe(
  //     data => {
  //       const value_usdt = data[0][0].value_usdt;
  //       this.price_btc = value_usdt.toFixed(2);
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   );
  //   this.http.get<any>(`http://localhost:8080/api/price/${this.ada}`).subscribe(
  //     data => {
  //       const value_usdt = data[0][0].value_usdt;
  //       this.price_ada = value_usdt.toFixed(2);
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   );
  //   this.http.get<any>(`http://localhost:8080/api/price/${this.eth}`).subscribe(
  //     data => {
  //       const value_usdt = data[0][0].value_usdt;
  //       this.price_eth = value_usdt.toFixed(2);
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   );
  //
  //



