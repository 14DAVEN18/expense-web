import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContributionsComponent } from '@modules/savings/components/contributions/contributions.component';
import { IContributionDisplay } from '@modules/savings/interfaces/contribution.interfaces';
import { ISaving } from '@modules/savings/interfaces/savings.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { FiltersComponent } from '@shared/components/filters/filters.component';
import { TableComponent } from '@shared/components/table/table.component';
import { PaginatorSize } from '@shared/components/table/types/paginator';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-contribution-list',
  imports: [
    CommonModule,
    MatButtonModule, MatTooltipModule, MatIconModule,
    FiltersComponent, TableComponent,
    TranslatePipe
  ],
  templateUrl: './contribution-list.component.html',
  styleUrl: './contribution-list.component.sass'
})
export class ContributionListComponent {
  // ******************************* TABLE RELATED PROPERTIES *******************************
    public realColumnNames: string[] = ['date', 'associated_saving_name', 'amount']
    public displayHeaders: string[] = [
      'SAVINGS.COLUMNS.DATE',
      'SAVINGS.COLUMNS.ASSOCIATED_ACCOUNT_NAME',
      'SAVINGS.COLUMNS.AMOUNT',
    ]
    public shortColumns: string[] = ['date', 'amount']
    public savings: ISaving[] = []
    public data: IContributionDisplay[] = []
    public pageSize: PaginatorSize = 10
  
    // ******************************* FILTER RELATED PROPERTIES *******************************
    public filterParameters: string[] = [
      'SAVINGS.COLUMNS.NAME',
      'SAVINGS.COLUMNS.ASSOCIATED_ACCOUNT_NAME',
      'SAVINGS.COLUMNS.DESCRIPTION'
    ]
    
    public showActive: boolean = true
    public searchValue: string = ''
    public searchColumns: string[] = ['date', 'associated_saving_name', 'amount']

  // ******************************* PROPERTIES *******************************
  public isLoadingSavings: boolean = false

  constructor(
    private readonly dialog: MatDialog,
    private readonly toastService: ToastService
  ) {

  }

  // ******************************* MAIN METHODS *******************************
  private async initialize() {
    // this.isLoadingSavings = true;

    // await Promise.all([
    //   this.getSavings(),
    //   this.getAccounts()
    // ]);

    // this.mapNames()
    
    // this.isLoadingSavings = false;
  }

  /**
   * Opens a modal for saving creation
   * @param enterAnimationDuration string that defines the duration of the opening animation of the modal
   * @param exitAnimationDuration string that defines the duration of the closing  animation of the modal
   */
  public openCreationModal(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(ContributionsComponent, {
      maxHeight: '60vh',
      minHeight: '30vh',
      width: '45vw',
      enterAnimationDuration,
      exitAnimationDuration
    })

    dialogRef.afterClosed().subscribe(async result => {
      if(!result) return
      
      if(result.success) {
        this.toastService.showSuccess('SAVINGS.MESSAGES.CREATION_SUCCESS')
        await this.initialize()
      } 
      else this.toastService.showError('SAVINGS.MESSAGES.CREATION_ERROR')
    })
  }

  public exportCSV() {
    
  }
}
