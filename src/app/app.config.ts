import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader'

import { routes } from './app.routes';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorIntl } from '@shared/components/table/internationalization/language-intl';
import { provideNativeDateAdapter } from '@angular/material/core';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: 'en',

      loader: provideTranslateHttpLoader({
          prefix: './i18n/',
          suffix: '.json'
        }
      )
    }),
    {
      provide: MatPaginatorIntl,
      useClass: PaginatorIntl
    },
    provideNativeDateAdapter(),
    provideCharts(withDefaultRegisterables())
  ]
};
