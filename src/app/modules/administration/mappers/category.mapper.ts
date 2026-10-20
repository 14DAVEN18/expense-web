import { ICategory, ICategoryFormModel } from "../interfaces/category";
import { DateUtil } from "@shared/utils/date.util";

export class CategoryMapper {
    static fromForm(category: ICategoryFormModel, row?: ICategory) {
        const newTransaction: ICategory = {
            ...row,
            type: category.type,
            name: category.name,
            description: category.description.trim().toUpperCase(),
            active: row?.active ?? true,
            created_at: row?.created_at ?? DateUtil.currentTimeStamp(),
            updated_at: row?.id ? DateUtil.currentTimeStamp() : undefined
        }
        return newTransaction
    }
}