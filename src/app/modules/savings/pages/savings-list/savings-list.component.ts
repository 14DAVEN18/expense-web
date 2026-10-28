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
import { ProgressComponent } from '@shared/components/progress/progress.component';
import { TableComponent } from '@shared/components/table/table.component';
import { PaginatorSize } from '@shared/components/table/types/paginator';
import { ToastService } from '@shared/services/toast.service';
import { SavingContributionStart, SavingPlanType } from '../../../../local/constants/saving';
import { DateUtil } from '@shared/utils/date.util';

@Component({
  selector: 'app-savings-list',
  imports: [
    CommonModule,
    MatTooltipModule, MatIconModule, MatButtonModule,
    FiltersComponent, TableComponent, ProgressComponent,
    TranslatePipe
  ],
  templateUrl: './savings-list.component.html',
  styleUrl: './savings-list.component.sass'
})
export class SavingsListComponent implements OnInit {
  // ******************************* TABLE RELATED PROPERTIES *******************************
  public realColumnNames: string[] = ['active', 'real_date', 'name', 'description', 'associated_account_name', 'progress', 'actions']
  public displayHeaders: string[] = [
    '',
    'SAVINGS.COLUMNS.DATE',
    'SAVINGS.COLUMNS.NAME',
    'SAVINGS.COLUMNS.DESCRIPTION',
    'SAVINGS.COLUMNS.ASSOCIATED_ACCOUNT_NAME',
    'SAVINGS.COLUMNS.PROGRESS',
    'SAVINGS.COLUMNS.ACTIONS'
  ]
  public shortColumns: string[] = ['active', 'real_date']
  public savings: ISaving[] = []
  private accounts: IAccount[] = []
  public data: ISavingDisplay[] = []
  public pageSize: PaginatorSize = 10

  // ******************************* FILTER RELATED PROPERTIES *******************************
  public filterParameters: string[] = [
    'SAVINGS.COLUMNS.NAME',
    'SAVINGS.COLUMNS.ASSOCIATED_ACCOUNT_NAME',
    'SAVINGS.COLUMNS.DESCRIPTION'
  ]
  
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

  /**
   * Maps additional information
   */
  private mapNames() {
    this.data = this.savings.map(saving => ({
      ...saving,
      real_date: saving.contribution_start ? this.mapStartDate(saving.date, saving.contribution_start) : saving.date,
      associated_account_name: this.accounts.find(account => account.id === saving.account_id)?.name ?? '-',
      progress: {
        current: saving.target_amount ?? 0,
        target: saving.target_amount ?? null
      }
    }))
  }

  /**
   * It modifies the start date of the saving depending on the value contribution_start
   * @param date original date of the saving
   * @param contributionStart value of contribution start
   * @returns the string of the updated date
   */
  private mapStartDate(date: string, contributionStart: SavingContributionStart) {
    if(contributionStart === 'START_MONTH') return date

    const creationDate = new Date(date)
    creationDate.setMonth(creationDate.getMonth() + 1)
    return DateUtil.dateToString(creationDate)
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
      await this.savingService.disableSaving(saving?.id)
      this.toastService.showSuccess('SAVINGS.MESSAGES.DISABLE_SUCCESS')
      await this.initialize()
    }
    catch (error) {
      console.warn("Error disabling transaction", error)
      this.toastService.showError('SAVINGS.MESSAGES.DISABLE_ERROR')
    }
  }

  /**
   * Opens a new page with the link of the saving
   * @param link URL added at the moment of creation
   */
  public openLink(link?: string) {
    if(!link) return

    window.open(link, '_blank', 'noopener,noreferrer')
  }

  public confirmCompletion(saving: ISavingDisplay) {
    console.log(saving)
  }

  /**
   * Exports all existing savings in CSV format
   */
  public async exportCSV(): Promise<void> {
    await this.savingService.exportSavingsToCSV()
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
