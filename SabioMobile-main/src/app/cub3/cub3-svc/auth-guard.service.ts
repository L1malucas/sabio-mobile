import { Injectable } from '@angular/core';

import { CanActivate } from '@angular/router';
import { Cub3AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Cub3AuthGuard implements CanActivate {
    constructor(
      public authenticationService: Cub3AuthService
        ) {}

    canActivate(): Observable<boolean> {
      return this.authenticationService.isAuthenticated();
    }

}