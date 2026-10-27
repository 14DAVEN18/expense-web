import { Component, ContentChild, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator'
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { IFilter } from '../filters/interfaces/filter.interface';
import { PaginatorSize } from './types/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'our-table',
  imports: [ 
    CommonModule,
    MatTableModule, MatPaginatorModule,
    TranslatePipe
  ],
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
  @Input() selectedFilter?: IFilter
  @Input() active?: boolean
  @Input() searchValue?: string

  @Input() pageSize: PaginatorSize = 10
  @Input() loading: boolean = false

  // ******************************* INPUTS *******************************
  @Output() pageChange = new EventEmitter<PageEvent>()

  @ContentChild('cellTemplate') cellTemplate!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // MAIN METHODS
  /**
   * Applies a filter to the data
   * @returns 
   */
  private applyFilter() {
    this.dataSource.filterPredicate = (data) => {
      if (!data) return false;

      const activeMatch = this.active === undefined || data['active'] === this.active

      const valueMatch =
        !this.selectedFilter?.allowedValues.length || 
        this.selectedFilter.allowedValues.includes(
          (data[this.selectedFilter.column]?.toString() || '').toUpperCase()
        )

      const matchSearch = !this.searchValue || 
        this.searchColumns.some((column) => {
            const val = data[column] ?? '';
            return val
              .toString()
              .toLowerCase()
              .includes(this.searchValue!.trim().toLowerCase());
          })

      return activeMatch && valueMatch && matchSearch
    };

    this.dataSource.filter = Date.now().toString();
  }
}
