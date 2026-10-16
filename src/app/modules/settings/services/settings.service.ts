import { Injectable } from '@angular/core';
import { ExpenseTrackerDbService } from '../../../local/services/expense-tracker-db.service';
import { ISetting } from '../interfaces/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private readonly expensesWebDb: ExpenseTrackerDbService) { }

  public getSettings() {
    return this.expensesWebDb.settings.toArray()
  }

  public getSetting(key: string) {
    return this.expensesWebDb.settings.get(key)
  }

  public async saveSettings(setting: ISetting) {
    return this.expensesWebDb.settings.put(setting)    
  }
}
