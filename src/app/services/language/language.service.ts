import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private config: PrimeNGConfig,private translateService: TranslateService) { }

  translate(lang: string) {
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
    localStorage.setItem('lang', lang);
  }
}
