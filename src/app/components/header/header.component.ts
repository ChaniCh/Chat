import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
// [x: string]: any;
public isLoggedIn$: Observable<boolean>

  constructor(private authService: AuthService) { 
    this.isLoggedIn$ = authService.isLoggedIn()
  }

  ngOnInit(): void {
  }

  public loginWithGoogle(): void {
    this.authService.signInWithGoogle()
  }

  public signOut(): void {
    this.authService.signOut()
  }

}
