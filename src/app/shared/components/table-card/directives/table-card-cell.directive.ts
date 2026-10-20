import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[tableCardCell]',
  standalone: true
})
export class TableCardCellDirective {

  constructor(
    public templateRef: TemplateRef<any>
  ) { }

}
