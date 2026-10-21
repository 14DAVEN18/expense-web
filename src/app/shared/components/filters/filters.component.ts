import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IFilter } from './interfaces/filter.interface';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'our-filters',
  imports: [ 
    CommonModule, FormsModule,
    MatSlideToggleModule,
    TranslatePipe
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.sass'
})
export class FiltersComponent implements OnChanges, OnDestroy {
  // ******************************* INPUTS *******************************
  @Input() parameters!: string[]
  @Input() fixedFilters!: IFilter[]

  // ******************************* OUTPUTS *******************************
  @Output() filter: EventEmitter<number> = new EventEmitter()
  @Output() active: EventEmitter<boolean> = new EventEmitter()
  @Output() search: EventEmitter<string> = new EventEmitter()
  
  // ******************************* VIEW CHILD *******************************
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>

  // ******************************* PROPERTIES *******************************
  public showActive: boolean = true
  public joinedParameters: string = ''
  public filterIndex: number = 0

  private parametersSubscription?: Subscription;

  constructor(
    private readonly translateService: TranslateService
  ) {

  }

  // ******************************* HOOKS *******************************
  ngOnChanges(changes: SimpleChanges) {
    if(changes['parameters']) {
      this.parametersSubscription?.unsubscribe()
      this.updateJoinedParameters()
    }
  }

  ngOnDestroy(): void {
    this.parametersSubscription?.unsubscribe();
  }

  // ******************************* MAIN METHODS *******************************
  
  /**
   * Emits the value from the input
   * @param value value to ve emitted
   */
  public onSearch(value: string) {
    this.search.emit(value)
  }

  /**
   * Emits a boolean to show 
   * @param value 
   */
  public toggleStatus(value: boolean) {
    this.active.emit(value)
  }

  /**
   * Emits the index of the filter to be selected
   * @param index index to be searched in the filter list
   */
  public applyFilter(index: number) {
    if(index === null || index === undefined) return
    this.filterIndex = index
    this.filter.emit(index)
  }

  // ******************************* HELPER *******************************
  /**
   * Joins the parameters translations to display in the placeholder
   */
  private updateJoinedParameters(): void {
    this.parametersSubscription = this.translateService.stream(this.parameters)
      .subscribe(translations => {
        this.joinedParameters = this.parameters
          .map(parameter => translations[parameter])
          .join(', ');
      });
  }
}
