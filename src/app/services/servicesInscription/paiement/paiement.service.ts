import { Paiement } from './../../../entities/inscription/paiement';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { SettingService } from '../../setting/setting.service';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  error: {};
  reponse: any;
  errorData: {};

  constructor(
    private settingService: SettingService,
    private httpclient: HttpClient
  ) { }

  getApiPaiementUrl() {
    return this.settingService.getApiDomain()+"/paiement";
  }

  getListPaiements(){
    return this.httpclient.get<Paiement[]>(this.getApiPaiementUrl());
  }

  postPaiement(content) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.post(this.getApiPaiementUrl(), content, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  updatePaiement(oldPaiement,newPaiement) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.put(this.getApiPaiementUrl()+"/update?IdBanque="+oldPaiement.idbanque+"&Numero="+oldPaiement.numero+"&Matricule="+oldPaiement.matricule+"&Annee="+oldPaiement.annee, newPaiement, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  deletePaiement(content) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        body: content,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.delete(this.getApiPaiementUrl(), httpOptions).pipe(
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
      errorTitle: 'Oops! ??chec de la demande.',
      errorDesc: 'Quelque chose de terrible est arriv??. Veuillez r??essayer plus tard.'
    };
    return throwError(this.errorData);
  }

}
