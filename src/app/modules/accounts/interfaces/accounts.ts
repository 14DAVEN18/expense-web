import { AccountType } from "../../../local/constants/account-type"

export interface IAccount {
    id?: number
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
    created_at: Date
    name: string
    type: AccountType
    currency_code: string
    initial_balance: string
    description: string
    active: boolean
}