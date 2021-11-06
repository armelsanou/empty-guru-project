import { CycleDomaineService } from './../../../services/servicesDomaine/cycle-domaine/cycle-domaine.service';
import { CycleService } from './../../../services/servicesDomaine/cycle/cycle.service';
import { SousDomaineService } from './../../../services/servicesDomaine/sous-domaine/sous-domaine.service';
import { DomaineService } from './../../../services/servicesDomaine/domaine/domaine.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common';
import { transition, trigger, style, animate } from '@angular/animations';
import { SendNotificationService } from './../../../services/send-notication/send-notification.service';
import { SettingService } from './../../../services/setting/setting.service';
import { Semestre } from '../../../entities/programme/semestre';
import { NiveauService } from '../../../services/servicesDomaine/niveau/niveau.service';
import { UtilsService } from './../../../services/utils/utils.service';
import { SemestreService } from '../../../services/servicesProgramme/semestre/semestre.service';

@Component({
  selector: 'app-semestre',
  templateUrl: './semestre.component.html',
  styleUrls: ['./semestre.component.scss']
})
export class SemestreComponent implements OnInit {
  public semestres: any[] = [];
  public niveaux: any[] = [];
  public domaines: any[] = [];
  public sousDomaines: any[] = [];
  public cycles: any[] = [];
  semestre = new Semestre();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadSemestres = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  createLoad = false;
  updateLoad = false;
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentSemestreId: number;
  selectedNiveauCode: any;
  selectedNiveauName: any;
  public cyclesFiltered: any[] = [];
  public sousDomainesFiltered: any[] = [];
  public niveauxFiltered: any[] = [];
  public cyclesDomaines: any[] = [];
  zeroResultatCycle: string = "";
  zeroResultatNiveau: string = "";
  zeroResultat: string = "";
  selectedCycleCode: any;
  selectedSousDomainId: any;
  selectedDomainId: any;
  currentSousDomaine: any;
  currentDomaine: any;
  currentNiveau: any;
  currentCycle: any;
  currentCycleDomaine: any;

  semestreForm: FormGroup;
  nomDomain = new FormControl('', [Validators.required]);
  //nomSousDomaine = new FormControl('', [Validators.required]);
  codeCycle = new FormControl('', [Validators.required]);
  codeSemestre = new FormControl('', [Validators.required]);
  niveau = new FormControl('', [Validators.required]);
  nomSemestre = new FormControl('', [Validators.required]);
  numeroSemestre = new FormControl('');
  yearSemestre= new FormControl('', [Validators.required]);
  creditSemestre = new FormControl('');

  constructor(
    public domaineService: DomaineService,
    public sousDomaineService: SousDomaineService,
    public cycleDomaineService: CycleDomaineService,
    public cycleService: CycleService,
    public niveauService: NiveauService,
    public semestreService: SemestreService,
    private sendNotificationService: SendNotificationService,
    private settingService : SettingService,
    private utilsService : UtilsService
  )
  {
    this.semestreForm = new FormGroup({
      nomDomain: this.nomDomain,
      //nomSousDomaine: this.nomSousDomaine,
      codeCycle: this.codeCycle,
      codeSemestre: this.codeSemestre,
      niveau: this.niveau,
      nomSemestre: this.nomSemestre,
      numeroSemestre: this.numeroSemestre,
      yearSemestre: this.yearSemestre,
      creditSemestre: this.creditSemestre,
    });
  }

