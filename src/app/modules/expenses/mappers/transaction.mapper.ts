import { DatePipe } from "@angular/common";
import { ITransaction, ITransactionFormModel } from "../interfaces/transactions";

export class TransactionMapper {
    static fromForm(expense: ITransactionFormModel) {
        const newTransaction: ITransaction = {
            type: expense.type,
            date: TransactionMapper.dateToString(expense.date),
            amount: expense.amount,
            description: expense.description,
            source: expense.source
        }
        return newTransaction
    }

    static dateToString(date: Date): string {
        const pipe = new DatePipe('en-US')

        if(!date) {
            const today = new Date();
            const dateOnly = today.toISOString().split('T')[0];
            return dateOnly
        }

        const formatted = pipe.transform(date, 'yyyy/MM/dd')!
        return formatted
    }
}