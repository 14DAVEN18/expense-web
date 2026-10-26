import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IAccount } from '@modules/accounts/interfaces/accounts';
import { AccountsService } from '@modules/accounts/services/accounts.service';
import { SavingsComponent } from '@modules/savings/components/savings/savings.component';
import { ISaving, ISavingDisplay } from '@modules/savings/interfaces/savings.interface';
import { SavingService } from '@modules/savings/services/saving.service';
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
export class SavingsListComponent implements OnInit {
  // ******************************* TABLE RELATED PROPERTIES *******************************
  public realColumnNames: string[] = ['active', 'date', 'name', 'associated_account_name', 'progress', 'actions']
  public displayHeaders: string[] = [
    '',
    'SAVINGS.COLUMNS.DATE',
    'SAVINGS.COLUMNS.NAME',
    'SAVINGS.COLUMNS.ASSOCIATED_ACCOUNT_NAME',
    'SAVINGS.COLUMNS.PROGRESS',
    'SAVINGS.COLUMNS.ACTIONS'
  ]
  public shortColumns: string[] = ['active', 'date']
  public savings: ISaving[] = []
  private accounts: IAccount[] = []
  public data: ISavingDisplay[] = []
  public pageSize: PaginatorSize = 10

  // ******************************* FILTER RELATED PROPERTIES *******************************
  public filterParameters: string[] = [
    'SAVINGS.COLUMNS.NAME',
    'SAVINGS.COLUMNS.ASSOCIATED_ACCOUNT_NAME',
    'SAVINGS.COLUMNS.DESCRIPTION',
    'SAVINGS.COLUMNS.TARGET_DATE'
  ]
  // public transactionFixedFilters: IFilter[] = [
  //   { label: 'TRANSACTION_TYPES.ALL', column: 'type', allowedValues: [] },
  //   { label: 'TRANSACTION_TYPES.INCOME', column: 'type', allowedValues: ['INCOME'] },
  //   { label: 'TRANSACTION_TYPES.EXPENSE', column: 'type', allowedValues: ['EXPENSE'] },
  //   { label: 'TRANSACTION_TYPES.TRANSFER', column: 'type', allowedValues: ['TRANSFER'] }
  // ]
  // public selectedFilter: IFilter = { label: 'TRANSACTION_TYPES.ALL', column: 'type', allowedValues: ['INCOME', 'EXPENSE', 'TRANSFER'] }
  public showActive: boolean = true
  public searchValue: string = ''
  public searchColumns: string[] = ['name', 'associated_account_name', 'description', 'target_date']
  
  // ******************************* PROPERTIES *******************************
  public isLoadingSavings: boolean = false

  constructor(
    private readonly dialog: MatDialog,
    private readonly savingService: SavingService,
    private readonly accountService: AccountsService,
    private readonly toastService: ToastService
  ) {

  }

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    void this.initialize()
  }

  // ******************************* MAIN METHODS *******************************
  private async initialize() {
    this.isLoadingSavings = true;

    await Promise.all([
      this.getSavings(),
      this.getAccounts()
    ]);
    console.log(this.savings)
    this.mapNames()
    
    this.isLoadingSavings = false;
  }

  private async getSavings() {
    this.savings = await this.savingService.getSavings()
  }

  /**
   * Fetches the existing savings of the user from indexedDB
   */
  private async getAccounts() {
    this.accounts = await this.accountService.getAccounts()
  }

  private mapNames() {
    this.data = this.savings.map(saving => ({
      ...saving,
      associates_account_name: this.accounts.find(account => account.id === saving.account_id)?.name ?? '-',
      progress: {
        current: 0,
        target: saving.target_amount ?? 0
      }
    }))
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
        this.toastService.showSuccess('SAVINGS.MESSAGES.CREATION_SUCCESS')
        await this.initialize()
      } 
      else this.toastService.showError('SAVINGS.MESSAGES.CREATION_ERROR')
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
        this.toastService.showSuccess('SAVINGS.MESSAGES.UPDATE_SUCCESS')
        await this.initialize()
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
        title: 'SAVINGS.DELETE.TITLE',
        message: 'SAVINGS.DELETE.MESSAGE',
        messageParams: {
          name: saving.name,
        }
      }
    })

    dialogRef.afterClosed().subscribe(async confirmed => {
      if(!confirmed) return

      await this.disableSaving(saving)
    })
  }

  /**
   * Disables a saving
   * @param saving saving to be disabled
   */
  private async disableSaving(saving: ISaving) {
    if (!saving.id) return

    try {
      // await this.savingService.disableSaving(transaction?.id)
      this.toastService.showSuccess('SAVINGS.MESSAGES.DISABLE_SUCCESS')
      await this.initialize()
    }
    catch (error) {
      console.warn("Error disabling transaction", error)
      this.toastService.showError('SAVINGS.MESSAGES.DISABLE_ERROR')
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
  // public applyFilter(index: number) {
  //   if(index === null || index === undefined) return
  //   this.selectedFilter = this.transactionFixedFilters[index]
  // }

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
