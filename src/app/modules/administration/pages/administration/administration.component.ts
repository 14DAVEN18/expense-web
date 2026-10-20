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
import { TranslatePipe } from '@ngx-translate/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ConfirmationModalComponent } from '@shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'our-administration',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltip,
    TableCardComponent,
    TableCardCellDirective,
    TranslatePipe
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

  /**
   * Opens a modal for category edition
   * @param category category object to be loaded in the modal
   */
  public openEditionModal(enterAnimationDuration: string, exitAnimationDuration: string, category: ICategory) {
    const dialogRef = this.dialog.open(CategoryComponent, {
      height: '60vh',
      width: '45vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        category
      }
    })

    dialogRef.afterClosed().subscribe(async result => {
      if(!result) return

      if(result.success) {
        this.toastService.showSuccess('ADMINISTRATION.CATEGORIES.MESSAGES.UPDATE_SUCCESS')
        await this.loadData()
      }
    })
  }

  /**
   * Confirms or Rejects the deletion of a transaction
   * @param transaction the transaction to be deleted
   */
  public confirmDeletion(enterAnimationDuration: string, exitAnimationDuration: string, category: ICategory) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      height: '30vh',
      width: '50vw',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        title: 'ADMINISTRATION.CATEGORIES.DELETE.TITLE',
        message: 'ADMINISTRATION.CATEGORIES.DELETE.MESSAGE',
        messageParams: {
          name: category.name
        }
      }
    })

    dialogRef.afterClosed().subscribe(async confirmed => {
      if(!confirmed) return

      await this.disableCategory(category)
    })
  }

  /**
   * Disables a category
   * @param category category to be disabled
   */
  private async disableCategory(category: ICategory) {
    if (!category.id) return

    try {
      await this.administrationService.disableCategory(category?.id)
      this.toastService.showSuccess('TRANSACTIONS.MESSAGES.DISABLE_SUCCESS')
      await this.loadData()
    }
    catch (error) {
      console.warn("Error disabling transaction", error)
      this.toastService.showError('TRANSACTIONS.MESSAGES.DISABLE_ERROR')
    }
  }

  /**
   * Exports categories to a CSV file
   */
  public exportCategoriesToCSV() {
    this.administrationService.exportCategoriesToCSV()
  }
}