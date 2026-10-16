import { Component, ContentChild, Input, OnChanges, OnInit, TemplateRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'our-table',
  imports: [CommonModule, MatTableModule, TranslatePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.sass'
})
export class TableComponent implements OnInit {
  @Input() realColumnNames: string[] = []
  @Input() displayHeaders: string[] = []
  @Input() data: any[] = []
  @Input() noDataColumn: boolean = false
  @Input() emptyDataColumnName: string[] = ['selection']

  @ContentChild('cellTemplate') cellTemplate!: TemplateRef<any>;

  public dataSource!: MatTableDataSource<any>;

  constructor() {
    this.dataSource = new MatTableDataSource<any>(this.data);
  }
  
  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.dataSource.data = this.data ?? [];
  }
}
