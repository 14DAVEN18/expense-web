import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { CATEGORY_TRANSACTION_TYPE, CategoryTransactionType } from '../../../../local/constants/categories'; 
import { TranslatePipe } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { CategoryMapper } from '@modules/administration/mappers/category.mapper';
import { AdministrationService } from '@modules/administration/services/administration.service';
import { ICategory } from '@modules/administration/interfaces/category';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-category',
  imports: [ ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatRadioModule, MatIconModule, MatDividerModule, MatButtonModule, TranslatePipe ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.sass'
})
export class CategoryComponent {
  // ******************************* PROPERTIES *******************************
  public categoryTransactionTypes = CATEGORY_TRANSACTION_TYPE
  public categories: ICategory[] = []
  public categoryForm!: FormGroup

  // ******************************* ERROR HANDLING *******************************
  public error: boolean = false
  public errorMessage: string = ''

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { category?: ICategory },
    public dialogRef: MatDialogRef<CategoryComponent>,
    private readonly fb: FormBuilder,
    private readonly administrationService: AdministrationService
  ) {

  }

  ngOnInit() {
    this.createCategoryForm()

    if(this.isEditing) this.loadCategory()
  }

  ngAfterViewInit() {
    this.categoryForm.enable()
  }

  // ******************************* MAIN METHODS *******************************
  private loadCategory() {
    const category = this.data.category
    if(!category) return

    this.categoryForm.patchValue({
      type: category.type,
      name: category.name,
      description: category.description,
    })
  }
  /**
   * Creates the transaction form
   */
  private createCategoryForm() {
    this.categoryForm = this.fb.group({
      type: new FormControl<CategoryTransactionType | null>({ value: null, disabled: true}, Validators.required),
      name: new FormControl({ value: null, disabled: true}, Validators.required),
      description: new FormControl({ value: null, disabled: true }, Validators.required),
    })
  }

  /**
   * Sends the value to be saved in the indexedDB table
   */
  public async saveCategory() {
    this.categoryForm.markAllAsTouched()
      if(this.categoryForm.invalid) {
        this.errorMessage = 'ADMINISTRATION.CATEGORIES.MESSAGES.REQUIRED_ERROR'
        this.error = true
        return
      }
      
      const category = CategoryMapper.fromForm(
        this.categoryForm.getRawValue(),
        this.isEditing ? this.data.category : undefined
      )
  
      try {
        if (this.isEditing) await this.updateCategory(category)
        else await this.createCategory(category)
  
        this.categoryForm.reset()
        this.dialogRef.close({success: true})
      }
      catch (error) {
        console.warn("Error saving transaction", error)
        this.dialogRef.close({success: false})
      }
  }

  /**
   * It creates the category
   * @param category category to be created
   */
  private async createCategory(category: ICategory) {
    await this.administrationService.createCategory(category)
  }

  /**
   * It updates the transaction
   * @param transaction transaction to be updated
   */
  private async updateCategory(category: ICategory) {
    const original = this.data.category

    await this.administrationService.updateCategory({
      ...category,
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
    return !!this.data?.category
  }
}
