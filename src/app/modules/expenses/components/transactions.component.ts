import { AfterViewInit, Component, OnInit } from '@angular/core'
import { TransactionsService } from '../services/transactions.service'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { provideNativeDateAdapter } from '@angular/material/core'
import { MatInputModule } from '@angular/material/input'
import { MatDividerModule } from '@angular/material/divider'
import { MatSelectModule } from '@angular/material/select'
import { MatRadioModule } from '@angular/material/radio'
import { ITransaction } from '../interfaces/transactions'
import { TransactionMapper } from '../mappers/transaction.mapper'
import { MatIconModule } from '@angular/material/icon'
import { MatDialogRef } from '@angular/material/dialog'


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
  public readonly sourceOptions: string[] = [
    'spendable money',
    'monthly expenses',
    'that',
    'washing machine'
  ]

  public readonly typeOptions: {value: number, type: string}[] = [
    { value: 1, type: 'expense' },
    { value: 2, type: 'income' }
  ]

  // ******************************* FORM RELATED PROPERTIES *******************************
  public transactionForm!: FormGroup

  constructor(
    public dialogRef: MatDialogRef<TransactionsComponent>,
    private readonly fb: FormBuilder,
    private readonly transactionsService: TransactionsService
  ) {}

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      type: new FormControl({ value: null, disabled: true}),
      date: new FormControl({ value: null, disabled: true}),
      amount: new FormControl({ value: null, disabled: true}),
      description: new FormControl({ value: null, disabled: true }),
      source: new FormControl({ value: null, disabled: true })
    })

    this.transactionForm.valueChanges.subscribe(() => console.log(this.transactionForm.getRawValue()))
  }

  ngAfterViewInit(): void {
    this.transactionForm.enable()
  }

  // ******************************* MAIN METHODS *******************************
  public async saveExpense() {
    const formValue = this.transactionForm.value
    const expense: ITransaction = TransactionMapper.fromForm(formValue)

    await this.transactionsService.saveExpense(expense)
    this.transactionForm.reset()
  }

  // ******************************* HELPERS *******************************
  formatAmount() {
    const value = this.transactionForm.get('amount')?.value;
    if(!value) return

    const formatted = Number(value).toFixed(2);
    this.transactionForm.get('amount')?.setValue(formatted, { emitEvent: false });
  }
}
