import { AfterViewInit, Component, OnInit } from '@angular/core'
import { TransactionsService } from '@modules/transactions/services/transactions.service'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
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
import { ITransactionType } from '@modules/administration/interfaces/creation-type'
import { IAccount } from '@modules/accounts/interfaces/accounts'
import { AccountsService } from '@modules/accounts/services/accounts.service'


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
    MatIconModule
  ],
  providers: [ provideNativeDateAdapter() ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.sass'
})
export class TransactionsComponent implements OnInit, AfterViewInit {

  // ******************************* PROVISIONAL PROPERTIES *******************************
  public showDestinationAccount: boolean = true
  public transactionTypeMap: Record<string, number> = {}

  // ******************************* PROPERTIES *******************************
  public transactionTypes: ITransactionType[] = []
  public accounts: IAccount[] = []
  public transactionForm!: FormGroup

  constructor(
    public dialogRef: MatDialogRef<TransactionsComponent>,
    private readonly fb: FormBuilder,
    private readonly transactionsService: TransactionsService,
    private readonly administrationService: AdministrationService,
    private readonly accountService: AccountsService
  ) {}

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.getTransactionTypes()
    this.getAccounts()
    this.createTransactionForm()
    this.listenToTransactionType()
    this.transactionForm.valueChanges.subscribe(() => console.log(this.transactionForm.getRawValue()))
  }

  ngAfterViewInit(): void {
    this.transactionForm.enable()
  }

  // ******************************* MAIN METHODS *******************************
  /**
   * Fetches the existing transaction types
   */
  private async getTransactionTypes() {
    this.transactionTypes = await this.administrationService.getTransactionTypes()
    this.generateTransactionTypeMap()
  }

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
      transaction_type_id: new FormControl({ value: null, disabled: true}),
      date: new FormControl({ value: null, disabled: true}),
      amount: new FormControl({ value: null, disabled: true}),
      description: new FormControl({ value: null, disabled: true }),
      source_account_id: new FormControl({ value: null, disabled: true }),
      destination_account_id: new FormControl({ value: null, disabled: true})
    })
  }

  private generateTransactionTypeMap() {
    this.transactionTypes.forEach(type => {
      if(type.id) {
        this.transactionTypeMap[type.name.toUpperCase().replaceAll(' ', '_')] = type.id
      }
    })
  }

  private listenToTransactionType() {
    this.transactionForm.get('transaction_type_id')?.valueChanges.subscribe(value => 
      this.showDestinationAccount = value === this.transactionTypeMap['TRANSFER']
    )
  }

  /**
   * Sends the value to be saved in the indexedDB table
   */
  public async saveTransaction() {
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
}