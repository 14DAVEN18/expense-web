import { AccountType } from "../../../local/constants/account-type"

export interface IAccount {
    id?: number
    date: string
    name: string
    type: AccountType
    currency_code: string
    initial_balance: number
    description: string
    active: boolean
    created_at: string,
    updated_at?: string
}

export interface IAccountDisplay extends IAccount {
    current_balance: number
}

export interface IAccountFormModel {
    date: Date
    name: string
    type: AccountType
    currency_code: string
    initial_balance: string
    description: string
}