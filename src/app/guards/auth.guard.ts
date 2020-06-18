import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private auth: AuthService){}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedData = next.data.role;
    // TODO: Check, if AuthService has already loaded user to fix racing condition.
    const role = this.auth.getCurrentUser()['role'];
    if (role !== expectedData) {
      console.log(`User with role ${role} not authorized (expected ${expectedData})`);
      this.router.parseUrl('/sign-up-tab1');
      return false;
    }
    return true;
    // return this.auth.getUser().pipe(
    //   take(1),
    //   map(user =>{
    //       console.log('log',user);
    //       if(user){
    //         let role = user['role'];
    //         if(expectedData == role){
    //           this.auth.signIn
    //           return true;
    //         }else{
    //           //user Alert - SHow Why? - Not right User Role - Need special Role / Not logged in ...
    //           return this.router.parseUrl('/sign-up-tab1');     // SHOW USER Altert
    //         }
    //       }else{
    //         //user Alert - SHow Why? - Not right User Role - Need special Role / Not logged in ...
    //         return this.router.parseUrl('/sign-up-tab1');     // SHOW USER Altert
    //       }
    //   })
    // )

    
  }
  
}
