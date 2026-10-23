import { CurrencyCode } from "../../../local/constants/currencies";

export interface IDashboardSummary {
    income: number
    expenses: number
    netFlow: number;
}

export interface ICategoryExpense {
    categoryId: number
    categoryName: string
    amount: number
}

export interface IMonthlyCashFlow {
    year: number
    month: number
    income: number
    expenses: number
}

export interface IAccountBalance {
    accountId: number
    accountName: string
    balance: number
}

export interface IDashboardFilters {
    year: number
    month: number
    currencyCode: CurrencyCode  
}