import { DomaineService } from './../../../services/servicesDomaine/domaine/domaine.service';
import { SousDomaineService } from './../../../services/servicesDomaine/sous-domaine/sous-domaine.service';
import { FiliereService } from './../../../services/servicesDomaine/filiere/filiere.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EcUe } from '../../../entities/programme/ec-ue';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Ec } from '../../../entities/programme/ec';
import { EcService } from '../../../services/servicesProgramme/ec/ec.service';
import { Ue } from '../../../entities/programme/ue';
import { UeService } from '../../../services/servicesProgramme/ue/ue.service';
import { EcUeService } from '../../../services/servicesProgramme/ec-ue/ec-ue.service';
import { SendNotificationService } from './../../../services/send-notication/send-notification.service';
import { SettingService } from './../../../services/setting/setting.service';
import { UtilsService } from './../../../services/utils/utils.service';

@Component({
  selector: 'app-ec-ue',
  templateUrl: './ec-ue.component.html',
  styleUrls: ['./ec-ue.component.scss']
})
export class EcUeComponent implements OnInit {

  public ecs: any[] = [];
  public ues: any[] = [];
  public ecsUes: any[] = [];
  public filieres: any[] = [];
  public domaines: any[] = [];
  public sousDomaines: any[] = [];
  public sousDomainesFiltered: any[] = [];
  public filieresFiltered: any[] = [];
  public sousDomainesFilteredForEcForm: any[] = [];
  public filieresFilteredForEcForm: any[] = [];
  ec = new Ec();
  ecUe = new EcUe();
  oldEcuE = new EcUe();
  ue = new Ue();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadEcsUes = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  createLoad = false;
  updateLoad = false;
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentEcUeCode: number;
  selectedUeId: any;
  selectedUeName: any;
  selectedEcCode: any;
  selectedFiliereId: any;
  selectedSousDomainId: any;
  selectedDomainId: any;
  currentSousDomaine: any;
  currentFiliere: any;
  currentSousDomaineForEcForm: any;
  currentFiliereForEcForm: any;
  currentUe: any;
  currentEc: any;
  currentDomainForEcForm: any;
  currentDomain: any;

  ecUeForm: FormGroup;
  eec = new FormControl('', [Validators.required]);
  nomDomain = new FormControl('', [Validators.required]);
  nomSousDomaine = new FormControl('', [Validators.required]);
  filiere = new FormControl('', [Validators.required]);
  nomDomainForEcForm = new FormControl('', [Validators.required]);
  nomSousDomaineForEcForm = new FormControl('', [Validators.required]);
  filiereForEcForm = new FormControl('', [Validators.required]);
  uue = new FormControl('', [Validators.required]);
  creditEc = new FormControl('', [Validators.required]);
  annee = new FormControl('', [Validators.required]);

  constructor(
    public ueService: UeService,
    public ecUeService: EcUeService,
    public httpClient: HttpClient,
    public ecService: EcService,
    private sendNotificationService: SendNotificationService,
    private settingService : SettingService,
    private utilsService : UtilsService,
    public domaineService: DomaineService,
    public sousDomaineService: SousDomaineService,
    public filiereService: FiliereService
  )
  {
    this.ecUeForm = new FormGroup({
      eec: this.eec,
      uue: this.uue,
      creditEc: this.creditEc,
      annee: this.annee,
      nomSousDomaine: this.nomSousDomaine,
      nomDomain: this.nomDomain,
      filiere: this.filiere,
      nomSousDomaineForEcForm: this.nomSousDomaineForEcForm,
      nomDomainForEcForm: this.nomDomainForEcForm,
      filiereForEcForm: this.filiereForEcForm
    });
  }

  ngOnInit() {
    this.loadEcsUes = true;
    this.getAllEcsUes();
    this.getAllDomaines();
  }

