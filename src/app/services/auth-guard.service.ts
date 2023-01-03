import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    return this.authService.isLoggedIn().pipe(
      tap((userIsLoggedIn) => {
        if(!userIsLoggedIn) this.router.navigate(['/']);
      })
    )
  }
}
