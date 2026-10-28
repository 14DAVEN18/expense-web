import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AccountsService } from '@modules/accounts/services/accounts.service';
import { ISavingContribution } from '@modules/savings/interfaces/savings.interface';
import { SavingService } from '@modules/savings/services/saving.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contributions',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule, MatDatepickerModule, MatSelectModule, MatInputModule, MatIconModule,
    TranslatePipe
  ],
  templateUrl: './contributions.component.html',
  styleUrl: './contributions.component.sass'
})
export class ContributionsComponent {

  public contributionForm!: FormGroup

  public loading: boolean = false

  public maxDate: Date = new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { contribution?: ISavingContribution },
    public dialogRef: MatDialogRef<ContributionsComponent>,
    private readonly fb: FormBuilder,
    private readonly accountService: AccountsService,
    private readonly savingService: SavingService,
  ) {

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
    return !!this.data?.contribution
  } 
}
