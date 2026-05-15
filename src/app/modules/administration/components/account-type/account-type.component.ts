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
import { MatRadioModule } from '@angular/material/radio';
import { IAccountType } from '@modules/administration/interfaces/creation-type';
import { AccountTypeMapper } from '@modules/administration/mappers/account-type.mapper';
import { AdministrationService } from '@modules/administration/services/administration.service';

@Component({
  selector: 'app-account-type',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  providers: [ provideNativeDateAdapter() ],
  templateUrl: './account-type.component.html',
  styleUrl: './account-type.component.sass'
})
export class AccountTypeComponent implements OnInit, AfterViewInit {

  // ******************************* PROPERTIES *******************************
  public accountTypeForm!: FormGroup
  public creationMode: boolean = false

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    public dialogRef: MatDialogRef<AccountTypeComponent>,
    private readonly fb: FormBuilder,
    private readonly administrationService: AdministrationService
  ) {
    this.creationMode = data.creationMode
  }

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.createAccountTypeForm()
  }

  ngAfterViewInit(): void {
    this.accountTypeForm.enable()
  }

  // ******************************* MAIN METHODS *******************************
  private createAccountTypeForm() {
    this.accountTypeForm = this.fb.group({
      created_at: new FormControl({value: null, disabled: true}),
      name: new FormControl({value: null, disabled: true}),
      description: new FormControl({value: null, disabled: true})
    })
  }
  /**
   * Sends the account type data to be saved in the indexedDB table
   */
  public async saveAccountType() {
    if(this.creationMode) this.accountTypeForm.get('created_at')?.setValue(new Date)

    try {
      const formValue = this.accountTypeForm.value
      const account: IAccountType = AccountTypeMapper.fromForm(formValue)

      await this.administrationService.saveAccountType(account)
      this.accountTypeForm.reset()
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
}
