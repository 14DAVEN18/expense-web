import { ComponentType } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AccountTypeComponent } from '@modules/administration/components/account-type/account-type.component';
import { IAccountType, ICurrency, ITransactionType } from '@modules/administration/interfaces/creation-type';
import { AdministrationService } from '@modules/administration/services/administration.service';
import { environment } from '../../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '@shared/services/toast.service';
import { TransactionTypeComponent } from '@modules/administration/components/transaction-type/transaction-type.component';
import { CurrencyComponent } from '@modules/administration/components/currency/currency.component';

@Component({
  selector: 'our-administration',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.sass'
})
export class AdministrationComponent implements OnInit {

  // ******************************* PROPERTIES *******************************
  public accountTypes: IAccountType[] = []
  public transactionTypes: ITransactionType[] = []
  public currencies: ICurrency[] = []

  public loadingAccountTypes: boolean = false
  public loadingTransactionTypes: boolean = false
  public loadingCurrencies: boolean = false

  constructor(
    private readonly administrationService: AdministrationService,
    private readonly dialog: MatDialog,
    private readonly toastService: ToastService
  ) { }

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.getAccountTypes()
    this.getTransactionTypes()
    this.getCurrencies()
  }

  // ******************************* MAIN METHODS *******************************
  /**
   * Fetches the existing account types
   */
  private async getAccountTypes() {
    this.loadingAccountTypes = true
    this.accountTypes = await this.administrationService.getAccountTypes()
    this.loadingAccountTypes = false
  }

  /**
   * Fetches the existing transaction types
   */
  private async getTransactionTypes() {
    this.loadingTransactionTypes = true
    this.transactionTypes = await this.administrationService.getTransactionTypes()
    console.log(this.transactionTypes)
    this.loadingTransactionTypes = false
  }

  /**
   * Fetches the existing currencies
   */
  private async getCurrencies() {
    this.loadingCurrencies = true
    this.currencies = await this.administrationService.getCurrencies()
    this.loadingCurrencies = false
  }

  /**
   * Sends account type modal settings to the openModal function
   * @param creationMode indicates whether the modal is for creation (true) or update (false)
   */
  public openAccountTypeCreationModal(creationMode: boolean = true) {
    this.openModal({
      component: AccountTypeComponent,
      successMessage: 'The account type was successfully created',
      errorMessage: 'There was an error creating the account type',
      reload: () => this.getAccountTypes()
    },
    creationMode)
  }

  /**
   * Sends transaction type modal settings to the openModal function
   * @param creationMode indicates whether the modal is for creation (true) or update (false)
   */
  public openTransactionTypeCreationModal(creationMode: boolean = true) {
    this.openModal({
      component: TransactionTypeComponent,
      successMessage: 'The transaction type was successfully created',
      errorMessage: 'There was an error creating the transaction type',
      reload: () => this.getTransactionTypes()
    },
    creationMode)
  }

   /**
   * Sends currency modal settings to the openModal function
   * @param creationMode indicates whether the modal is for creation (true) or update (false)
   */
  public openCurrencyCreationModal(creationMode: boolean = true) {
    this.openModal({
      component: CurrencyComponent,
      successMessage: 'The currency was successfully created',
      errorMessage: 'There was an error creating the currency',
      reload: () => this.getCurrencies()
    },
    creationMode)
  }

  public openModal(
    config: {component: ComponentType<any>, successMessage: string, errorMessage: string, reload?: () => void},
    creationMode: boolean = false  
  ) {
    const dialogRef = this.dialog.open(config.component, {
      height: '60vh',
      width: '30vw',
      enterAnimationDuration: environment.enterAnimationDuration,
      exitAnimationDuration: environment.exitAnimationDuration,
      data: {
        creationMode
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return

      if(result.success) {
        this.toastService.showSuccess(config.successMessage)
        config.reload?.()
      }
      else this.toastService.showError(config.errorMessage)
    })
  }
  
  
}