import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ConfirmationModalData } from './interfaces/confirmation-modal.interface';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-modal',
  imports: [ MatIconModule, MatDividerModule, MatButtonModule, TranslatePipe ],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.sass'
})
export class ConfirmationModalComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationModalData,
    private dialogRef: MatDialogRef<ConfirmationModalComponent>
  ) {
    console.log(this.data.messageParams)
  }

  // ******************************* MAIN METHODS *******************************
  /**
   * Closes the modal with negative response
   */
  public cancel() {
    this.dialogRef.close(false)
  }

  /**
   * Closes the modal with affirmative response
   */
  public confirm() {
    this.dialogRef.close(true)
  }
}
