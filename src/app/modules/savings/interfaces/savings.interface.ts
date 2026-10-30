import { SavingContributionStart, SavingPlanType, SavingProgress } from "../../../local/constants/saving"

export interface ISaving {
    id?: number
    name: string
    date: string
    account_id: number
    saving_plan_type: SavingPlanType
    contribution_start: SavingContributionStart | null
    target_amount: number | null
    target_date: string | null  
    contribution_amount: number | null
    link?: string
    description: string
    completed: boolean
    active: boolean
    created_at: string
    updated_at?: string
}

export interface ISavingDisplay extends ISaving {
    real_date: string
    associated_account_name: string
    progress: SavingProgress
}

export interface ISavingFormModel {
    name: string
    date: Date
    account_id: number
    saving_plan_type: SavingPlanType
    contribution_start: SavingContributionStart
    target_amount: string
    target_date: Date
    contribution_amount: string
    link: string
    description: string
}