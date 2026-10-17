import { Injectable } from '@angular/core';
import { ITransaction } from '../interfaces/transactions';
import { ExpenseTrackerDbService } from '../../../local/services/expense-tracker-db.service';
import { DateUtil } from '@shared/utils/date.util';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private readonly expensesWebDb: ExpenseTrackerDbService) { }

  /**
   * It creates a new transaction
   * @param transaction transaction to be created
   */
  public async createTransaction(transaction: ITransaction) {
    return this.expensesWebDb.transactions.add(transaction)    
  }

  /**
   * It updates a transaction
   * @param transaction the  transaction to be updated
   */
  public async updateTransaction(transaction: ITransaction) {
    if(!transaction.id) {
      throw new Error("Transaction ID is required to update a transaction")
    }

    return this.expensesWebDb.transactions.update(
      transaction.id,
      transaction
    )
  }

  /**
   * It deletes (disables) a transaction
   * @param id ID of the transaction to delete
   */
  public async disableTransaction(id: string) {
    return this.expensesWebDb.transactions.update(id, {
      active: false,
      updated_at: DateUtil.currentTimeStamp()
    })
  }

  /**
   * Retrieves the existing transactions
   */
  public async getTransactions() {
    return this.expensesWebDb.transactions.toArray()
  }

  /**
   * Exports the existing transactions to a CSV file
   */
  public async exportTransactionsToCSV() {
    const transactions = await this.expensesWebDb.transactions.toArray()

    const headers = [ 'id', 'date', 'amount', 'description', 'type', 'source_account_id', 'destination_account_id', 'created_at', 'updated_at' ]

    const rows = transactions.map(transaction => [
      transaction.id,
      transaction.date,
      transaction.amount,
      transaction.description,
      transaction.type,
      transaction.source_account_id,
      transaction.destination_account_id,
      transaction.created_at,
      transaction.updated_at ?? ''
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
    
    const fileName = `transactions-${year}-${month}-${day}-${hours}-${minutes}.csv`;

    a.download = fileName;
    
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
