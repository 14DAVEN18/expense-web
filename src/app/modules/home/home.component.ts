import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'
import { IDashboardSummary } from './interfaces/dashboard.interface';
import { CURRENCIES, CurrencyCode } from '../../local/constants/currencies';
import { DashboardService } from './services/dashboard.service';
import { TranslatePipe } from '@ngx-translate/core';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'our-home',
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule,
    TranslatePipe, MoneyPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent implements OnInit {
  // ******************************* PROPERTIES *******************************
  public initialSummary: IDashboardSummary = { income: 0, expenses: 0, netFlow: 0 }
  public summary: IDashboardSummary = { income: 0, expenses: 0, netFlow: 0}

  public selectedCurrency: CurrencyCode = 'COP'
  public selectedDate = new Date()

  public loading: boolean = false
  private duration: number = 1500

  public currencies = CURRENCIES

  // ******************************* ERROR HANDLING *******************************
  public maxDate: Date = new Date();

  constructor(
    private dashboardService: DashboardService
  ) { }

  // ******************************* HOOKS *******************************
  ngOnInit() {
    void this.loadDashboard()
  }

  // ******************************* MAIN METHODS *******************************
  /**
   * Loads summary
   */
  public async loadDashboard() {
    this.loading = true

    try {
      const result = await this.dashboardService.getMonthlySummary({
        year: this.selectedDate.getFullYear(),
        month: this.selectedDate.getMonth() + 1,
        currencyCode: this.selectedCurrency
      })

      this.animateSummary(result)
    } finally {
      this.loading = false
    }
  }

  /**
   * Animate the summary loading of numbers
   * @param result 
   */
  private animateSummary(result: IDashboardSummary): void {
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / this.duration, 1)

      this.summary = {
        income: result.income * progress,
        expenses: result.expenses * progress,
        netFlow: result.netFlow * progress
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  public chosenYearHandler(date: Date) {
    this.selectedDate = new Date(
      date.getFullYear(),
      this.selectedDate.getMonth()
    )
  }

  public chosenMonthHandler(date: Date, datepicker: MatDatepicker<Date>): void {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      date.getMonth(),
      1
    )

    datepicker.close()

    void this.loadDashboard()
  }
}