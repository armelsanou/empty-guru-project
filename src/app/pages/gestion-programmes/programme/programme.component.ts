import { NiveauService } from './../../../services/servicesDomaine/niveau/niveau.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgrammeService } from '../../../services/servicesProgramme/programme/programme.service';
import { UeService } from '../../../services/servicesProgramme/ue/ue.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { SendNotificationService } from '../../../services/send-notication/send-notification.service';
import { SettingService } from '../../../services/setting/setting.service';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Programme } from '../../../entities/programme/programme';
import { SpecialiteService } from '../../../services/servicesDomaine/specialite/specialite.service';
import { ClasseService } from '../../../services/servicesDomaine/classe/classe.service';
import { DomaineService } from '../../../services/servicesDomaine/domaine/domaine.service';
import { FiliereService } from '../../../services/servicesDomaine/filiere/filiere.service';
import { SousDomaineService } from '../../../services/servicesDomaine/sous-domaine/sous-domaine.service';
import { SemestreService } from '../../../services/servicesProgramme/semestre/semestre.service';
import { CategorieueService } from '../../../services/servicesProgramme/categorie-ue/categorieue.service';

@Component({
  selector: 'app-programme',
  templateUrl: './programme.component.html',
  styleUrls: ['./programme.component.scss']
})
export class ProgrammeComponent implements OnInit {

  public ues: any[] = [];
  public semestres: any[] = [];
  public classes: any[] = [];
  public programmes: any[] = [];
  public sousDomaines: any[] = [];
  public niveaux: any[] = [];
  public sousDomainesFiltered: any[] = [];
  public filieresFiltered: any[] = [];

  public sousDomainesFilteredForUeForm: any[] = [];
  public filieresFilteredForUeForm: any[] = [];

  public classesFiltered: any[] = [];
  public specialitesFiltered: any[] = [];
  public niveauxFiltered: any[] = [];
  public semestresFiltered: any[] = [];
  public uesFiltered: any[] = [];
  public specialites: any[] = [];
  public domaines: any[] = [];
  public filieres: any[] = [];
  public categorieues: any[] = [];
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  totalRecords: number;
  programme = new Programme();
  oldProgramme = new Programme();
  public sortOrder = 'desc';
  loadProgrammes = false;
  deleteLoading = false;
  showCancelBtn = false;
  createLoad = false;
  updateLoad = false;
  isEmpty = false;
  deleteMessage = "Supprimer";
  buttonAction = "Enregistrer";
  selectedFiliereId: any;
  selectedSousDomainId: any;
  selectedDomainId: any;
  selectedSpecialiteId: any;
  currentSousDomaine: any;
  currentFiliere: any;
  currentClasse: any;
  currentDomaine: any;
  currentSpecialite: any;
  currentEvaluationId: number;
  zeroResultat: string = "";
  zeroResultatFiliere: string = "";
  zeroResultatClasse: string = "";
  zeroResultatSpecialite: string = "";
  zeroResultatSemestre: string = "";
  zeroResultatUe: string = "";
  zeroResultatForUeForm: string = "";
  selectedEcCode: any;
  selectedClasseId: any;
  selectedUeId: any;
  selectedSemestreId: any;
  selectedCategorieUeId: any;
  currentNiveau: any;
  error: {};
  currentDomainForUeForm: any;
  currentSousDomaineForUeForm: any;
  currentFiliereForUeForm: any;

  programmeForm: FormGroup;
  nomDomain = new FormControl('');
  nomSousDomaine = new FormControl('');
  filiere = new FormControl('');
  
  nomDomainForUeForm = new FormControl('');
  nomSousDomaineForUeForm = new FormControl('');
  filiereForUeForm = new FormControl('');

  nomSpecialite = new FormControl('');
  idsemestre = new FormControl('', [Validators.required]);
  idclasse = new FormControl('', [Validators.required]);
  idcategorie = new FormControl('', [Validators.required]);
  idue = new FormControl('', [Validators.required]);
  annee = new FormControl('', [Validators.required]);
  credit = new FormControl('', [Validators.required]);

