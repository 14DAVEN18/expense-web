import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'our-administration',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.sass'
})
export class AdministrationComponent implements OnInit {

  // ******************************* PROPERTIES *******************************

  constructor() { }

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
  }

  // ******************************* MAIN METHODS *******************************
}