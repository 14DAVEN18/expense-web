import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { IAccount } from '@modules/accounts/interfaces/accounts';
import { AccountsService } from '@modules/accounts/services/accounts.service';
import { ISaving } from '@modules/savings/interfaces/savings.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { MONTH_YEAR_FORMATS, SAVING_CONTRIBUTION_START, SAVING_PLAN_TYPES, SavingContributionStart, SavingPlanType } from '../../../../local/constants/saving';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { SavingMapper } from '@modules/savings/mappers/savings.mapper';
import { SavingService } from '@modules/savings/services/saving.service';
import { SavingUtil } from '@shared/utils/saving.utils';
import { MoneyPipe } from '@shared/pipes/money.pipe';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-savings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatRadioModule, MatDividerModule, MatIconModule, MatButtonModule,
    TranslatePipe
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: MONTH_YEAR_FORMATS
    },
    DatePipe
  ],
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.sass'
})
export class SavingsComponent implements OnInit {
  // ******************************* PROPERTIES *******************************
  public isTargetDate: boolean = false
  public isTargetAmount: boolean = false
  public isIndefinite: boolean = false
  public isFutureCreationMonth: boolean = false
  public savingForm!: FormGroup
  public accounts: IAccount[] = []
  public dateFilteredAccounts: IAccount[] = []
  public savingPlanTypes: SavingPlanType[] = SAVING_PLAN_TYPES
  public savingContributionStart: SavingContributionStart[] = SAVING_CONTRIBUTION_START
  private readonly requiredValidator = Validators.required
  public estimatedContribution: number | null = null
  public estimatedDate: Date | null = null
  public params: any = {}



  // ******************************* VIEW CHILD *******************************
  @ViewChild('body') private body!: ElementRef<HTMLElement>



  // ******************************* ERROR HANDLING *******************************
  public minDate!: Date 
  public loading: boolean = false
  public error: boolean = false
  public noAccounts: boolean = false
  public errorMessages: string[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { saving?: ISaving },
    public dialogRef: MatDialogRef<SavingsComponent>,
    private readonly fb: FormBuilder,
    private readonly accountService: AccountsService,
    private readonly savingService: SavingService,
    private readonly moneyPipe: MoneyPipe,
    private readonly datePipe: DatePipe,
  ) { }

  // ******************************* HOOKS *******************************
  ngOnInit() {
   this.createSavingForm()
   void this.initialize()
  }

  // ******************************* MAIN METHODS *******************************
  /**
   * Loads and transforms data before use
   */
  private async initialize() {
    this.loading = true

    this.setMinDate()
    
    await this.getAccounts()
    
    this.listenToCreationDate()
    this.listenToSavingPlanType()
    this.listenToContributionAmount()

    this.savingForm.valueChanges.pipe(debounceTime(1000)).subscribe(async() => {
      await this.calculateEstimates()
    })

    if(this.isEditing) this.loadSaving()
    this.loading = false

    if (this.noAccounts) {
      this.savingForm.disable()
      setTimeout(() => {
        this.scrollToBottom()
      })
      return
    }

    this.savingForm.enable()
  }

  /**
   * It sets the minimum date allowed for the form validation, it varies depending on whether I'm editing or creating
   */
  private setMinDate() {
    const today = new Date()
    const saving = this.data?.saving

    if (saving) {
      const savingDate = new Date(saving.date)

      this.minDate = new Date(savingDate.getFullYear(), savingDate.getMonth(), 1)
      return
    }

    this.minDate = new Date(today.getFullYear(), today.getMonth(), 1)
  }

  /**
   * Load the saving details into the form for edition
   */
  private loadSaving() {
    const saving = this.data.saving
    if(!saving) return
    
    this.savingForm.patchValue({
      name: saving.name,
      date: new Date(saving.date),
      account_id: saving.account_id,
      saving_plan_type: saving.saving_plan_type,
      contribution_start: saving.contribution_start,
      target_amount: saving.target_amount,
      target_date: saving.target_date ? new Date(saving.target_date) : null,
      contribution_amount: saving.contribution_amount,
      link: saving.link,
      description: saving.description,
      completed: saving.completed
    }, {emitEvent: false})
    
    this.savingForm.enable()
  }

  /**
   * Fetches the existing accounts created by the user
   */
  private async getAccounts() {
    this.accounts = (await this.accountService.getAccounts()).filter(account => account.active)
    this.dateFilteredAccounts = this.accounts

    const message = 'SAVINGS.MESSAGES.NO_ACCOUNTS_ERROR'
    
    if(!this.accounts.length) {
      if(!this.errorMessages.includes(message)) this.errorMessages.push(message)
      this.noAccounts = true
      this.error = this.errorMessages.length > 0
    }
  }

