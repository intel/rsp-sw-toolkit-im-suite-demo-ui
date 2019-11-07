import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AppConfigService {
  private appConfig;

  constructor( private http: HttpClient) {}

    async loadAppConfig() {
       await this.http.get('/assets/configuration/appConfig.json')
        .toPromise()
        .then( configValues => {
          this.appConfig = configValues;
        },
         e => {
          console.log('Error: ', e);
          this.appConfig = '';
        });
    }

    getConfig() {
    return this.appConfig;
    }
  }
