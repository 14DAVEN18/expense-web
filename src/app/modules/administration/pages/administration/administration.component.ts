import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ICategory } from '@modules/administration/interfaces/creation-type';
import { TableCardComponent } from '@shared/components/table-card/table-card.component';
import { CATEGORIES_BUTTONS, CATEGORIES_COLUMN_NAMES, CATEGORIES_REAL_NAMES } from '@modules/administration/constants/categories';
import { IButton } from '@shared/components/table-card/interfaces/table-card-button.interface';
import { AdministrationService } from '@modules/administration/services/administration.service';

@Component({
  selector: 'our-administration',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    TableCardComponent
  ],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.sass'
})
export class AdministrationComponent implements OnInit {

  // ******************************* PROPERTIES *******************************
  public categoryColumns: string[] = CATEGORIES_COLUMN_NAMES
  public categoryNames: string[] = CATEGORIES_REAL_NAMES
  public categoryButtons: IButton[] = CATEGORIES_BUTTONS
  public categories: ICategory[] = []
  public loadingCategories: boolean = false

  constructor(
    private readonly administrationService: AdministrationService
  ) { }

  // ******************************* HOOKS *******************************
  ngOnInit(): void {
  }

  // ******************************* MAIN METHODS *******************************
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
    this.openCategoryModal()
  }

  /**
   * Opens the modal for category
   */
  public openCategoryModal() {
    console.log("create category")
  }
}