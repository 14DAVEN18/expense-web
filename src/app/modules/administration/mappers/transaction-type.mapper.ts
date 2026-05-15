import { IAccountType, IAccountTypeFormModel } from "../interfaces/creation-type";

export class TransactionTypeMapper {
    static fromForm(transactionType: IAccountTypeFormModel) {
        const newTransactionType: IAccountType = {
            created_at: TransactionTypeMapper.dateToString(transactionType.created_at),
            name: transactionType.name.toUpperCase(),
            description: transactionType.description.toUpperCase(),
            updated_at: transactionType.updated_at ? TransactionTypeMapper.dateToString(transactionType.updated_at) : ''
        }
        return newTransactionType
    }

    static dateToString(date?: Date): string {
        const targetDate = date ?? new Date();

        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');

        const hours = String(targetDate.getHours()).padStart(2, '0');
        const minutes = String(targetDate.getMinutes()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }
}