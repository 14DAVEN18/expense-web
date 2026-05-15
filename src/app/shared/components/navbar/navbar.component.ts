import { Component } from '@angular/core';
import { INavbar } from './interfaces/navbar';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'our-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass'
})
export class NavbarComponent {

  public navbarOption: INavbar[] = [
    { path: '/home', label: 'home' },
    { path: '/accounts', label: 'accounts' },
    { path: '/transactions', label: 'transactions' },
    { path: '/administration', label: 'administration' }
  ]
}