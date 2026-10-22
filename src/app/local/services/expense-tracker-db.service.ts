import { Injectable } from '@angular/core';
import { IAccount } from '@modules/accounts/interfaces/accounts';
import { ICategory } from '@modules/administration/interfaces/category';
import { ISetting } from '@modules/settings/interfaces/settings';
import { ITransaction } from '@modules/transactions/interfaces/transactions';
import { DateUtil } from '@shared/utils/date.util';
import Dexie, { Table } from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTrackerDbService extends Dexie {
  transactions!: Table<ITransaction>
  accounts!: Table<IAccount>
  categories!: Table<ICategory>
  settings!: Table<ISetting>


  constructor() {
    super('ExpenseWebDatabase')
    
    this.version(2).stores({
      transactions: '++id, date',
      accounts: '++id, date, name',
      categories: '++id, date, name',
      settings: '&key'
    })

    this.version(3).stores({
      transactions: '++id, date, type, amount, category_id, source_account_id, destination_account_id',
      accounts: '++id, name, type, currency_code',
      categories: '++id, name, type',
      settings: '&key'
    }).upgrade(tx => {
      return tx
        .table('transactions')
        .toCollection()
        .modify(transaction => {
          transaction.category_id = null
        })
    })

    this.version(4).stores({
      transactions: '++id, date, type, amount, category_id, source_account_id, destination_account_id',
      accounts: '++id, date, name, type, currency_code',
      categories: '++id, name, type',
      settings: '&key'
    }).upgrade(tx => {
      return tx
        .table('accounts')
        .toCollection()
        .modify(account => {
          account.date = account.created_at
            ? DateUtil.dateToString(new Date(account.created_at))
            : DateUtil.dateToString(new Date())
        })
    })
  }
}