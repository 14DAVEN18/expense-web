export interface IAccount {
    id?: string
    name: string
    type: string
    currency: string
    initial_balance: number
    description: string
    active: boolean
    created_at: string
}

export interface IAccountFormModel {
    created_at: Date
    name: string
    type: string
    currency: string
    initial_balance: number
    description: string
    active: boolean
}