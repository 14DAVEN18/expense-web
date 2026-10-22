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
import { FiltersComponent } from '@shared/components/filters/filters.component';
import { IFilter } from '@shared/components/filters/interfaces/filter.interface';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { AccountUtil } from '@shared/utils/account.utils';

@Component({
  selector: 'our-account-list',
  imports: [ 
    CommonModule,
    MatButtonModule, MatTooltipModule, MatIconModule,
    TableComponent, FiltersComponent,
    TranslatePipe
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.sass'
})
export class AccountListComponent implements OnInit {

  // ******************************* TABLE RELATED PROPERTIES *******************************
  public realColumnNames: string[] = ['active', 'currency_code', 'date', 'updated_at', 'name', 'description', 'initial_balance', 'type', 'actions']
  public displayHeaders: string[] = [
    '',
    'ACCOUNTS.COLUMNS.CURRENCY',
    'ACCOUNTS.COLUMNS.DATE',
    'ACCOUNTS.COLUMNS.UPDATED_AT',
    'ACCOUNTS.COLUMNS.NAME',
    'ACCOUNTS.COLUMNS.DESCRIPTION',
    'ACCOUNTS.COLUMNS.BALANCE',
    'ACCOUNTS.COLUMNS.TYPE',
    'ACCOUNTS.COLUMNS.ACTIONS'
  ]
  public shortColumns: string[] = ['active', 'currency_code', 'date', 'type']
  private accounts: IAccount[] = []
  public data: IAccountDisplay[] = []

  // ******************************* FILTER RELATED PROPERTIES *******************************
  public filterParameters: string[] = [
    'ACCOUNTS.COLUMNS.CURRENCY',
    'ACCOUNTS.COLUMNS.NAME',
    'ACCOUNTS.COLUMNS.DESCRIPTION'
  ]
  public fixedFilters: IFilter[] = [
    { label: 'TRANSACTION_TYPES.ALL', column: 'type', allowedValues: [] },
    { label: 'ACCOUNT_TYPES.CASH', column: 'type', allowedValues: ['CASH'] },
    { label: 'ACCOUNT_TYPES.DIGITAL_ACCOUNT', column: 'type', allowedValues: ['DIGITAL_ACCOUNT'] }
  ]
  public selectedFilter: IFilter = { label: 'TRANSACTION_TYPES.ALL', column: 'type', allowedValues: [] }
  public showActive: boolean = true
  public searchValue: string = ''
  public searchColumns: string[] = ['currency_code', 'name', 'description']

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
    void this.loadData()
  }

  // ******************************* MAIN METHODS *******************************
  /**
   * It fetches the account and transactions details
   */
  private async loadData() {
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
    this.data = AccountUtil.calculateBalance(this.data, this.transactions)
  }

  /**
   * Opens a modal for transaction creation
   * @param enterAnimationDuration string that defines the duration of the opening animation of the modal
   * @param exitAnimationDuration string that defines the duration of the closing  animation of the modal
   */
  public openCreationModal(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(AccountComponent, {
      height: '60vh',
      width: '30vw',
      enterAnimationDuration,
      exitAnimationDuration
    })

    dialogRef.afterClosed().subscribe(async result => {
      if(!result) return
      
      if(result.success) {
        this.toastService.showSuccess('ACCOUNTS.MESSAGES.CREATION_SUCCESS')
        await this.loadData()
      } 
      else this.toastService.showError('ACCOUNTS.MESSAGES.CREATION_ERROR')
    })
  }

  /**
   * Opens a modal for account edition
   * @param account account object to be loaded in the modal
   */
  public openEditionModal(enterAnimationDuration: string, exitAnimationDuration: string, account: IAccount) {
    const dialogRef = this.dialog.open(AccountComponent, {
      height: '60vh',
      width: '45vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        account
      }
    })

    dialogRef.afterClosed().subscribe(async result => {
      if(!result) return

      if(result.success) {
        this.toastService.showSuccess('ACCOUNTS.MESSAGES.UPDATE_SUCCESS')
        await this.loadData()
      }
      else this.toastService.showError('ACCOUNTS.MESSAGES.UPDATE_ERROR')
    })
  }

  /**
   * Confirms or Rejects the deletion of a transaction
   * @param transaction the transaction to be deleted
   */
  public confirmDeletion(enterAnimationDuration: string, exitAnimationDuration: string, account: IAccount) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      height: '30vh',
      width: '50vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'ACCOUNTS.DELETE.TITLE',
        message: 'ACCOUNTS.DELETE.MESSAGE',
        messageParams: {
          name: account.name
        }
      }
    })

    dialogRef.afterClosed().subscribe(async confirmed => {
      if(!confirmed) return

      await this.disableAccount(account)
    })
  }

  /**
   * Disables a transaction
   * @param transaction transaction to be disabled
   */
  private async disableAccount(account: IAccount) {
    if (!account.id) return

    try {
      await this.accountService.disableAccount(account?.id)
      this.toastService.showSuccess('ACCOUNTS.MESSAGES.DISABLE_SUCCESS')
      await this.loadData()
    }
    catch (error) {
      console.warn("Error disabling transaction", error)
      this.toastService.showError('ACCOUNTS.MESSAGES.DISABLE_ERROR')
    }
  }

  /**
   * Exports the information of all existing accounts in CSV format
   */
  public async exportCSV(): Promise<void> {
    await this.accountService.exportAccountsToCSV()
  }

  /**
   * Updates the value of the selected filter to send to the table
   * @param index index of the filter to select
   */
  public applyFilter(index: number) {
    if(index === null || index === undefined) return
    this.selectedFilter = this.fixedFilters[index]
  }

  /**
   * Updates the value of the selected filter to send to the table
   * @param index index of the filter to select
   */
  public applyStatus(value: boolean) {
    if(value === null || value === undefined) return
    this.showActive = value
  }

  /**
   * Updates the search value to send to the table
   * @param search value of the filter to select
   */
  public applySearch(search: string) {
    this.searchValue = search
  }
}
