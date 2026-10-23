import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'
import { IAccountBalance, ICategoryExpense, IDashboardFilters, IDashboardSummary, IMonthlyCashFlow } from './interfaces/dashboard.interface';
import { CURRENCIES, CurrencyCode } from '../../local/constants/currencies';
import { DashboardService } from './services/dashboard.service';
import { TranslatePipe } from '@ngx-translate/core';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ITransactionDisplay } from '@modules/transactions/interfaces/transactions';

@Component({
  selector: 'our-home',
  imports: [
    CommonModule, FormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule,
    TranslatePipe, MoneyPipe,
    BaseChartDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent implements OnInit {
  // ******************************* PROPERTIES *******************************
  public initialSummary: IDashboardSummary = { income: 0, expenses: 0, netFlow: 0 }
  public summary: IDashboardSummary = { income: 0, expenses: 0, netFlow: 0}
  public topCategories: ICategoryExpense[] = []
  public incomeVsExpenses: IMonthlyCashFlow[] = []
  public accountBalances: IAccountBalance[] = []
  public recentTransactions: ITransactionDisplay[] = []

  public selectedCurrency: CurrencyCode = 'COP'
  public selectedDate = new Date()

  public loading: boolean = false
  private duration: number = 1500

  public currencies = CURRENCIES

  // ******************************* CHART RELATED PROPERTIES *******************************
  public expenseCategoryData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  }
  public expenseCategoryOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      }
    }
  }

  public incomeVsExpensesData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [

    ]
  }
  public incomeVsExpensesOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

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

    const filters: IDashboardFilters = {
      year: this.selectedDate.getFullYear(),
      month: this.selectedDate.getMonth() + 1,
      currencyCode: this.selectedCurrency
    }

    try {
      const [summary, topCategories, incomeVsExpenses, accountBalances, recentTransactions] = await Promise.all([
        this.dashboardService.getMonthlySummary(filters),
        this.dashboardService.getTopExpenseCategories(filters),
        this.dashboardService.getIncomeVsExpenses(filters),
        this.dashboardService.getAccountBalances(this.selectedCurrency),
        this.dashboardService.getRecentTransactions(filters)
      ]) 
      
      this.expenseCategoryData = {
        labels: topCategories.map(category => category.categoryName),
        datasets: [
          {
            data: topCategories.map(category => category.amount)
          }
        ]
      }

      this.incomeVsExpensesData = {
        labels: incomeVsExpenses.map(item => `${item.month}/${item.year}`),
        datasets: [
          {
            label: 'Income',
            data: incomeVsExpenses.map(item => item.income)
          },
          {
            label: 'expenses',
            data: incomeVsExpenses.map(item => item.expenses)
          }
        ]
      }

      this.accountBalances = accountBalances
      this.recentTransactions = recentTransactions
      this.animateSummary(summary)
    } finally {
      this.loading = false
    }
  }

  // ******************************* HELPERS *******************************
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