import { Injectable } from '@angular/core';
import { ExpenseTrackerDbService } from '../../../local/services/expense-tracker-db.service';
import { IAccount } from '../interfaces/accounts';
import { DateUtil } from '@shared/utils/date.util';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private readonly expensesWebDb: ExpenseTrackerDbService) { }
  
    public async saveAccount(account: IAccount) {
      return this.expensesWebDb.accounts.add(account)    
    }
  
    public async getAccounts() {
      return this.expensesWebDb.accounts.toArray()
    }
  
    public async exportAccountsToCSV() {
      const accounts = await this.expensesWebDb.accounts.toArray()
  
      const headers = [ 'id', 'created_at', 'name', 'type', 'currency', 'initial_balance', 'description', 'active' ]
  
      const rows = accounts.map(account => [
        account.id,
        account.created_at,
        account.name,
        account.type,
        account.currency,
        account.initial_balance,
        account.description,
        account.active
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
      
      const fileName = `accounts-${year}-${month}-${day}-${hours}-${minutes}.csv`;
  
      a.download = fileName;
      a.click()
      window.URL.revokeObjectURL(url)
    }
}
