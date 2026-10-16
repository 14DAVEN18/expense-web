import { Injectable } from '@angular/core';
import { ExpenseTrackerDbService } from '../../../local/services/expense-tracker-db.service';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private readonly expensesWebDb: ExpenseTrackerDbService) { }

}
