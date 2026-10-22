import { IAccount, IAccountFormModel } from "@modules/accounts/interfaces/accounts";
import { DateUtil } from "@shared/utils/date.util";

export class AccountMapper {
    static fromForm(account: IAccountFormModel, row?: IAccount) {
        const newAccount: IAccount = {
            ...row,
            date: DateUtil.dateToString(account.date),
            name: account.name.trim().toUpperCase(),
            type: account.type,
            currency_code: account.currency_code.toUpperCase(),
            initial_balance: Number.parseFloat(account.initial_balance),
            description: account.description.trim().toUpperCase(),
            active: row?.active ?? true,
            created_at: row?.created_at ?? DateUtil.currentTimeStamp(),
            updated_at: row?.id ? DateUtil.currentTimeStamp() : undefined
        }
        return newAccount
    }
}