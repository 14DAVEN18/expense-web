import { Injectable } from '@angular/core';
import { ITransaction } from '@modules/expenses/interfaces/transactions';
import Dexie, { Table } from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTrackerDbService extends Dexie {
  transactions!: Table<ITransaction>

  constructor() {
    super('ExpenseWebDatabase')

    this.version(1).stores({
      transactions: '++id, date, category'
    })
  }
}