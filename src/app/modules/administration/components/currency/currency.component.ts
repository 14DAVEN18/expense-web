import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ICurrency } from '@modules/administration/interfaces/creation-type';
import { CurrencyMapper } from '@modules/administration/mappers/currency.mapper';
import { AdministrationService } from '@modules/administration/services/administration.service';
import { DateUtil } from '@shared/utils/date.util';

@Component({
  selector: 'app-currency',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormField,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule
  ],
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.sass'
})
export class CurrencyComponent implements OnInit, AfterViewInit{
  // ******************************* PROPERTIES *******************************
  public currencyForm!: FormGroup
  public row!: ICurrency

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    public dialogRef: MatDialogRef<CurrencyComponent>,
    private readonly fb: FormBuilder,
    private readonly administrationService: AdministrationService)
  {
    this.row = data
  }

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.createAccountTypeForm()
  }

  ngAfterViewInit(): void {
    this.currencyForm.enable()
  }

  // ******************************* MAIN METHODS *******************************
  private createAccountTypeForm() {
    this.currencyForm = this.fb.group({
      code: new FormControl({value: this.row?.code ?? null, disabled: true}),
      name: new FormControl({value: this.row?.name ?? null, disabled: true}),
      symbol: new FormControl({value: this.row?.symbol ?? null, disabled: true}), 
      description: new FormControl({value: this.row?.description ?? null, disabled: true}),
    })
  }
  /**
   * Sends the account type data to be saved in the indexedDB table
   */
  public async saveCurrency() {
    try {
      const formValue = this.currencyForm.getRawValue()
      const currency: ICurrency = {
        ...this.row,
        code: formValue.code.toUpperCase(),
        name: formValue.name.toUpperCase(),
        symbol: formValue.symbol.toUpperCase(),
        description: formValue.description.toUpperCase(),
        created_at: this.row?.created_at ?? DateUtil.dateToString(),
        updated_at: this.row ? DateUtil.dateToString() : ''
      }

      await this.administrationService.saveCurrency(currency)
      this.currencyForm.reset()
      this.dialogRef.close({success: true})
    }
    catch (error) {
      console.warn("Error saving currency", error)
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
