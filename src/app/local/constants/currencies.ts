export type CurrencyCode = 'COP' | 'USD' | 'PEN' | 'BRL' | 'EUR' | 'JPY'

export interface Currency {
    code: CurrencyCode
    symbol: string
}

export const CURRENCIES: readonly Currency[] = [
    { code: 'COP', symbol: "$" },
    { code: 'USD', symbol: "$" },
    { code: 'PEN', symbol: "S/." },
    { code: 'BRL', symbol: "R$" },
    { code: 'EUR', symbol: "€" },
    { code: 'JPY', symbol: "¥" }
]