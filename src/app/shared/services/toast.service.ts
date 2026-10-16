import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly translateService: TranslateService
  ) { }

  showSuccess(message: string) {
    this.snackBar.open(
      this.translateService.instant(message),
      'OK',
      {
        duration: 3000,
        panelClass: ['toast-success']
      }
    );
  }

  showError(message: string) {
    this.snackBar.open(
      this.translateService.instant(message),
      'OK', 
      {
        duration: 4000,
        panelClass: ['toast-error']
      }
    );
  }
}
