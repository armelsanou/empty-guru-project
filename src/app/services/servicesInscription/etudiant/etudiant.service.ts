import { Injectable } from '@angular/core';
import { Etudiant } from './../../../entities/inscription/etudiant';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { SettingService } from '../../setting/setting.service';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {

  error: {};
  reponse: any;
  errorData: {};

  constructor(
    private settingService: SettingService,
    private httpclient: HttpClient
  ) { }
  
  getApiEtudiantUrl() {
    return this.settingService.getApiDomain()+"/etudiant";
  }

  postEtudiant(content) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.post(this.getApiEtudiantUrl(), content, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  updateEtudiant(oldEtudiant,newEtudiant) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.put(this.getApiEtudiantUrl()+"/update?Matricule="+oldEtudiant.matricule, newEtudiant, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  deleteEtudiant(content) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        body: content,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.delete(this.getApiEtudiantUrl(), httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  getListEtudiants(){
    return this.httpclient.get<Etudiant[]>(this.getApiEtudiantUrl());
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
