import { Injectable } from '@angular/core';
import { IAccount } from '@modules/accounts/interfaces/accounts';
import { ITransaction } from '@modules/transactions/interfaces/transactions';
import Dexie, { Table } from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTrackerDbService extends Dexie {
  transactions!: Table<ITransaction>
  accounts!: Table<IAccount>

  constructor() {
    super('ExpenseWebDatabase')

    this.version(1).stores({
      transactions: '++id, date, category',
      accounts: '++id, date, name'
    })
  }
}