export interface IAccountType {
    id?: number
    name: string
    description: string
    created_at: string
    updated_at?: string
}

export interface IAccountTypeFormModel {
    created_at?: Date
    name: string
    description: string
    updated_at?: Date
}

export interface ITransactionType {
    id?: number
    name: string
    description: string
    created_at: string
    updated_at?: string
}

export interface ITransactionTypeFormModel {
    created_at?: Date
    name: string
    description: string
    updated_at?: Date
}

export interface ICurrency {
    id?: number
    code: string
    name: string
    symbol: string
    description: string
    created_at: string
    updated_at?: string
}

export interface ICurrencyFormModel {
    code: string
    name: string
    symbol: string
    description: string
    created_at?: Date
    updated_at?: Date
}