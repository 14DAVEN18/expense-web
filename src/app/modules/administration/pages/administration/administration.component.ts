import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TableCardComponent } from '@shared/components/table-card/table-card.component';
import { CATEGORIES_BUTTONS, CATEGORIES_COLUMNS } from '../../../../local/constants/categories';
import { IButton, ITableCardColumn } from '@shared/components/table-card/interfaces/table-card-button.interface';
import { AdministrationService } from '@modules/administration/services/administration.service';
import { ICategory } from '@modules/administration/interfaces/category';
import { MatDialog } from '@angular/material/dialog';
import { CategoryComponent } from '@modules/administration/components/category/category.component';
import { ToastService } from '@shared/services/toast.service';
import { TableCardCellDirective } from '@shared/components/table-card/directives/table-card-cell.directive';

@Component({
  selector: 'our-administration',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    TableCardComponent,
    TableCardCellDirective
  ],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.sass'
})
export class AdministrationComponent implements OnInit {

  // ******************************* PROPERTIES *******************************
  public categoryColumns: ITableCardColumn[] = CATEGORIES_COLUMNS
  public categoryButtons: IButton[] = CATEGORIES_BUTTONS
  public categories: ICategory[] = []
  public loadingCategories: boolean = false

  constructor(
    private readonly dialog: MatDialog,
    private readonly administrationService: AdministrationService,
    private readonly toastService: ToastService
  ) { }

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.loadData()
  }

  // ******************************* MAIN METHODS *******************************
  
  public async loadData() {
    await Promise.all([
      this.getCategories()
    ])
  }

  private async getCategories() {
    this.categories = await this.administrationService.getCategories()
  }

  /**
   * Receives the action from the section's button and routes accordingly
   * @param $event event sent from the table card
   */
  public actionHandler($event: string) {
    const section = $event.split(".")
    if (!section) return
    if (!section[0] || !section[1]) return 

    switch(section[0]) {
      case "category":
        this.handleCategoryAction(section[1])
        break
      default:
        break
    }
  }

  /**
   * Routes the action for categories
   * @param action action to perform
   */
  private handleCategoryAction(action: string) {
    if (!action) return
    switch(action) {
      case "create":
        this.openCategoryModal('1000', '1000')
        break
      case "export":
        this.exportCategoriesToCSV()
        break
    }
    
  }

  /**
   * Opens the modal for category
   */
  public openCategoryModal(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(CategoryComponent, {
      maxHeight: '80vh',
      minHeight: '30vh',
      width: '45vw',
      enterAnimationDuration,
      exitAnimationDuration
    })

    dialogRef.afterClosed().subscribe(async result => {
      if(!result) return
      
      if(result.success) {
        this.toastService.showSuccess('ADMINISTRATION.CATEGORY.MESSAGES.CREATION_SUCCESS')
        await this.loadData()
      } 
      else this.toastService.showError('ADMINISTRATION.CATEGORY.MESSAGES.CREATION_ERROR')
    })
  }

  public exportCategoriesToCSV() {
    this.administrationService.exportCategoriesToCSV()
  }
}