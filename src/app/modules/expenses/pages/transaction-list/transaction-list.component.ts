import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TransactionsComponent } from '@modules/expenses/components/transactions.component';
import { TransactionsService } from '@modules/expenses/services/transactions.service';

@Component({
  selector: 'our-expense-list',
  imports: [ MatButtonModule, MatIconModule ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.sass'
})
export class TransactionListComponent {

  constructor(
    private readonly dialog: MatDialog,
    private readonly transactionService: TransactionsService
  ) {}

  public openCreationModal(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(TransactionsComponent, {
      height: '65vh',
      width: '20vw',
      enterAnimationDuration,
      exitAnimationDuration
    })
  }

  public async exportCSV(): Promise<void> {
    await this.transactionService.exportTransactionsToCSV()
  }
}
