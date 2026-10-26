import { Injectable } from '@angular/core';
import { ExpenseTrackerDbService } from '../../../local/services/expense-tracker-db.service';
import { DateUtil } from '@shared/utils/date.util';
import { ISaving } from '../interfaces/savings.interface';

@Injectable({
  providedIn: 'root'
})
export class SavingService {

  constructor(private readonly expensesWebDb: ExpenseTrackerDbService) { }

  /**
   * It creates a new saving
   * @param saving saving to be created
   */
  public async createSaving(saving: ISaving) {
    return this.expensesWebDb.savings.add(saving)    
  }

  /**
   * It updates a saving
   * @param saving the  saving to be updated
   */
  public async updateSaving(saving: ISaving) {
    if(!saving.id) {
      throw new Error("saving ID is required to update a saving")
    }

    return this.expensesWebDb.savings.update(
      saving.id,
      saving
    )
  }

  /**
   * It deletes (disables) a saving
   * @param id ID of the saving to delete
   */
  public async disableSaving(id: number) {
    return this.expensesWebDb.savings.update(id, {
      active: false,
      updated_at: DateUtil.currentTimeStamp()
    })
  }

  /**
   * Retrieves the existing savings
   */
  public async getSavings() {
    return this.expensesWebDb.savings.toArray()
  }

  /**
   * Exports the existing savings to a CSV file
   */
  public async exportSavingsToCSV() {
    const savings = await this.expensesWebDb.savings.toArray()

    const headers = [
        'id',
        'name',
        'date',
        'account_id',
        'saving_plan_type',
        'contribution_start',
        'target_amount',
        'target_date',
        'contribution_amount',
        'link',
        'description',
        'completed',
        'active',
        'created_at',
        'updated_at'
    ]

    const rows = savings.map(saving => [
      saving.id,
      saving.name,
      saving.date,
      saving.account_id,
      saving.saving_plan_type,
      saving.contribution_start,
      saving.target_amount,
      saving.target_date,
      saving.contribution_amount,
      saving.link,
      saving.description,
      saving.completed,
      saving.active,
      saving.created_at,
      saving.updated_at ?? ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob(
      [csvContent],
      { type: 'text/csv;charset=utf-8;' }
    )

    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url

    const now = new Date();
    const [ year, month, day, hours, minutes] = DateUtil.getDateParts(now)
    
    const fileName = `savings-${year}-${month}-${day}-${hours}-${minutes}.csv`;

    a.download = fileName;
    
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
