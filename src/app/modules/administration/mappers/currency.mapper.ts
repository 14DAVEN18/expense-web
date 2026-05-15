import { IAccountType, IAccountTypeFormModel, ICurrency, ICurrencyFormModel } from "../interfaces/creation-type";

export class CurrencyMapper {
    static fromForm(currency: ICurrencyFormModel) {
        const newCurrency: ICurrency = {
            created_at: CurrencyMapper.dateToString(currency.created_at),
            code: currency.code.toUpperCase(),
            name: currency.name.toUpperCase(),
            symbol: currency.symbol.toUpperCase(),
            description: currency.description.toUpperCase(),
            updated_at: currency.updated_at ? CurrencyMapper.dateToString(currency.updated_at) : ''
        }
        return newCurrency
    }

    static dateToString(date?: Date): string {
        const targetDate = date ?? new Date();

        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');

        const hours = String(targetDate.getHours()).padStart(2, '0');
        const minutes = String(targetDate.getMinutes()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }
}