  ngOnInit() {
    this.loadSemestres = true;
    this.getAllCycles();
    this.getAllDomaines();
    this.getAllCyclesDomaines();
    this.utilsService.setDateOfToday(this.semestreForm,'yearSemestre');
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
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getAllCycles(){
    this.cycleService.getListCycles().subscribe(
      (result) => {
        this.cycles = result;
        this.cycles = this.cycles.sort((a, b) => b.idcycle - a.idcycle);
        this.getAllNiveaux();
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
        this.niveaux = this.niveaux.sort((a, b) => b.codeniveau - a.codeniveau);
          this.getAllSemestres();
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadSemestres = false;
      }
    );
  }

  async getAllSemestres() {
    this.semestreService.getAllSemestres().subscribe(
      (result) => {
        this.semestres = result;
        this.semestres = this.semestres.sort((a, b) => b.idsemestre - a.idsemestre);
        this.totalRecords = this.semestres.length;
        if (this.totalRecords > 0) {
          this.loadSemestres = false;
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
          this.loadSemestres = false;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadSemestres = false;
      }
    );
  }

  onDomainSelect(e){
    this.selectedDomainId = e.target.value;
    this.getDomainNameById(this.selectedDomainId);
    this.getCyclesByDomaineId(this.selectedDomainId);
  }

  onSousDomainSelect(e){
    this.selectedSousDomainId = e.target.value;
    this.getSousDomaineById(Number(this.selectedSousDomainId));
    //this.getFilieresBySousDomaineId(this.selectedSousDomainId);
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

  getNiveauxByCodeCycle(codCycle){
    this.niveauxFiltered = this.utilsService.getAllChildsByParentByValue(this.niveaux, "codecycle", codCycle);
  }

  getSousDomaineById(idSousDomaine){
    this.currentSousDomaine = this.utilsService.filterByOneField(this.sousDomaines, "idsousdomaine", Number(idSousDomaine));
    this.selectedSousDomainId = idSousDomaine;
  }

  getNiveauByCode(codeNiveau){
    this.currentNiveau = this.utilsService.filterByOneField(this.niveaux, "codeniveau", codeNiveau);
  }

  getCycleByCode(codeCycle){
    this.currentCycle = this.utilsService.filterByOneField(this.cycles, "codecycle", codeCycle);
  }

  getCycleDomaineByCodeCycle(codeCycle){
    this.currentCycleDomaine = this.utilsService.filterByOneField(this.cyclesDomaines, "codecycle", codeCycle);
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

  initializeSemestreObject() {
    this.semestre.setCodeSemestre(this.semestreForm.get('codeSemestre').value);
    this.semestre.setNiveau(this.selectedNiveauCode);
    this.semestre.setNom(this.semestreForm.get('nomSemestre').value);
    this.semestre.setNumero(this.semestreForm.get('numeroSemestre').value);
    this.semestre.setCredit(this.semestreForm.get('creditSemestre').value);
    this.semestre.setAnnee(this.utilsService.extractDate(this.semestreForm.get('yearSemestre').value));
  }

  fillFormBeforUpdating(semestre){
    console.log("semestre", semestre);
    this.semestreForm.reset();
    this.showCancelBtn = true;
    this.getNiveauNameByCode(semestre.codeniveau);
    this.getNiveauByCode(semestre.codeniveau);
    this.getCycleByCode(this.currentNiveau.codecycle);
    this.getCycleDomaineByCodeCycle(this.currentCycle.codecycle);
    this.getNiveauxByCodeCycle(this.currentNiveau.codecycle);
    this.getDomainNameById(this.currentCycleDomaine.iddomaine);
    this.getCyclesByDomaineId(this.currentDomaine.iddomaine);
    this.selectedNiveauCode = semestre.codeniveau;
    this.currentSemestreId = Number(semestre.idsemestre);
    this.buttonAction = "Modifier";
    this.semestreForm.get('nomDomain').setValue(this.currentDomaine.iddomaine);
    //this.semestreForm.get('nomSousDomaine').setValue(this.currentSousDomaine.idsousdomaine);
    this.semestreForm.get('codeCycle').setValue(this.currentNiveau.codecycle);
    this.semestreForm.get('codeSemestre').setValue(semestre.codesemestre);
    this.semestreForm.get('niveau').setValue(semestre.codeniveau);
    this.semestreForm.get('nomSemestre').setValue(semestre.nom);
    this.semestreForm.get('creditSemestre').setValue(semestre.credit);
    this.semestreForm.get('numeroSemestre').setValue(semestre.numero);
    this.semestreForm.get('yearSemestre').setValue(semestre.annee+"-01");

    var options = Array(document.getElementById('niveau').getElementsByTagName('option'));
    for (let i = 0; i < options[0].length; i++) {
      if(Number(options[0][i].value) === Number(semestre.codeniveau)){
        $(document).ready(function () {
          document.getElementById('niveau').getElementsByTagName('option')[options[0][i].index].selected = true;
        })
        break;
      }
    }

    var optionsDomaine = Array(document.getElementById('nomDomain').getElementsByTagName('option'));
    for (let i = 0; i < optionsDomaine[0].length; i++) {
      if(Number(optionsDomaine[0][i].value) === Number(this.selectedDomainId)){
        $(document).ready(function () {
          document.getElementById('nomDomain').getElementsByTagName('option')[optionsDomaine[0][i].index].selected = true;
        })
        break;
      }
    }

    /*var optionsSousDomaine = Array(document.getElementById('nomSousDomaine').getElementsByTagName('option'));
    for (let i = 0; i < optionsSousDomaine[0].length; i++) {
      if(Number(optionsSousDomaine[0][i].value) === Number(this.currentSousDomaine.idsousdomaine)){
        $(document).ready(function () {
          document.getElementById('nomSousDomaine').getElementsByTagName('option')[optionsSousDomaine[0][i].index].selected = true;
        })
        break;
      }
    }*/

    var optionsCycles = Array(document.getElementById('codeCycle').getElementsByTagName('option'));
    for (let i = 0; i < optionsCycles[0].length; i++) {
      if(optionsCycles[0][i].value === this.currentCycle.codecycle){
        $(document).ready(function () {
          document.getElementById('codeCycle').getElementsByTagName('option')[optionsCycles[0][i].index].selected = true;
        })
        break;
      }
    }
    window.scrollTo(0,0);
  }

  onNiveauSelect(e){
    this.selectedNiveauCode = e.target.value;
    this.getNiveauNameByCode(Number(this.selectedNiveauCode));
  }

  getNiveauNameByCode(codeNiveau){
    this.niveaux.forEach(niveau => {
      if (niveau.codeniveau === codeNiveau) {
        this.selectedNiveauName = niveau.nom;
      }
    });
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.semestreForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  createSemestre(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeSemestreObject();
    const content = {
      "codeniveau": this.semestre.getNiveau(),
      "codesemestre": this.semestre.getCodeSemestre(),
      "nom": this.semestre.getNom(),
      "numero": this.semestre.getNumero(),
      "annee": this.semestre.getAnnee(),
      "credit": this.semestre.getCredit()
    }
    this.semestreService.postSemestre(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Semestre crée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllNiveaux();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Semestre non enregistré.";
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

  updateSemestre(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeSemestreObject();
    const content = [
      {
        "op": "replace",
        "path": "/codeniveau",
        "value": this.semestre.getNiveau()
      },
      {
        "op": "replace",
        "path": "/codesemestre",
        "value": this.semestre.getCodeSemestre()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.semestre.getNom()
      },
      {
        "op": "replace",
        "path": "/numero",
        "value": this.semestre.getNumero()
      },
      {
        "op": "replace",
        "path": "/annee",
        "value": this.semestre.getAnnee()
      },
      {
        "op": "replace",
        "path": "/credit",
        "value": this.semestre.getCredit()
      }
    ]
    this.semestreService.updateSemestre(this.currentSemestreId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Semestre modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllNiveaux();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Semestre non modifié.";
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

  deleteSemestre(idSemestre) {
    Swal.fire({
      title: 'Etes-vous sûr?',
      text: "Cette action n'est pas reversible!",
      type: 'qsemestrestion',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.semestreService.deleteSemestre(idSemestre).then(
            (result) => {
              this.getAllSemestres().then((res) => {
                Swal.fire(
                  'Semestre Supprimé!',
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

  submitAction(){
    if (this.buttonAction === 'Modifier') {
      this.updateSemestre();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createSemestre();
    }
  }

}
