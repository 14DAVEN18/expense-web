import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { RouterLink } from "@angular/router";
import { NavbarComponent } from '@shared/components/navbar/navbar.component';

@Component({
  selector: 'our-home',
  imports: [CommonModule, MatButtonModule, RouterLink, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent {

}
