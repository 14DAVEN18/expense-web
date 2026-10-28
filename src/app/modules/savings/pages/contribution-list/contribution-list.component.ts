import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contribution-list',
  imports: [
    MatButtonModule, MatTooltipModule, MatIconModule,
    TranslatePipe
  ],
  templateUrl: './contribution-list.component.html',
  styleUrl: './contribution-list.component.sass'
})
export class ContributionListComponent {

  /**
     * Opens a modal for saving creation
     * @param enterAnimationDuration string that defines the duration of the opening animation of the modal
     * @param exitAnimationDuration string that defines the duration of the closing  animation of the modal
     */
    public openCreationModal(enterAnimationDuration: string, exitAnimationDuration: string) {
      // const dialogRef = this.dialog.open(SavingsComponent, {
      //   maxHeight: '80vh',
      //   minHeight: '60vh',
      //   width: '45vw',
      //   enterAnimationDuration,
      //   exitAnimationDuration
      // })
  
      // dialogRef.afterClosed().subscribe(async result => {
      //   if(!result) return
        
      //   if(result.success) {
      //     this.toastService.showSuccess('SAVINGS.MESSAGES.CREATION_SUCCESS')
      //     await this.initialize()
      //   } 
      //   else this.toastService.showError('SAVINGS.MESSAGES.CREATION_ERROR')
      // })
    }

    public exportCSV() {
      
    }
}
