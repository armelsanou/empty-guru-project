import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common';
import { transition, trigger, style, animate } from '@angular/animations';
import { SendNotificationService } from './../../../services/send-notication/send-notification.service';
import { SettingService } from './../../../services/setting/setting.service';
import { Ue } from '../../../entities/programme/ue';
import { FiliereService } from '../../../services/servicesDomaine/filiere/filiere.service';
import { UtilsService } from './../../../services/utils/utils.service';
import { UeService } from '../../../services/servicesProgramme/ue/ue.service';
import { DomaineService } from '../../../services/servicesDomaine/domaine/domaine.service';
import { SousDomaineService } from '../../../services/servicesDomaine/sous-domaine/sous-domaine.service';

@Component({
  selector: 'app-ue',
  templateUrl: './ue.component.html',
  styleUrls: ['./ue.component.scss',
  './../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'
  ],
})
export class UeComponent implements OnInit {

  public ues: any[] = [];
  public filieres: any[] = [];
  public domaines: any[] = [];
  public sousDomaines: any[] = [];
  public sousDomainesFiltered: any[] = [];
  public filieresFiltered: any[] = [];
  loadFilieres = false;
  ue = new Ue();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadUes = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  createLoad = false;
  updateLoad = false;
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentUeId: number;
  selectedFiliereId: any;
  selectedFiliereName: any;
  selectedSousDomainId: any;
  selectedSousDomainName: any;
  selectedDomainId: any;
  selectedDomainName: any = "";
  currentSousDomaine: any;
  currentFiliere: any;

  ueForm: FormGroup;
  nomDomain = new FormControl('', [Validators.required]);
  nomSousDomaine = new FormControl('', [Validators.required]);
  codeUe = new FormControl('', [Validators.required]);
  filiere = new FormControl('', [Validators.required]);
  nomUe = new FormControl('', [Validators.required]);
  nameUe = new FormControl('');
  yearUe= new FormControl('', [Validators.required]);

  constructor(
    public filiereService: FiliereService,
    public ueService: UeService,
    private sendNotificationService: SendNotificationService,
    private settingService : SettingService,
    private utilsService : UtilsService,
    public domaineService: DomaineService,
    public sousDomaineService: SousDomaineService,
  )
  {
    this.ueForm = new FormGroup({
      codeUe: this.codeUe,
      filiere: this.filiere,
      nomUe: this.nomUe,
      nameUe: this.nameUe,
      yearUe: this.yearUe,
      nomSousDomaine: this.nomSousDomaine,
      nomDomain: this.nomDomain
    });
  }

