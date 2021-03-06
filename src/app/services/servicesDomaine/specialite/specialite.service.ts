import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingService } from '../../setting/setting.service';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { Specialite } from '../../../entities/domaine/specialite';

@Injectable({
  providedIn: 'root'
})
export class SpecialiteService {

  error: {};
  reponse: any;
  errorData: {};

  constructor(
    private settingService : SettingService,
    private httpclient : HttpClient
  ) { }

  getApiSpecialiteUrl(){
    return this.settingService.getApiDomain()+"/specialites";
  }

  postSpecialite(content) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.post(this.getApiSpecialiteUrl(), content, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  updateSpecialite(idSpecialite,content) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.patch(this.getApiSpecialiteUrl()+"/"+idSpecialite, content, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  deleteSpecialite(idSpecialite) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.delete(this.getApiSpecialiteUrl()+"/"+idSpecialite, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getAllSpecialites(){
    return this.httpclient.get<Specialite[]>(this.getApiSpecialiteUrl());
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
