import { AfterViewInit, Component, Inject, OnInit } from '@angular/core'
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
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

  // ******************************* PROPERTIES *******************************
  public showDestinationAccount: boolean = true
  public transactionTypeMap: Record<string, number> = {}
  private readonly requiredValidator = Validators.required
  public transactionTypes = TRANSACTION_TYPES
  public accounts: IAccount[] = []
  public transactionForm!: FormGroup
  

  // ******************************* ERROR HANDLING *******************************
  public maxDate: Date = new Date();
  public error: boolean = false
  public noAccounts: boolean = false
  public errorMessage: string = ''

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { transaction?: ITransaction },
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
      this.error = false
      this.transactionForm.markAsUntouched()
    })

    if(this.isEditing) this.loadTransaction()
  }

  ngAfterViewInit(): void {
    this.transactionForm.enable()
  }

  // ******************************* MAIN METHODS *******************************
  private loadTransaction() {
    const transaction = this.data.transaction
    if(!transaction) return

    this.transactionForm.patchValue({
      type: transaction.type,
      date: new Date(transaction.date),
      amount: transaction.amount,
      description: transaction.description,
      source_account_id: transaction.source_account_id,
      destination_account_id: transaction.destination_account_id
    })
  }
  /**
   * Fetches the existing accounts created by the user
   */
  private async getAccounts() {
    this.accounts = await this.accountService.getAccounts()

    if(!this.accounts.length) {
      this.transactionForm.disable()
      this.errorMessage = 'TRANSACTIONS.MESSAGES.NO_ACCOUNTS_ERROR'
      this.noAccounts = true
      this.error = true
    }
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
      this.errorMessage = 'TRANSACTIONS.MESSAGES.REQUIRED_ERROR'
      this.error = true
      return
    }
    
    const transaction = TransactionMapper.fromForm(
      this.transactionForm.getRawValue(),
      this.isEditing ? this.data.transaction : undefined
    )

    try {
      if (this.isEditing) await this.updateTransaction(transaction)
      else await this.createTransaction(transaction)

      this.transactionForm.reset()
      this.dialogRef.close({success: true})
    }
    catch (error) {
      console.warn("Error saving transaction", error)
      this.dialogRef.close({success: false})
    }
  }

  /**
   * It creates the transaction
   * @param transaction transaction to be created
   */
  private async createTransaction(transaction: ITransaction) {
    await this.transactionsService.createTransaction(transaction)
  }

  /**
   * It updates the transaction
   * @param transaction transaction to be updated
   */
  private async updateTransaction(transaction: ITransaction) {
    const original = this.data.transaction

    await this.transactionsService.updateTransaction({
      ...transaction,
      id: original?.id
    })
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
   * It determines whether the modal is in edition mode or not
   */
  public get isEditing(): boolean {
    return !!this.data?.transaction
  }
  /**
   * Formats the amount entered to add decimal point and 2 decimal positions
   */
  formatAmount() {
    const value = this.transactionForm.get('amount')?.value;
    if(!value) return

    const formatted = Number(value).toFixed(2);
    this.transactionForm.get('amount')?.setValue(formatted, { emitEvent: false });
  }

  /**
   * It adds the required validator to a form control
   * @param controlPath path in the form to the form control
   */
  private makeRequired(controlPath: string) {
    if(!controlPath) return
    this.transactionForm.get(controlPath)?.addValidators(this.requiredValidator)
    this.transactionForm.get('destination_account_id')?.updateValueAndValidity()
  }

  /**
   * It removes the required validator from a form control
   * @param controlPath path in the form to the from control
   */
  private makeOptional(controlPath: string) {
    if(!controlPath) return
    this.transactionForm.get(controlPath)?.removeValidators(this.requiredValidator)
    this.transactionForm.get('destination_account_id')?.updateValueAndValidity()
  }
}