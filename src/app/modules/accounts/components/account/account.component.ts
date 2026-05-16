import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { IAccountType, ICurrency } from '@modules/administration/interfaces/creation-type';
import { AdministrationService } from '@modules/administration/services/administration.service';

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
    ReactiveFormsModule
  ],
  providers: [ provideNativeDateAdapter() ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass'
})
export class AccountComponent implements OnInit, AfterViewInit {

  // ******************************* PROPERTIES *******************************
  public accountForm!: FormGroup
  public accountTypes: IAccountType[] = []
  public currencies: ICurrency[] = []
  public row!: IAccount

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IAccount, 
    public dialogRef: MatDialogRef<AccountComponent>,
    private readonly fb: FormBuilder,
    private readonly administrationService: AdministrationService,
    private readonly accountService: AccountsService
  ) {
    this.row = data
  }

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.getAccountTypes()
    this.getCurrencies()
    this.createAccountForm()
  }

  ngAfterViewInit(): void {
    this.accountForm.enable()
  }

  // ******************************* MAIN METHODS *******************************
  /**
   * Fetches the existing account types
   */
  private async getAccountTypes() {
    this.accountTypes = await this.administrationService.getAccountTypes()
  }

  private async getCurrencies() {
    this.currencies = await this.administrationService.getCurrencies()
  }

  /**
   * Creates the fields for the account form
   */
  private createAccountForm() {
    this.accountForm = this.fb.group({
      created_at: new FormControl({ value: null, disabled: true }),
      name: new FormControl({ value: null, disabled: true }),
      type_id: new FormControl({ value: null, disabled: true }),
      currency_code: new FormControl({ value: null, disabled: true }),
      initial_balance: new FormControl({ value: null, disabled: true }),
      description: new FormControl({ value: null, disabled: true }),
      active: new FormControl({ value: true, disabled: true })
    })
  }

  /**
   * Sends the value to be saved in the indexedDB table
   */
  public async saveAccount() {
    try {
      const formValue = this.accountForm.getRawValue()
      const account: IAccount = AccountMapper.fromForm(formValue, this.row)

      await this.accountService.saveAccount(account)
      this.accountForm.reset()
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
