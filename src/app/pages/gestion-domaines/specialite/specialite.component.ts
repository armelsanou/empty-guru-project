import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common';
import { transition, trigger, style, animate } from '@angular/animations';
import { SendNotificationService } from './../../../services/send-notication/send-notification.service';
import { SettingService } from './../../../services/setting/setting.service';
import { Specialite } from '../../../entities/domaine/specialite';
import { SpecialiteService } from '../../../services/servicesDomaine/specialite/specialite.service';
import { FiliereService } from '../../../services/servicesDomaine/filiere/filiere.service';
import { UtilsService } from './../../../services/utils/utils.service';
import { DomaineService } from '../../../services/servicesDomaine/domaine/domaine.service';
import { SousDomaineService } from '../../../services/servicesDomaine/sous-domaine/sous-domaine.service';

@Component({
  selector: 'app-specialite',
  templateUrl: './specialite.component.html',
  styleUrls: ['./specialite.component.scss',
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
],
providers: [DatePipe]
})
export class SpecialiteComponent implements OnInit {

  public specialites: any[] = [];
  public filieres: any[] = [];
  public domaines: any[] = [];
  public sousDomaines: any[] = [];
  public sousDomainesFiltered: any[] = [];
  public filieresFiltered: any[] = [];
  specialite = new Specialite();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadSpecialites = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  createLoad = false;
  updateLoad = false;
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentSpecialiteId: number;
  selectedFiliereId: any;
  selectedSousDomainId: any;
  selectedDomainId: any;
  currentSousDomaine: any;
  currentFiliere: any;
  currentDomaine: any;
  zeroResultat: string = "";
  zeroResultatFiliere: string = "";

  specialiteForm: FormGroup;
  nomDomain = new FormControl('', [Validators.required]);
  nomSousDomaine = new FormControl('', [Validators.required]);
  codeSpecialite = new FormControl('', [Validators.required]);
  filiere = new FormControl('', [Validators.required]);
  nomSpecialite = new FormControl('', [Validators.required]);
  nameSpecialite = new FormControl('');
  yearSpecialite= new FormControl('', [Validators.required]);

  constructor(
    public domaineService: DomaineService,
    public sousDomaineService: SousDomaineService,
    public filiereService: FiliereService,
    public specialiteService: SpecialiteService,
    private sendNotificationService: SendNotificationService,
    private settingService : SettingService,
    private utilsService : UtilsService
  )
  {
    this.specialiteForm = new FormGroup({
      codeSpecialite: this.codeSpecialite,
      filiere: this.filiere,
      nomSpecialite: this.nomSpecialite,
      nameSpecialite: this.nameSpecialite,
      yearSpecialite: this.yearSpecialite,
      nomDomain: this.nomDomain,
      nomSousDomaine: this.nomSousDomaine

    });
  }

