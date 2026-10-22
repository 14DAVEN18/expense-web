import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { IAccount } from '@modules/accounts/interfaces/accounts';
import { AccountMapper } from '@modules/accounts/mappers/account.mapper';
import { AccountsService } from '@modules/accounts/services/accounts.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ACCOUNT_TYPES, AccountType } from '../../../../local/constants/account-type';
import { CURRENCIES, CurrencyCode } from '../../../../local/constants/currencies';

@Component({
  selector: 'app-account',
  imports: [
    MatInputModule,
    MatIconModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatDividerModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  providers: [ provideNativeDateAdapter() ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass'
})
export class AccountComponent implements OnInit, AfterViewInit {

  // ******************************* PROPERTIES *******************************
  public accountForm!: FormGroup
  public readonly accountTypes = ACCOUNT_TYPES
  public readonly currencies = CURRENCIES

  // ******************************* ERROR HANDLING *******************************
  public maxDate: Date = new Date();
  public error: boolean = false
  public errorMessage: string = ''
  public loading: boolean = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { account?: IAccount }, 
    public dialogRef: MatDialogRef<AccountComponent>,
    private readonly fb: FormBuilder,
    private readonly accountService: AccountsService
  ) { }

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.createAccountForm()
    this.initialize()
  }

  ngAfterViewInit(): void {
    this.accountForm.enable()
  }

  // ******************************* MAIN METHODS *******************************
  /**
   * Loads and transforms data before use
   */
  private initialize() {
    this.loading = true
        
    this.accountForm.valueChanges.subscribe(() => {
      this.accountForm.markAsUntouched()
    })

    if(this.isEditing) this.loadAccount()
    this.loading = false
    this.accountForm.enable()
  }

  /**
   * Load the transaction details into the form for edition
   */
  private loadAccount() {
    const account = this.data.account
    if(!account) return

    this.accountForm.patchValue({
      date: new Date(account.date),
      name: account.name,
      type: account.type,
      currency_code: account.currency_code,
      initial_balance: account.initial_balance,
      description: account.description
    })
    this.accountForm.enable()
  }

  /**
   * Creates the fields for the account form
   */
  private createAccountForm() {
    this.accountForm = this.fb.group({
      date: new FormControl({ value: null, disabled: true }, [Validators.required]),
      name: new FormControl({ value: null, disabled: true }, [Validators.required]),
      type: new FormControl<AccountType | null>({ value: null, disabled: true }, [Validators.required]),
      currency_code: new FormControl<CurrencyCode | null>({ value: null, disabled: true }, [Validators.required]),
      initial_balance: new FormControl({ value: null, disabled: true }, [Validators.required]),
      description: new FormControl({ value: null, disabled: true }, [Validators.required])
    })
  }

  /**
   * Sends the value to be saved in the indexedDB table
   */
  public async saveAccount() {
    this.accountForm.markAllAsTouched()
    if(this.accountForm.invalid) {
      this.errorMessage = 'ACCOUNTS.MESSAGES.REQUIRED_ERROR'
      this.error = true
      return
    }

    const account = AccountMapper.fromForm(
          this.accountForm.getRawValue(),
          this.isEditing ? this.data.account : undefined
        )

    try {
      if (this.isEditing) await this.updateAccount(account)
      else await this.createAccount(account)

      this.accountForm.reset()
      this.dialogRef.close({success: true})
    }
    catch (error) {
      console.warn("Error saving account", error)
      this.dialogRef.close({success: false})
    }
  }

  /**
   * It creates the account
   * @param account account to be created
   */
  private async createAccount(account: IAccount) {
    await this.accountService.createAccount(account)
  }

  /**
   * It updates the account
   * @param account account to be updated
   */
  private async updateAccount(account: IAccount) {
    const original = this.data.account

    await this.accountService.updateAccount({
      ...account,
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
    return !!this.data?.account
  }
  /**
   * Formats the amount entered to add decimal point and 2 decimal positions
   */
  formatAmount() {
    const value = this.accountForm.get('initial_balance')?.value;
    if(!value) return

    const formatted = Number(value).toFixed(2);
    this.accountForm.get('initial_balance')?.setValue(formatted, { emitEvent: false });
  }
}
