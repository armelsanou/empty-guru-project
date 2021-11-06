import { CycleDomaineService } from './../../../services/servicesDomaine/cycle-domaine/cycle-domaine.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClasseService } from '../../../services/servicesDomaine/classe/classe.service';
import { Classe } from '../../../entities/domaine/classe';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CycleService } from '../../../services/servicesDomaine/cycle/cycle.service';
import { Cycle } from '../../../entities/domaine/cycle';
import { Niveau } from '../../../entities/domaine/niveau';
import { NiveauService } from '../../../services/servicesDomaine/niveau/niveau.service';
import { SettingService } from '../../../services/setting/setting.service';
import { SendNotificationService } from '../../../services/send-notication/send-notification.service';
import { SpecialiteService } from '../../../services/servicesDomaine/specialite/specialite.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { DomaineService } from '../../../services/servicesDomaine/domaine/domaine.service';
import { FiliereService } from '../../../services/servicesDomaine/filiere/filiere.service';
import { SousDomaineService } from '../../../services/servicesDomaine/sous-domaine/sous-domaine.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.scss']
})
export class ClasseComponent implements OnInit {

  public filieres: any[] = [];
  public domaines: any[] = [];
  public cyclesDomaines: any[] = [];
  public sousDomaines: any[] = [];
  public sousDomainesFiltered: any[] = [];
  public filieresFiltered: any[] = [];
  public specialitesFiltered: any[] = [];
  public classes: any[] = [];
  public specialites: any[] = [];
  public cycles: any[] = [];
  public cyclesFiltered: any[] = [];
  public niveaux: any[] = [];
  public niveauxFiltered: any[] = [];
  niveau = new Niveau();
  cycle = new Cycle();
  classe = new Classe();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadClasses = false;
  createLoad = false;
  updateLoad = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentClasseId: number;
  deleted = false;
  selectedCycleCode: any;
  selectedNiveauCode: any;
  selectedSpecialiteId: any;
  currentNiveau: any;
  currentSpecialiteId: number;
  selectedFiliereId: any;
  selectedSousDomainId: any;
  selectedDomainId: any;
  currentSousDomaine: any;
  currentFiliere: any;
  currentDomaine: any;
  currentSpecialite: any;
  zeroResultat: string = "";
  zeroResultatFiliere: string = "";
  zeroResultatSpecialite: string = "";
  zeroResultatCycle: string = "";
  zeroResultatNiveau: string = "";

  classeForm: FormGroup;
  nomDomain = new FormControl('', [Validators.required]);
  nomSousDomaine = new FormControl('', [Validators.required]);
  filiere = new FormControl('', [Validators.required]);
  codeClasse = new FormControl('', [Validators.required]);
  codeCycle = new FormControl('', [Validators.required]);
  codeNiveau = new FormControl('', [Validators.required]);
  nomSpecialite = new FormControl('', [Validators.required]);
  nomClasse = new FormControl('', [Validators.required]);
  nameClasse = new FormControl('');
  yearClasse = new FormControl('', [Validators.required]);
  year: string;

  constructor(
    public httpClient: HttpClient,
    public classeService: ClasseService,
    public domaineService: DomaineService,
    public cycleDomaineService: CycleDomaineService,
    public sousDomaineService: SousDomaineService,
    public filiereService: FiliereService,
    public specialiteService: SpecialiteService,
    public niveauService: NiveauService,
    public cycleService: CycleService,
    private settingService : SettingService,
    private sendNotificationService: SendNotificationService,
    private utilsService : UtilsService
  )
  {
    this.classeForm = new FormGroup({
      nomDomain: this.nomDomain,
      nomSousDomaine: this.nomSousDomaine,
      filiere: this.filiere,
      codeClasse: this.codeClasse,
      codeCycle: this.codeCycle,
      codeNiveau: this.codeNiveau,
      nomSpecialite: this.nomSpecialite,
      nomClasse: this.nomClasse,
      nameClasse: this.nameClasse,
      yearClasse: this.yearClasse
    });
  }

  ngOnInit() {
    this.loadClasses = true;
    this.getAllCycles();
    this.getAllDomaines();
    this.getAllCyclesDomaines();
    this.year = this.utilsService.getDateOfToday();
    this.utilsService.setDateOfToday(this.classeForm,'yearClasse');
  }

  onCycleSelect(e){
    this.selectedCycleCode = e.target.value;
    if (this.selectedCycleCode != null && this.selectedCycleCode != "") {
      this.getNiveauxByCodeCycle(this.selectedCycleCode);
    }
    if (this.niveauxFiltered.length > 0) {
      this.zeroResultatNiveau = "";
    }else{
      this.zeroResultatNiveau = "rien";
    }
  }

  onNiveauSelect(e){
    this.selectedNiveauCode = e.target.value;
  }

  onSpecialiteSelect(e){
    this.selectedSpecialiteId = e.target.value;
  }

