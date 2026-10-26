import { ISaving, ISavingFormModel } from "../interfaces/savings.interface";
import { DateUtil } from "@shared/utils/date.util";

export class SavingMapper {
    static fromForm(saving: ISavingFormModel, row?: ISaving) {
        const newSaving: ISaving = {
            ...row,
            name: saving.name,
            date: DateUtil.dateToString(saving.date),
            account_id: saving.account_id,
            saving_plan_type: saving.saving_plan_type,
            contribution_start: saving.contribution_start,
            target_amount: saving.target_amount !== null 
                ? Number(saving.target_amount) 
                : null,
            target_date: saving.target_date 
                ? DateUtil.dateToString(saving.target_date)
                : null,
            contribution_amount: saving.contribution_amount !== null 
                ? Number(saving.contribution_amount)
                : null,
            link: saving.link,
            description: saving.description.trim().toUpperCase(),
            completed: row?.completed ?? false,
            active: row?.active ?? true,
            created_at: row?.created_at ?? DateUtil.currentTimeStamp(),
            updated_at: row?.id
                ? DateUtil.currentTimeStamp()
                : undefined
        }
        return newSaving
    }
}