import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingService } from '../../setting/setting.service';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { Programme } from '../../../entities/programme/programme';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeService {

  error: {};
  reponse: any;
  errorData: {};

  constructor(
    private settingService : SettingService,
    private httpclient : HttpClient
  ) { }

  getApiProgrammeUrl(){
    return this.settingService.getApiDomain()+"/programme";
  }

  getListProgrammes(){
    return this.httpclient.get<Programme[]>(this.getApiProgrammeUrl());
  }

  FindProgramBy(annee = null,idSemestre,idClasse) {
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
      this.httpclient.get(this.getApiProgrammeUrl()+"/FindProgramBy?idSemestre="+idSemestre+"&idClasse="+idClasse+"&annee="+annee,httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  FindProgramUeClassromBy(annee = null,idClasse) {
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
      this.httpclient.get(this.getApiProgrammeUrl()+"/FindProgramUeClassromBy?idClasse="+idClasse+"&annee="+annee,httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  postProgramme(content) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.post(this.getApiProgrammeUrl(), content, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  updateProgramme(oldProgramme,newProgramme) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.put(this.getApiProgrammeUrl()+"/update?Idclasse="+oldProgramme.idclasse+"&Idsemestre="+oldProgramme.idsemestre+"&Idcategorie"+oldProgramme.idcategorie+"&Idue="+oldProgramme.idue+"&Annee="+oldProgramme.annee+"&Credit="+oldProgramme.credit, newProgramme, httpOptions).pipe(
        catchError(this.handleError)
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  deleteProgramme(content) {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        body: content,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      };
      this.httpclient.delete(this.getApiProgrammeUrl(), httpOptions).pipe(
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
