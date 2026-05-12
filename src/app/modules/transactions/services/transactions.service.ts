import { Injectable } from '@angular/core';
import { ITransaction } from '../interfaces/transactions';
import { ExpenseTrackerDbService } from '../../../local/services/expense-tracker-db.service';
import { DateUtil } from '@shared/utils/date.util';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private readonly expensesWebDb: ExpenseTrackerDbService) { }

  public async saveTransaction(transaction: ITransaction) {
    return this.expensesWebDb.transactions.add(transaction)    
  }

  public async getTransactions() {
    return this.expensesWebDb.transactions.toArray()
  }

  public async exportTransactionsToCSV() {
    const transactions = await this.expensesWebDb.transactions.toArray()

    const headers = [ 'id', 'date', 'amount', 'description', 'type', 'source' ]

    const rows = transactions.map(transaction => [
      transaction.id,
      transaction.date,
      transaction.amount,
      transaction.description,
      transaction.type,
      transaction.source
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
    a.download = 'transactions.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
