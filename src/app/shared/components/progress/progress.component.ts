import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { CurrencyCode } from '../../../local/constants/currencies';

@Component({
  selector: 'our-progress',
  imports: [
    CommonModule,
    MoneyPipe
  ],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.sass'
})
export class ProgressComponent {
  @Input() current: number = 0
  @Input() target: number = 0
  @Input() currencyCode: CurrencyCode = 'COP'
  @Input() barOnly: boolean = true


  public getProgress() {
    if(this.target === 0) return '0%'
    return this.current / this.target >= 1
      ? '100.00%'
      : `${((this.current / this.target) * 100).toFixed(2) }%`
  }
}
