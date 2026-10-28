import { Component, EventEmitter, Output } from '@angular/core';
import { MenuItem } from './types/meu-item';
import { MatListModule } from '@angular/material/list'
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'our-sidenav',
  imports: [
    CommonModule,
    RouterLink, RouterLinkActive,
    MatListModule, MatIconModule,
    TranslatePipe
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.sass'
})
export class SidenavComponent {
  @Output() closeDrawer = new EventEmitter<void>()

  public currentTab: string | null = null;

  public menu: MenuItem[] = [
    {
      name: 'NAVBAR.HOME',
      options: new Map<string, string>([
        ['NAVBAR.HOME', "home"],
      ])
    },
    {
      name: 'NAVBAR.ACCOUNTS',
      options: new Map<string, string>([
        ["NAVBAR.ACCOUNTS", "accounts"],
      ])
    },
    {
      name: 'NAVBAR.TRANSACTIONS',
      options: new Map<string, string>([
        ["NAVBAR.TRANSACTIONS", 'transactions'],
      ])
    },
    {
      name: 'NAVBAR.SAVINGS',
      options: new Map<string, string>([
        ['NAVBAR.SAVINGS', "savings"],
      ])
    },
    {
      name: 'NAVBAR.ADMINISTRATION',
      options: new Map<string, string>([
        ['NAVBAR.ADMINISTRATION', 'administration']
      ])
    }
  ]

  public icons: { [key: string]: string } = {
    'NAVBAR.HOME': 'home',
    'NAVBAR.ACCOUNTS': 'account_balance',
    'NAVBAR.TRANSACTIONS': 'attach_money',
    'NAVBAR.SAVINGS': 'savings',
    'NAVBAR.ADMINISTRATION': 'build',
  }

  originalOrder = () => 0;

  close(): void {
    this.closeDrawer.emit()
  }

}
