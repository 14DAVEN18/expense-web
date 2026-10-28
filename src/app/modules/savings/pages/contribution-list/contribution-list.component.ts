import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContributionsComponent } from '@modules/savings/components/contributions/contributions.component';
import { TranslatePipe } from '@ngx-translate/core';
import { FiltersComponent } from '@shared/components/filters/filters.component';
import { TableComponent } from '@shared/components/table/table.component';
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
      maxHeight: '80vh',
      minHeight: '60vh',
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
