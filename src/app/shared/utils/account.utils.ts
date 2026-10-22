import { IAccount, IAccountDisplay } from "@modules/accounts/interfaces/accounts";
import { ITransaction } from "@modules/transactions/interfaces/transactions";

export class AccountUtil {
    static calculateAccountBalance(account: IAccount, transactions: ITransaction[], excludeTransactionId?: number): number {
        return transactions.reduce((balance, transaction) => {
            if (!transaction.active) return balance

            if (excludeTransactionId && transaction.id === excludeTransactionId) return balance

            const amount = Number(transaction.amount)
            if (!Number.isFinite(amount)) return balance

            switch (transaction.type) {
                case 'INCOME':
                    if (transaction.source_account_id === account.id) balance += amount
                    break
                case 'EXPENSE':
                    if (transaction.source_account_id === account.id) balance -= amount
                    break
                case 'TRANSFER':
                    if (transaction.source_account_id === account.id) balance -= amount
                    if (transaction.destination_account_id === account.id) balance += amount
                    break
            }

            return balance
        }, Number(account.initial_balance))
    }

    static calculateBalance(accounts: IAccount[], transactions: ITransaction[]): IAccountDisplay[] {
        return accounts.map(account => ({
            ...account,
            current_balance: this.calculateAccountBalance(
            account,
            transactions
            )
        }))
    }

    static getResultingBalance(currentBalance: number, amount: number) {
        return currentBalance - amount
    }
}