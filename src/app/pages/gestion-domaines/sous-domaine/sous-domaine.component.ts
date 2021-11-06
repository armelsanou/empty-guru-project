import { DomaineService } from '../../../services/servicesDomaine/domaine/domaine.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { transition, trigger, style, animate } from '@angular/animations';
import { SendNotificationService } from './../../../services/send-notication/send-notification.service';
import { SettingService } from './../../../services/setting/setting.service';
import { SousDomaine } from '../../../entities/domaine/sous-domaine';
import { SousDomaineService } from '../../../services/servicesDomaine/sous-domaine/sous-domaine.service';
import { UtilsService } from './../../../services/utils/utils.service';

@Component({
  selector: 'app-sous-domaine',
  templateUrl: './sous-domaine.component.html',
  styleUrls: ['./sous-domaine.component.scss',
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

export class SousDomaineComponent implements OnInit {

  public domaines: any[] = [];
  public sousDomaines: any[] = [];
  sousDomaine = new SousDomaine();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadSousDomaines = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  createLoad = false;
  updateLoad = false;
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentSousDomaineId: number;
  selectedDomainId: any;
  selectedDomainName: any;

  sousDomainForm: FormGroup;
  codeSousDomain = new FormControl('', [Validators.required]);
  nomDomain = new FormControl('', [Validators.required]);
  nomSousDomain = new FormControl('', [Validators.required]);
  nameSousDomain = new FormControl('');
  yearSousDomain = new FormControl('', [Validators.required]);

  constructor(
    public domaineService: DomaineService,
    public sousDomaineService: SousDomaineService,
    private sendNotificationService: SendNotificationService,
    private settingService : SettingService,
    private utilsService : UtilsService
  )
  {
    this.sousDomainForm = new FormGroup({
      codeSousDomain: this.codeSousDomain,
      nomDomain: this.nomDomain,
      nomSousDomain: this.nomSousDomain,
      nameSousDomain: this.nameSousDomain,
      yearSousDomain: this.yearSousDomain
    });
  }

  ngOnInit() {
    this.loadSousDomaines = true;
    this.getAllDomaines();
  }

  async getAllDomaines(){
    this.domaineService.getListDomaines().subscribe(
      (result) => {
        this.domaines = result;
        this.domaines = this.domaines.sort((a, b) => b.iddomaine - a.iddomaine);
        if (this.domaines.length > 0) {
          this.getAllSousDomaines();
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.loadSousDomaines = false;
          this.isEmpty = true;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadSousDomaines = true;
      }
    );
  }

  async getAllSousDomaines(){
    this.sousDomaineService.getAllSousDomaines().subscribe(
      (result) => {
        this.sousDomaines = result;
        this.sousDomaines = this.sousDomaines.sort((a, b) => b.idsousdomaine - a.idsousdomaine);
        this.totalRecords = this.sousDomaines.length;
        if (this.totalRecords > 0) {
          this.loadSousDomaines = false
          this.isEmpty = false;
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
          this.loadSousDomaines = false;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadSousDomaines = false;
      }
    );
  }

  initializeSousDomaineObject(){
    this.sousDomaine.setCodeSousDomaine(this.sousDomainForm.get('codeSousDomain').value);
    this.sousDomaine.setIdDomaine(this.selectedDomainId);
    this.sousDomaine.setNom(this.sousDomainForm.get('nomSousDomain').value);
    this.sousDomaine.setName(this.sousDomainForm.get('nameSousDomain').value);
    this.sousDomaine.setAnnee(this.utilsService.extractDate(this.sousDomainForm.get('yearSousDomain').value));
  }

  fillFormBeforUpdating(sousDomaine){
    this.sousDomainForm.reset();
    this.showCancelBtn = true;
    this.getDomainNameById(sousDomaine.iddomaine);
    this.currentSousDomaineId = Number(sousDomaine.idsousdomaine);
    this.selectedDomainId = sousDomaine.iddomaine;
    this.buttonAction = "Modifier";
    this.sousDomainForm.get('codeSousDomain').setValue(sousDomaine.codesousdomaine);
    this.sousDomainForm.get('nomDomain').setValue(this.selectedDomainName);
    this.sousDomainForm.get('nomSousDomain').setValue(sousDomaine.nom);
    var options = Array(document.getElementById('nomDomain').getElementsByTagName('option'));
    for (let i = 0; i < options[0].length; i++) {
      if(Number(options[0][i].value) === Number(sousDomaine.iddomaine)){
        $(document).ready(function () {
          document.getElementById('nomDomain').getElementsByTagName('option')[options[0][i].index].selected = true;
        })
        break;
      }
    }
    this.sousDomainForm.get('nameSousDomain').setValue(sousDomaine.name);
    this.sousDomainForm.get('yearSousDomain').setValue(sousDomaine.annee+"-01");
    window.scrollTo(0,0);
  }

  onDomainSelect(e){
    this.selectedDomainId = e.target.value;
    this.getDomainNameById(Number(this.selectedDomainId));
  }

  getDomainNameById(idDomain){
    let domaine = this.utilsService.filterByOneField(this.domaines, "iddomaine", idDomain);
    this.selectedDomainName = domaine.nom;
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.sousDomainForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  createSousDomaine(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeSousDomaineObject();
    const content = {
      "iddomaine": this.sousDomaine.getIdDomaine(),
      "codesousdomaine": this.sousDomaine.getCodeSousDomaine(),
      "nom": this.sousDomaine.getNom(),
      "name": this.sousDomaine.getName(),
      "annee": this.sousDomaine.getAnnee()
    }
    this.sousDomaineService.postSousDomaine(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Sous-domaine crée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllDomaines();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Sous-Domaine non enregistré.";
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

  updateSousDomaine(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeSousDomaineObject();
    const content = [
      {
        "op": "replace",
        "path": "/iddomaine",
        "value": Number(this.selectedDomainId)
      },
      {
        "op": "replace",
        "path": "/codesousdomaine",
        "value": this.sousDomaine.getCodeSousDomaine()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.sousDomaine.getNom()
      },
      {
        "op": "replace",
        "path": "/name",
        "value": this.sousDomaine.getName()
      },
      {
        "op": "replace",
        "path": "/annee",
        "value": this.sousDomaine.getAnnee()
      },
    ]
    this.sousDomaineService.updateSousDomaine(this.currentSousDomaineId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Sous-Domaine modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllDomaines();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Sous-Domaine non modifié.";
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

  deleteSousDomaine(idSousDomaine) {
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
          this.sousDomaineService.deleteSousDomaine(idSousDomaine).then(
            (result) => {
              this.getAllSousDomaines().then((res) => {
                Swal.fire(
                  'Sous-domaine Supprimé!',
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
      this.updateSousDomaine();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createSousDomaine();
    }
  }

}