  /**
   * Creates the fields for the saving form
   */
  private createSavingForm() {
    this.savingForm = this.fb.group({
      name: new FormControl({ value: null, disabled: true }, [Validators.required]),
      date: new FormControl({ value: null, disabled: true }, [Validators.required]),
      account_id: new FormControl({ value: null, disabled: true}, [Validators.required]),
      saving_plan_type: new FormControl<SavingPlanType | null>({ value: null, disabled: true }, [Validators.required]),
      contribution_start: new FormControl<SavingContributionStart | null>({value: null, disabled: true}, [Validators.required]),
      target_amount: new FormControl({ value: null, disabled: true }),
      target_date: new FormControl({ value: null, disabled: true }),
      contribution_amount: new FormControl({ value: null, disabled: true }),
      link: new FormControl({ value: null, disabled: true }),
      description: new FormControl({ value: null, disabled: true }, [Validators.required]),
      completed: new FormControl({ value: null, disabled: true })
    })
  }

  /**
   * Sets listener for creation date
   */
  private listenToCreationDate() {
    this.savingForm.get('date')?.valueChanges.subscribe((value: Date | null) => {
      if(!value) return

      const today = new Date()

      const selectedMonth = new Date(value.getFullYear(), value.getMonth(), 1)
      const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      this.isFutureCreationMonth = selectedMonth > currentMonth

      const contributionStart = this.savingForm.get('contribution_start')?.value

      if (this.isFutureCreationMonth && contributionStart === 'NEXT_MONTH')
        this.savingForm.get('contribution_start')?.reset()
    })
  }

  /**
   * Sets listener for saving_plan_type
   */
  private listenToSavingPlanType() {
    this.savingForm.get('saving_plan_type')?.valueChanges.subscribe(value => {
      this.isTargetDate = value === 'TARGET_DATE'
      this.isTargetAmount = value === 'TARGET_AMOUNT'
      this.isIndefinite = value === 'INDEFINITE'

      if(this.isTargetDate) this.savingForm.get('contribution_amount')?.setValue(null)
      if(this.isTargetAmount) this.savingForm.get('target_date')?.setValue(null)
      if(this.isIndefinite) {
        this.savingForm.get('target_amount')?.setValue(null)
        this.savingForm.get('target_date')?.setValue(null)
      }

      this.updatePlanValidators()
    })
  }

  /**
   * Sets listener for contribution_amount
   */
  private listenToContributionAmount() {
    this.savingForm.get('contribution_amount')?.valueChanges.subscribe(value => {
      if(!value) return

      const target = this.savingForm.get('target_amount')?.value
      if(!target) return

      const message = 'SAVINGS.MESSAGES.CONTRIBUTION_ERROR'

      if(Number(value) > Number(target)) {
        this.savingForm.get('contribution_amount')?.markAsTouched()
        if (!this.errorMessages.includes(message)) this.errorMessages.push(message)
        this.error = this.errorMessages.length > 0
        this.savingForm.get('contribution_amount')?.setValue(null)
        setTimeout(() => {
          this.scrollToBottom()
        })
        return
      }

      this.errorMessages = []
      this.error = false
    })
  }

  /**
   * Sends the value to be saved in the indexedDB table
   */
  public async saveSaving() {
    this.savingForm.markAllAsTouched()

    const message = 'SAVINGS.MESSAGES.REQUIRED_ERROR'

    if(this.savingForm.invalid) {
      if(!this.errorMessages.includes(message)) this.errorMessages.push(message)
      this.error = this.errorMessages.length > 0
      setTimeout(() => {
        this.scrollToBottom()
      })
      return
    }
    
    const saving = SavingMapper.fromForm(
      this.savingForm.getRawValue(),
      this.isEditing ? this.data.saving : undefined
    )

    try {
      if (this.isEditing) await this.updateSaving(saving)
      else await this.createSaving(saving)

      this.savingForm.reset()
      this.dialogRef.close({success: true})
    }
    catch (error) {
      console.warn("Error saving saving", error)
      this.dialogRef.close({success: false})
    }
  }

  /**
   * It creates the saving
   * @param saving saving to be created
   */
  private async createSaving(saving: ISaving) {
    await this.savingService.createSaving(saving)
  }

