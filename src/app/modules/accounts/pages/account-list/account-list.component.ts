import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AccountComponent } from '@modules/accounts/components/account/account.component';
import { IAccount, IAccountDisplay } from '@modules/accounts/interfaces/accounts';
import { AccountsService } from '@modules/accounts/services/accounts.service';
import { IAccountType } from '@modules/administration/interfaces/creation-type';
import { AdministrationService } from '@modules/administration/services/administration.service';
import { ITransaction } from '@modules/transactions/interfaces/transactions';
import { TransactionsService } from '@modules/transactions/services/transactions.service';
import { TableComponent } from '@shared/components/table/table.component';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'our-account-list',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TableComponent
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.sass'
})
export class AccountListComponent implements OnInit {

  // ******************************* TABLE RELATED PROPERTIES *******************************
  public realColumnNames: string[] = ['active', 'currency_code', 'created_at', 'name', 'description', 'initial_balance', 'type_name']
  public displayHeaders: string[] = ['', 'cur', 'created at', 'name', 'description', 'balance', 'type']
  public shortColumns: string[] = ['active', 'currency']
  private accounts: IAccount[] = []
  public data: IAccountDisplay[] = []

  // ******************************* OTHER PROPERTIES *******************************
  public isLoadingAccounts: boolean = false
  private accountTypes: IAccountType[] = []
  private transactions: ITransaction[] = []


  constructor(
    private readonly dialog: MatDialog,
    private readonly administrationService: AdministrationService,
    private readonly accountService: AccountsService,
    private readonly transactionService: TransactionsService,
    private readonly toastService: ToastService
  ) {}

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
   this.getData()
  }

  // ******************************* MAIN METHODS *******************************
  /**
   * 
   */
  private async getData() {
    this.isLoadingAccounts = true

    await Promise.all([
      this.getAccountTypes(),
      this.getTransactions(),
      this.getAccounts()
    ])

    this.mapAccountTypes()
    this.calculateBalances()

    this.isLoadingAccounts = false
  }

  /**
   * Fetches the existing account types
   */
  private async getAccountTypes() {
    this.accountTypes = await this.administrationService.getAccountTypes()
  }

  /**
   * Fetches the existing transactions
   */
  private async getTransactions() {
    this.transactions = await this.transactionService.getTransactions()
  }

  /**
   * Fetches the existing accounts of the user from indexedDB
   */
  private async getAccounts() {
    this.isLoadingAccounts = true
    this.accounts = await this.accountService.getAccounts()
    this.mapAccountTypes()
    this.isLoadingAccounts = false
  }

  /**
   * Maps the type name to the data array sent to the table
   */
  private mapAccountTypes() {
    this.data = this.accounts.map(account => {
      const type = this.accountTypes.find(t => t.id === account.type_id)
      
      return {
        ...account,
        type_name: type?.name ?? 'Unknown',
        current_balance: 0
      }
    })
  }

  /**
   * Calculates the balance of each account
   */
  private calculateBalances() {
    this.data = this.data.map(account => {
      const accountTransactions = this.transactions.filter(t =>
          t.source_account_id === account.id
        );
      const currentBalance = account.initial_balance - accountTransactions.reduce(
          (sum, t) => sum + Number.parseFloat(t.amount.toString()), 0);
      return {
        ...account,
        current_balance: currentBalance
      };

    });
  }

  /**
   * Opens a modal for transaction creation
   * @param enterAnimationDuration string that defines the duration of the opening animation of the modal
   * @param exitAnimationDuration string that defines the duration of the closing  animation of the modal
   */
  public openCreationModal(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(AccountComponent, {
      height: '90vh',
      width: '30vw',
      enterAnimationDuration,
      exitAnimationDuration
    })

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return
      
      if(result.success) {
        this.toastService.showSuccess('The account was successfully created')
        this.getAccounts()
      } 
      else this.toastService.showError('There was an error creating the account')
    })
  }

  /**
   * Exports the information of all existing accounts in CSV format
   */
  public async exportCSV(): Promise<void> {
    await this.accountService.exportAccountsToCSV()
  }
}
