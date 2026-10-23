import { Injectable } from '@angular/core';
import { AccountsService } from '@modules/accounts/services/accounts.service';
import { TransactionsService } from '@modules/transactions/services/transactions.service';
import { IAccountBalance, ICategoryExpense, IDashboardFilters, IDashboardSummary, IMonthlyCashFlow } from '../interfaces/dashboard.interface';
import { AdministrationService } from '@modules/administration/services/administration.service';
import { CurrencyCode } from '../../../local/constants/currencies';
import { AccountUtil } from '@shared/utils/account.utils';
import { ITransactionDisplay } from '@modules/transactions/interfaces/transactions';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private readonly accountService: AccountsService,
    private readonly transactionsService: TransactionsService,
    private readonly administrationService: AdministrationService
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

  public async getTopExpenseCategories(filters: IDashboardFilters): Promise<ICategoryExpense[]> {

    const [accounts, transactions, categories] = await Promise.all([
      this.accountService.getAccounts(),
      this.transactionsService.getTransactions(),
      this.administrationService.getCategories()
    ])

    const accountIds = accounts
      .filter(account => account.currency_code === filters.currencyCode)
      .map(account => account.id)

    const expenses = transactions.filter(transaction => {
      if (!transaction.active) return false
      if (transaction.type !== 'EXPENSE') return false
      if (!accountIds.includes(transaction.source_account_id)) return false

      const [year, month] = transaction.date
        .split('/')
        .map(Number)

      return year === filters.year && month === filters.month
    })

    const totals = new Map<number, number>()

    expenses.forEach(transaction => {
      if (transaction.category_id === null) return

      const current = totals.get(transaction.category_id) ?? 0

      totals.set(
        transaction.category_id,
        current + Number(transaction.amount)
      )
    })

    return [...totals.entries()]
      .map(([categoryId, amount]) => ({
        categoryId,
        categoryName:
          categories.find(category => category.id === categoryId)?.name ?? '-',
        amount
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }


  public async getIncomeVsExpenses(filters: IDashboardFilters): Promise<IMonthlyCashFlow[]> {
    const [transactions, accounts] = await Promise.all([
      this.transactionsService.getTransactions(),
      this.accountService.getAccounts()
    ])

    const accountIds = new Set(
      accounts.filter(account => account.currency_code === filters.currencyCode).map(account => account.id)
    )

    const periods = this.getLastMonths(filters.year, filters.month, 6)

    return periods.map(period => {
      const monthlyTransactions = transactions.filter(transaction => {
        if (!transaction.active) return false
        if (!accountIds.has(transaction.source_account_id)) return false
        if (transaction.type === 'TRANSFER') return false

        const [year, month] = transaction.date.split('/').map(Number)

        return (year === period.year && month === period.month)
      })

      const income = monthlyTransactions
        .filter(transaction => transaction.type === 'INCOME')
        .reduce((total, transaction) => total + Number(transaction.amount), 0)

      const expenses = monthlyTransactions
        .filter(transaction => transaction.type === 'EXPENSE')
        .reduce((total, transaction) => total + Number(transaction.amount), 0)

      return {
        year: period.year,
        month: period.month,
        income,
        expenses
      }
    })
  }


  /**
   * It gets the last N periods before a specific month
   * @param year year of the period
   * @param month month to start
   * @param quantity N of period to get
   * @returns array of { year: number; month: number }
   */
  private getLastMonths(year: number, month: number, quantity: number): { year: number; month: number }[] {
    const periods: { year: number; month: number }[] = []

    for (let i = quantity - 1; i >= 0; i--) {
      const date = new Date(year, month - 1 - i, 1)

      periods.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1
      })
    }

    return periods
  }

  /**
   * Gets accounts with their balance 
   * @param currencyCode currency in which the accounts must be
   * @returns an array of IAccountBalance
   */
  public async getAccountBalances(currencyCode: CurrencyCode): Promise<IAccountBalance[]> {
    const [accounts, transactions] = await Promise.all([
      this.accountService.getAccounts(),
      this.transactionsService.getTransactions()
    ])

    const accountsWithBalance = AccountUtil.calculateBalance(accounts, transactions)

    return accountsWithBalance
      .filter(account => account.active && account.currency_code === currencyCode)
      .map(account => ({
        accountId: account.id!,
        accountName: account.name,
        balance: account.current_balance
      }))
  }

  public async getRecentTransactions(filters: IDashboardFilters, limit: number = 5): Promise<ITransactionDisplay[]> {
    const [transactions, accounts, categories] = await Promise.all([
      this.transactionsService.getTransactions(),
      this.accountService.getAccounts(),
      this.administrationService.getCategories()
    ])

    const accountIds = new Set(accounts
        .filter(account => account.currency_code === filters.currencyCode)
        .map(account => account.id)
    )

    return transactions.filter(transaction => {
      if (!transaction.active) return false
      if (!accountIds.has(transaction.source_account_id)) return false

      const [year, month] = transaction.date.split('/').map(Number)

      return (year === filters.year && month === filters.month)
    })
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
    .map(transaction => ({
      ...transaction,

      source_account_name: accounts.find(account => account.id === transaction.source_account_id )?.name ?? '-',
      destination_account_name: accounts.find(account => account.id === transaction.destination_account_id )?.name ?? '-',
      category_name: categories.find(category => category.id === transaction.category_id )?.name ?? '-',
      currency_code: accounts.find(account => account.id === transaction.source_account_id)?.currency_code ?? filters.currencyCode
    }))
  }
}
