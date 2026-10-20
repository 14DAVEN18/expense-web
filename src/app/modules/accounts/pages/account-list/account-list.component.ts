import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AccountComponent } from '@modules/accounts/components/account/account.component';
import { IAccount, IAccountDisplay } from '@modules/accounts/interfaces/accounts';
import { AccountsService } from '@modules/accounts/services/accounts.service';
import { AdministrationService } from '@modules/administration/services/administration.service';
import { ITransaction } from '@modules/transactions/interfaces/transactions';
import { TransactionsService } from '@modules/transactions/services/transactions.service';
import { TranslatePipe } from '@ngx-translate/core';
import { TableComponent } from '@shared/components/table/table.component';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'our-account-list',
  imports: [
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    TableComponent,
    TranslatePipe
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.sass'
})
export class AccountListComponent implements OnInit {

  // ******************************* TABLE RELATED PROPERTIES *******************************
  public realColumnNames: string[] = ['active', 'currency_code', 'created_at', 'name', 'description', 'initial_balance', 'type']
  public displayHeaders: string[] = [
    '',
    'ACCOUNTS.COLUMNS.CURRENCY',
    'ACCOUNTS.COLUMNS.CREATED_AT',
    'ACCOUNTS.COLUMNS.NAME',
    'ACCOUNTS.COLUMNS.DESCRIPTION',
    'ACCOUNTS.COLUMNS.BALANCE',
    'ACCOUNTS.COLUMNS.TYPE'
  ]
  public shortColumns: string[] = ['active', 'currency']
  private accounts: IAccount[] = []
  public data: IAccountDisplay[] = []

  // ******************************* OTHER PROPERTIES *******************************
  public isLoadingAccounts: boolean = false
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
      this.getTransactions(),
      this.getAccounts()
    ])

    this.mapAccountTypes()
    this.calculateBalances()

    this.isLoadingAccounts = false
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
    this.isLoadingAccounts = false
  }

  /**
   * Maps the type name to the data array sent to the table
   */
  private mapAccountTypes() {
    this.data = this.accounts.map(account => ({
        ...account,
        current_balance: 0
    }))
  }

  /**
   * Calculates the balance of each account
   */
  private calculateBalances() {
    this.data = this.data.map(account => {
      const currentBalance = this.transactions.reduce((balance, transaction) => {
        if(!transaction.active) return balance
        
        const amount = Number(transaction.amount)
        if(!Number.isFinite(amount)) return balance
        
        switch(transaction.type) {
          case 'INCOME':
            if(transaction.source_account_id === account.id) return balance + amount
            break
          case 'EXPENSE':
            if(transaction.source_account_id === account.id) return balance - amount
            break
          case 'TRANSFER':
            if(transaction.source_account_id === account.id) balance -= amount
            if(transaction.destination_account_id === account.id) balance += amount
            break
        }
        return balance
      }, Number(account.initial_balance))

      return {
        ...account,
        current_balance: currentBalance
      }
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

    dialogRef.afterClosed().subscribe(async result => {
      if(!result) return
      
      if(result.success) {
        this.toastService.showSuccess('ACCOUNTS.MESSAGES.CREATION_SUCCESS')
        await this.getData()
      } 
      else this.toastService.showError('ACCOUNTS.MESSAGES.CREATION_ERROR')
    })
  }

  /**
   * Exports the information of all existing accounts in CSV format
   */
  public async exportCSV(): Promise<void> {
    await this.accountService.exportAccountsToCSV()
  }
}
