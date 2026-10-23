import { Injectable } from '@angular/core';
import { AccountsService } from '@modules/accounts/services/accounts.service';
import { TransactionsService } from '@modules/transactions/services/transactions.service';
import { IDashboardFilters, IDashboardSummary } from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly accountService: AccountsService
  ) { }

  // ******************************* MAIN METHODS *******************************
  public async getMonthlySummary(filters: IDashboardFilters): Promise<IDashboardSummary> {
    const [transactions, accounts] = await Promise.all([
      this.transactionsService.getTransactions(),
      this.accountService.getAccounts()
    ])

    const accountIds = accounts
      .filter(account => account.currency_code === filters.currencyCode)
      .map(account => account.id)

    const transactionsInPeriod = transactions.filter(transaction => {
      if (!transaction.active) return false
      if (!accountIds.includes(transaction.source_account_id)) return false;

      const [year, month] = transaction.date.split('/').map(Number)

      return (year === filters.year && month === filters.month)
    })

    const income = transactionsInPeriod
      .filter(transaction => transaction.type === 'INCOME')
      .reduce((total, transaction) => total + transaction.amount, 0)

    const expenses = transactionsInPeriod
      .filter(transaction => transaction.type === 'EXPENSE')
      .reduce((total, transaction) => total + transaction.amount, 0)

    return {
      income,
      expenses,
      netFlow: income - expenses
    }
  }
}
