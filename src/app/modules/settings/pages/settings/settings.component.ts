import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LANGUAGES } from '../../../../local/constants/language';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SettingsService } from '@modules/settings/services/settings.service';
import { ISetting } from '@modules/settings/interfaces/settings';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  imports: [ CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.sass'
})
export class SettingsComponent implements OnInit, AfterViewInit {
  public readonly languages = LANGUAGES

  // ******************************* PROPERTIES *******************************
  public isLoadingSettings: boolean = false
  public settings: ISetting[] = []
  public languageSettingForm!: FormGroup

  // ******************************* ERROR HANDLING *******************************
  public creationError: boolean = false

  constructor(
    private readonly settingsService: SettingsService,
    private readonly fb: FormBuilder,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService
  ){ }

  ngOnInit() {
    this.createLanguageSettingForm()
    this.getSettings()
  }

  ngAfterViewInit(): void {
    this.languageSettingForm.enable()
  }

  // ******************************* MAIN METHODS *******************************
  // It retrieves the stored settings
  private async getSettings() {
    this.isLoadingSettings = true
    this.settings = await this.settingsService.getSettings()
    this.settings.forEach(setting => {
      if(setting.key === 'language') this.languageSettingForm.get('language')?.setValue(setting.value)
    })
    this.isLoadingSettings = false
  }

  /**
   * Creates the setting form
   */
  private createLanguageSettingForm() {
    this.languageSettingForm = this.fb.group({
      language: new FormControl({ value: null, disabled: true}),
    })
  }

  /**
   * Sends the value to be saved in the indexedDB table
   */
  public async saveSetting() {
    this.languageSettingForm.markAllAsTouched()
    if(this.languageSettingForm.invalid) {
      this.creationError = true
      return
    } 
    
    try {
      const formValue = this.languageSettingForm.getRawValue()
      const setting: ISetting = {
        value: formValue.language,
        key: 'language'
      }

      await this.settingsService.saveSettings(setting)
      this.translateService.use(setting.value)
      this.creationError = false
      this.toastService.showSuccess('Setting saved successfully')
    }
    catch (error) {
      console.warn("Error saving setting", error)
      this.toastService.showError('An error occurred while saving the setting')
    }
  }
}