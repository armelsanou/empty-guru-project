import { Injectable } from '@angular/core';
import { Inscription } from './../../../entities/inscription/inscription';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { SettingService } from '../../setting/setting.service';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {

  error: {};
  reponse: any;
  errorData: {};

  constructor(
    private settingService: SettingService,
    private httpclient: HttpClient
  ) { }

  getApiInscriptionUrl() {
    return this.settingService.getApiDomain()+"/inscription";
  }

  getListInscriptions(){
    return this.httpclient.get<Inscription[]>(this.getApiInscriptionUrl());
  }

  FindInfoStudentBy(annee = null,matricule) {
    if (annee == "" || annee == null || annee < 0) {
      annee = 0;
    }
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.get(this.getApiInscriptionUrl()+"/FindInfoStudentBy?annee="+annee+"&matricule="+matricule,httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  postInscription(content) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.post(this.getApiInscriptionUrl(), content, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  updateInscription(oldInscription,newInscription) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.put(this.getApiInscriptionUrl()+"/update?Idclasse="+oldInscription.idclasse+"&Matricule="+oldInscription.matricule+"&Annee="+oldInscription.annee, newInscription, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  deleteInscription(content) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        body: content,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.delete(this.getApiInscriptionUrl(), httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
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
      errorTitle: 'Oops! Échec de la demande.',
      errorDesc: 'Quelque chose de terrible est arrivé. Veuillez réessayer plus tard.'
    };
    return throwError(this.errorData);
  }

}
