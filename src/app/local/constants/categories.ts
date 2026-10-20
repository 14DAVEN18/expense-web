import { ITableCardColumn } from "@shared/components/table-card/interfaces/table-card-button.interface"

export type CategoryTransactionType = 'INCOME' | 'EXPENSE'

export const CATEGORY_TRANSACTION_TYPE: CategoryTransactionType[] = [ 'INCOME', 'EXPENSE' ]

export const CATEGORIES_COLUMNS: ITableCardColumn[] = [
    { key: 'id', label: 'ADMINISTRATION.CATEGORIES.COLUMNS.ID' },
    { key: 'name', label: 'ADMINISTRATION.CATEGORIES.COLUMNS.NAME' },
    { key: 'created_at', label: 'ADMINISTRATION.CATEGORIES.COLUMNS.CREATED_AT' },
    { key: 'updated_at', label: 'ADMINISTRATION.CATEGORIES.COLUMNS.UPDATED_AT' }
]
export const CATEGORIES_BUTTONS = [
    {icon: 'add', tooltip: 'ADMINISTRATION.CATEGORIES.TOOLTIPS.CREATE', action: 'category.create', dataDependent: false },
    {icon: 'download', tooltip: 'ADMINISTRATION.CATEGORIES.TOOLTIPS.EXPORT', action: 'category.export', dataDependent: true}
]