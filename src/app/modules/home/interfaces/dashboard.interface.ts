import { CurrencyCode } from "../../../local/constants/currencies";

export interface IDashboardSummary {
    income: number
    expenses: number
    netFlow: number;
}

export interface IDashboardFilters {
    year: number
    month: number
    currencyCode: CurrencyCode  
}