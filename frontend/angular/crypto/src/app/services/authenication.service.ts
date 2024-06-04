import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public currentUserSubject: BehaviorSubject<{ username: string; public_address: string } | null>;
  public currentUser$: Observable<{ username: string; public_address: string } | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = JSON.parse(localStorage.getItem('currentUser')!);
    this.currentUserSubject = new BehaviorSubject<{ username: string; public_address: string } | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public login(username: string): void {
    // Check the username and password in the db
    localStorage.setItem('currentUser', JSON.stringify({ username: username, public_address: '' }));
    this.currentUserSubject.next({ username: username, public_address: '' });
    this.http.get<any>('http://localhost:8080/api/user/' + username).subscribe(response => {
      if (response) {
        const user = { username: username, public_address: response[0].public_address };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        console.log(user.public_address);
      }
    });
  }

  public logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    // check if currentUserSubject has a value
    return !!this.currentUserSubject.getValue();
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
