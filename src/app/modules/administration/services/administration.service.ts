import { Injectable } from '@angular/core';
import { ExpenseTrackerDbService } from '../../../local/services/expense-tracker-db.service';
import { ICategory } from '../interfaces/category'; 
import { DateUtil } from '@shared/utils/date.util';

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

  /**
   * 
   */
  public async exportCategoriesToCSV() {
    const categories = await this.expensesWebDb.categories.toArray()

    const headers = [ 'id', 'type', 'name', 'description', 'active', 'created_at', 'updated_at' ]

    const rows = categories.map(category => [
      category.id,
      category.type,
      category.name,
      category.description,
      category.active,
      category.created_at,
      category.updated_at
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob(
      [ csvContent ],
      { type: 'text/csv;charset=utf-8;' }
    )

    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url

    const now = new Date();
    const [ year, month, day, hours, minutes] = DateUtil.getDateParts(now)
    
    const fileName = `categories-${year}-${month}-${day}-${hours}-${minutes}.csv`;

    a.download = fileName;
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
