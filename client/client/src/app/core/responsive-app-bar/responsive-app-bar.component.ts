import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../feature/authorization/services/authorization.service';


@Component({
  selector: 'app-responsive-app-bar',
  standalone: true,
  imports: [MatMenuModule, CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './responsive-app-bar.component.html',
  styleUrl: './responsive-app-bar.component.scss'
})
export class ResponsiveAppBarComponent {
  pages: string[] = ['Products', 'Pricing', 'Blog'];
  settings: string[] = ['Profile', 'Account', 'Dashboard', 'Logout'];

  isNavMenuOpen = false;
  isUserMenuOpen = false;

  constructor(private router: Router, private authorizationService: AuthorizationService) {

  }

  toggleNavMenu() {
    this.isNavMenuOpen = !this.isNavMenuOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeNavMenu() {
    this.isNavMenuOpen = false;
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;
  }
  logout() {
    this.router.navigateByUrl('/login');
    this.authorizationService.clearAuthToken();
  }
}




