import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IButton } from './interfaces/table-card-button.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'our-table-card',
  imports: [ CommonModule, MatIconModule, TranslatePipe ],
  templateUrl: './table-card.component.html',
  styleUrl: './table-card.component.sass'
})
export class TableCardComponent {
  // ******************************* INPUTS *******************************
  @Input() title: string = ''
  @Input() columnNames: string[] = []
  @Input() realNames: string[] = []
  @Input() data: any[] = []
  @Input() buttons: IButton[] = []
  @Input() emptyMessage: string = ''
  @Input() loading: boolean = false

  // ******************************* OUTPUTS *******************************
  @Output() action: EventEmitter<string> = new EventEmitter()

  // ******************************* MAIN METHODS *******************************
  public emitAction(action: string) {
    this.action.emit(action)
  }
}
