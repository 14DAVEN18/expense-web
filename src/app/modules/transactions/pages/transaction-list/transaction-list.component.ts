import { Component, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog';
import { TransactionsComponent } from '@modules/transactions/components/transactions/transactions.component';
import { TransactionsService } from '@modules/transactions/services/transactions.service';
import { ToastService } from '@shared/services/toast.service';
import { ITransaction, ITransactionDisplay } from '@modules/transactions/interfaces/transactions';
import { AccountsService } from '@modules/accounts/services/accounts.service';
import { IAccount } from '@modules/accounts/interfaces/accounts';
import { TableComponent } from '@shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { AdministrationService } from '@modules/administration/services/administration.service';
import { ITransactionType } from '@modules/administration/interfaces/creation-type';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { CURRENCIES } from '../../../../local/constants/currencies';

@Component({
  selector: 'our-expense-list',
  imports: [ CommonModule, MatButtonModule, MatTooltipModule, MatIconModule, TableComponent, TranslatePipe ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.sass'
})
export class TransactionListComponent implements OnInit {
  // ******************************* TABLE RELATED PROPERTIES *******************************
    public realColumnNames: string[] = ['date', 'updated_at', 'amount', 'description', 'source_account_name', 'destination_account_name', 'actions']
    public displayHeaders: string[] = [
      'TRANSACTIONS.COLUMNS.DATE',
      'TRANSACTIONS.COLUMNS.UPDATED_AT',
      'TRANSACTIONS.COLUMNS.AMOUNT',
      'TRANSACTIONS.COLUMNS.DESCRIPTION',
      'TRANSACTIONS.COLUMNS.SOURCE',
      'TRANSACTIONS.COLUMNS.DESTINATION',
      'TRANSACTIONS.COLUMNS.ACTIONS'
    ]
    public shortColumns: string[] = ['active', 'currency']
    public transactions: ITransaction[] = []
    private accounts: IAccount[] = []
    public transactionTypeMap: Record<string, number> = {}
    public data: ITransactionDisplay[] = []

  // ******************************* PROPERTIES *******************************
  public isLoadingTransactions: boolean = false
  public readonly currencies = CURRENCIES
  

  constructor(
    private readonly dialog: MatDialog,
    private readonly transactionService: TransactionsService,
    private readonly accountService: AccountsService,
    private readonly administrationService: AdministrationService,
    private readonly toastService: ToastService
  ) {}

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.loadData()
  }

  // ******************************* MAIN METHODS *******************************
  private async loadData() {
    this.isLoadingTransactions = true;

    await Promise.all([
      this.getAccounts(),
      this.getTransactions()
    ]);
    console.log(this.transactions)
    this.isLoadingTransactions = false;
  }
  /**
   * Fetches the existing transactions
   */
  private async getTransactions() {
    this.isLoadingTransactions = true
    this.transactions = await this.transactionService.getTransactions()
    this.mapAccounts()
    this.generateTransactionTypeMap()
    this.isLoadingTransactions = false
  }

  /**
   * Fetches the existing accounts
   */
  private async getAccounts() {
    this.accounts = await this.accountService.getAccounts()
  }

  /**
   * Maps the string names corresponding to the account type
   */
  private mapAccounts() {
    this.data = this.transactions.map(transaction => {
      const source = this.accounts.find(a => a.id === transaction.source_account_id)
      const destination = this.accounts.find(d => d.id === transaction.destination_account_id)
      
      return {
        ...transaction,
        source_account_name: source?.name ?? 'Unknown',
        destination_account_name: destination?.name ?? 'Unknown',
        transaction_type_name: ''
      }
    })
  }

  /**
   * Creates a map of transactionTypes
   */
  private generateTransactionTypeMap() {
    this.data = this.data.map(transaction => ({...transaction}))
  }

  /**
   * Opens a modal for transaction creation
   * @param enterAnimationDuration string that defines the duration of the opening animation of the modal
   * @param exitAnimationDuration string that defines the duration of the closing  animation of the modal
   */
  public openCreationModal(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(TransactionsComponent, {
      height: '60vh',
      width: '45vw',
      enterAnimationDuration,
      exitAnimationDuration
    })

    dialogRef.afterClosed().subscribe(async result => {
      if(!result) return
      
      if(result.success) {
        this.toastService.showSuccess('TRANSACTIONS.MESSAGES.CREATION_SUCCESS')
        await this.loadData()
      } 
      else this.toastService.showError('TRANSACTIONS.MESSAGES.CREATION_ERROR')
    })
  }

  /**
   * Opens a modal for transaction edition
   * @param transaction transaction object to be loaded in the modal
   */
  public openEditionModal(enterAnimationDuration: string, exitAnimationDuration: string, transaction: ITransaction) {
    console.log(transaction)
    const dialogRef = this.dialog.open(TransactionsComponent, {
      height: '60vh',
      width: '45vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        transaction
      }
    })

    dialogRef.afterClosed().subscribe(async result => {
      if(!result) return

      if(result.success) {
        this.toastService.showSuccess('TRANSACTIONS.MESSAGES.UPDATE_SUCCESS')
        await this.loadData()
      }
    })
  }

  /**
   * Confirms or Rejects the deletion of a transaction
   * @param transaction the transaction to be deleted
   */
  public confirmDeletion(enterAnimationDuration: string, exitAnimationDuration: string, transaction: ITransaction) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      height: '20vh',
      width: '50vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'TRANSACTIONS.DELETE.TITLE',
        message: 'TRANSACTIONS.DELETE.MESSAGE',
        messageParams: {
          currency: this.getCurrency(transaction.source_account_id),
          amount: transaction.amount,
          account: this.getAccountName(transaction.source_account_id)
        }
      }
    })

    dialogRef.afterClosed().subscribe(async confirmed => {
      if(!confirmed) return

      await this.disableTransaction(transaction)
    })
  }

  private async disableTransaction(transaction: ITransaction) {
    if (!transaction.id) return

    try {
      await this.transactionService.disableTransaction(transaction?.id)
      this.toastService.showSuccess('TRANSACTIONS.MESSAGES.DISABLE_SUCCESS')
      await this.loadData()
    }
    catch (error) {
      console.warn("Error disabling transaction", error)
      this.toastService.showError('TRANSACTIONS.MESSAGES.DISABLE_ERROR')
    }
  }

  /**
   * Exports all existing transactions in CSV format
   */
  public async exportCSV(): Promise<void> {
    await this.transactionService.exportTransactionsToCSV()
  }

  // ******************************* HELPERS *******************************
  /**
   * Retrieves the name of the account associated to an ID
   * @param accountId id of the wanted account
   * @returns a string with the name of the account
   */
  private getAccountName(accountId: number | null): string {
    if (!accountId) return ''

    return this.accounts.find(account => account.id === accountId)?.name ?? ''
  }

  /**
   * Retrieves the code and symbol of the transaction
   * @param accountId id of the account owner of the wanted currency
   * @returns a string with the currency code and its symbol
   */
  private getCurrency(accountId: number | null): string {
    if (!accountId) return ''
    
    const currencyCode = this.accounts.find(account => account.id === accountId)?.currency_code ?? ''
    const symbol = this.currencies.find(currency => currency.code === currencyCode)?.symbol ?? ''
    return `${currencyCode} ${symbol}`
  }
}
