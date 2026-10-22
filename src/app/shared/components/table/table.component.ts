import { Component, ContentChild, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { IFilter } from '../filters/interfaces/filter.interface';

@Component({
  selector: 'our-table',
  imports: [CommonModule, MatTableModule, TranslatePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.sass'
})
export class TableComponent implements OnInit, OnChanges {
  // ******************************* INPUTS *******************************
  @Input() realColumnNames: string[] = []
  @Input() displayHeaders: string[] = []
  @Input() searchColumns: string[] = []
  @Input() data: any[] = []
  @Input() noDataColumn: boolean = false
  @Input() emptyDataColumnName: string[] = ['selection']
  @Input() selectedFilter!: IFilter
  @Input() active!: boolean
  @Input() searchValue!: string

  @ContentChild('cellTemplate') cellTemplate!: TemplateRef<any>;

  // ******************************* PROPERTIES *******************************
  private filterNames: string[] = ['selectedFilter', 'active', 'searchValue']
  public dataSource!: MatTableDataSource<any>;

  constructor() {
    this.dataSource = new MatTableDataSource<any>(this.data);
  }
  
  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.dataSource.data = this.data ?? [];
  }

  ngOnChanges(changes: SimpleChanges) {
    const exist = this.filterNames.some(fn => changes[fn])
    if(exist) this.applyFilter()
  }

  private applyFilter() {
    if(!this.selectedFilter) return

    this.dataSource.filterPredicate = (data) => {
      if (!data) return false;
      const active = data['active'] === this.active
      const value = (data[this.selectedFilter.column]?.toString() || '').toString().toUpperCase();
      const valueMatch = !this.selectedFilter.allowedValues.length || this.selectedFilter.allowedValues.includes(value);

      const matchSearch = this.searchValue
        ? this.searchColumns.some((column) => {
            const val = data[column] ?? '';
            return val
              .toString()
              .toLowerCase()
              .includes(this.searchValue.trim().toLowerCase());
          })
        : true;

      return active && valueMatch && matchSearch
    };

    this.dataSource.filter = Date.now().toString();
  }
}
