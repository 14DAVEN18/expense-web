import { Component } from '@angular/core';
import { INavbar } from './interfaces/navbar';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'our-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass'
})
export class NavbarComponent {

  public navbarOption: INavbar[] = [
    { path: '/home', label: 'home' },
    { path: '/transactions', label: 'transactions' }
  ]
}