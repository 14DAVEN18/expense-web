import { Injectable } from '@angular/core';
import { ExpenseTrackerDbService } from '../../../local/services/expense-tracker-db.service';
import { DateUtil } from '@shared/utils/date.util';
import { IContribution } from '../interfaces/contribution.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {

  constructor(private readonly expensesWebDb: ExpenseTrackerDbService) { }

  /**
   * It creates a new contribution
   * @param contribution contribution to be created
   */
  public async createContribution(contribution: IContribution) {
    return this.expensesWebDb.contributions.add(contribution)    
  }

  /**
   * It updates a contribution
   * @param contribution the  contribution to be updated
   */
  public async updateContribution(contribution: IContribution) {
    if(!contribution.id) {
      throw new Error("contribution ID is required to update a contribution")
    }

    return this.expensesWebDb.contributions.update(
      contribution.id,
      contribution
    )
  }

  /**
   * It deletes (disables) a contribution
   * @param id ID of the contribution to delete
   */
//   public async disableContribution(id: number) {
//     return this.expensesWebDb.contributions.update(id, {
//       active: false,
//       updated_at: DateUtil.currentTimeStamp()
//     })
//   }

  /**
   * Retrieves the existing contributions
   */
  public async getContributions() {
    return this.expensesWebDb.contributions.toArray()
  }

  /**
   * Exports the existing contributions to a CSV file
   */
  public async exportContributionsToCSV() {
    const contributions = await this.expensesWebDb.contributions.toArray()

    const headers = [
        'id',
        'saving_id',
        'date',
        'amount',
        'active',
        'created_at',
        'updated_at'
    ]

    const rows = contributions.map(contribution => [
      contribution.id,
      contribution.saving_id,
      contribution.date,
      contribution.amount,
      contribution.active,
      contribution.created_at,
      contribution.updated_at
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
    
    const fileName = `contributions-${year}-${month}-${day}-${hours}-${minutes}.csv`;

    a.download = fileName;
    
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