  constructor(
    public httpClient: HttpClient,
    public ueService: UeService,
    public programmeService: ProgrammeService,
    private utilsService : UtilsService,
    private sendNotificationService: SendNotificationService,
    private settingService : SettingService,
    public domaineService: DomaineService,
    public sousDomaineService: SousDomaineService,
    public filiereService: FiliereService,
    public specialiteService: SpecialiteService,
    public classeService: ClasseService,
    public semestreService: SemestreService,
    public niveauService: NiveauService,
    public categorieueservice: CategorieueService
  )
  {
    this.programmeForm = new FormGroup({
      nomDomain: this.nomDomain,
      nomSousDomaine: this.nomSousDomaine,
      filiere: this.filiere,

      nomDomainForUeForm: this.nomDomainForUeForm,
      nomSousDomaineForUeForm: this.nomSousDomaineForUeForm,
      filiereForUeForm: this.filiereForUeForm,
      nomSpecialite: this.nomSpecialite,

      idsemestre: this.idsemestre,
      idclasse: this.idclasse,
      idcategorie: this.idcategorie,
      idue: this.idue,
      annee: this.annee,
      credit: this.credit
    });
  }

  ngOnInit() {
    this.loadProgrammes = false;
    this.isEmpty = true;
    //this.getAllProgrammes();
    this.getAllDomaines();
    this.getAllSemestres();
    this.getAllNiveaux();
    this.utilsService.setDateOfToday(this.programmeForm,'annee');
  }

