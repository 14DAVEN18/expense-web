import { CategoryTransactionType } from "../../../local/constants/categories"

export interface ICategory {
    id?: number
    type: CategoryTransactionType
    name: string
    description: string
    active: boolean
    created_at: string
    updated_at?: string
}

export interface ICategoryFormModel {
    type: CategoryTransactionType
    name: string
    description: string
}