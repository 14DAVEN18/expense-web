import { DatePipe } from "@angular/common";
import { IAccount, IAccountFormModel } from "@modules/accounts/interfaces/accounts";

export class AccountMapper {
    static fromForm(expense: IAccountFormModel) {
        const newAccount: IAccount = {
            created_at: AccountMapper.dateToString(expense.created_at),
            name: expense.name,
            type: expense.type,
            currency: expense.currency,
            initial_balance: expense.initial_balance,
            description: expense.description,
            active: expense.active
        }
        return newAccount
    }

    static dateToString(date?: Date): string {
        const targetDate = date ?? new Date();

        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');

        return `${year}/${month}/${day}`;
    }
}