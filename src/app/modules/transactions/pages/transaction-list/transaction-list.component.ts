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

@Component({
  selector: 'our-expense-list',
  imports: [ CommonModule, MatButtonModule, MatIconModule, TableComponent ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.sass'
})
export class TransactionListComponent implements OnInit {
  // ******************************* TABLE RELATED PROPERTIES *******************************
    public realColumnNames: string[] = ['date', 'amount', 'description', 'source_account_name', 'destination_account_name']
    public displayHeaders: string[] = ['date', 'amount', 'description', 'source', 'destination']
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
    this.getTransactionTypes()
    this.getAccounts()
    this.getTransactions()
  }

  // ******************************* MAIN METHODS *******************************
  private async loadData() {
    this.isLoadingTransactions = true;

    await Promise.all([
      this.getAccounts(),
      this.getTransactionTypes()
    ]);
    await this.getTransactions();
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

  private async getTransactionTypes() {
    this.transactionTypes = await this.administrationService.getTransactionTypes()
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
    this.data = this.data.map(transaction => {
      const type = this.transactionTypes.find(tt => tt.id === transaction.transaction_type_id)

      return {
        ...transaction,
        transaction_type_name: type?.name ?? 'Unknown'
      }
    })
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

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return
      
      if(result.success) {
        this.toastService.showSuccess('The transaction was successfully created')
        this.getTransactions()
      } 
      else this.toastService.showError('There was an error creating the transaction')
    })
  }

  /**
   * Exports all existing transactions in CSV format
   */
  public async exportCSV(): Promise<void> {
    await this.transactionService.exportTransactionsToCSV()
  }
}
