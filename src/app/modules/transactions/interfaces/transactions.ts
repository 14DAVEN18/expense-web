export interface ITransaction {
    id?: string
    transaction_type_id: string
    date: string
    amount: number
    description: string
    source_account_id: number
    destination_account_id: number 
}

export interface ITransactionFormModel {
    transaction_type_id: string
    date: Date
    amount: number
    description: string
    source_account_id: number
    destination_account_id: number
}