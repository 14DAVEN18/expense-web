import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IButton, ITableCardColumn } from './interfaces/table-card-button.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { TableCardCellDirective } from './directives/table-card-cell.directive';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'our-table-card',
  imports: [ CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDividerModule, TranslatePipe ],
  templateUrl: './table-card.component.html',
  styleUrl: './table-card.component.sass'
})
export class TableCardComponent {
  // ******************************* TEMPLATE *******************************
  @ContentChild(TableCardCellDirective) public cellTemplate!: TableCardCellDirective

  // ******************************* INPUTS *******************************
  @Input() title: string = ''
  @Input() columns: ITableCardColumn[] = []
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
