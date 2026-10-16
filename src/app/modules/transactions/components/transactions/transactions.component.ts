import { AfterViewInit, Component, OnInit } from '@angular/core'
import { TransactionsService } from '@modules/transactions/services/transactions.service'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { provideNativeDateAdapter } from '@angular/material/core'
import { MatInputModule } from '@angular/material/input'
import { MatDividerModule } from '@angular/material/divider'
import { MatSelectModule } from '@angular/material/select'
import { MatRadioModule } from '@angular/material/radio'
import { ITransaction } from '@modules/transactions/interfaces/transactions'
import { TransactionMapper } from '@modules/transactions/mappers/transaction.mapper'
import { MatIconModule } from '@angular/material/icon'
import { MatDialogRef } from '@angular/material/dialog'
import { AdministrationService } from '@modules/administration/services/administration.service'
import { IAccount } from '@modules/accounts/interfaces/accounts'
import { AccountsService } from '@modules/accounts/services/accounts.service'
import { TRANSACTION_TYPES, TransactionType } from '../../../../local/constants/transaction-type'
import { TranslatePipe } from '@ngx-translate/core'


@Component({
  selector: 'our-expenses',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    TranslatePipe
  ],
  providers: [ provideNativeDateAdapter() ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.sass'
})
export class TransactionsComponent implements OnInit, AfterViewInit {

  // ******************************* PROVISIONAL PROPERTIES *******************************
  public showDestinationAccount: boolean = true
  public transactionTypeMap: Record<string, number> = {}
  private readonly requiredValidator = Validators.required

  // ******************************* PROPERTIES *******************************
  public transactionTypes = TRANSACTION_TYPES
  public accounts: IAccount[] = []
  public transactionForm!: FormGroup

  // ******************************* ERROR HANDLING *******************************
  public creationError: boolean = false

  constructor(
    public dialogRef: MatDialogRef<TransactionsComponent>,
    private readonly fb: FormBuilder,
    private readonly transactionsService: TransactionsService,
    private readonly administrationService: AdministrationService,
    private readonly accountService: AccountsService
  ) {}

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.getAccounts()
    this.createTransactionForm()
    this.listenToTransactionType()
    this.transactionForm.valueChanges.subscribe(() => {
      this.creationError = false
      this.transactionForm.markAsUntouched()
    })
  }

  ngAfterViewInit(): void {
    this.transactionForm.enable()
  }

  // ******************************* MAIN METHODS *******************************
  /**
   * Fetches the existing accounts created by the user
   */
  private async getAccounts() {
    this.accounts = await this.accountService.getAccounts()
  }

  /**
   * Creates the transaction form
   */
  private createTransactionForm() {
    this.transactionForm = this.fb.group({
      type: new FormControl<TransactionType | null>({ value: null, disabled: true}, Validators.required),
      date: new FormControl({ value: null, disabled: true}, Validators.required),
      amount: new FormControl({ value: null, disabled: true}, Validators.required),
      description: new FormControl({ value: null, disabled: true }, Validators.required),
      source_account_id: new FormControl({ value: null, disabled: true }, Validators.required),
      destination_account_id: new FormControl({ value: null, disabled: true})
    })
  }

  /**
   * It listens to changes in the type field
   */
  private listenToTransactionType() {
    this.transactionForm.get('type')?.valueChanges.subscribe(value => {
      if(value === "TRANSFER") {
        this.showDestinationAccount = true
        this.makeRequired('destination_account_id')
      } else {
        this.showDestinationAccount = false
        this.makeOptional('destination_account_id')
      }
    })
  }

  /**
   * Sends the value to be saved in the indexedDB table
   */
  public async saveTransaction() {
    this.transactionForm.markAllAsTouched()
    if(this.transactionForm.invalid) {
      this.creationError = true
      return
    }
    
    try {
      const formValue = this.transactionForm.getRawValue()
      const transaction: ITransaction = TransactionMapper.fromForm(formValue)

      await this.transactionsService.saveTransaction(transaction)
      this.transactionForm.reset()
      this.dialogRef.close({success: true})
    }
    catch (error) {
      console.warn("Error saving account", error)
      this.dialogRef.close({success: false})
    }
  }

  /**
   * Closes the modal
   * @param success Indicates whether the operation was successful or not
   */
  public close() {
    this.dialogRef.close()
  }

  // ******************************* HELPERS *******************************
  /**
   * Formats the amount entered to add decimal point and 2 decimal positions
   */
  formatAmount() {
    const value = this.transactionForm.get('amount')?.value;
    if(!value) return

    const formatted = Number(value).toFixed(2);
    this.transactionForm.get('amount')?.setValue(formatted, { emitEvent: false });
  }

  private makeRequired(controlPath: string) {
    if(!controlPath) return
    this.transactionForm.get(controlPath)?.addValidators(this.requiredValidator)
    this.transactionForm.get('destination_account_id')?.updateValueAndValidity()
  }

  private makeOptional(controlPath: string) {
    if(!controlPath) return
    this.transactionForm.get(controlPath)?.removeValidators(this.requiredValidator)
    this.transactionForm.get('destination_account_id')?.updateValueAndValidity()
  }
}