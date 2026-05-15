import { Injectable } from '@angular/core';
import { ExpenseTrackerDbService } from '../../../local/services/expense-tracker-db.service';
import { IAccountType, ICurrency, ITransactionType } from '../interfaces/creation-type';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private readonly expensesWebDb: ExpenseTrackerDbService) { }

  public getAccountTypes() {
    return this.expensesWebDb.account_types.toArray()
  }

  public getTransactionTypes() {
    return this.expensesWebDb.transaction_types.toArray()
  }

  public getCurrencies() {
    return this.expensesWebDb.currencies.toArray()
  }

  public async saveAccountType(accountType: IAccountType) {
    return this.expensesWebDb.account_types.add(accountType)    
  }

  public async saveTransactionType(transactionType: ITransactionType) {
    return this.expensesWebDb.transaction_types.add(transactionType)
  }

  public async saveCurrency(currency: ICurrency) {
    return this.expensesWebDb.currencies.add(currency)
  }
}
