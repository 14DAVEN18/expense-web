import { Component } from '@angular/core';
import { INavbar } from './interfaces/navbar';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'our-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass'
})
export class NavbarComponent {

  public navbarOption: INavbar[] = [
    { path: '/home', label: 'NAVBAR.HOME' },
    { path: '/accounts', label: 'NAVBAR.ACCOUNTS' },
    { path: '/transactions', label: 'NAVBAR.TRANSACTIONS' },
    { path: '/administration', label: 'NAVBAR.ADMINISTRATION' },
    { path: '/settings', label: 'NAVBAR.SETTINGS' }
  ]
}