  ngOnInit() {
    this.loadSpecialites = true;
    this.getAllFilieres();
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
          this.loadSpecialites = false;
          this.isEmpty = true;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadSpecialites = true;
      }
    );
  }

  async getAllSousDomaines(){
    this.sousDomaineService.getAllSousDomaines().subscribe(
      (result) => {
        this.sousDomaines = result;
        this.sousDomaines = this.sousDomaines.sort((a, b) => b.idsousdomaine - a.idsousdomaine);
        this.getAllFilieres();
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadSpecialites = false;
      }
    );
  }

  async getAllFilieres(){
    this.filiereService.getAllFilieres().subscribe(
      (result) => {
        this.filieres = result;
        this.filieres = this.filieres.sort((a, b) => b.idfiliere - a.idfiliere);
        this.getAllSpecialites();
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadSpecialites = false;
      }
    );
  }

  async getAllSpecialites(){
    this.specialiteService.getAllSpecialites().subscribe(
      (result) => {
        this.specialites = result;
        this.specialites = this.specialites.sort((a, b) => b.idspecialite - a.idspecialite);
        this.totalRecords = this.specialites.length;
        if (this.totalRecords > 0) {
          this.isEmpty = false;
          this.loadSpecialites = false
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
          this.loadSpecialites = false;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadSpecialites = false;
      }
    );
  }

  initializeSpecialiteObject(){
    this.specialite.setCodeSpecialite(this.specialiteForm.get('codeSpecialite').value);
    this.specialite.setFiliere(this.selectedFiliereId);
    this.specialite.setNom(this.specialiteForm.get('nomSpecialite').value);
    this.specialite.setName(this.specialiteForm.get('nameSpecialite').value);
    this.specialite.setAnnee(this.utilsService.extractDate(this.specialiteForm.get('yearSpecialite').value));
  }

  fillFormBeforUpdating(specialite){
    this.specialiteForm.reset();
    this.showCancelBtn = true;
    this.getFiliereBySpecialiteId(specialite.idfiliere);
    this.currentSpecialiteId = Number(specialite.idspecialite);
    this.buttonAction = "Modifier";
    this.specialiteForm.get('codeSpecialite').setValue(specialite.codespecialite);
    this.specialiteForm.get('filiere').setValue(specialite.idfiliere);
    this.specialiteForm.get('nomSpecialite').setValue(specialite.nom);
    this.specialiteForm.get('nameSpecialite').setValue(specialite.name);
    this.specialiteForm.get('yearSpecialite').setValue(specialite.annee+"-01");
    this.specialiteForm.get('nomDomain').setValue(this.currentDomaine.iddomaine);
    this.specialiteForm.get('nomSousDomaine').setValue(this.currentSousDomaine.idsousdomaine);

    var optionsDomaine = Array(document.getElementById('nomDomain').getElementsByTagName('option'));
    for (let i = 0; i < optionsDomaine[0].length; i++) {
      if(Number(optionsDomaine[0][i].value) === Number(this.selectedDomainId)){
        $(document).ready(function () {
          document.getElementById('nomDomain').getElementsByTagName('option')[optionsDomaine[0][i].index].selected = true;
        })
        break;
      }
    }

    var optionsSousDomaine = Array(document.getElementById('nomSousDomaine').getElementsByTagName('option'));
    for (let i = 0; i < optionsSousDomaine[0].length; i++) {
      if(Number(optionsSousDomaine[0][i].value) === Number(this.currentSousDomaine.idsousdomaine)){
        $(document).ready(function () {
          document.getElementById('nomSousDomaine').getElementsByTagName('option')[optionsSousDomaine[0][i].index].selected = true;
        })
        break;
      }
    }

    var optionsFiliere = Array(document.getElementById('filiere').getElementsByTagName('option'));
    for (let i = 0; i < optionsFiliere[0].length; i++) {
      if(Number(optionsFiliere[0][i].value) === Number(this.selectedFiliereId)){
        $(document).ready(function () {
          document.getElementById('filiere').getElementsByTagName('option')[optionsFiliere[0][i].index].selected = true;
        })
        break;
      }
    }
    window.scrollTo(0,0);
  }

  onFiliereSelect(e){
    this.selectedFiliereId = e.target.value;
  }

  getFilieresBySousDomaineId(idSousDomaine){
    this.filieresFiltered = this.utilsService.getAllChildsByParentByValue(this.filieres, "idsousdomaine", Number(idSousDomaine));
    if (this.filieresFiltered.length > 0) {
      this.zeroResultatFiliere = "";
    }else{
      this.zeroResultatFiliere = "rien";
    }
  }

  onDomainSelect(e){
    this.selectedDomainId = e.target.value;
    this.getDomainNameById(this.selectedDomainId);
  }

  onSousDomainSelect(e){
    this.selectedSousDomainId = e.target.value;
    this.getSousDomaineById(Number(this.selectedSousDomainId));
    this.getFilieresBySousDomaineId(this.selectedSousDomainId);
  }

  getSousDomaineById(idSousDomaine){
    this.currentSousDomaine = this.utilsService.filterByOneField(this.sousDomaines, "idsousdomaine", Number(idSousDomaine));
    this.selectedSousDomainId = idSousDomaine;
  }

  getDomainNameById(idDomain){
    this.currentDomaine = this.utilsService.filterByOneField(this.domaines, "iddomaine",  Number(idDomain));
    this.selectedDomainId = idDomain;
    if (this.selectedDomainId != null) {
      this.sousDomainesFiltered = this.utilsService.getAllChildsByParentByValue(this.sousDomaines, "iddomaine", Number(this.selectedDomainId));
    }
    if (this.sousDomainesFiltered.length > 0) {
      this.zeroResultat = "";
    }else{
      this.zeroResultat = "rien";
    }
  }

  getFiliereBySpecialiteId(idFiliere){
    this.currentFiliere = this.utilsService.filterByOneField(this.filieres, "idfiliere", idFiliere);
    this.selectedFiliereId = this.currentFiliere.idfiliere;
    this.getSousDomaineById(this.currentFiliere.idsousdomaine);
    if (this.currentSousDomaine.idsousdomaine != 0) {
      this.getDomainNameById(this.currentSousDomaine.iddomaine);
      this.getFilieresBySousDomaineId(this.currentFiliere.idsousdomaine);
    }
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.specialiteForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
    this.sousDomainesFiltered = [];
    this.filieresFiltered = [];
  }

  createSpecialite(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeSpecialiteObject();
    const content = {
      "idfiliere": this.specialite.getFiliere(),
      "codespecialite": this.specialite.getCodeSpecialite(),
      "nom": this.specialite.getNom(),
      "name": this.specialite.getName(),
      "annee": this.specialite.getAnnee()
    }
    this.specialiteService.postSpecialite(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Spécialité créee avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllFilieres();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Spécialité non enregistrée.";
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

  updateSpecialite(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeSpecialiteObject();
    const content = [
      {
        "op": "replace",
        "path": "/idfiliere",
        "value": Number(this.selectedFiliereId)
      },
      {
        "op": "replace",
        "path": "/codespecialite",
        "value": this.specialite.getCodeSpecialite()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.specialite.getNom()
      },
      {
        "op": "replace",
        "path": "/name",
        "value": this.specialite.getName()
      },
      {
        "op": "replace",
        "path": "/annee",
        "value": this.specialite.getAnnee()
      },
    ]
    this.specialiteService.updateSpecialite(this.currentSpecialiteId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Spécialité modifiée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllFilieres();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Spécialité non modifiée.";
          this.sendNotificationService.addToast(this.settingService.option, "error");
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

  deleteSpecialite(idSpecialite) {
    Swal.fire({
      title: 'Etes-vous sûr?',
      text: "Cette action n'est pas reversible!",
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.specialiteService.deleteSpecialite(idSpecialite).then(
            (result) => {
              this.getAllSpecialites().then((res) => {
                Swal.fire(
                  'Spécialité Supprimée!',
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
      this.updateSpecialite();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createSpecialite();
    }
  }

}
