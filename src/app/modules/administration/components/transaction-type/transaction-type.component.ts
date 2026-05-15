import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ITransactionType } from '@modules/administration/interfaces/creation-type';
import { TransactionTypeMapper } from '@modules/administration/mappers/transaction-type.mapper';
import { AdministrationService } from '@modules/administration/services/administration.service';

@Component({
  selector: 'app-transaction-type',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatDividerModule,
    ReactiveFormsModule
  ],
  providers: [ provideNativeDateAdapter() ],
  templateUrl: './transaction-type.component.html',
  styleUrl: './transaction-type.component.sass'
})
export class TransactionTypeComponent implements OnInit, AfterViewInit {

  // ******************************* PROPERTIES *******************************
  public transactionTypeForm!: FormGroup
  public creationMode: boolean = false

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    public dialogRef: MatDialogRef<TransactionTypeComponent>,
    private readonly fb: FormBuilder,
    private readonly administrationService: AdministrationService)
  {
    this.creationMode = data.creationMode
  }

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.createAccountTypeForm()
  }

  ngAfterViewInit(): void {
    this.transactionTypeForm.enable()
  }

  // ******************************* MAIN METHODS *******************************
  private createAccountTypeForm() {
    this.transactionTypeForm = this.fb.group({
      created_at: new FormControl({value: null, disabled: true}),
      name: new FormControl({value: null, disabled: true}),
      description: new FormControl({value: null, disabled: true}),
      update_at: new FormControl({value: null, disabled: true})
    })
  }
  /**
   * Sends the account type data to be saved in the indexedDB table
   */
  public async saveTransactionType() {
    if(this.creationMode) this.transactionTypeForm.get('created_at')?.setValue(new Date)

    try {
      const formValue = this.transactionTypeForm.value
      const accountType: ITransactionType = TransactionTypeMapper.fromForm(formValue)

      await this.administrationService.saveTransactionType(accountType)
      this.transactionTypeForm.reset()
      this.dialogRef.close({success: true})
    }
    catch (error) {
      console.warn("Error saving account type", error)
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
}
