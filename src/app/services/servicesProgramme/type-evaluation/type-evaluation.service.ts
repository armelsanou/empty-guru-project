import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SettingService } from '../../setting/setting.service';
import { TypeEvaluation } from '../../../entities/programme/type-evaluation';

@Injectable({
  providedIn: 'root'
})
export class TypeEvaluationService {

  error: {};
  reponse: any;
  errorData: {};

  constructor(
    private settingService : SettingService,
    private httpclient : HttpClient
  ) { }

  getApiTypeEvaluationUrl(){
    return this.settingService.getApiDomain()+"/typeEvaluations";
  }

  postTypeEvaluation(TypeEvaluation: TypeEvaluation) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      const body = {
        'idtypeevaluation': TypeEvaluation.getIdTypeEvaluation(),
        'codetypeevaluation': TypeEvaluation.getCodeTypeEvaluation(),
        'nom': TypeEvaluation.getNom(),
        'name': TypeEvaluation.getName(),
        'annee': TypeEvaluation.getAnnee(),
      }
      this.httpclient.post(this.getApiTypeEvaluationUrl(), body, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  updateTypeEvaluation(idTypeEvaluation,content) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.patch(this.getApiTypeEvaluationUrl()+"/"+idTypeEvaluation, content, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  deleteTypeEvaluation(idTypeEvaluation) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.delete(this.getApiTypeEvaluationUrl()+"/"+idTypeEvaluation, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getListTypeEvaluations(){
    return this.httpclient.get<TypeEvaluation[]>(this.getApiTypeEvaluationUrl());
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        alert(error.error.message);
        // A client-side or network error occurred. Handle it accordingly.
        console.error('Une erreur est survenue:', error.error.message);
    } else {
        //error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }

    // return an observable with a user-facing error message
    this.errorData = {
        errorTitle: 'Oops! ??chec de la demande.',
        errorDesc: 'Quelque chose de terrible est arriv??. Veuillez r??essayer plus tard.'
    };
    return throwError(this.errorData);
  }

}
