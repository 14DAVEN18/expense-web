import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IContribution } from '@modules/savings/interfaces/contribution.interfaces';
import { ISaving } from '@modules/savings/interfaces/savings.interface';
import { ContributionMapper } from '@modules/savings/mappers/contribution.mapper';
import { ContributionService } from '@modules/savings/services/contribution.service';
import { SavingService } from '@modules/savings/services/saving.service';
import { TranslatePipe } from '@ngx-translate/core';
import { DateUtil } from '@shared/utils/date.util';

@Component({
  selector: 'app-contributions',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule, MatDatepickerModule, MatSelectModule, MatInputModule, MatIconModule, MatDividerModule, MatButtonModule,
    TranslatePipe
  ],
  templateUrl: './contributions.component.html',
  styleUrl: './contributions.component.sass'
})
export class ContributionsComponent {
  // ******************************* PROPERTIES *******************************
  public contributionForm!: FormGroup
  private savings: ISaving[] = []
  public dateFilteredSavings: ISaving[] = []
  private originalSourceSavingId: number | null = null



  // ******************************* VIEW CHILD *******************************
  @ViewChild('body') private body!: ElementRef<HTMLElement>



  // ******************************* ERROR HANDLING *******************************
  public minDate!: Date 
  public loading: boolean = false
  public error: boolean = false
  public noSavings: boolean = false
  public errorMessages: string[] = []
  public savingDateWarning = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { contribution?: IContribution },
    public dialogRef: MatDialogRef<ContributionsComponent>,
    private readonly fb: FormBuilder,
    private readonly savingService: SavingService,
    private readonly contributionService: ContributionService
  ) { }



  // ******************************* HOOKS *******************************
  ngOnInit() {
    this.createContributionForm()
    void this.initialize()
  }




  // ******************************* MAIN METHODS *******************************
  /**
   * Loads and transforms data before use
   */
  private async initialize() {
    this.loading = true

    this.setMinDate()
    
    await this.getSavings()

    this.listenToDate()

    if(this.isEditing) this.loadContribution()
    this.loading = false
  
    if (this.noSavings) {
      this.contributionForm.disable()
      setTimeout(() => {
        this.scrollToBottom()
      })
      return
    } 

    this.contributionForm.enable()
  }

  /**
   * It sets the minimum date allowed for the form validation, it varies depending on whether I'm editing or creating
   */
  private setMinDate() {
    const today = new Date()
    const contribution = this.data?.contribution

    if (contribution) {
      const savingDate = new Date(contribution.date)

      this.minDate = new Date(savingDate.getFullYear(), savingDate.getMonth(), 1)
      return
    }

    this.minDate = today
  }

  /**
   * Load the contribution details into the form for edition
   */
  private loadContribution() {
    const contribution = this.data.contribution
    if(!contribution) return
    
    this.contributionForm.patchValue({
      saving_id: contribution.saving_id,
      date: new Date(contribution.date),
      amount: contribution.amount
    }, {emitEvent: false})
    
    this.contributionForm.enable()
  }

  /**
   * Fetches the existing savings created by the user
   */
  private async getSavings() {
    this.savings = (await this.savingService.getSavings()).filter(saving => saving.active)
    this.dateFilteredSavings = this.savings
    
    const message = 'CONTRIBUTIONS.MESSAGES.NO_SAVINGS_ERROR'

    if(!this.savings.length) {
      if(!this.errorMessages.includes(message)) this.errorMessages.push(message)
      this.noSavings = true
      this.error = this.errorMessages.length > 0
    }
  }

  /**
   * Creates the fields for the contribution form
   */
  private createContributionForm() {
    this.contributionForm = this.fb.group({
      date: new FormControl({ value: null, disabled: true }, [Validators.required]),
      saving_id: new FormControl({ value: null, disabled: true}, [Validators.required]),
      amount: new FormControl({ value: null, disabled: true }, [Validators.required])
    })
  }

  /**
   * It listens to changes in the date field
   */
  private listenToDate() {
    this.contributionForm.get('date')?.valueChanges.subscribe(value => {
      if(!value) return

      this.filterSavings(value)

      const message = 'CONTRIBUTIONS.MESSAGES.NO_OLDER_SAVINGS'
      
      if(!this.dateFilteredSavings.length) {
        if(!this.errorMessages.includes(message)) this.errorMessages.push(message)
      } else {
        this.errorMessages = this.errorMessages.filter(
          error => error !== message
        )
      }

      this.error = this.errorMessages.length > 0
    })
  }

  /**
   * Sends the value to be saved in the indexedDB table
   */
  public async saveContribution() {
    this.contributionForm.markAllAsTouched()

    const message = 'CONTRIBUTIONS.MESSAGES.REQUIRED_ERROR'
    if(this.contributionForm.invalid) {
      if(!this.errorMessages.includes(message)) this.errorMessages.push(message)

      this.error = this.errorMessages.length > 0
      return
    }
    
    const contribution = ContributionMapper.fromForm(
      this.contributionForm.getRawValue(),
      this.isEditing ? this.data.contribution : undefined
    )

    try {
      if (this.isEditing) await this.updateContribution(contribution)
      else await this.createContribution(contribution)

      this.contributionForm.reset()
      this.dialogRef.close({success: true})
    }
    catch (error) {
      console.warn("Error saving saving", error)
      this.dialogRef.close({success: false})
    }
  }

  /**
   * It creates the contribution
   * @param contribution contribution to be created
   */
  private async createContribution(contribution: IContribution) {
    await this.contributionService.createContribution(contribution)
  }

  /**
   * It updates the contribution
   * @param contribution contribution to be updated
   */
  private async updateContribution(contribution: IContribution) {
    const original = this.data.contribution

    await this.contributionService.updateContribution({
      ...contribution,
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
    return !!this.data?.contribution
  } 

  /**
   * Filters savings based on date and whether it's the original saving
   * @param selectedDate date selected in the date field
   */
  private filterSavings(selectedDate: Date): void {
    const date = DateUtil.dateToString(selectedDate);

    this.dateFilteredSavings = this.savings.filter(saving => {
      const isValidByDate = saving.date <= date;

      const isOriginalSaving = this.isEditing && saving.id === this.originalSourceSavingId

      return isValidByDate || isOriginalSaving;
    });

    this.checkSavingDates(date);
  }

  /**
   * check saving dates to decide whether the warning must be displayed or not
   * @param transactionDate 
   */
  private checkSavingDates(contributionDate: string): void {
    const sourceAccountId = this.contributionForm.get('saving_id')?.value;

    this.savingDateWarning = this.isSavingAfterContribution(sourceAccountId, contributionDate);
  }

  /**
   * Checks the saving validity
   * @param savingId 
   * @param contributionDate 
   * @returns 
   */
  private isSavingAfterContribution(savingId: number | null, contributionDate: string): boolean {
    if (!savingId) return false
    const saving = this.savings.find(saving => saving.id === savingId)
    return !!saving && saving.date > contributionDate
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
}
