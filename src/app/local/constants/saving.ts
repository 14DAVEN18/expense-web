export type SavingPlanType = 'TARGET_DATE' | 'CONTRIBUTION_AMOUNT' | 'INDEFINITE'
export type SavingContributionStart = 'START_MONTH' | 'NEXT_MONTH'
export type SavingProgress = { current: number, target: number | null }

export const SAVING_PLAN_TYPES: SavingPlanType[] = [
    'TARGET_DATE',
    'CONTRIBUTION_AMOUNT',
    'INDEFINITE'
]

export const SAVING_CONTRIBUTION_START: SavingContributionStart[] = [
    'START_MONTH',
    'NEXT_MONTH'
]

export const MONTH_YEAR_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};