  /**
   * It updates the saving
   * @param saving saving to be updated
   */
  private async updateSaving(saving: ISaving) {
    const original = this.data.saving

    await this.savingService.updateSaving({
      ...saving,
      id: original?.id
    })
  }

  /**
   * Closes the modal
   * @param success Indicates whether the operation was successful or not
   */
  public close() {
    this.dialogRef.close()
  }



  // ******************************* HELPERS *******************************
  /**
   * It determines whether the modal is in edition mode or not
   */
  public get isEditing(): boolean {
    return !!this.data?.saving
  }

  private async calculateEstimates() {
    if(this.isTargetDate) await this.calculateEstimateAmount()
    if(this.isTargetAmount) this.calculateEstimatedDate()
  }

  /**
   * Updates required state of fields according to the saving_plan_type
   */
  private updatePlanValidators() {
    if(this.isIndefinite) this.makeOptional('target_amount')
    else this.makeRequired('target_amount')
    
    if(this.isTargetDate) this.makeRequired('target_date')
    else this.makeOptional('target_date')
  }

  /**
   * It adds the required validator to a form control
   * @param controlPath path in the form to the form control
   */
  private makeRequired(controlPath: string) {
    if(!controlPath) return
    const control = this.savingForm.get(controlPath)
    control?.addValidators(this.requiredValidator)
    control?.updateValueAndValidity()
  }

  /**
   * It removes the required validator from a form control
   * @param controlPath path in the form to the from control
   */
  private makeOptional(controlPath: string) {
    if(!controlPath) return
    const control = this.savingForm.get(controlPath)
    control?.removeValidators(this.requiredValidator)
    control?.updateValueAndValidity()
  }

  /**
   * It handles the year selection of a date picker
   * @param normalizedYear year selected by the user
   * @param controlPath form path of the control
   */
  public chosenYearHandler(normalizedYear: Date, controlPath: string) {
    const ctrlValue = this.savingForm.get(controlPath)?.value ?? new Date()
    ctrlValue.setFullYear(normalizedYear.getFullYear())
    ctrlValue.setDate(1)
    this.savingForm.get(controlPath)?.setValue(ctrlValue)
  }

  /**
   * It handles the month selection of a date picker and closes the picker
   * @param normalizedMonth month selected by the user
   * @param controlPath form path of the control
   * @param datepicker datepicker that called the function
   */
  public chosenMonthHandler(normalizedMonth: Date, controlPath: string, datepicker: MatDatepicker<Date>): void {
    const ctrlValue = this.savingForm.get(controlPath)?.value ?? new Date()
    ctrlValue.setMonth(normalizedMonth.getMonth())
    this.savingForm.get(controlPath)?.setValue(ctrlValue)
    datepicker.close()
  }

  /**
   * Scroll tot he bottom of the form
   */
  private scrollToBottom() {
    const element = this.body.nativeElement

    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'smooth'
    })
  }

  /**
   * It validates that there's enough data to calculate the estimated contribution
   */
  private async calculateEstimateAmount() {
    this.estimatedContribution = null

    const targetAmount = this.savingForm.get('target_amount')?.value
    if(!targetAmount) return

    const startMonth = this.savingForm.get('contribution_start')?.value
    if(!startMonth) return

    const creationDate = this.savingForm.get('date')?.value
    if(!creationDate) return

    const targetDate = this.savingForm.get('target_date')?.value
    if(!targetDate) return

    this.estimatedContribution = SavingUtil.calculateEstimateContribution(targetAmount, targetDate, creationDate, startMonth)

    const accountId = this.savingForm.get('account_id')?.value
    const account = accountId
      ? await this.accountService.getAccount(accountId)
      : undefined

    this.params = {
      amount: this.moneyPipe.transform(this.estimatedContribution, account?.currency_code, 'symbol')
    }
  }

  /**
   * It validates that there's enough data to calculate the estimated date
   * @returns 
   */
  private calculateEstimatedDate() {
    this.estimatedDate = null

    const creationDate = this.savingForm.get('date')?.value
    if(!creationDate) return

    const contributionStart = this.savingForm.get('contribution_start')?.value
    if(!contributionStart) return

    const targetAmount = this.savingForm.get('target_amount')?.value
    if(!targetAmount) return

    const contributionAmount = this.savingForm.get('contribution_amount')?.value
    if(!contributionAmount) return

    this.estimatedDate = SavingUtil.calculateEstimateDate(targetAmount, contributionAmount, creationDate, contributionStart)

    this.params = {
      date: this.datePipe.transform(this.estimatedDate, 'yyyy/MM/dd')
    }
  }
}
