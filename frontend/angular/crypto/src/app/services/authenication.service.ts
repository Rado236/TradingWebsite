import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isUserAdmin:boolean=false;
  public currentUserSubject: BehaviorSubject<{ username: string; public_address: string } | null>;
  public currentUser$: Observable<{ username: string; public_address: string } | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = JSON.parse(localStorage.getItem('currentUser')!);
    this.currentUserSubject = new BehaviorSubject<{ username: string; public_address: string } | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public login(username: string): void {
    this.http.get<any>(`https://tradingbackend.vercel.app/api/user/${username}`).subscribe(
        response=> {
            if (response) {
                const user = { username: username, public_address: response[0].public_address };
                localStorage.setItem('currentUser', JSON.stringify(user)); 
                this.currentUserSubject.next(user); 
                if(user.username==='rado' || user.username==='buba'){
                  this.isUserAdminFunc();
                }
            } else {
                console.error("Public address not found in response");
            }
        },
        error => {
            console.error("Error during login:", error);
        }
    );
}

  public logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.getValue();
  }

  isUserAdminFunc():boolean{
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.username === 'rado' || user.username === 'buba';
  }

  public updateUsername(username: string): void {
    const currentUser = this.currentUserSubject.getValue();
    if (currentUser) {
      const updatedUser = { ...currentUser, username: username };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }
}
