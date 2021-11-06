import { Domaine } from '../../../entities/domaine/domaine';
import { DomaineService } from '../../../services/servicesDomaine/domaine/domaine.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { transition, trigger, style, animate } from '@angular/animations';
import { SendNotificationService } from '../../../services/send-notication/send-notification.service';
import { SettingService } from '../../../services/setting/setting.service';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-domaine',
  templateUrl: './domaine.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './domaine.component.scss',
    './../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'
  ],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class DomaineComponent implements OnInit {

  public domaines: any[] = [];
  domaine = new Domaine();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadDomaines = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  createLoad = false;
  updateLoad = false;
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentDomaineId: number;

  domainForm: FormGroup;
  codeDomain = new FormControl('', [Validators.required]);
  nomDomain = new FormControl('', [Validators.required]);
  nameDomain = new FormControl('');
  yearDomain = new FormControl('', [Validators.required]);

  constructor(
    public domaineService: DomaineService,
    private sendNotificationService: SendNotificationService,
    private settingService : SettingService,
    private utilsService : UtilsService
  )
  {
    this.domainForm = new FormGroup({
      codeDomain: this.codeDomain,
      nomDomain: this.nomDomain,
      nameDomain: this.nameDomain,
      yearDomain: this.yearDomain
    });
  }

  ngOnInit() {
    this.loadDomaines = true;
    this.getAllDomaines();
  }

  async getAllDomaines(){
    this.domaineService.getListDomaines().subscribe(
      (result) => {
        this.domaines = result;
        this.totalRecords = this.domaines.length;
        if (this.totalRecords > 1) {
          this.domaines = this.domaines.sort((a, b) => b.iddomaine - a.iddomaine);
        }else if(this.totalRecords === 1){
          this.domaines = result;
          this.isEmpty = false;
        }else{
          this.isEmpty = true;
        }
        this.loadDomaines = false
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.isEmpty = true;
        this.loadDomaines = false;
      }
    );
  }

  initializeDomaineObject(){
    this.domaine.setCodeDomaine(this.domainForm.get('codeDomain').value);
    this.domaine.setNom(this.domainForm.get('nomDomain').value);
    this.domaine.setName(this.domainForm.get('nameDomain').value);
    this.domaine.setAnnee(this.utilsService.extractDate(this.domainForm.get('yearDomain').value));
  }

  fillFormBeforUpdating(domaine){
    this.domainForm.reset();
    this.showCancelBtn = true;
    this.currentDomaineId = Number(domaine.iddomaine);
    this.buttonAction = "Modifier";
    this.domainForm.get('codeDomain').setValue(domaine.codedomaine);
    this.domainForm.get('nomDomain').setValue(domaine.nom);
    this.domainForm.get('nameDomain').setValue(domaine.name);
    this.domainForm.get('yearDomain').setValue(domaine.annee+"-01");
    window.scrollTo(0,0);
  }

  reset(){
    this.domainForm.reset();
    this.buttonAction = "Enregistrer";
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  updateDomaine(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeDomaineObject();
    const content = [
      {
        "op": "replace",
        "path": "/codedomaine",
        "value": this.domaine.getCodeDomaine()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.domaine.getNom()
      },
      {
        "op": "replace",
        "path": "/name",
        "value": this.domaine.getName()
      },
      {
        "op": "replace",
        "path": "/annee",
        "value": this.domaine.getAnnee()
      },
    ]
    this.domaineService.updateDomaine(this.currentDomaineId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Domaine modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllDomaines();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Domaine non modifié.";
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

  createDomaine(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeDomaineObject();
    const content = {
      "codedomaine": this.domaine.getCodeDomaine(),
      "nom": this.domaine.getNom(),
      "name": this.domaine.getName(),
      "annee": this.domaine.getAnnee()
    }
    this.domaineService.postDomaine(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Domaine crée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllDomaines();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Domaine non enregistré.";
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

  deleteDomaine(idDomaine) {
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
          this.domaineService.deleteDomaine(idDomaine).then(
            (result) => {
              this.getAllDomaines().then((res) => {
                Swal.fire(
                  'Domaine Supprimé!',
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

  submitAction(){
    if (this.buttonAction === 'Modifier') {
      this.updateDomaine();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createDomaine();
    }
  }

}
