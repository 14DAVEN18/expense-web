import { TransactionType } from "../../../local/constants/transaction-type"

export interface ITransaction {
    id?: number
    type: TransactionType
    date: string
    amount: number
    description: string
    source_account_id: number
    destination_account_id: number | null
    category_id: number | null
    active: boolean
    created_at: string
    updated_at?: string
}

export interface ITransactionDisplay extends ITransaction {
    source_account_name: string
    destination_account_name: string
    category_name: string
    currency_code: string
}

export interface ITransactionFormModel {
    type: TransactionType
    date: Date
    amount: string
    category_id: number | null
    description: string
    source_account_id: number
    destination_account_id: number
}