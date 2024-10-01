import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './authenication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private auth:AuthService, private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      var isAuthenticated = this.auth.isLoggedIn();
      if (!isAuthenticated) {
        this.router.navigate(['/login']);
        return false;
      }
      
      var isAdmin = this.auth.isUserAdminFunc();
      if (!isAdmin) {
        this.router.navigate(['/']);
        console.log(isAdmin)
        return false;
      }
      return true;
  }
}
