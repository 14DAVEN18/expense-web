import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PaginatorIntl extends MatPaginatorIntl {

    constructor(private readonly translate: TranslateService) {
        super();

        this.setLabels();

        this.translate.onLangChange.subscribe(() => {
        this.setLabels();
        this.changes.next();
        });
    }

    private setLabels(): void {
        this.itemsPerPageLabel = this.translate.instant('PAGINATOR.ITEMS_PER_PAGE');
        this.nextPageLabel = this.translate.instant('PAGINATOR.NEXT_PAGE');
        this.previousPageLabel = this.translate.instant('PAGINATOR.PREVIOUS_PAGE');
        this.firstPageLabel = this.translate.instant('PAGINATOR.FIRST_PAGE');
        this.lastPageLabel = this.translate.instant('PAGINATOR.LAST_PAGE');
    }

    override getRangeLabel = (page: number, pageSize: number, length: number): string => {
        if (length === 0 || pageSize === 0) 
            return this.translate.instant('PAGINATOR.RANGE_EMPTY', { length });

        const startIndex = page * pageSize;
        const endIndex = Math.min(startIndex + pageSize, length);

        return this.translate.instant('PAGINATOR.RANGE', 
            {
                start: startIndex + 1,
                end: endIndex,
                length
            }
        );
    };
}