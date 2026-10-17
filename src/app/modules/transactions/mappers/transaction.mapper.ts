import { ITransaction, ITransactionFormModel } from "../interfaces/transactions";
import { DateUtil } from "@shared/utils/date.util";

export class TransactionMapper {
    static fromForm(transaction: ITransactionFormModel, row?: ITransaction) {
        const newTransaction: ITransaction = {
            ...row,
            type: transaction.type,
            date: DateUtil.dateToString(transaction.date),
            amount: Number(transaction.amount),
            description: transaction.description.trim().toUpperCase(),
            source_account_id: Number(transaction.source_account_id),
            destination_account_id: transaction.destination_account_id
                ? Number(transaction.destination_account_id)
                : null,
            active: row?.active ?? true,
            created_at: row?.created_at ?? DateUtil.currentTimeStamp(),
            updated_at: row?.id ? DateUtil.currentTimeStamp() : undefined
        }
        return newTransaction
    }
}