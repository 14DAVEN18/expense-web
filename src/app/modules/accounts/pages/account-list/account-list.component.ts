import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AccountComponent } from '@modules/accounts/components/account/account.component';
import { IAccount } from '@modules/accounts/interfaces/accounts';
import { AccountsService } from '@modules/accounts/services/accounts.service';
import { TableComponent } from '@shared/components/table/table.component';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-account-list',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TableComponent
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.sass'
})
export class AccountListComponent implements OnInit {

  // ******************************* TABLE RELATED PROPERTIES *******************************
  public realColumnNames: string[] = ['active', 'currency', 'created_at', 'name', 'description', 'initial_balance', 'type']
  public displayHeaders: string[] = ['', 'cur', 'created at', 'name', 'description', 'balance', 'type']
  public shortColumns: string[] = ['active', 'currency']
  public data: IAccount[] = []

  // ******************************* OTHER PROPERTIES *******************************
  public isLoadingAccounts: boolean = false

  constructor(
    private readonly dialog: MatDialog,
    private readonly accountService: AccountsService,
    private readonly toastService: ToastService
  ) {}

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.getAccounts()
  }

  // ******************************* MAIN METHODS *******************************
  private async getAccounts() {
    this.isLoadingAccounts = true
    this.data = await this.accountService.getAccounts()
    this.isLoadingAccounts = false
  }

  /**
   * Opens a modal for transaction creation
   * @param enterAnimationDuration string that defines the duration of the opening animation of the modal
   * @param exitAnimationDuration string that defines the duration of the closing  animation of the modal
   */
  public openCreationModal(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(AccountComponent, {
      height: '90vh',
      width: '30vw',
      enterAnimationDuration,
      exitAnimationDuration
    })

    dialogRef.afterClosed().subscribe(success => {
      if(success){
        this.toastService.showSuccess('The account was successfully created')
        this.getAccounts()
      } else
        this.toastService.showError('There was an error creating the account')
    })
  }

  /**
   * Exports the information of all existing accounts in CSV format
   */
  public async exportCSV(): Promise<void> {
    await this.accountService.exportAccountsToCSV()
  }
}
