import { IAccountType, IAccountTypeFormModel } from "../interfaces/creation-type";

export class AccountTypeMapper {
    static fromForm(accountType: IAccountTypeFormModel) {
        const newAccountType: IAccountType = {
            created_at: AccountTypeMapper.dateToString(accountType.created_at),
            name: accountType.name.toUpperCase(),
            description: accountType.description.toUpperCase(),
            updated_at: accountType.updated_at ? AccountTypeMapper.dateToString(accountType.updated_at) : ''
        }
        return newAccountType
    }

    static dateToString(date?: Date): string {
        const targetDate = date ?? new Date();

        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');

        const hours = String(targetDate.getHours()).padStart(2, '0');
        const minutes = String(targetDate.getMinutes()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }
}