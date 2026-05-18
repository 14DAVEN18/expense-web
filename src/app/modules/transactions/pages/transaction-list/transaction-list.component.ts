import { Component, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog';
import { TransactionsComponent } from '@modules/transactions/components/transactions/transactions.component';
import { TransactionsService } from '@modules/transactions/services/transactions.service';
import { ToastService } from '@shared/services/toast.service';
import { ITransaction } from '@modules/transactions/interfaces/transactions';

@Component({
  selector: 'our-expense-list',
  imports: [ MatButtonModule, MatIconModule ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.sass'
})
export class TransactionListComponent implements OnInit {
  // ******************************* PROPERTIES *******************************
  public transactions: ITransaction[] = []

  constructor(
    private readonly dialog: MatDialog,
    private readonly transactionService: TransactionsService,
    private readonly toastService: ToastService
  ) {}

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.getTransactions()
  }

  // ******************************* MAIN METHODS *******************************
  /**
   * Fetches the existing transactions
   */
  private async getTransactions() {
    this.transactions = await this.transactionService.getTransactions()
  }

  /**
   * Opens a modal for transaction creation
   * @param enterAnimationDuration string that defines the duration of the opening animation of the modal
   * @param exitAnimationDuration string that defines the duration of the closing  animation of the modal
   */
  public openCreationModal(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(TransactionsComponent, {
      height: '60vh',
      width: '45vw',
      enterAnimationDuration,
      exitAnimationDuration
    })

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return
      
      if(result.success) {
        this.toastService.showSuccess('The transaction was successfully created')
        this.getTransactions()
      } 
      else this.toastService.showError('There was an error creating the transaction')
    })
  }

  /**
   * Exports all existing transactions in CSV format
   */
  public async exportCSV(): Promise<void> {
    await this.transactionService.exportTransactionsToCSV()
  }
}
