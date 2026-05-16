export interface IAccount {
    id?: number
    name: string
    type_id: number
    currency_code: string
    initial_balance: number
    description: string
    active: boolean
    created_at: string,
    updated_at?: string
}

export interface IAccountDisplay extends IAccount {
    type_name: string
}

export interface IAccountFormModel {
    created_at: Date
    name: string
    type_id: number
    currency_code: string
    initial_balance: string
    description: string
    active: boolean
}