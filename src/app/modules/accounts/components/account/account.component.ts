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
  public row!: IAccount

  // ******************************* ERROR HANDLING *******************************
  public creationError: boolean = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IAccount, 
    public dialogRef: MatDialogRef<AccountComponent>,
    private readonly fb: FormBuilder,
    private readonly accountService: AccountsService
  ) {
    this.row = data
  }

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.createAccountForm()
  }

  ngAfterViewInit(): void {
    this.accountForm.enable()
  }

  // ******************************* MAIN METHODS *******************************
  /**
   * Creates the fields for the account form
   */
  private createAccountForm() {
    this.accountForm = this.fb.group({
      created_at: new FormControl({ value: null, disabled: true }, [Validators.required]),
      name: new FormControl({ value: null, disabled: true }, [Validators.required]),
      type: new FormControl<AccountType | null>({ value: null, disabled: true }, [Validators.required]),
      currency_code: new FormControl<CurrencyCode | null>({ value: null, disabled: true }, [Validators.required]),
      initial_balance: new FormControl({ value: null, disabled: true }, [Validators.required]),
      description: new FormControl({ value: null, disabled: true }, [Validators.required]),
      active: new FormControl({ value: true, disabled: true }, [Validators.required])
    })
  }

  /**
   * Sends the value to be saved in the indexedDB table
   */
  public async saveAccount() {
    this.accountForm.markAllAsTouched()
    if(this.accountForm.invalid) {
      this.creationError = true
    }
    try {
      const formValue = this.accountForm.getRawValue()
      const account: IAccount = AccountMapper.fromForm(formValue, this.row)
      await this.accountService.saveAccount(account)
      this.accountForm.reset()
      await this.accountService.getAccounts()
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
    const value = this.accountForm.get('initial_balance')?.value;
    if(!value) return

    const formatted = Number(value).toFixed(2);
    this.accountForm.get('initial_balance')?.setValue(formatted, { emitEvent: false });
  }
}
