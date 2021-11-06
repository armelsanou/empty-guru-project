import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategorieueService } from '../../../services/servicesProgramme/categorie-ue/categorieue.service';
import { Categorieue } from '../../../entities/programme/categorieue';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SettingService } from '../../../services/setting/setting.service';
import { SendNotificationService } from '../../../services/send-notication/send-notification.service';
import { SpecialiteService } from '../../../services/servicesDomaine/specialite/specialite.service';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-categorieue',
  templateUrl: './categorieue.component.html',
  styleUrls: ['./categorieue.component.scss']
})
export class CategorieueComponent implements OnInit {

  public categorieues: any[] = [];
  categorieue = new Categorieue();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadcategorieues = false;
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

  categorieueForm: FormGroup;
  codeCategorieue = new FormControl('', [Validators.required]);
  nomCategorieue = new FormControl('', [Validators.required]);
  nameCategorieue = new FormControl('');
  yearCategorieue = new FormControl('', [Validators.required]);

  constructor(
    public httpClient: HttpClient,
    public categorieueservice: CategorieueService,
    private settingService : SettingService,
    private sendNotificationService: SendNotificationService,
    private utilsService : UtilsService
  )
  {
    this.categorieueForm = new FormGroup({
      codeCategorieue: this.codeCategorieue,
      nomCategorieue: this.nomCategorieue,
      nameCategorieue: this.nameCategorieue,
      yearCategorieue: this.yearCategorieue
    });
  }

  ngOnInit() {
    this.loadcategorieues = true;
    this.getAllcategorieues();
  }

  async getAllcategorieues(){
    this.categorieueservice.getListCategorieues().subscribe(
      (result) => {
        this.categorieues = result;
        this.categorieues = this.categorieues.sort((a, b) => b.idcategorie - a.idcategorie);
        this.totalRecords = this.categorieues.length;
        if (this.totalRecords > 0) {
          this.isEmpty = false;
        } else {
          this.isEmpty = true;
        }
        this.loadcategorieues = false;
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadcategorieues = false;
      }
    );
  }

  createCategorieue(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeCategorieueObject();
    this.categorieueservice.postCategorieue(this.categorieue).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "categorieue créee avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllcategorieues();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "categorieue non enregistrée.";
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

  updateCategorieue(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeCategorieueObject();
    const content = [
      {
        "op": "replace",
        "path": "/codecategorieue",
        "value": this.categorieue.getCodeCategorieue()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.categorieue.getNom()
      },
      {
        "op": "replace",
        "path": "/name",
        "value": this.categorieue.getName()
      },
      {
        "op": "replace",
        "path": "/annee",
        "value": this.categorieue.getAnnee()
      }
    ]
    this.categorieueservice.updateCategorieue(this.currentcategorieId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "categorieue modifiée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllcategorieues();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "categorieue non modifiée.";
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

  deleteCategorieue(idcategorie) {
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
          this.categorieueservice.deleteCategorieue(idcategorie).then(
            (result) => {
              this.getAllcategorieues().then((res) => {
                Swal.fire(
                  'categorieue Supprimée!',
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
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    })
  }

  initializeCategorieueObject(){
    this.categorieue.setCodeCategorieue(this.categorieueForm.get('codeCategorieue').value);
    this.categorieue.setNom(this.categorieueForm.get('nomCategorieue').value);
    this.categorieue.setName(this.categorieueForm.get('nameCategorieue').value);
    this.categorieue.setAnnee(this.utilsService.extractDate(this.categorieueForm.get('yearCategorieue').value));
  }

  fillFormBeforUpdating(categorieue){
    this.categorieueForm.reset();
    this.showCancelBtn = true;
    this.currentcategorieId = Number(categorieue.idcategorie);
    this.buttonAction = "Modifier";
    this.categorieueForm.get('codeCategorieue').setValue(categorieue.codecategorieue);
    this.categorieueForm.get('nomCategorieue').setValue(categorieue.nom);
    this.categorieueForm.get('nameCategorieue').setValue(categorieue.name);
    this.categorieueForm.get('yearCategorieue').setValue(categorieue.annee+"-01");
    window.scrollTo(0,0);
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.categorieueForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  submitAction(){
    if (this.buttonAction === 'Modifier') {
      this.updateCategorieue();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createCategorieue();
    }
  }

}
