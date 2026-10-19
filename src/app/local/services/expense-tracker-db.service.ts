import { Injectable } from '@angular/core';
import { IAccount } from '@modules/accounts/interfaces/accounts';
import { ICategory } from '@modules/administration/interfaces/creation-type';
import { ISetting } from '@modules/settings/interfaces/settings';
import { ITransaction } from '@modules/transactions/interfaces/transactions';
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
  }
}