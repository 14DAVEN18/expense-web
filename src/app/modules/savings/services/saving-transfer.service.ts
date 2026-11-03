import { Injectable } from '@angular/core';
import { ISavingTransfer } from '../interfaces/saving-transfer.interface';
import { ExpenseTrackerDbService } from '../../../local/services/expense-tracker-db.service';
import { DateUtil } from '@shared/utils/date.util';

@Injectable({
  providedIn: 'root'
})
export class SavingTransferService {

  constructor(private readonly expensesWebDb: ExpenseTrackerDbService) { }

  /**
   * It creates a new saving transfer
   * @param savingTransfer saving transfer to be created
   */
  public async createSavingTransfer(savingTransfer: ISavingTransfer) {
    return await this.expensesWebDb.savingTransfers.add(savingTransfer)    
  }

  /**
   * It updates a saving transfer
   * @param savingTransfer the saving transfer to be updated
   */
  public async updateSavingTransfer(savingTransfer: ISavingTransfer) {
    if(!savingTransfer.id) {
      throw new Error("saving transfer ID is required to update a saving transfer")
    }

    return this.expensesWebDb.savingTransfers.update(
      savingTransfer.id,
      savingTransfer
    )
  }

  /**
   * It deletes (disables) a saving transfer
   * @param id ID of the saving transfer to delete
   */
  public async disableSavingTransfer(id: number) {
    return this.expensesWebDb.savingTransfers.update(id, {
      active: false,
      updated_at: DateUtil.currentTimeStamp()
    })
  }

  /**
   * Retrieves the existing savings
   */
  public async getSavingTransfers() {
    return this.expensesWebDb.savingTransfers.toArray()
  }

  /**
   * Exports the existing savings to a CSV file
   */
  public async exportSavingTransfersToCSV() {
    const savingTransfers = await this.expensesWebDb.savingTransfers.toArray()

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

    const rows = savingTransfers.map(savingTransfer => [
      savingTransfer.id,
      savingTransfer.date,
      savingTransfer.source_saving_id,
      savingTransfer.destination_saving_id,
      savingTransfer.amount,
      savingTransfer.reason,
      savingTransfer.active,
      savingTransfer.created_at,
      savingTransfer.updated_at ?? ''
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
