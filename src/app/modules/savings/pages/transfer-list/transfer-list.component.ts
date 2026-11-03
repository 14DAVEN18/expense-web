import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccountsService } from '@modules/accounts/services/accounts.service';
import { SavingTransfersComponent } from '@modules/savings/components/saving-transfers/saving-transfers.component';
import { ISavingTransfer, ISavingTransferDisplay } from '@modules/savings/interfaces/saving-transfer.interface';
import { ISaving } from '@modules/savings/interfaces/savings.interface';
import { SavingTransferService } from '@modules/savings/services/saving-transfer.service';
import { SavingService } from '@modules/savings/services/saving.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { FiltersComponent } from '@shared/components/filters/filters.component';
import { TableComponent } from '@shared/components/table/table.component';
import { PaginatorSize } from '@shared/components/table/types/paginator';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-tranfer-list',
  imports: [
    CommonModule,
    MatIconModule, MatTooltipModule, MatButtonModule,
    TranslatePipe, MoneyPipe,
    FiltersComponent, TableComponent
  ],
  templateUrl: './transfer-list.component.html',
  styleUrl: './transfer-list.component.sass'
})
export class TransferListComponent implements OnInit {
  // ******************************* TABLE RELATED PROPERTIES *******************************
  public realColumnNames: string[] = ['date', 'amount', 'reason', 'source_saving_name', 'destination_saving_name', 'actions']
  public displayHeaders: string[] = [
    'SAVING_TRANSFERS.COLUMNS.DATE',
    'SAVING_TRANSFERS.COLUMNS.AMOUNT',
    'SAVING_TRANSFERS.COLUMNS.REASON',
    'SAVING_TRANSFERS.COLUMNS.SOURCE_SAVING',
    'SAVING_TRANSFERS.COLUMNS.DESTINATION_SAVING',
    'SAVING_TRANSFERS.COLUMNS.ACTIONS'
  ]
  public shortColumns: string[] = ['date']
  public savingTransfers: ISavingTransfer[] = []
  private savings: ISaving[] = []
  public data: ISavingTransferDisplay[] = []
  public pageSize: PaginatorSize = 10

  // ******************************* FILTER RELATED PROPERTIES *******************************
  public filterParameters: string[] = [
    'SAVING_TRANSFERS.COLUMNS.DATE',
    'SAVING_TRANSFERS.COLUMNS.AMOUNT',
    'SAVING_TRANSFERS.COLUMNS.REASON',
    'SAVING_TRANSFERS.COLUMNS.SOURCE_SAVING_NAME',
    'SAVING_TRANSFERS.COLUMNS.DESTINATION_SAVING_NAME'
  ]
  
  public showActive: boolean = true
  public searchValue: string = ''
  public searchColumns: string[] = ['date', 'amount', 'reason', 'source_saving_name', 'destination_saving_name']
  
  // ******************************* PROPERTIES *******************************
  public isLoadingSavingTransfers: boolean = false

  constructor(
    private readonly dialog: MatDialog,
    private readonly savingTransferService: SavingTransferService,
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
    this.isLoadingSavingTransfers = true;

    await Promise.all([
      this.getSavingTransfers(),
      this.getSavings()
    ]);

    await this.mapNames()
    
    this.isLoadingSavingTransfers = false;
  }

  /**
   * Fetches the existing saving transfers of the user from indexedDB
   */
  private async getSavingTransfers() {
    this.savingTransfers = await this.savingTransferService.getSavingTransfers()
  }

  /**
   * Retrieves the existing saving transfers
   */
  private async getSavings() {
    this.savings = await this.savingService.getSavings()
  }

  /**
   * Maps additional information
   */
  private async mapNames() {
    const savingsWithId = this.savings.filter((saving): saving is ISaving & { id: number } =>
      saving.id !== undefined
    )

    const savingTransfers = await Promise.all(
      this.savingTransfers.map(async savingTransfer => {
        const sourceSaving = savingsWithId.find(saving => saving.id === savingTransfer.source_saving_id)
        const destinationSaving = savingsWithId.find(saving => saving.id === savingTransfer.destination_saving_id)
        if(!sourceSaving || !destinationSaving) return
        
        const account = await this.accountService.getAccount(sourceSaving.account_id)
        if(!account) return

        return {
          ...savingTransfer,
          source_saving_name: sourceSaving.name,
          destination_saving_name: destinationSaving.name,
          currency_code: account.currency_code
        }
      }
    ))

    this.data = savingTransfers.filter(savingTransfer => savingTransfer !== undefined)
  }

  /**
   * Opens a modal for saving transfer creation
   * @param enterAnimationDuration string that defines the duration of the opening animation of the modal
   * @param exitAnimationDuration string that defines the duration of the closing  animation of the modal
   */
  public openCreationModal(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(SavingTransfersComponent, {
      maxHeight: '80vh',
      minHeight: '60vh',
      width: '45vw',
      enterAnimationDuration,
      exitAnimationDuration
    })

    dialogRef.afterClosed().subscribe(async result => {
      if(!result) return
      
      if(result.success) {
        this.toastService.showSuccess('SAVING_TRANSFERS.MESSAGES.CREATION_SUCCESS')
        await this.initialize()
      } 
      else this.toastService.showError('SAVING_TRANSFERS.MESSAGES.CREATION_ERROR')
    })
  }

  /**
   * Opens a modal for saving transfer edition
   * @param savingTransfer saving transfer object to be loaded in the modal
   */
  public openEditionModal(enterAnimationDuration: string, exitAnimationDuration: string, savingTransfer: ISavingTransfer) {
    const dialogRef = this.dialog.open(SavingTransfersComponent, {
      height: '60vh',
      width: '45vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        savingTransfer
      }
    })

    dialogRef.afterClosed().subscribe(async result => {
      if(!result) return

      if(result.success) {
        this.toastService.showSuccess('SAVING_TRANSFERS.MESSAGES.UPDATE_SUCCESS')
        await this.initialize()
      }
    })
  }

  /**
   * Confirms or Rejects the deletion of a saving transfer
   * @param savingTransfer the saving transfer to be deleted
   */
  public confirmDeletion(enterAnimationDuration: string, exitAnimationDuration: string, savingTransfer: ISavingTransferDisplay) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      height: '30vh',
      width: '50vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'SAVING_TRANSFERS.DELETE.TITLE',
        message: 'SAVING_TRANSFERS.DELETE.MESSAGE',
        messageParams: {
          currency: savingTransfer.currency_code,
          amount: savingTransfer.active,
          source: savingTransfer.source_saving_name,
          destination: savingTransfer.destination_saving_name
        }
      }
    })

    dialogRef.afterClosed().subscribe(async confirmed => {
      if(!confirmed) return

      await this.disableSavingTransfer(savingTransfer)
    })
  }

  /**
   * Disables a saving transfer
   * @param savingTransfer saving transfer to be disabled
   */
  private async disableSavingTransfer(savingTransfer: ISavingTransfer) {
    if (!savingTransfer.id) return

    try {
      await this.savingTransferService.disableSavingTransfer(savingTransfer?.id)
      this.toastService.showSuccess('SAVING_TRANSFERS.MESSAGES.DISABLE_SUCCESS')
      await this.initialize()
    }
    catch (error) {
      console.warn("Error disabling saving transfer", error)
      this.toastService.showError('SAVING_TRANSFERS.MESSAGES.DISABLE_ERROR')
    }
  }

  /**
   * Exports all existing saving transfers in CSV format
   */
  public async exportCSV(): Promise<void> {
    await this.savingTransferService.exportSavingTransfersToCSV()
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
