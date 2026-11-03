import { CurrencyCode } from "../../../local/constants/currencies"

export interface ISavingTransfer {
  id?: number
  date: string
  source_saving_id: number
  destination_saving_id: number
  amount: number
  reason: string
  active: boolean
  created_at: string
  updated_at?: string
}

export interface ISavingTransferDisplay extends ISavingTransfer {
  source_saving_name: string
  destination_saving_name: string
  currency_code: CurrencyCode
}