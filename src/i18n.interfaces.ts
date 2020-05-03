export interface I18nConfig {
    defaultLocale: string;
    locales: string[];
    localePath: string;
    generatedPath: string;
    googleTranslateApiKey?: string;
    yandexTranslateApiKey?: string;
    rtl?: string[];
    ltr?: string[];
}

export interface I18nFunction {
    name: string;
    signature: string;
    body: string;
    variables: string[] | null;
}