  ngOnInit() {
    this.loadUes = true;
    this.getAllDomaines();
    this.utilsService.setDateOfToday(this.ueForm,'yearUe');
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
          this.loadFilieres = false;
          this.isEmpty = true;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadFilieres = true;
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
        this.loadFilieres = false;
      }
    );
  }

  async getAllFilieres(){
    this.filiereService.getAllFilieres().subscribe(
      (result) => {
        this.filieres = result;
        this.filieres = this.filieres.sort((a, b) => b.idfiliere - a.idfiliere);
        this.getAllUes();
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadUes = false;
      }
    );
  }

  async getAllUes(){
    this.ueService.getAllUes().subscribe(
      (result) => {
        this.ues = result;
        this.ues = this.ues.sort((a, b) => b.idue - a.idue);
        this.totalRecords = this.ues.length;
        if (this.totalRecords > 0) {
          this.isEmpty = false;
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
        }
        this.loadUes = false;
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadUes = false;
      }
    );
  }

  initializeUeObject(){
    this.ue.setCodeUe(this.ueForm.get('codeUe').value);
    this.ue.setFiliere(this.selectedFiliereId);
    this.ue.setNom(this.ueForm.get('nomUe').value);
    this.ue.setName(this.ueForm.get('nameUe').value);
    this.ue.setAnnee(this.utilsService.extractDate(this.ueForm.get('yearUe').value));
  }

  fillFormBeforUpdating(ue){
    this.ueForm.reset();
    this.showCancelBtn = true;
    this.getFiliereNameById(ue.idfiliere);
    this.getFiliereById(ue.idfiliere);
    this.getSousDomaineById(this.currentFiliere.idsousdomaine);
    this.getDomainNameById(this.currentSousDomaine.iddomaine);
    this.getFiliereBySousDomaineId(Number(this.selectedSousDomainId));
    this.currentUeId = Number(ue.idue);
    this.buttonAction = "Modifier";
    this.ueForm.get('codeUe').setValue(ue.codeue);
    this.ueForm.get('filiere').setValue(ue.idfiliere);
    this.ueForm.get('nomUe').setValue(ue.nom);
    this.ueForm.get('nameUe').setValue(ue.name);
    this.ueForm.get('yearUe').setValue(ue.annee+"-01");
    this.ueForm.get('nomSousDomaine').setValue(this.selectedSousDomainId);
    this.ueForm.get('nomDomain').setValue(this.selectedDomainId);

    var options = Array(document.getElementById('filiere').getElementsByTagName('option'));
    for (let i = 0; i < options[0].length; i++) {
      if(Number(options[0][i].value) === Number(ue.idfiliere)){
        $(document).ready(function () {
          document.getElementById('filiere').getElementsByTagName('option')[options[0][i].index].selected = true;
        })
        break;
      }
    }

    var options = Array(document.getElementById('nomSousDomaine').getElementsByTagName('option'));
    for (let i = 0; i < options[0].length; i++) {
      if(Number(options[0][i].value) === Number(this.currentFiliere.idsousdomaine)){
        $(document).ready(function () {
          document.getElementById('nomSousDomaine').getElementsByTagName('option')[options[0][i].index].selected = true;
        })
        break;
      }
    }

    var optionsDomaine = Array(document.getElementById('nomDomain').getElementsByTagName('option'));
    for (let i = 0; i < optionsDomaine[0].length; i++) {
      if(Number(optionsDomaine[0][i].value) === Number(this.currentSousDomaine.iddomaine)){
        $(document).ready(function () {
          document.getElementById('nomDomain').getElementsByTagName('option')[optionsDomaine[0][i].index].selected = true;
        })
        break;
      }
    }
    window.scrollTo(0,0);
  }

  onSousDomainSelect(e){
    this.selectedSousDomainId = e.target.value;
    this.getSousDomaineById(Number(this.selectedSousDomainId));
    this.getFiliereBySousDomaineId(Number(this.selectedSousDomainId));
  }

  onDomainSelect(e){
    this.selectedDomainId = e.target.value;
    this.getDomainNameById(Number(this.selectedDomainId));
  }

  getSousDomaineById(idSousDomaine){
    let filiere = this.utilsService.filterByOneField(this.filieres, "idsousdomaine", idSousDomaine);
    this.selectedSousDomainName = filiere.nom;
    this.selectedSousDomainId = idSousDomaine;
    let souDo = this.utilsService.filterByOneField(this.sousDomaines, "idsousdomaine", idSousDomaine);
    this.currentSousDomaine = souDo;
    this.selectedDomainName = this.getDomainNameById(this.currentSousDomaine.iddomaine);
  }

  getDomainNameById(idDomain){
    let domain = this.utilsService.filterByOneField(this.domaines, "iddomaine", idDomain);
    this.selectedDomainName = domain.nom;
    this.selectedDomainId = idDomain;
    if (this.selectedDomainId != null) {
      this.sousDomainesFiltered = this.utilsService.getAllChildsByParentByValue(this.sousDomaines, "iddomaine", Number(this.selectedDomainId));
    }
  }

  onFiliereSelect(e){
    this.selectedFiliereId = e.target.value;
    this.getFiliereNameById(Number(this.selectedFiliereId));
    this.getFiliereById(this.selectedFiliereId);
  }

  getFiliereNameById(idFiliere){
    this.filieres.forEach(filiere => {
      if (filiere.idfiliere === idFiliere) {
        this.selectedFiliereName = filiere.nom;
      }
    });
  }

  getFiliereBySousDomaineId(idSousDomaine){
    this.filieresFiltered = this.utilsService.getAllChildsByParentByValue(this.filieres, "idsousdomaine", idSousDomaine);
  }

  getFiliereById(idFiliere){
    this.selectedFiliereId = idFiliere;
    this.currentFiliere = this.utilsService.filterByOneField(this.filieres, "idfiliere", Number(idFiliere));
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.ueForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  createUe(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeUeObject();
    const content = {
      "idfiliere": this.ue.getFiliere(),
      "codeue": this.ue.getCodeUe(),
      "nom": this.ue.getNom(),
      "name": this.ue.getName(),
      "annee": this.ue.getAnnee()
    }
    this.ueService.postUe(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Ue créee avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllFilieres();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Ue non enregistrée.";
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

  updateUe(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeUeObject();
    const content = [
      {
        "op": "replace",
        "path": "/idfiliere",
        "value": this.ue.getFiliere()
      },
      {
        "op": "replace",
        "path": "/codeue",
        "value": this.ue.getCodeUe()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.ue.getNom()
      },
      {
        "op": "replace",
        "path": "/name",
        "value": this.ue.getName()
      },
      {
        "op": "replace",
        "path": "/annee",
        "value": this.ue.getAnnee()
      },
    ]
    this.ueService.updateUe(this.currentUeId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Ue modifiée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllFilieres();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Ue non modifiée.";
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

  deleteUe(idUe) {
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
          this.ueService.deleteUe(idUe).then(
            (result) => {
              this.getAllUes().then((res) => {
                Swal.fire(
                  'Ue Supprimée!',
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
      this.updateUe();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createUe();
    }
  }

}