  reset(){
    this.programmeForm.reset();
    this.buttonAction = "Enregistrer";
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  fillFormBeforUpdating(programme){
    this.getClasseById(programme.idclasse);
    this.getSpecialiteById(this.currentClasse.idspecialite);
    this.getSpecialitesByFiliereId(this.currentSpecialite.idfiliere);
    this.getClassesBySpecialiteId(this.currentClasse.idspecialite);
    this.getFiliereById(this.currentSpecialite.idfiliere);
    this.getFilieresBySousDomaineId(this.currentFiliere.idsousdomaine);
    this.getNiveauxByCodeNiveau(this.currentClasse.codeniveau);
    this.getNiveauByCode(this.currentClasse.codeniveau);
    this.getSemestresByCodeNiveau(this.currentNiveau.codeniveau);
    this.getUesByFiliereId(this.currentFiliere.idfiliere);
    this.oldProgramme = programme;
    this.programmeForm.reset();
    this.showCancelBtn = true;
    this.buttonAction = "Modifier";
    this.programmeForm.get('nomDomain').setValue(this.currentDomaine.iddomaine);
    this.programmeForm.get('nomSousDomaine').setValue(this.currentSousDomaine.idsousdomaine);
    this.programmeForm.get('filiere').setValue(this.currentSpecialite.idfiliere);
    this.programmeForm.get('nomSpecialite').setValue(this.currentSpecialite.idspecialite);
    this.programmeForm.get('idsemestre').setValue(programme.idsemestre);
    this.programmeForm.get('idclasse').setValue(programme.idclasse);
    this.programmeForm.get('idcategorie').setValue(programme.idcategorie);
    this.programmeForm.get('idue').setValue(programme.idue);
    this.programmeForm.get('annee').setValue(programme.annee+"-01");
    this.programmeForm.get('credit').setValue(programme.credit);
    this.programmeForm.get('nomSousDomaineForUeForm').setValue(this.currentSousDomaineForUeForm.idsousdomaine);
    this.programmeForm.get('nomDomainForUeForm').setValue(this.currentDomainForUeForm.iddomaine);
    window.scrollTo(0,0);
  }

  initializeProgrammeObject(){
    this.programme.setIdSemestre(this.programmeForm.get('idsemestre').value);
    this.programme.setIdClasse(this.programmeForm.get('idclasse').value);
    this.programme.setIdCategorie(this.programmeForm.get('idcategorie').value);
    this.programme.setIdUe(this.programmeForm.get('idue').value);
    this.programme.setAnnee(this.utilsService.extractDate(this.programmeForm.get('annee').value));
    this.programme.setCredit(this.programmeForm.get('credit').value);
  }

  getAllProgrammes(){
    this.programmeService.getListProgrammes().subscribe(
      (result) => {
        this.programmes = result;
        this.totalRecords = this.programmes.length;
        if (this.totalRecords > 1) {
          this.programmes = this.programmes.sort((a, b) => b.iddomaine - a.iddomaine);
        }else if(this.totalRecords === 1){
          this.programmes = result;
          this.isEmpty = false;
        }else{
          this.isEmpty = true;
        }
        this.loadProgrammes = false
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.isEmpty = true;
        this.loadProgrammes = false;
      }
    );
  }

  async getAllSpecialites(){
    this.specialiteService.getAllSpecialites().subscribe(
      (result) => {
        this.specialites = result;
        this.getAllClasses();
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

  async getAllDomaines(){
    this.domaineService.getListDomaines().subscribe(
      (result) => {
        this.domaines = result;
        this.domaines = this.domaines.sort((a, b) => b.iddomaine - a.iddomaine);
        if (this.domaines.length > 0) {
          this.getAllSousDomaines();
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
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

  async getAllSemestres(){
    this.semestreService.getAllSemestres().subscribe(
      (result) => {
        this.semestres = result;
        this.semestres = this.semestres.sort((a, b) => b.idsemestre - a.idsemestre);
        this.getAllcategorieues();
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getAllUes(){
    this.ueService.getAllUes().subscribe(
      (result) => {
        this.ues = result;
        this.ues = this.ues.sort((a, b) => b.idue - a.idue);
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getAllcategorieues(){
    this.categorieueservice.getListCategorieues().subscribe(
      (result) => {
        this.categorieues = result;
        this.categorieues = this.categorieues.sort((a, b) => b.idcategorie - a.idcategorie);
        this.getAllUes();
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  onDomainSelect(e,formName = null){
    this.selectedDomainId = e.target.value;
    this.getDomainById(this.selectedDomainId);
  }

  onSousDomainSelect(e,formName = null){
    this.selectedSousDomainId = e.target.value;
    this.getSousDomaineById(Number(this.selectedSousDomainId));
    this.getFilieresBySousDomaineId(this.selectedSousDomainId);
  }

  onSpecialiteSelect(e,formName = null){
    this.selectedSpecialiteId = e.target.value;
    this.getClassesBySpecialiteId(this.selectedSpecialiteId);
  }

  onFiliereSelect(e,formName = null){
    this.selectedFiliereId = e.target.value;
    this.getSpecialitesByFiliereId(this.selectedFiliereId);
    this.getUesByFiliereId(this.selectedFiliereId);
  }

  onClasseSelect(e,formName = null){
    this.selectedClasseId = e.target.value;
    this.getClasseById(this.selectedClasseId);
    this.getNiveauxByCodeNiveau(this.currentClasse.codeniveau);
    this.getSemestresByCodeNiveau(this.currentClasse.codeniveau);
  }

  getNiveauxByCodeNiveau(codeNiveau){
    this.niveauxFiltered = this.utilsService.getAllChildsByParentByValue(this.niveaux, "codeniveau", codeNiveau);
  }

  getSemestresByCodeNiveau(codeNiveau){
    this.semestresFiltered = this.utilsService.getAllChildsByParentByValue(this.semestres, "codeniveau", codeNiveau);
    if (this.semestresFiltered.length > 0) {
      this.zeroResultatSemestre = "";
    }else{
      this.zeroResultatSemestre = "rien";
    }
  }

  onSemestreSelect(e,formName = null){
    this.selectedSemestreId = e.target.value;
  }

  onUeSelect(e,formName = null){
    this.selectedUeId = e.target.value;
  }

  onCategorieUeSelect(e,formName = null){
    this.selectedCategorieUeId = e.target.value;
  }

  getSousDomaineById(idSousDomaine,formName = null){
    this.currentSousDomaine = this.utilsService.filterByOneField(this.sousDomaines, "idsousdomaine", Number(idSousDomaine));
    this.selectedSousDomainId = idSousDomaine;
  }

  getDomainById(idDomain,formName = null){
    this.selectedDomainId = idDomain;
    let sousDomainesFil = this.utilsService.getAllChildsByParentByValue(this.sousDomaines, "iddomaine", Number(this.selectedDomainId));
    let currentDo = this.utilsService.filterByOneField(this.domaines, "iddomaine",  Number(idDomain));
    if (this.selectedDomainId != null) {
      if (formName != null) {
        this.currentDomainForUeForm = currentDo;
        this.sousDomainesFilteredForUeForm = sousDomainesFil;
      } else {
        this.currentDomaine = currentDo;
        this.sousDomainesFiltered = sousDomainesFil;
      }
    }
    console.log("sousDomainesFil", sousDomainesFil);
    if (this.sousDomainesFiltered.length > 0) {
      this.zeroResultat = "";
    }else{
      this.zeroResultat = "rien";
    }
    if (this.sousDomainesFilteredForUeForm.length > 0) {
      this.zeroResultatForUeForm = "";
    }else{
      this.zeroResultatForUeForm = "rien";
    }
  }

  getSpecialiteById(idSpecialite){
    this.currentSpecialite = this.utilsService.filterByOneField(this.specialites, "idspecialite", idSpecialite);
    this.getFiliereById(this.currentSpecialite.idfiliere);
  }

  getNiveauByCode(codeNiveau){
    this.currentNiveau = this.utilsService.filterByOneField(this.niveaux, "codeniveau", codeNiveau);
  }

  getFiliereById(idFiliere,formName = null){
    this.selectedFiliereId = this.currentFiliere.idfiliere;
    this.getSousDomaineById(this.currentFiliere.idsousdomaine);
    if (formName != null) {
      this.currentFiliereForUeForm = this.utilsService.filterByOneField(this.filieres, "idfiliere", idFiliere);
    } else {
      this.currentFiliere = this.utilsService.filterByOneField(this.filieres, "idfiliere", idFiliere);
    }
    if (this.currentSousDomaine.idsousdomaine != 0) {
      this.getDomainById(this.currentSousDomaine.iddomaine);
    }
  }

  getClasseById(idClasse,formName = null){
    this.currentClasse = this.utilsService.filterByOneField(this.classes, "idclasse", Number(idClasse));
    this.getSpecialiteById(this.currentClasse.idspecialite);
  }

  getFilieresBySousDomaineId(idSousDomaine,formName = null){
    if (formName != null) {
      this.filieresFilteredForUeForm = this.utilsService.getAllChildsByParentByValue(this.filieres, "idsousdomaine", Number(idSousDomaine));
    } else {
      this.filieresFiltered = this.utilsService.getAllChildsByParentByValue(this.filieres, "idsousdomaine", Number(idSousDomaine));
    }
    if (this.filieresFiltered.length > 0) {
      this.zeroResultatFiliere = "";
    }else{
      this.zeroResultatFiliere = "rien";
    }
  }

  getClassesBySpecialiteId(idSpecialite,formName = null){
    this.classesFiltered = this.utilsService.getAllChildsByParentByValue(this.classes, "idspecialite", Number(idSpecialite));
    if (this.classesFiltered.length > 0) {
      this.zeroResultatClasse = "";
    }else{
      this.zeroResultatClasse = "rien";
    }
  }

  getSpecialitesByFiliereId(idFiliere,formName = null){
    this.specialitesFiltered = this.utilsService.getAllChildsByParentByValue(this.specialites, "idfiliere", Number(idFiliere));
    if (this.specialitesFiltered.length > 0) {
      this.zeroResultatSpecialite = "";
    }else{
      this.zeroResultatSpecialite = "rien";
    }
  }

  getUesByFiliereId(idFiliere,formName = null){
    this.uesFiltered = this.utilsService.getAllChildsByParentByValue(this.ues, "idfiliere", Number(idFiliere));
    if (this.uesFiltered.length > 0) {
      this.zeroResultatUe = "";
    }else{
      this.zeroResultatUe = "rien";
    }
  }

  FindProgramBy(annee = null,idSemestre,idClasse){
    let etu: any = "";
    this.programmeService.FindProgramBy(annee,idSemestre,idClasse).then(
      (result) => {
        if (result) {
          etu = result;
          console.log("etudiant", etu);
        } else {
        }
      },
      (err) => {
      }
    );
    return etu;
  }

  updateProgramme(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeProgrammeObject();
    const content = {
      "idsemestre": this.programme.getIdSemestre(),
      "idclasse": this.programme.getIdClasse(),
      "idcategorie": this.programme.getIdCategorie(),
      "idue": this.programme.getIdUe(),
      "annee": this.programme.getAnnee(),
      "credit": this.programme.getCredit()
    }
    this.programmeService.updateProgramme(this.oldProgramme, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Programme modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllProgrammes();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Programme non modifié.";
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

  createProgramme(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeProgrammeObject();
    const content = {
      "idsemestre": this.programme.getIdSemestre(),
      "idclasse": this.programme.getIdClasse(),
      "idcategorie": this.programme.getIdCategorie(),
      "idue": this.programme.getIdUe(),
      "annee": this.programme.getAnnee(),
      "credit": this.programme.getCredit()
    }
    this.programmeService.postProgramme(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Programme crée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllProgrammes();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Programme non enregistré.";
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

  deleteProgramme(programme) {
    const content = {
      "idsemestre": programme.idsemestre,
      "idclasse": programme.idclasse,
      "idcategorie": programme.idcategorie,
      "idue": programme.idue,
      "annee": programme.annee,
      "credit": programme.credit
    }
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
          this.programmeService.deleteProgramme(content).then(
            (result) => {
              this.getAllProgrammes();//.then((res) => {
                Swal.fire(
                  'Programme Supprimé!',
                  'supression!',
                  'success'
                )
              //});
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
      this.updateProgramme();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createProgramme();
    }
  }

}
