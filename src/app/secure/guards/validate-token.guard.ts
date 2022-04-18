import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree, Event } from '@angular/router';
import { Observable } from 'rxjs'; 
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Location } from '@angular/common';
import { ModuleEnum } from '../../data/enums/modules.enum';
import { RoleEnum } from '../../data/enums/roles.enum';

@Injectable({
  providedIn: 'root'
})

export class ValidateTokenGuard implements CanActivate, CanLoad {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private _location: Location,
  ){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      // console.log('canactivate');
      // console.log(this.authService.verifyAuthentication());

      if (!this.authService.verifyAuthentication()) {
        this.authService.logOut();
        return false;
      }

      return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.authService.verifyAuthentication()) {
        this.authService.logOut();
        return false;
      }

      return true;
  }
}
