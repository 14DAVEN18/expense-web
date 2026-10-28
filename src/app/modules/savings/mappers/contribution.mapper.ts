import { IContribution, IContributionFormModel } from "../interfaces/contribution.interfaces";
import { ISaving, ISavingFormModel } from "../interfaces/savings.interface";
import { DateUtil } from "@shared/utils/date.util";

export class ContributionMapper {
    static fromForm(contribution: IContributionFormModel, row?: IContribution) {
        const newContribution: IContribution = {
            ...row,
            date: DateUtil.dateToString(contribution.date),
            saving_id: contribution.saving_id,
            amount: contribution.amount,
            active: row?.active ?? true,
            created_at: row?.created_at ?? DateUtil.currentTimeStamp(),
            updated_at: row?.id
                ? DateUtil.currentTimeStamp()
                : undefined
        }
        return newContribution
    }
}