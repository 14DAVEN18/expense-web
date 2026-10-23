import { Pipe, PipeTransform } from '@angular/core';
import { CURRENCIES, CurrencyCode } from '../../local/constants/currencies';
import { MoneyDisplay } from './type/money-display';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

  transform(value: number | null | undefined, currencyCode: CurrencyCode, display: MoneyDisplay = 'full'): string {
    if(value === null || value === undefined) return '-'

    const currency = CURRENCIES.find(currency => currency.code === currencyCode)

    if(!currency) return value.toString()

    const amount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)

    if(display === 'symbol')
      return `${currency.symbol} ${amount}`

    return `${currency.code} ${currency.symbol} ${amount}`
  }

}
