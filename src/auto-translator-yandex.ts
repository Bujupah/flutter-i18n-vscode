import { I18nConfig } from "./i18n.interfaces";
import { Variables } from "./variables";
const { YandexTranslate } = require('yet-another-yandex-translate');

interface YandexError {
  error?: YandexError;
  code?: number;
  message?: string;
  errors?: YandexError[];
  status?: string;
}

interface YandexTranslation {
  originalText: string;
  translatedText: string;
}

// Translates given strings to specified locale,
// using global I18nConfig having API key and defaultLocale
export class AutoYTranslator {

  private readonly varibales = new Variables();

  constructor(private config: I18nConfig) {
  }

  async translate(input: string, locale: string): Promise<string> {
    const apiKey = this.config.yandexTranslateApiKey;
    if (!apiKey) {
      return Promise.reject("yandexTranslateApiKey is not set.");
    }

    try {
      const source = this.config.defaultLocale.substr(0, 2);
      const target = locale.substr(0, 2);

      const yt = new YandexTranslate(apiKey);
      return new Promise<string>((resolve, reject) => {
        yt.translate(input, {from: source, to: target, format: 'plain'})
        .then((response: any) => {
          const translation: YandexTranslation = {
            originalText: input,
            translatedText: response
          };
          const result = this.handleTranslation(translation);
          resolve(result);
        })
        .catch((error: any)=>{
            if (error.body) {
              const ge = JSON.parse(error.body) as YandexError;
              const message = ge.message || ge.error && ge.error.message;
              reject(message);
            } else {
              reject(error);
            }
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private handleTranslation(translation: YandexTranslation): string {
    const originalVars = this.varibales.parseVariables(translation.originalText) || [];
    const translatedVars = this.varibales.parseVariables(translation.translatedText) || [];

    const result = this.varibales.replaceVariablesWithVariables(
      translation.translatedText, translatedVars, originalVars);
    return result;
  }
}
