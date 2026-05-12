export interface ITransaction {
    id?: string
    type: string
    date: string
    amount: number
    description: string
    source: string
}

export interface ITransactionFormModel {
    type: string
    date: Date
    amount: number
    description: string
    source: string
}