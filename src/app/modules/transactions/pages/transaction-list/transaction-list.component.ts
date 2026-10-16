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

@Component({
  selector: 'our-expense-list',
  imports: [ CommonModule, MatButtonModule, MatIconModule, TableComponent, TranslatePipe ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.sass'
})
export class TransactionListComponent implements OnInit {
  // ******************************* TABLE RELATED PROPERTIES *******************************
    public realColumnNames: string[] = ['date', 'amount', 'description', 'source_account_name', 'destination_account_name']
    public displayHeaders: string[] = [
      'TRANSACTIONS.COLUMNS.DATE',
      'TRANSACTIONS.COLUMNS.AMOUNT',
      'TRANSACTIONS.COLUMNS.DESCRIPTION',
      'TRANSACTIONS.COLUMNS.SOURCE',
      'TRANSACTIONS.COLUMNS.DESTINATION'
    ]
    public shortColumns: string[] = ['active', 'currency']
    public transactions: ITransaction[] = []
    private accounts: IAccount[] = []
    public transactionTypeMap: Record<string, number> = {}
    public data: ITransactionDisplay[] = []

  // ******************************* PROPERTIES *******************************
  public isLoadingTransactions: boolean = false
  private transactionTypes: ITransactionType[] = []
  

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
   * Exports all existing transactions in CSV format
   */
  public async exportCSV(): Promise<void> {
    await this.transactionService.exportTransactionsToCSV()
  }
}
