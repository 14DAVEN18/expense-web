import { ITransaction, ITransactionFormModel } from "../interfaces/transactions";
import { DateUtil } from "@shared/utils/date.util";

export class TransactionMapper {
    static fromForm(transaction: ITransactionFormModel) {
        const newTransaction: ITransaction = {
            transaction_type_id: Number(transaction.transaction_type_id),
            date: DateUtil.dateToString(transaction.date),
            amount: Number(transaction.amount),
            description: transaction.description.trim().toUpperCase(),
            source_account_id: Number(transaction.source_account_id),
            destination_account_id: transaction.destination_account_id
                ? Number(transaction.destination_account_id)
                : null
        }
        return newTransaction
    }
}