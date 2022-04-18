import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs'; 
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class ValidateGuard implements CanActivate, CanLoad {
  
  constructor(private authService: AuthService,private router: Router){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      // console.log('canactivate');
      // console.log(this.authService.verifyAuthentication());

      if (this.authService.verifyAuthentication()) {
        this.router.navigate(['./counselor/']);
        return false;
      }

      return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
      if (this.authService.verifyAuthentication()) {
        this.router.navigate(['./counselor/']);
        return false;
      }

      return true;
  }
}
