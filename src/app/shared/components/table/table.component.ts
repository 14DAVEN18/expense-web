import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'our-table',
  imports: [CommonModule, MatTableModule],
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

  // data = [
  //   {
  //     active: true,
  //     created_at: "2026/05/11",
  //     currency: "COP",
  //     description: "Cuenta de ahorros del Banco Caja Social",
  //     id: 1,
  //     initial_balance: "5102923.00",
  //     name: "Banco Caja Social",
  //     type: 2
  //   },
  //   {
  //     active: false,
  //     created_at: "2026/05/11",
  //     currency: "COP",
  //     description: "Cuenta de ahorros del Banco Caja Social",
  //     id: 1,
  //     initial_balance: "5102923.00",
  //     name: "Banco Caja Social",
  //     type: 2
  //   }
  // ]

  constructor() {
    this.dataSource = new MatTableDataSource<any>(this.data);
  }
  
  // ******************************* HOOKS *******************************
  ngOnInit(): void {
    this.dataSource.data = this.data ?? [];
  }
}
