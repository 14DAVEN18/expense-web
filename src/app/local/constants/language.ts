export type languageCode = 'en' | 'es' | 'pt'

export interface Language {
    code: languageCode
    name: string
}

export const LANGUAGES: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' }
]