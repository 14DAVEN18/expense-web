import { Injectable } from '@angular/core';
import { IAccount } from '@modules/accounts/interfaces/accounts';
import { ICategory } from '@modules/administration/interfaces/category';
import { IContribution } from '@modules/savings/interfaces/contribution.interfaces';
import { ISaving } from '@modules/savings/interfaces/savings.interface';
import { ISetting } from '@modules/settings/interfaces/settings';
import { ITransaction } from '@modules/transactions/interfaces/transactions';
import { DateUtil } from '@shared/utils/date.util';
import Dexie, { Table } from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTrackerDbService extends Dexie {
  accounts!: Table<IAccount>
  transactions!: Table<ITransaction>
  savings!: Table<ISaving, number>
  contributions!: Table<IContribution, number>
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

    this.version(5).stores({
      accounts: '++id, date, name, type, currency_code',
      transactions: '++id, date, type, amount, category_id, source_account_id, destination_account_id',
      savings: '++id, account_id, saving_plan_type, active, completed',
      categories: '++id, name, type',
      settings: '&key'
    })

    this.version(6).stores({
      accounts: '++id, date, name, type, currency_code',
      transactions: '++id, date, type, amount, category_id, source_account_id, destination_account_id',
      savings: '++id, account_id, saving_plan_type, active, completed',
      contributions: '++id, saving_id, amount, date',
      categories: '++id, name, type',
      settings: '&key'
    })
  }
}