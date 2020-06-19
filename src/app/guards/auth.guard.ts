import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private auth: AuthService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedRole = next.data.role;
    return new Promise(async (resolve, reject) => {
      const user = await this.auth.getCurrentUser();
      if (user.role !== expectedRole) {
        console.log(`User with role ${user.role} not authorized (expected ${expectedRole})`);
        this.router.parseUrl('/sign-up-tab1');
        return resolve(false);
      }
      return resolve(true);
    });
  }
}
