import { Injectable } from '@angular/core';
import { ExpenseTrackerDbService } from '../../../local/services/expense-tracker-db.service';
import { ICategory } from '../interfaces/category'; 

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private readonly expensesWebDb: ExpenseTrackerDbService) { }

  /**
   * It creates a new category
   * @param transaction category to be created
   */
  public async createCategory(category: ICategory) {
    return await this.expensesWebDb.categories.add(category)    
  }

  /**
   * It updates a category
   * @param category the category to be updated
   */
  public async updateCategory(category: ICategory) {
    if(!category.id) {
      throw new Error("Category ID is required to update a category")
    }

    return this.expensesWebDb.categories.update(
      category.id,
      category
    )
  }

  /**
   * Retrieves the existing categories
   */
  public async getCategories() {
    return await this.expensesWebDb.categories.toArray()
  }
}
