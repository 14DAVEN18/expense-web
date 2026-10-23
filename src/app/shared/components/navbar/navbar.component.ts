import { Component } from '@angular/core';
import { INavbar } from './interfaces/navbar';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'our-navbar',
  imports: [
    CommonModule, 
    RouterLink, RouterLinkActive,
    MatTooltip, MatIconModule,
    TranslatePipe
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass'
})
export class NavbarComponent {

  public navbarTabs: INavbar[] = [
    { path: '/home', label: 'NAVBAR.HOME' },
    { path: '/accounts', label: 'NAVBAR.ACCOUNTS' },
    { path: '/transactions', label: 'NAVBAR.TRANSACTIONS' },
    { path: '/administration', label: 'NAVBAR.ADMINISTRATION' },
  ]

  public navbarIcons: INavbar[] = [
    { path: '/settings', label: 'NAVBAR.SETTINGS', icon: 'settings' }
  ]
}