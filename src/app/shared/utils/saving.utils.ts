import { SavingContributionStart } from "../../local/constants/saving"

export class SavingUtil {
    static calculateEstimateContribution(targetAmount: number, targetDate: Date, selectedDate: Date, startMonth: SavingContributionStart) {
        const monthDifference = 
            (targetDate.getFullYear() - selectedDate.getFullYear()) * 12 + 
            (targetDate.getMonth() - selectedDate.getMonth())

        const contributionMonths = monthDifference + (startMonth === 'START_MONTH' ? 1 : 0)

        if(contributionMonths <= 0) return null
        
        return targetAmount / contributionMonths
    }

    static calculateEstimateDate(targetAmount: number, contributionAmount: number, selectedDate: Date, startMonth: SavingContributionStart) {
        const amountMonths = targetAmount / contributionAmount

        const estimateDate = new Date(
            selectedDate.getFullYear(),
            
        )
    }
}