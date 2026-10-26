import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IAccount } from '@modules/accounts/interfaces/accounts';
import { SavingsComponent } from '@modules/savings/components/savings/savings.component';
import { ISaving, ISavingDisplay } from '@modules/savings/interfaces/savings.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { FiltersComponent } from '@shared/components/filters/filters.component';
import { IFilter } from '@shared/components/filters/interfaces/filter.interface';
import { TableComponent } from '@shared/components/table/table.component';
import { PaginatorSize } from '@shared/components/table/types/paginator';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-savings-list',
  imports: [
    CommonModule,
    MatTooltipModule, MatIconModule, MatButtonModule,
    FiltersComponent, TableComponent,
    TranslatePipe, MoneyPipe
  ],
  templateUrl: './savings-list.component.html',
  styleUrl: './savings-list.component.sass'
})
export class SavingsListComponent {
  // ******************************* TABLE RELATED PROPERTIES *******************************
  public realColumnNames: string[] = ['date', 'updated_at', 'amount', 'category_name', 'description', 'source_account_name', 'destination_account_name', 'actions']
  public displayHeaders: string[] = [
    'TRANSACTIONS.COLUMNS.DATE',
    'TRANSACTIONS.COLUMNS.UPDATED_AT',
    'TRANSACTIONS.COLUMNS.AMOUNT',
    'TRANSACTIONS.COLUMNS.CATEGORY',
    'TRANSACTIONS.COLUMNS.DESCRIPTION',
    'TRANSACTIONS.COLUMNS.SOURCE',
    'TRANSACTIONS.COLUMNS.DESTINATION',
    'TRANSACTIONS.COLUMNS.ACTIONS'
  ]
  public shortColumns: string[] = ['active', 'currency']
  public savings: ISaving[] = []
  private accounts: IAccount[] = []
  public data: ISavingDisplay[] = []
  public pageSize: PaginatorSize = 10

  // ******************************* FILTER RELATED PROPERTIES *******************************
  public filterParameters: string[] = [
    'TRANSACTIONS.COLUMNS.AMOUNT',
    'TRANSACTIONS.COLUMNS.CATEGORY',
    'TRANSACTIONS.COLUMNS.DESCRIPTION',
    'TRANSACTIONS.COLUMNS.ACCOUNT'
  ]
  public transactionFixedFilters: IFilter[] = [
    { label: 'TRANSACTION_TYPES.ALL', column: 'type', allowedValues: [] },
    { label: 'TRANSACTION_TYPES.INCOME', column: 'type', allowedValues: ['INCOME'] },
    { label: 'TRANSACTION_TYPES.EXPENSE', column: 'type', allowedValues: ['EXPENSE'] },
    { label: 'TRANSACTION_TYPES.TRANSFER', column: 'type', allowedValues: ['TRANSFER'] }
  ]
  public selectedFilter: IFilter = { label: 'TRANSACTION_TYPES.ALL', column: 'type', allowedValues: ['INCOME', 'EXPENSE', 'TRANSFER'] }
  public showActive: boolean = true
  public searchValue: string = ''
  public searchColumns: string[] = ['amount', 'category_name', 'description', 'source_account_name', 'destination_account_name']
  
  // ******************************* PROPERTIES *******************************
  public isLoadingSavings: boolean = false

  constructor(
    private readonly dialog: MatDialog,
    private readonly toastService: ToastService
  ) {

  }

  // ******************************* MAIN METHODS *******************************
  private async loadData() {
    this.isLoadingSavings = true;

    await Promise.all([
    //   this.getAccounts(),
    //   this.getCategories(),
    //   this.getTransactions(),
    ]);

    // this.mapNames()
    
    this.isLoadingSavings = false;
  }

  /**
   * Opens a modal for saving creation
   * @param enterAnimationDuration string that defines the duration of the opening animation of the modal
   * @param exitAnimationDuration string that defines the duration of the closing  animation of the modal
   */
  public openCreationModal(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(SavingsComponent, {
      maxHeight: '80vh',
      minHeight: '60vh',
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
   * Opens a modal for saving edition
   * @param saving saving object to be loaded in the modal
   */
  public openEditionModal(enterAnimationDuration: string, exitAnimationDuration: string, saving: ISaving) {
    const dialogRef = this.dialog.open(SavingsComponent, {
      height: '60vh',
      width: '45vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        saving
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
   * Confirms or Rejects the deletion of a saving
   * @param saving the saving to be deleted
   */
  public confirmDeletion(enterAnimationDuration: string, exitAnimationDuration: string, saving: ISaving) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      height: '30vh',
      width: '50vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'TRANSACTIONS.DELETE.TITLE',
        message: 'TRANSACTIONS.DELETE.MESSAGE',
        messageParams: {
          name: '', // this.getCurrency(transaction.source_account_id),
          amount: 0, // transaction.amount,
        }
      }
    })

    dialogRef.afterClosed().subscribe(async confirmed => {
      if(!confirmed) return

      await this.disableTransaction(saving)
    })
  }

  /**
   * Disables a transaction
   * @param transaction transaction to be disabled
   */
  private async disableTransaction(saving: ISaving) {
    if (!saving.id) return

    try {
      // await this.transactionService.disableTransaction(transaction?.id)
      this.toastService.showSuccess('TRANSACTIONS.MESSAGES.DISABLE_SUCCESS')
      await this.loadData()
    }
    catch (error) {
      console.warn("Error disabling transaction", error)
      this.toastService.showError('TRANSACTIONS.MESSAGES.DISABLE_ERROR')
    }
  }

  /**
   * Exports all existing savings in CSV format
   */
  public async exportCSV(): Promise<void> {
    
  }

  /**
   * Updates the value of the selected filter to send to the table
   * @param index index of the filter to select
   */
  public applyFilter(index: number) {
    if(index === null || index === undefined) return
    this.selectedFilter = this.transactionFixedFilters[index]
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
