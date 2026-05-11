import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { TransactionListComponent } from '@modules/expenses/pages/transaction-list/transaction-list.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'transactions',
        component: TransactionListComponent
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