  initializeEcUeObject(){
    this.ecUe.setIdUe(Number(this.ecUeForm.get('uue').value));
    this.ecUe.setIdEc(Number(this.ecUeForm.get('eec').value));
    this.ecUe.setCreditEc(Number(this.ecUeForm.get('creditEc').value));
    this.ecUe.setAnnee(this.utilsService.extractDate(this.ecUeForm.get('annee').value));
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
        this.getAllUes();
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
        this.getAllEcs();
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getAllEcsUes(){
    this.ecUeService.getListEcsUes().subscribe(
      (result) => {
        this.ecsUes = result;
        if (this.ecsUes.length > 0) {
          this.isEmpty = false;
          this.loadEcsUes = false
        } else {
          this.isEmpty = true;
          this.loadEcsUes = false
        }
        this.getAllUes();

      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadEcsUes = false;
      }
    );
  }

  async getAllEcs(){
    this.ecService.getAllEcs().subscribe(
      (result) => {
        this.ecs = result;
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  onUeSelect(e){
    this.selectedUeId = e.target.value;
  }

  onEcSelect(e){
    this.selectedEcCode = e.target.value;
  }

  fillFormBeforUpdating(ecUe){
    this.getUeById(ecUe.idue);
    this.getEcById(ecUe.idec);
    this.oldEcuE = ecUe;
    this.ecUeForm.reset();
    this.showCancelBtn = true;
    this.buttonAction = "Modifier";
    this.getFiliereById(this.currentUe.idfiliere);
    this.ecUeForm.get('filiere').setValue(this.currentFiliere.idfiliere);
    this.getSousDomaineById(this.currentFiliere.idsousdomaine);
    this.getFiliereBySousDomaineId(this.currentSousDomaine.idsousdomaine);
    this.ecUeForm.get('nomDomain').setValue(this.currentDomain.iddomaine);
    this.ecUeForm.get('nomSousDomaine').setValue(this.currentSousDomaine.idsousdomaine);
    this.getFiliereById(this.currentEc.idfiliere,"yes");
    this.getSousDomaineById(this.currentFiliereForEcForm.idsousdomaine,"yes");
    this.ecUeForm.get('filiereForEcForm').setValue(this.currentFiliereForEcForm.idfiliere);
    this.getFiliereBySousDomaineId(this.currentSousDomaineForEcForm.idsousdomaine,"yes");
    this.ecUeForm.get('uue').setValue(ecUe.idue);
    this.ecUeForm.get('eec').setValue(ecUe.idec);
    this.ecUeForm.get('creditEc').setValue(ecUe.creditec);
    this.ecUeForm.get('annee').setValue(ecUe.annee+"-01");
    this.ecUeForm.get('nomSousDomaineForEcForm').setValue(this.currentSousDomaineForEcForm.idsousdomaine);
    this.ecUeForm.get('nomDomainForEcForm').setValue(this.currentDomainForEcForm.iddomaine);
    window.scrollTo(0,0);
  }

  reset(){
    this.ecUeForm.reset();
    this.buttonAction = "Enregistrer";
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  onSousDomainSelect(e,formName = null){
    this.selectedSousDomainId = e.target.value;
    this.getSousDomaineById(Number(this.selectedSousDomainId),formName);
    this.getFiliereBySousDomaineId(Number(this.selectedSousDomainId),formName);
  }

  onDomainSelect(e,formName = null){
    this.selectedDomainId = e.target.value;
    if (this.selectedDomainId != null) {
      this.getDomainById(Number(this.selectedDomainId),formName);
    }
  }

  onFiliereSelect(e,formName = null){
    this.selectedFiliereId = e.target.value;
    this.getFiliereById(this.selectedFiliereId,formName);
  }
  
  getSousDomaineById(idSousDomaine,formName = null){
    let souDo = this.utilsService.filterByOneField(this.sousDomaines, "idsousdomaine", Number(idSousDomaine));
    if (formName != null) {
      this.currentSousDomaineForEcForm = souDo;
    } else {
      this.currentSousDomaine = souDo;
    }
    this.getDomainById(Number(souDo.iddomaine),formName);
  }

  getDomainById(idDomain,formName = null){
    this.selectedDomainId = idDomain;
    if (formName != null) {
      this.currentDomainForEcForm = this.utilsService.filterByOneField(this.domaines, "iddomaine", idDomain);
      this.sousDomainesFilteredForEcForm = this.utilsService.getAllChildsByParentByValue(this.sousDomaines, "iddomaine", Number(this.selectedDomainId));
    } else {
      this.currentDomain = this.utilsService.filterByOneField(this.domaines, "iddomaine", idDomain);
      this.sousDomainesFiltered = this.utilsService.getAllChildsByParentByValue(this.sousDomaines, "iddomaine", Number(this.selectedDomainId));
    }
  }

  getFiliereBySousDomaineId(idSousDomaine,formName = null){
    if (formName != null) {
      this.filieresFilteredForEcForm = this.utilsService.getAllChildsByParentByValue(this.filieres, "idsousdomaine", Number(idSousDomaine));
    } else {
      this.filieresFiltered = this.utilsService.getAllChildsByParentByValue(this.filieres, "idsousdomaine", Number(idSousDomaine));
    }
  }

  getFiliereById(idFiliere,formName = null){
    if (formName != null) {
      this.currentFiliereForEcForm = this.utilsService.filterByOneField(this.filieres, "idfiliere", idFiliere);
    } else {
      this.currentFiliere = this.utilsService.filterByOneField(this.filieres, "idfiliere", idFiliere);
    }
  }

  getUeById(idUe){
    this.currentUe = this.utilsService.filterByOneField(this.ues, "idue", idUe);
  }

  getEcById(idEc){
    this.currentEc = this.utilsService.filterByOneField(this.ecs, "idec", idEc);
  }

  updateEcUe(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeEcUeObject();
    const content =
    {
      "idue": this.ecUe.getIdUe(),
      "idec": this.ecUe.getIdEc(),
      "creditec": this.ecUe.getCreditEc(),
      "annee": this.ecUe.getAnnee()
    }
    this.ecUeService.updateEcUe(this.oldEcuE, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "succès";
          this.settingService.option.msg = "EcUe modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllEcsUes();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "EcUe non modifié.";
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

  createEcUe(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeEcUeObject();
    const content = {
      "idue": this.ecUe.getIdUe(),
      "idec": this.ecUe.getIdEc(),
      "creditec": this.ecUe.getCreditEc(),
      "annee": Number(this.ecUe.getAnnee())
    }

    this.ecUeService.postEcUe(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "EcUe créee avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllEcsUes();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "EcUe non enregistrée.";
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

  deleteEcUe(ecUe) {
    const content  =
    {
      "idue": ecUe.idue,
      "idec": ecUe.idec,
      "creditec": ecUe.creditec,
      "annee": ecUe.annee
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
          this.ecUeService.deleteEcUe(content).then(
            (result) => {
              this.getAllEcsUes().then((res) => {
                Swal.fire(
                  'EcUe Supprimé!',
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
      this.updateEcUe();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createEcUe();
    }
  }

}
