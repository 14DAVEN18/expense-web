import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { TransactionListComponent } from '@modules/transactions/pages/transaction-list/transaction-list.component';
import { AccountListComponent } from '@modules/accounts/pages/account-list/account-list.component';
import { AdministrationComponent } from '@modules/administration/pages/administration/administration.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'accounts', component: AccountListComponent },
    { path: 'transactions', component: TransactionListComponent },
    { path: 'administration', component: AdministrationComponent },
    { path: '**', redirectTo: 'home' }
];
