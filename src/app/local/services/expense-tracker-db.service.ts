import { Injectable } from '@angular/core';
import { IAccount } from '@modules/accounts/interfaces/accounts';
import { IAccountType, ICurrency, ITransactionType } from '@modules/administration/interfaces/creation-type';
import { ITransaction } from '@modules/transactions/interfaces/transactions';
import Dexie, { Table } from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTrackerDbService extends Dexie {
  transactions!: Table<ITransaction>
  accounts!: Table<IAccount>
  account_types!: Table<IAccountType>
  transaction_types!: Table<ITransactionType>
  currencies!: Table<ICurrency>

  constructor() {
    super('ExpenseWebDatabase')

    this.version(1).stores({
      transactions: '++id, date, category',
      accounts: '++id, date, name',
      account_types: '++id',
      transaction_types: '++id',
      currencies: '++id'
    })
  }
}