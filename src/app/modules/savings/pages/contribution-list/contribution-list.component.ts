import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IAccount } from '@modules/accounts/interfaces/accounts';
import { AccountsService } from '@modules/accounts/services/accounts.service';
import { ContributionsComponent } from '@modules/savings/components/contributions/contributions.component';
import { IContribution, IContributionDisplay } from '@modules/savings/interfaces/contribution.interfaces';
import { ISaving } from '@modules/savings/interfaces/savings.interface';
import { ContributionService } from '@modules/savings/services/contribution.service';
import { SavingService } from '@modules/savings/services/saving.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';
import { FiltersComponent } from '@shared/components/filters/filters.component';
import { TableComponent } from '@shared/components/table/table.component';
import { PaginatorSize } from '@shared/components/table/types/paginator';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { ToastService } from '@shared/services/toast.service';
import { CURRENCIES } from '../../../../local/constants/currencies';

@Component({
  selector: 'app-contribution-list',
  imports: [
    CommonModule,
    MatButtonModule, MatTooltipModule, MatIconModule,
    FiltersComponent, TableComponent,
    TranslatePipe, MoneyPipe
  ],
  templateUrl: './contribution-list.component.html',
  styleUrl: './contribution-list.component.sass'
})
export class ContributionListComponent implements OnInit {
  // ******************************* TABLE RELATED PROPERTIES *******************************
    public realColumnNames: string[] = ['date', 'saving_name', 'account_name', 'amount', 'actions']
    public displayHeaders: string[] = [
      'CONTRIBUTIONS.COLUMNS.DATE',
      'CONTRIBUTIONS.COLUMNS.SAVING_NAME',
      'CONTRIBUTIONS.COLUMNS.ACCOUNT_NAME',
      'CONTRIBUTIONS.COLUMNS.AMOUNT',
      'CONTRIBUTIONS.COLUMNS.ACTIONS'
    ]
    // public shortColumns: string[] = ['date', 'amount']
    public contributions: IContribution[] = []
    public savings: ISaving[] = []
    public accounts: IAccount[] = []
    public data: IContributionDisplay[] = []
    public pageSize: PaginatorSize = 10
  
    // ******************************* FILTER RELATED PROPERTIES *******************************
    public filterParameters: string[] = [
      'CONTRIBUTIONS.COLUMNS.NAME',
      'CONTRIBUTIONS.COLUMNS.SAVING_NAME',
      'CONTRIBUTIONS.COLUMNS.DESCRIPTION'
    ]
    
    public showActive: boolean = true
    public searchValue: string = ''
    public searchColumns: string[] = ['date', 'saving_name', 'account_name', 'amount']

  // ******************************* PROPERTIES *******************************
  public isLoadingContributions: boolean = false

  constructor(
    private readonly dialog: MatDialog,
    private readonly contributionService: ContributionService,
    private readonly savingService: SavingService,
    private readonly accountService: AccountsService,
    private readonly toastService: ToastService,
  ) {

  }

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    void this.initialize()
  }

  // ******************************* MAIN METHODS *******************************
  private async initialize() {
    this.isLoadingContributions = true;

    await Promise.all([
      this.getContributions(),
      this.getSavings(),
      this.getAccounts()
    ]);

    this.mapNames()
    
    this.isLoadingContributions = false;
  }

  /**
   * Retrieves the existing savings
   */
  private async getContributions() {
    this.contributions = await this.contributionService.getContributions()
  }

  /**
   * Retrieves the existing savings
   */
  private async getSavings() {
    this.savings = await this.savingService.getSavings()
  }

  /**
   * Retrieves the existing savings
   */
  private async getAccounts() {
    this.accounts = await this.accountService.getAccounts()
  }

  /**
   * Maps additional information
   */
  private mapNames() {
    this.data = this.contributions.map(contribution => {

      const saving = this.savings.find(saving => saving.id === contribution.saving_id)
      const account = this.accounts.find(account => account.id === saving?.account_id)
      return {
        ...contribution,
        saving_name: saving?.name ?? '-',
        account_name: account?.name ?? '-',
        currency_code: account?.currency_code
      }
    })
  }

  /**
   * Opens a modal for contribution creation
   * @param enterAnimationDuration string that defines the duration of the opening animation of the modal
   * @param exitAnimationDuration string that defines the duration of the closing  animation of the modal
   */
  public openCreationModal(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(ContributionsComponent, {
      maxHeight: '40vh',
      minHeight: '30vh',
      width: '45vw',
      enterAnimationDuration,
      exitAnimationDuration
    })

    dialogRef.afterClosed().subscribe(async result => {
      if(!result) return
      
      if(result.success) {
        this.toastService.showSuccess('CONTRIBUTIONS.MESSAGES.CREATION_SUCCESS')
        await this.initialize()
      } 
      else this.toastService.showError('CONTRIBUTIONS.MESSAGES.CREATION_ERROR')
    })
  }

  /**
   * Opens a modal for contribution edition
   * @param contribution contribution object to be loaded in the modal
   */
  public openEditionModal(enterAnimationDuration: string, exitAnimationDuration: string, contribution: IContribution) {
    const dialogRef = this.dialog.open(ContributionsComponent, {
      maxHeight: '60vh',
      minHeight: '30vh',
      width: '45vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        contribution
      }
    })

    dialogRef.afterClosed().subscribe(async result => {
      if(!result) return

      if(result.success) {
        this.toastService.showSuccess('CONTRIBUTIONS.MESSAGES.UPDATE_SUCCESS')
        await this.initialize()
      }
    })
  }

  /**
   * Confirms or Rejects the deletion of a contribution
   * @param contribution the contribution to be deleted
   */
  public confirmDeletion(enterAnimationDuration: string, exitAnimationDuration: string, contribution: IContribution) {
    const saving = this.savings.find(saving => saving.id === contribution.saving_id)
    
    const account = this.accounts.find(account => account.id === saving?.account_id)

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      height: '30vh',
      width: '50vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'CONTRIBUTIONS.DELETE.TITLE',
        message: 'CONTRIBUTIONS.DELETE.MESSAGE',
        messageParams: {
          amount: contribution.amount,
          saving: saving?.name ?? '',
          currency: this.getCurrency(account?.id ?? null)
        }
      }
    })

    dialogRef.afterClosed().subscribe(async confirmed => {
      if(!confirmed) return

      await this.disableContribution(contribution)
    })
  }

  /**
   * Disables a saving
   * @param saving saving to be disabled
   */
  private async disableContribution(contribution: IContribution) {
    if (!contribution.id) return

    try {
      await this.contributionService.disableContribution(contribution?.id)
      this.toastService.showSuccess('CONTRIBUTIONS.MESSAGES.DISABLE_SUCCESS')
      await this.initialize()
    }
    catch (error) {
      console.warn("Error disabling transaction", error)
      this.toastService.showError('CONTRIBUTIONS.MESSAGES.DISABLE_ERROR')
    }
  }

  public async exportCSV() {
    await this.contributionService.exportContributionsToCSV()
  }

  // ******************************* HELPERS *******************************
  /**
   * Retrieves the code and symbol of the contribution
   * @param accountId id of the account owner of the wanted currency
   * @returns a string with the currency code and its symbol
   */
  private getCurrency(accountId: number | null): string {
    if (!accountId) return ''
    
    const currencyCode = this.accounts.find(account => account.id === accountId)?.currency_code ?? ''
    const symbol = CURRENCIES.find(currency => currency.code === currencyCode)?.symbol ?? ''
    return `${currencyCode} ${symbol}`
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
