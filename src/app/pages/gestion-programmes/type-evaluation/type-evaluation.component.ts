import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TypeEvaluationService } from '../../../services/servicesProgramme/type-evaluation/type-evaluation.service';
import { TypeEvaluation } from '../../../entities/programme/type-evaluation';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SettingService } from '../../../services/setting/setting.service';
import { SendNotificationService } from '../../../services/send-notication/send-notification.service';
import { SpecialiteService } from '../../../services/servicesDomaine/specialite/specialite.service';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-type-evaluation',
  templateUrl: './type-evaluation.component.html',
  styleUrls: ['./type-evaluation.component.scss']
})
export class TypeEvaluationComponent implements OnInit {
  public typeEvaluations: any[] = [];
  TypeEvaluation = new TypeEvaluation();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadtypeEvaluation = false;
  createLoad = false;
  updateLoad = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentcategorieId: number;
  deleted = false;

  typeEvaluationForm: FormGroup;
  codeTypeEvaluation = new FormControl('', [Validators.required]);
  nomTypeEvaluation = new FormControl('', [Validators.required]);
  nameTypeEvaluation = new FormControl('');
  yearTypeEvaluation = new FormControl('', [Validators.required]);

  constructor(
    public httpClient: HttpClient,
    public typeEvaluationService: TypeEvaluationService,
    private settingService : SettingService,
    private sendNotificationService: SendNotificationService,
    private utilsService : UtilsService
  )
  {
    this.typeEvaluationForm = new FormGroup({
      codeTypeEvaluation: this.codeTypeEvaluation,
      nomTypeEvaluation: this.nomTypeEvaluation,
      nameTypeEvaluation: this.nameTypeEvaluation,
      yearTypeEvaluation: this.yearTypeEvaluation
    });
  }

  ngOnInit() {
    this.loadtypeEvaluation = true;
    this.getAllcategorieues();
  }

  async getAllcategorieues(){
    this.typeEvaluationService.getListTypeEvaluations().subscribe(
      (result) => {
        this.typeEvaluations = result;
        this.typeEvaluations = this.typeEvaluations.sort((a, b) => b.idcategorie - a.idcategorie);
        this.totalRecords = this.typeEvaluations.length;
        if (this.totalRecords > 0) {
          this.loadtypeEvaluation = false;
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
          this.loadtypeEvaluation = false;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadtypeEvaluation = false;
      }
    );
  }

  createTypeEvaluation(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeTypeEvaluationObject();
    this.typeEvaluationService.postTypeEvaluation(this.TypeEvaluation).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "TypeEvaluation créee avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllcategorieues();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "TypeEvaluation non enregistrée.";
          this.sendNotificationService.addToast(this.settingService.option, "error");
          this.buttonAction = "Enregistrer";
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.settingService.option.title = "error";
        this.settingService.option.msg = this.error;
        this.sendNotificationService.addToast(this.settingService.option, "error");
        this.createLoad = false;
        this.buttonAction = "Enregistrer";
      }
    );
  }

  updateTypeEvaluation(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeTypeEvaluationObject();
    const content = [
      {
        "op": "replace",
        "path": "/codetypeevaluation",
        "value": this.TypeEvaluation.getCodeTypeEvaluation()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.TypeEvaluation.getNom()
      },
      {
        "op": "replace",
        "path": "/name",
        "value": this.TypeEvaluation.getName()
      },
      {
        "op": "replace",
        "path": "/annee",
        "value": this.TypeEvaluation.getAnnee()
      }
    ]
    this.typeEvaluationService.updateTypeEvaluation(this.currentcategorieId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "TypeEvaluation modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllcategorieues();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "TypeEvaluation non modifié.";
          this.sendNotificationService.addToast(this.settingService.option, "error");
          this.buttonAction = "Modifier";
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.settingService.option.title = "error";
        this.settingService.option.msg = this.error;
        this.sendNotificationService.addToast(this.settingService.option, "error");
        this.updateLoad = false;
        this.buttonAction = "Modifier";
      }
    );
  }

  deleteTypeEvaluation(idcategorie) {
    Swal.fire({
      title: 'Etes-vous sûr?',
      text: "Cette action est irréversible!",
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.typeEvaluationService.deleteTypeEvaluation(idcategorie).then(
            (result) => {
              this.getAllcategorieues().then((res) => {
                Swal.fire(
                  'TypeEvaluation Supprimé!',
                  'supression!',
                  'success'
                )
              });
              this.reset();
              Swal.hideLoading();
            },
              (err) => {
                Swal.fire('Une erreur est survenue!','Veuillez réessayer plus tard.','error');
              }
            );
        });
      },
      allowOutsideClick: () => !swal.isLoading()
    });
  }

  initializeTypeEvaluationObject(){
    this.TypeEvaluation.setCodeTypeEvaluation(this.typeEvaluationForm.get('codeTypeEvaluation').value);
    this.TypeEvaluation.setNom(this.typeEvaluationForm.get('nomTypeEvaluation').value);
    this.TypeEvaluation.setName(this.typeEvaluationForm.get('nameTypeEvaluation').value);
    this.TypeEvaluation.setAnnee(this.utilsService.extractDate(this.typeEvaluationForm.get('yearTypeEvaluation').value));
  }

  fillFormBeforUpdating(TypeEvaluation){
    this.typeEvaluationForm.reset();
    this.showCancelBtn = true;
    this.currentcategorieId = Number(TypeEvaluation.idtypeevaluation);
    this.buttonAction = "Modifier";
    this.typeEvaluationForm.get('codeTypeEvaluation').setValue(TypeEvaluation.codetypeevaluation);
    this.typeEvaluationForm.get('nomTypeEvaluation').setValue(TypeEvaluation.nom);
    this.typeEvaluationForm.get('nameTypeEvaluation').setValue(TypeEvaluation.name);
    this.typeEvaluationForm.get('yearTypeEvaluation').setValue(TypeEvaluation.annee+"-01");
    window.scrollTo(0,0);
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.typeEvaluationForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  submitAction(){
    if (this.buttonAction === 'Modifier') {
      this.updateTypeEvaluation();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createTypeEvaluation();
    }
  }

}
