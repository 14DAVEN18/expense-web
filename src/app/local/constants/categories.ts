import { ITableCardColumn } from "@shared/components/table-card/interfaces/table-card-button.interface"

export type CategoryTransactionType = 'INCOME' | 'EXPENSE'

export const CATEGORY_TRANSACTION_TYPE: CategoryTransactionType[] = [ 'INCOME', 'EXPENSE' ]

export const CATEGORIES_COLUMNS: ITableCardColumn[] = [
    { key: 'active', label: '' },
    { key: 'name', label: 'ADMINISTRATION.CATEGORIES.COLUMNS.NAME' },
    { key: 'type', label: 'ADMINISTRATION.CATEGORIES.COLUMNS.TYPE' },
    { key: 'description', label: 'ADMINISTRATION.CATEGORIES.COLUMNS.DESCRIPTION' },
    { key: 'created_at', label: 'ADMINISTRATION.CATEGORIES.COLUMNS.CREATED_AT' },
    { key: 'updated_at', label: 'ADMINISTRATION.CATEGORIES.COLUMNS.UPDATED_AT' },
    { key: 'actions', label: 'ADMINISTRATION.CATEGORIES.COLUMNS.ACTIONS' }
]
export const CATEGORIES_BUTTONS = [
    {icon: 'add', tooltip: 'ADMINISTRATION.CATEGORIES.TOOLTIPS.CREATE', action: 'category.create', dataDependent: false },
    {icon: 'download', tooltip: 'ADMINISTRATION.CATEGORIES.TOOLTIPS.EXPORT', action: 'category.export', dataDependent: true}
]