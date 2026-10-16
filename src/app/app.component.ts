import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SettingsService } from '@modules/settings/services/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'expense-web';

  constructor(
    private readonly settingsService: SettingsService,
    private readonly translateService: TranslateService
  ) {
    this.loadLanguage()
  }

  private async loadLanguage(): Promise<void> {
    const setting = await this.settingsService.getSetting('language')

    this.translateService.use(setting?.value ?? 'en')
  }
}
