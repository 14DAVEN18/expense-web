import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  constructor(private snackBar: MatSnackBar) { }

  showSuccess(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['toast-success']
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 4000,
      panelClass: ['toast-error']
    });
  }
}
