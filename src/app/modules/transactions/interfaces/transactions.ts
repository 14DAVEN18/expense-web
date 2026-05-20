export interface ITransaction {
    id?: string
    transaction_type_id: number
    date: string
    amount: number
    description: string
    source_account_id: number
    destination_account_id: number 
}

export interface ITransactionDisplay extends ITransaction {
    source_account_name: string
    destination_account_name: string
    transaction_type_name: string
}

export interface ITransactionFormModel {
    transaction_type_id: number
    date: Date
    amount: number
    description: string
    source_account_id: number
    destination_account_id: number
}