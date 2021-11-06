import { EcUeService } from './../../../services/servicesProgramme/ec-ue/ec-ue.service';
import { ProgrammeService } from './../../../services/servicesProgramme/programme/programme.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EvaluationService } from '../../../services/servicesProgramme/evaluation/evaluation.service';
import { Evaluation } from '../../../entities/programme/evaluation';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SettingService } from '../../../services/setting/setting.service';
import { SendNotificationService } from '../../../services/send-notication/send-notification.service';
import { SpecialiteService } from '../../../services/servicesDomaine/specialite/specialite.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { EcService } from '../../../services/servicesProgramme/ec/ec.service';
import { ClasseService } from '../../../services/servicesDomaine/classe/classe.service';
import { TypeEvaluationService } from '../../../services/servicesProgramme/type-evaluation/type-evaluation.service';
import { DomaineService } from '../../../services/servicesDomaine/domaine/domaine.service';
import { FiliereService } from '../../../services/servicesDomaine/filiere/filiere.service';
import { SousDomaineService } from '../../../services/servicesDomaine/sous-domaine/sous-domaine.service';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {

  isEmpty = true;
  error: {};
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  loadEvaluation = false;
  evaluation = new Evaluation();
  public evaluations: any = null;
  public ecs: any = [];
  public ues: any = [];
  public classes: any[] = [];
  public typesEvaluations: any[] = [];
  public specialites: any[] = [];
  public domaines: any[] = [];
  public filieres: any[] = [];
  public ecsFiltered: any[] = [];
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  createLoad = false;
  updateLoad = false;
  totalRecords: number;
  buttonAction = "Enregistrer";
  selectedFiliereId: any;
  selectedSousDomainId: any;
  selectedDomainId: any;
  selectedSpecialiteId: any;
  public sousDomaines: any[] = [];
  public sousDomainesFiltered: any[] = [];
  public filieresFiltered: any[] = [];
  currentSousDomaine: any;
  currentFiliere: any;
  currentDomaine: any;
  currentSpecialite: any;
  currentEvaluationId: number;
  currentClasse: any;
  currentEc: any;
  oldEvaluation: any;
  zeroResultat: string = "";
  zeroResultatFiliere: string = "";
  zeroResultatClasse: string = "";
  zeroResultatSpecialite: string = "";
  zeroResultatEc: string = "";
  selectedEcCode: any;
  selectedUeCode: any;
  selectedClasse: any;
  selectedTypeEvaluation: any;
  public classesFiltered: any[] = [];
  public specialitesFiltered: any[] = [];

  evaluationForm: FormGroup;
  nomDomain = new FormControl('');
  nomSousDomaine = new FormControl('');
  filiere = new FormControl('');
  nomSpecialite = new FormControl('');
  ue = new FormControl('', [Validators.required]);
  eec = new FormControl('', [Validators.required]);
  typeEval = new FormControl('', [Validators.required]);
  idclasse = new FormControl('', [Validators.required]);
  coef = new FormControl('', [Validators.required]);
  year = new FormControl('', [Validators.required]);
  constructor(
    public httpClient: HttpClient,
    public typeEvaluationService: TypeEvaluationService,
    private settingService : SettingService,
    private sendNotificationService: SendNotificationService,
    public domaineService: DomaineService,
    public sousDomaineService: SousDomaineService,
    public filiereService: FiliereService,
    public specialiteService: SpecialiteService,
    public ecUeService: EcUeService,
    public ecService: EcService,
    public classeService: ClasseService,
    public evaluationService: EvaluationService,
    private utilsService: UtilsService,
    public programmeService: ProgrammeService
  ) {

    this.evaluationForm = new FormGroup({
      nomDomain: this.nomDomain,
      nomSousDomaine: this.nomSousDomaine,
      filiere: this.filiere,
      nomSpecialite: this.nomSpecialite,
      ue: this.ue,
      eec: this.eec,
      typeEval: this.typeEval,
      idclasse: this.idclasse,
      coef: this.coef,
      year: this.year,
    });
   }

  ngOnInit() {
    //this.loadEvaluation = true;
    this.loadEvaluation = false
    //this.getEvaluations();
    this.getAllTypesEvaluations();
    this.getAllClasses();
    this.getAllDomaines();
    this.utilsService.setDateOfToday(this.evaluationForm,'year');
  }

  FindProgramUeClassromBy(annee = null,idClasse){
    this.ues = [];
    this.programmeService.FindProgramUeClassromBy(annee,idClasse).then(
      (result) => {
        if (result) {
          this.ues = result;
        }
      },
      (err) => {
      }
    );
  }

  FindEcBy(idUe = null,annee){
    this.ecs = [];
    this.ecUeService.FindEcBy(idUe,annee).then(
      (result) => {
        if (result) {
          this.ecs = result;
        }
      },
      (err) => {
      }
    );
  }

  FindEvaluationBy(idClasse = null,annee){
    this.evaluations = [];
    this.evaluationService.FindEvaluationBy(annee,idClasse).then(
      (result) => {
        if (result) {
          this.evaluations = result;
        }
        if (this.evaluations != null && this.evaluations.length > 0) {
          this.isEmpty = false;
        }else{
          this.isEmpty = true;
        }
      },
      (err) => {
        this.isEmpty = true;
      }
    );
  }

  async getAllEcs() {
    this.ecService.getAllEcs().subscribe(
      (result) => {
        this.ecs = result;
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getAllTypesEvaluations() {
    this.typeEvaluationService.getListTypeEvaluations().subscribe(
      (result) => {
        this.typesEvaluations = result;
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getAllClasses() {
    this.classeService.getListClasses().subscribe(
      (result) => {
        this.classes = result;
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getEvaluations() {
    this.evaluationService.getListEvaluations().subscribe(
      (result) => {
        this.evaluations = result;
        this.evaluations = this.evaluations.sort((a, b) => b.idevaluation - a.idevaluation);
        if (this.evaluations.length > 0) {
          this.isEmpty = false;
          this.loadEvaluation = false
        } else {
          this.isEmpty = true;
          this.loadEvaluation = false
        }
        this.getAllEcs();
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadEvaluation = false;
      }
    );
  }

  async getAllSpecialites() {
    this.specialiteService.getAllSpecialites().subscribe(
      (result) => {
        this.specialites = result;
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

  async getAllFilieres() {
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

  onEcSelect(e){
    this.selectedEcCode = e.target.value;
  }

  onUeSelect(e){
    this.selectedUeCode = e.target.value;
    if (this.selectedUeCode != null && this.selectedUeCode != "") {
      this.FindEcBy(this.evaluationForm.get('ue').value,this.utilsService.extractDate(this.evaluationForm.get('year').value));
    }
  }

  onClasseSelect(e){
    this.selectedClasse = e.target.value;
    if (this.selectedClasse != null && this.selectedClasse != "") {
      this.FindProgramUeClassromBy(this.utilsService.extractDate(this.evaluationForm.get('year').value),this.selectedClasse);
      this.FindEvaluationBy(this.selectedClasse,this.utilsService.extractDate(this.evaluationForm.get('year').value));
    }
  }

  onAnneeSelect(e){
    this.FindEcBy(this.evaluationForm.get('ue').value,this.utilsService.extractDate(this.evaluationForm.get('year').value));
    this.FindProgramUeClassromBy(this.utilsService.extractDate(this.evaluationForm.get('year').value),this.selectedClasse);
    this.FindEvaluationBy(this.selectedClasse,this.utilsService.extractDate(this.evaluationForm.get('year').value));
  }


  onTypeEvaluationSelect(e){
    this.selectedTypeEvaluation = e.target.value;
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

  onSpecialiteSelect(e){
    this.selectedSpecialiteId = e.target.value;
    this.getClassesBySpecialiteId(this.selectedSpecialiteId);
  }

  onFiliereSelect(e){
    this.selectedFiliereId = e.target.value;
    this.getEcsByFiliereId(this.selectedFiliereId);
    this.getSpecialitesByFiliereId(this.selectedFiliereId);
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

  getSpecialiteById(idSpecialite){
    this.currentSpecialite = this.utilsService.filterByOneField(this.specialites, "idspecialite", idSpecialite);
    this.getFiliereById(this.currentSpecialite.idfiliere);
  }

  getFiliereById(idFiliere){
    this.currentFiliere = this.utilsService.filterByOneField(this.filieres, "idfiliere", idFiliere);
    this.selectedFiliereId = this.currentFiliere.idfiliere;
    this.getSousDomaineById(this.currentFiliere.idsousdomaine);
    if (this.currentSousDomaine.idsousdomaine != 0) {
      this.getDomainNameById(this.currentSousDomaine.iddomaine);
    }
  }

  getClasseById(idClasse){
    this.currentClasse = this.utilsService.filterByOneField(this.classes, "idclasse", idClasse);
    this.getSpecialiteById(this.currentClasse.idspecialite);
  }

  getEcById(idEc){
    this.currentEc = this.utilsService.filterByOneField(this.ecs, "idec", idEc);
  }

  getFilieresBySousDomaineId(idSousDomaine){
    this.filieresFiltered = this.utilsService.getAllChildsByParentByValue(this.filieres, "idsousdomaine", Number(idSousDomaine));
    if (this.filieresFiltered.length > 0) {
      this.zeroResultatFiliere = "";
    }else{
      this.zeroResultatFiliere = "rien";
    }
  }

  getClassesBySpecialiteId(idSpecialite){
    this.classesFiltered = this.utilsService.getAllChildsByParentByValue(this.classes, "idspecialite", Number(idSpecialite));
    if (this.classesFiltered.length > 0) {
      this.zeroResultatClasse = "";
    }else{
      this.zeroResultatClasse = "rien";
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

  getEcsByFiliereId(idFiliere){
    this.ecsFiltered = this.utilsService.getAllChildsByParentByValue(this.ecs, "idfiliere", Number(idFiliere));
    if (this.ecsFiltered.length > 0) {
      this.zeroResultatEc = "";
    }else{
      this.zeroResultatEc = "rien";
    }
  }

  initializeEvaluationObject() {
    this.evaluation.setIdClasse(this.selectedClasse);
    this.evaluation.setIdTypeEvaluation(this.selectedTypeEvaluation);
    this.evaluation.setIdEc(this.selectedEcCode);
    this.evaluation.setAnnee(this.utilsService.extractDate(this.evaluationForm.get('year').value));
    this.evaluation.setCoef(this.evaluationForm.get('coef').value);
  }

  createEvaluation() {
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeEvaluationObject();
    const content = {
      "idclasse": this.evaluation.getIdClasse(),
      "idtypeevaluation": this.evaluation.getIdTypeEvaluation(),
      "idec": this.evaluation.getIdEc(),
      "anne": this.evaluation.getAnnee(),
      "coef": this.evaluation.getCoef()
    }
    console.log("con:", content);
    this.evaluationService.postEvaluation(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Evaluation créee avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          //this.getEvaluations();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Evaluation non enregistrée.";
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

  updateEvaluation() {
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeEvaluationObject();
    const content = {
      "idclasse": this.evaluation.getIdClasse(),
      "idtypeevaluation": this.evaluation.getIdTypeEvaluation(),
      "idec": this.evaluation.getIdEc(),
      "anne": this.evaluation.getAnnee(),
      "coef": this.evaluation.getCoef()
    }
    this.evaluationService.updateEvaluation(this.oldEvaluation, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Evaluation modifiée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          //this.getEvaluations();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Evaluation non modifiée.";
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

  deleteEvaluation(evaluation) {
    const content = {
      "idclasse": evaluation.idclasse,
      "idtypeevaluation": evaluation.idtypeevaluation,
      "idec": evaluation.idec,
      "coef": evaluation.coef,
      "annee": evaluation.anne
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
          this.evaluationService.deleteEvaluation(content).then(
            (result) => {
              //this.getEvaluations();//.then((res) => {
              Swal.fire(
                'Evaluation Supprimée!',
                'supression!',
                'success'
              );
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

  fillFormBeforUpdating(evaluation) {
    console.log("evaluation", evaluation);
    this.FindEcBy(this.evaluationForm.get('ue').value,this.utilsService.extractDate(this.evaluationForm.get('year').value));
    this.FindProgramUeClassromBy(this.utilsService.extractDate(this.evaluationForm.get('year').value),this.selectedClasse);
    this.FindEvaluationBy(this.selectedClasse,this.utilsService.extractDate(this.evaluationForm.get('year').value));
    this.oldEvaluation = evaluation;
    this.getEcById(evaluation.idec);
    this.getFiliereById(this.currentEc.idfiliere);
    this.getSpecialitesByFiliereId(this.selectedFiliereId);
    this.getClasseById(evaluation.idclasse);
    this.getSpecialiteById(this.currentClasse.idspecialite);
    this.getClassesBySpecialiteId(this.currentClasse.idspecialite);
    this.getEcsByFiliereId(this.selectedFiliereId);
    this.getFilieresBySousDomaineId(this.selectedSousDomainId);
    this.selectedTypeEvaluation = evaluation.idtypeevaluation;
    this.selectedEcCode = evaluation.idec;
    this.selectedClasse = evaluation.idclasse;
    this.evaluationForm.reset();
    this.showCancelBtn = true;
    this.buttonAction = "Modifier";
    this.evaluationForm.get('nomDomain').setValue(this.currentDomaine.iddomaine);
    this.evaluationForm.get('nomSousDomaine').setValue(this.currentSousDomaine.idsousdomaine);
    this.evaluationForm.get('filiere').setValue(this.currentSpecialite.idfiliere);
    this.evaluationForm.get('nomSpecialite').setValue(this.currentSpecialite.idspecialite);
    this.evaluationForm.get('typeEval').setValue(this.selectedTypeEvaluation);
    this.evaluationForm.get('idclasse').setValue(this.currentClasse.idclasse);
    this.evaluationForm.get('eec').setValue(evaluation.idec);
    this.evaluationForm.get('coef').setValue(evaluation.coef);
    this.evaluationForm.get('year').setValue(evaluation.anne+"-01");

    var optionsDomaine = Array(document.getElementById('nomDomain').getElementsByTagName('option'));
    for (let i = 0; i < optionsDomaine[0].length; i++) {
      if(Number(optionsDomaine[0][i].value) === Number(this.selectedDomainId)){
        $(document).ready(function () {
          document.getElementById('nomDomain').getElementsByTagName('option')[optionsDomaine[0][i].index].selected = true;
        });
        break;
      }
    }

    var optionsSousDomaine = Array(document.getElementById('nomSousDomaine').getElementsByTagName('option'));
    for (let i = 0; i < optionsSousDomaine[0].length; i++) {
      if(Number(optionsSousDomaine[0][i].value) === Number(this.currentSousDomaine.idsousdomaine)){
        $(document).ready(function () {
          document.getElementById('nomSousDomaine').getElementsByTagName('option')[optionsSousDomaine[0][i].index].selected = true;
        });
        break;
      }
    }

    var optionsFiliere = Array(document.getElementById('filiere').getElementsByTagName('option'));
    for (let i = 0; i < optionsFiliere[0].length; i++) {
      if(Number(optionsFiliere[0][i].value) === Number(this.selectedFiliereId)){
        $(document).ready(function () {
          document.getElementById('filiere').getElementsByTagName('option')[optionsFiliere[0][i].index].selected = true;
        });
        break;
      }
    }

    var optionsSpecialites = Array(document.getElementById('nomSpecialite').getElementsByTagName('option'));
    for (let i = 0; i < optionsSpecialites[0].length; i++) {
      if(Number(optionsSpecialites[0][i].value) === Number(this.selectedSpecialiteId)){
        $(document).ready(function () {
          document.getElementById('nomSpecialite').getElementsByTagName('option')[optionsSpecialites[0][i].index].selected = true;
        });
        break;
      }
    }

    var optionsTypesEvaluations = Array(document.getElementById('typeEval').getElementsByTagName('option'));
    for (let i = 0; i < optionsTypesEvaluations[0].length; i++) {
      if(Number(optionsTypesEvaluations[0][i].value) === Number(this.selectedTypeEvaluation)){
        $(document).ready(function () {
          document.getElementById('typeEval').getElementsByTagName('option')[optionsTypesEvaluations[0][i].index].selected = true;
        });
        break;
      }
    }

    var optionsClasses = Array(document.getElementById('idclasse').getElementsByTagName('option'));
    for (let i = 0; i < optionsClasses[0].length; i++) {
      if(Number(optionsClasses[0][i].value) === Number(this.currentClasse.idclasse)){
        $(document).ready(function () {
          document.getElementById('idclasse').getElementsByTagName('option')[optionsClasses[0][i].index].selected = true;
        });
        break;
      }
    }

    var optionsEcs = Array(document.getElementById('eec').getElementsByTagName('option'));
    for (let i = 0; i < optionsEcs[0].length; i++) {
      if(Number(optionsEcs[0][i].value) === Number(this.selectedEcCode)){
        $(document).ready(function () {
          document.getElementById('eec').getElementsByTagName('option')[optionsEcs[0][i].index].selected = true;
        });
        break;
      }
    }

    window.scrollTo(0,0);
  }

  submitAction() {
    if (this.buttonAction === 'Modifier') {
      this.updateEvaluation();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createEvaluation();
    }
  }

  reset() {
    this.evaluationForm.reset();
    this.buttonAction = "Enregistrer";
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

}
