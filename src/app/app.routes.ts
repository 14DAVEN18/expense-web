import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { TransactionListComponent } from '@modules/transactions/pages/transaction-list/transaction-list.component';
import { AccountListComponent } from '@modules/accounts/pages/account-list/account-list.component';
import { AdministrationComponent } from '@modules/administration/pages/administration/administration.component';
import { SettingsComponent } from '@modules/settings/pages/settings/settings.component';
import { SavingsListComponent } from '@modules/savings/pages/savings-list/savings-list.component';
import { ContributionListComponent } from '@modules/savings/pages/contribution-list/contribution-list.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'accounts', component: AccountListComponent },
    { path: 'transactions', component: TransactionListComponent },
    { path: 'savings', component: SavingsListComponent },
    { path: 'contributions', component: ContributionListComponent },
    { path: 'administration', component: AdministrationComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '**', redirectTo: 'home' }
];
