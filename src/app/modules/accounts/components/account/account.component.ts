import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { IType } from '@shared/interfaces/type';
import { CURRENCIES } from '../../../../local/constants/constants';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { IAccount } from '@modules/accounts/interfaces/accounts';
import { AccountMapper } from '@modules/accounts/mappers/account.mapper';
import { AccountsService } from '@modules/accounts/services/accounts.service';

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

  // ******************************* PROVISIONAL PROPERTIES *******************************
  accountTypes: IType[] = [ 
    { value: 1, type: 'cash' },
    { value: 2, type: 'bank' }
  ];

  public CURRENCIES = CURRENCIES

  // ******************************* FORM RELATED PROPERTIES *******************************
  public accountForm!: FormGroup

  constructor(
    public dialogRef: MatDialogRef<AccountComponent>,
    private readonly fb: FormBuilder,
    private readonly accountService: AccountsService
  ) { }

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.accountForm = this.fb.group({
      created_at: new FormControl({ value: null, disabled: true }),
      name: new FormControl({ value: null, disabled: true }),
      type: new FormControl({ value: null, disabled: true }),
      currency: new FormControl({ value: null, disabled: true }),
      initial_balance: new FormControl({ value: null, disabled: true }),
      description: new FormControl({ value: null, disabled: true }),
      active: new FormControl({ value: true, disabled: true })
    })

    this.accountForm.valueChanges.subscribe(() => console.log(this.accountForm.getRawValue()))
  }

  ngAfterViewInit(): void {
    this.accountForm.enable()
  }

  // ******************************* MAIN METHODS *******************************
  /**
   * Sends the value to be saved in the indexedDB table
   */
  public async saveAccount() {
    const formValue = this.accountForm.value
    const account: IAccount = AccountMapper.fromForm(formValue)

    await this.accountService.saveAccount(account)
    this.accountForm.reset()
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
