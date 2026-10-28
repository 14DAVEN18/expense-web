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
        if((targetAmount / contributionAmount) < 1) return null
        const amountMonths = Math.ceil(targetAmount / contributionAmount)

        let estimatedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)

        if(startMonth === 'START_MONTH') 
            estimatedDate.setMonth(selectedDate.getMonth() + (amountMonths - 1))
        else
            estimatedDate.setMonth(selectedDate.getMonth() + amountMonths)

        return estimatedDate
    }
}