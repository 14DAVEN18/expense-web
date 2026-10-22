import { Injectable } from '@angular/core';
import { ExpenseTrackerDbService } from '../../../local/services/expense-tracker-db.service';
import { IAccount } from '../interfaces/accounts';
import { DateUtil } from '@shared/utils/date.util';
import { AccountUtil } from '@shared/utils/account.utils';
import { TransactionsService } from '@modules/transactions/services/transactions.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(
    private readonly expensesWebDb: ExpenseTrackerDbService,
    private readonly transactionsService: TransactionsService
  ) { }
  
  /**
   * Retrieves the existing accounts
   */
  public async getAccounts() {
    return this.expensesWebDb.accounts.toArray()
  }

  /**
   * Retrieves a single account
   * @param id id of the account to be retrieved
   */
  public async getAccount(id: number): Promise<IAccount | undefined> {
    return await this.expensesWebDb.accounts.get(id)
  }

  /**
   * Retrieves the balance of a given account
   * @param accountId account id to be retrieved
   * @returns Promise of type number with the balance of the requested account
   */
  public async getCurrentBalance(accountId: number, excludeTransactionId?: number): Promise<number> {
    const account = await this.getAccount(accountId);
    const transactions = await this.transactionsService.getTransactions();

    if (!account) throw new Error(`Account ${accountId} not found`)

    return AccountUtil.calculateAccountBalance(account, transactions, excludeTransactionId);
  }

  /**
   * It creates a new account
   * @param account account to be created
   */
  public async createAccount(account: IAccount) {
    return this.expensesWebDb.accounts.put(account)    
  }

  /**
   * It updates an account
   * @param account the account to be updated
   */
  public async updateAccount(account: IAccount) {
    if(!account.id) {
      throw new Error("Account ID is required to update a transaction")
    }

    return this.expensesWebDb.accounts.update(
      account.id,
      account
    )
  }

  /**
   * It deletes (disables) an account
   * @param id ID of the account to delete
   */
  public async disableAccount(id: number) {
    return this.expensesWebDb.accounts.update(id, {
      active: false,
      updated_at: DateUtil.currentTimeStamp()
    })
  }

  /**
   * Exports the existing accounts to a CSV file
   */
  public async exportAccountsToCSV() {
    const accounts = await this.expensesWebDb.accounts.toArray()

    const headers = [ 'id', 'name', 'type', 'currency_code', 'initial_balance', 'description', 'created_at', 'updated_at', 'active' ]

    const rows = accounts.map(account => [
      account.id,
      account.name,
      account.type,
      account.currency_code,
      account.initial_balance,
      account.description,
      account.created_at,
      account.updated_at,
      account.active
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
    
    const fileName = `accounts-${year}-${month}-${day}-${hours}-${minutes}.csv`;

    a.download = fileName;
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
