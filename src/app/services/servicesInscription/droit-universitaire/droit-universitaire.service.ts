import { DroitUniversitaire } from './../../../entities/inscription/droit-universtaire';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { SettingService } from '../../setting/setting.service';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DroitUniversitaireService {

  error: {};
  reponse: any;
  errorData: {};

  constructor(
    private settingService: SettingService,
    private httpclient: HttpClient
  ) { }

  getApiDroitUniversitaireUrl() {
    return this.settingService.getApiDomain()+"/droituniversitaire";
  }

  getListDroitUniversitaires(){
    return this.httpclient.get<DroitUniversitaire[]>(this.getApiDroitUniversitaireUrl());
  }

  postDroitUniversitaire(content) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.post(this.getApiDroitUniversitaireUrl(), content, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  updateDroitUniversitaire(oldDroitUniversitaire,newDroitUniversitaire) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.put(this.getApiDroitUniversitaireUrl()+"/update?Idclasse="+oldDroitUniversitaire.idclasse+"&Idpays="+oldDroitUniversitaire.idpays+"&Annee="+oldDroitUniversitaire.annee+"&Montant="+oldDroitUniversitaire.montant, newDroitUniversitaire, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  deleteDroitUniversitaire(content) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        body: content,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.delete(this.getApiDroitUniversitaireUrl(), httpOptions).pipe(
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