  onFiliereSelect(e){
    this.selectedFiliereId = e.target.value;
    if (this.selectedFiliereId != null && this.selectedFiliereId != "") {
      this.getSpecialitesByFiliereId(this.selectedFiliereId);
    }
    if (this.specialitesFiltered.length > 0) {
      this.zeroResultatSpecialite = "";
    }else{
      this.zeroResultatSpecialite = "rien";
    }
  }

  getFilieresBySousDomaineId(idSousDomaine){
    this.filieresFiltered = this.utilsService.getAllChildsByParentByValue(this.filieres, "idsousdomaine", Number(idSousDomaine));
    if (this.filieresFiltered.length > 0) {
      this.zeroResultatFiliere = "";
    }else{
      this.zeroResultatFiliere = "rien";
    }
  }

  getSpecialitesByFiliereId(idFiliere){
    this.specialitesFiltered = this.utilsService.getAllChildsByParentByValue(this.specialites, "idfiliere", Number(idFiliere));
    if (this.specialitesFiltered.length > 0) {
      this.zeroResultatSpecialite = "";
    }else{
      this.zeroResultatSpecialite = "rien";
    }
  }

  onDomainSelect(e){
    this.selectedDomainId = e.target.value;
    this.getDomainNameById(this.selectedDomainId);
    this.getCyclesByDomaineId(this.selectedDomainId);
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

  getCyclesByDomaineId(idDomaine){
    let cycleDomainesTemps = null;
    if (idDomaine != null && idDomaine != "") {
      cycleDomainesTemps = this.utilsService.filterByOneField(this.cyclesDomaines, "iddomaine", Number(idDomaine));
      this.cyclesFiltered = this.utilsService.getAllChildsByParentByValue(this.cycles, "codecycle", cycleDomainesTemps.codecycle);
    }
    if (this.cyclesFiltered.length > 0) {
      this.zeroResultatCycle = "";
    }else{
      this.zeroResultatCycle = "rien";
    }
  }

  getFiliereById(idFiliere){
    this.currentFiliere = this.utilsService.filterByOneField(this.filieres, "idfiliere", idFiliere);
    this.selectedFiliereId = this.currentFiliere.idfiliere;
    this.getSousDomaineById(this.currentFiliere.idsousdomaine);
    if (this.currentSousDomaine.idsousdomaine != 0) {
      this.getDomainNameById(this.currentSousDomaine.iddomaine);
    }
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
          this.isEmpty = true;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
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
      }
    );
  }

  async getAllClasses(){
    this.classeService.getListClasses().subscribe(
      (result) => {
        this.classes = result;
        this.classes = this.classes.sort((a, b) => b.idclasse - a.idclasse);
        this.totalRecords = this.classes.length;
        if (this.totalRecords > 0) {
          this.isEmpty = false;
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
        }
        this.loadClasses = false;
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadClasses = true;
      }
    );
  }

  async getAllCycles(){
    this.cycleService.getListCycles().subscribe(
      (result) => {
        this.cycles = result;
        this.cycles = this.cycles.sort((a, b) => b.idcycle - a.idcycle);
        this.getAllNiveaux();
        this.getAllSpecialites();
        this.getAllClasses();
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getAllCyclesDomaines(){
    this.cycleDomaineService.getListCyclesDomaines().subscribe(
      (result) => {
        this.cyclesDomaines = result;
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getAllNiveaux(){
    this.niveauService.getListNiveaux().subscribe(
      (result) => {
        this.niveaux = result;
        this.niveaux = this.niveaux.sort((a, b) => b.idniveau - a.idniveau);
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getAllSpecialites(){
    this.specialiteService.getAllSpecialites().subscribe(
      (result) => {
        this.specialites = result;
        this.specialites = this.specialites.sort((a, b) => b.idspecialite - a.idspecialite);
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  getCycleByNiveauId(codeniveau){
    this.currentNiveau = this.utilsService.filterByOneField(this.niveaux, "codeniveau", codeniveau);
  }
  
  getNiveauxByCodeCycle(codCycle){
    this.niveauxFiltered = this.utilsService.getAllChildsByParentByValue(this.niveaux, "codecycle", codCycle);
  }

  getSpecialiteByFiliereId(idfiliere){
    this.specialitesFiltered = this.utilsService.getAllChildsByParentByValue(this.specialites, "idfiliere", idfiliere);
  }

  getSpecialiteById(idSpecialite){
    this.currentSpecialite = this.utilsService.filterByOneField(this.specialites, "idspecialite", idSpecialite);
    this.getFiliereById(this.currentSpecialite.idfiliere);
  }

  createClasse(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeClasseObject();
    this.classeService.postClasse(this.classe,this.selectedCycleCode,this.selectedNiveauCode,this.selectedSpecialiteId).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Classe créee avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllClasses();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Classe non enregistrée.";
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

  updateClasse(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeClasseObject();
    const content = [
      {
        "op": "replace",
        "path": "/codeniveau",
        "value": this.classeForm.get('codeNiveau').value
      },
      {
        "op": "replace",
        "path": "/idspecialite",
        "value": this.classeForm.get('nomSpecialite').value
      },
      {
        "op": "replace",
        "path": "/codeclasse",
        "value": this.classe.getCodeClasse()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.classe.getNom()
      },
      {
        "op": "replace",
        "path": "/name",
        "value": this.classe.getName()
      },
      {
        "op": "replace",
        "path": "/annee",
        "value": this.classe.getAnnee()
      }
    ]
    this.classeService.updateClasse(this.currentClasseId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Classe modifiée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllClasses();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Classe non modifiée.";
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

  deleteClasse(idClasse) {
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
          this.classeService.deleteClasse(idClasse).then(
            (result) => {
              this.getAllClasses().then((res) => {
                Swal.fire(
                  'Classe Supprimée!',
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

  initializeClasseObject(){
    this.classe.setCodeClasse(this.classeForm.get('codeClasse').value);
    this.classe.setNom(this.classeForm.get('nomClasse').value);
    this.classe.setName(this.classeForm.get('nameClasse').value);
    this.classe.setAnnee(this.utilsService.extractDate(this.classeForm.get('yearClasse').value));
  }

  fillFormBeforUpdating(classe){
    this.getCycleByNiveauId(classe.codeniveau);
    this.classeForm.reset();
    this.showCancelBtn = true;
    this.selectedCycleCode = classe.codecycle;
    this.selectedNiveauCode = classe.codeniveau;
    this.getSpecialiteById(classe.idspecialite);
    this.getSpecialiteByFiliereId(this.currentSpecialite.idfiliere);
    this.getNiveauxByCodeCycle(this.currentNiveau.codecycle);
    this.getFiliereById(this.currentSpecialite.idfiliere);
    this.getFilieresBySousDomaineId(this.selectedSousDomainId);
    this.getCyclesByDomaineId(this.currentDomaine.iddomaine);
    this.currentClasseId = Number(classe.idclasse);
    this.buttonAction = "Modifier";
    this.classeForm.get('nomDomain').setValue(this.currentDomaine.iddomaine);
    this.classeForm.get('nomSousDomaine').setValue(this.currentSousDomaine.idsousdomaine);
    this.classeForm.get('filiere').setValue(this.currentSpecialite.idfiliere);
    this.classeForm.get('codeClasse').setValue(classe.codeclasse);
    this.classeForm.get('codeCycle').setValue(this.currentNiveau.codecycle);
    this.classeForm.get('codeNiveau').setValue(classe.codeniveau);
    this.classeForm.get('nomSpecialite').setValue(this.currentSpecialite.idspecialite);
    this.classeForm.get('nomClasse').setValue(classe.nom);
    this.classeForm.get('nameClasse').setValue(classe.name);
    this.classeForm.get('yearClasse').setValue(classe.annee+"-01");

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

    var optionsCycles = Array(document.getElementById('codeCycle').getElementsByTagName('option'));
    for (let i = 0; i < optionsCycles[0].length; i++) {
      if(optionsCycles[0][i].value === this.currentNiveau.codecycle){
        $(document).ready(function () {
          document.getElementById('codeCycle').getElementsByTagName('option')[optionsCycles[0][i].index].selected = true;
        })
        break;
      }
    }

    var optionsNiveaux = Array(document.getElementById('codeNiveau').getElementsByTagName('option'));
    for (let i = 0; i < optionsNiveaux[0].length; i++) {
      if(optionsNiveaux[0][i].value === classe.codeniveau){
        $(document).ready(function () {
          document.getElementById('codeNiveau').getElementsByTagName('option')[optionsNiveaux[0][i].index].selected = true;
        })
        break;
      }
    }

    var optionsFilieres = Array(document.getElementById('filiere').getElementsByTagName('option'));
    for (let i = 0; i < optionsFilieres[0].length; i++) {
      if(Number(optionsFilieres[0][i].value) === classe.idfiliere){
        $(document).ready(function () {
          document.getElementById('filiere').getElementsByTagName('option')[optionsFilieres[0][i].index].selected = true;
        })
        break;
      }
    }

    var optionsSpecialites = Array(document.getElementById('nomSpecialite').getElementsByTagName('option'));
    for (let i = 0; i < optionsSpecialites[0].length; i++) {
      if(Number(optionsSpecialites[0][i].value) === classe.idspecialite){
        $(document).ready(function () {
          document.getElementById('nomSpecialite').getElementsByTagName('option')[optionsSpecialites[0][i].index].selected = true;
        })
        break;
      }
    }
    window.scrollTo(0,0);
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.classeForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  submitAction(){
    if (this.buttonAction === 'Modifier') {
      this.updateClasse();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createClasse();
    }
  }

}
