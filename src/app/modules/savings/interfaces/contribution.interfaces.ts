import { CurrencyCode } from "../../../local/constants/currencies"

export interface IContribution {
    id?: number,
    saving_id: number
    amount: number
    date: string
    active: boolean
    created_at: string
    updated_at?: string
}

export interface IContributionDisplay extends IContribution {
    saving_name: string
    account_name: string
    currency_doe: CurrencyCode
}

export interface IContributionFormModel {
    saving_id: number
    amount: number
    date: Date
}