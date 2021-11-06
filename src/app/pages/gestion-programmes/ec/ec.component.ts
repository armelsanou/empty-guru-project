import { Ec } from '../../../entities/programme/ec';
import { EcService } from '../../../services/servicesProgramme/ec/ec.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { transition, trigger, style, animate } from '@angular/animations';
import { SendNotificationService } from './../../../services/send-notication/send-notification.service';
import { SettingService } from './../../../services/setting/setting.service';
import { UtilsService } from './../../../services/utils/utils.service';
import { FiliereService } from '../../../services/servicesDomaine/filiere/filiere.service';
import { DomaineService } from '../../../services/servicesDomaine/domaine/domaine.service';
import { SousDomaineService } from '../../../services/servicesDomaine/sous-domaine/sous-domaine.service';

@Component({
  selector: 'app-ec',
  templateUrl: './ec.component.html',
  styleUrls: ['./ec.component.scss']
})
export class EcComponent implements OnInit {

  public ecs: any[] = [];
  public filieres: any[] = [];
  public domaines: any[] = [];
  public sousDomaines: any[] = [];
  public sousDomainesFiltered: any[] = [];
  public filieresFiltered: any[] = [];
  ec = new Ec();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadEcs = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  createLoad = false;
  updateLoad = false;
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentEcId: number;
  selectedFiliereId: any;
  selectedSousDomainId: any;
  selectedDomainId: any;
  currentSousDomaine: any;
  currentFiliere: any;
  currentDomaine: any;
  zeroResultat: string = "";
  zeroResultatFiliere: string = "";

  ecForm: FormGroup;
  nomDomain = new FormControl('');
  nomSousDomaine = new FormControl('');
  codeEc = new FormControl('', [Validators.required]);
  filiere = new FormControl('', [Validators.required]);
  nomEc = new FormControl('', [Validators.required]);
  nameEc = new FormControl('', [Validators.required]);
  yearEc= new FormControl('', [Validators.required]);

  constructor(
    public filiereService: FiliereService,
    public ecService: EcService,
    private sendNotificationService: SendNotificationService,
    private settingService : SettingService,
    private utilsService : UtilsService,
    public domaineService: DomaineService,
    public sousDomaineService: SousDomaineService
  )
  {
    this.ecForm = new FormGroup({
      codeEc: this.codeEc,
      filiere: this.filiere,
      nomEc: this.nomEc,
      nameEc: this.nameEc,
      yearEc: this.yearEc,
      nomSousDomaine: this.nomSousDomaine,
      nomDomain: this.nomDomain
    });
  }

  ngOnInit() {
    this.loadEcs = true;
    this.getAllDomaines();
    this.utilsService.setDateOfToday(this.ecForm,'yearEc');
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
        this.getAllEcs();
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadEcs = false;
      }
    );
  }

  async getAllEcs(){
    this.ecService.getAllEcs().subscribe(
      (result) => {
        this.ecs = result;
        this.ecs = this.ecs.sort((a, b) => b.idec - a.idec);
        this.loadEcs = false;
        this.isEmpty = false;
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadEcs = false;
      }
    );
  }

  initializeEcObject(){
    this.ec.setCodeEc(this.ecForm.get('codeEc').value);
    this.ec.setIdFiliere(this.selectedFiliereId);
    this.ec.setNom(this.ecForm.get('nomEc').value);
    this.ec.setName(this.ecForm.get('nameEc').value);
    this.ec.setAnnee(this.utilsService.extractDate(this.ecForm.get('yearEc').value));
  }

  fillFormBeforUpdating(ec){
    this.ecForm.reset();
    this.getFiliereById(ec.idfiliere);
    this.getFilieresBySousDomaineId(this.currentFiliere.idsousdomaine);
    this.showCancelBtn = true;
    this.currentEcId = Number(ec.idec);
    this.buttonAction = "Modifier";
    this.ecForm.get('nomDomain').setValue(this.currentDomaine.iddomaine);
    this.ecForm.get('nomSousDomaine').setValue(this.currentSousDomaine.idsousdomaine);
    this.ecForm.get('codeEc').setValue(ec.codeec);
    this.ecForm.get('filiere').setValue(ec.idfiliere);
    this.ecForm.get('nomEc').setValue(ec.nom);
    this.ecForm.get('nameEc').setValue(ec.name);
    this.ecForm.get('yearEc').setValue(ec.annee);
    this.selectedFiliereId = ec.idfiliere;
    console.log("curr", this.currentFiliere);

    var optionsFiliere = Array(document.getElementById('filiere').getElementsByTagName('option'));
    for (let i = 0; i < optionsFiliere[0].length; i++) {
      if(Number(optionsFiliere[0][i].value) === Number(ec.idfiliere)){
        $(document).ready(function () {
          document.getElementById('filiere').getElementsByTagName('option')[optionsFiliere[0][i].index].selected = true;
        })
        break;
      }
    }

    var optionsSousDomaine = Array(document.getElementById('nomSousDomaine').getElementsByTagName('option'));
    for (let i = 0; i < optionsSousDomaine[0].length; i++) {
      if(Number(optionsSousDomaine[0][i].value) === Number(this.currentFiliere.idsousdomaine)){
        $(document).ready(function () {
          document.getElementById('nomSousDomaine').getElementsByTagName('option')[optionsSousDomaine[0][i].index].selected = true;
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

    this.ecForm.get('nameEc').setValue(ec.name);
    this.ecForm.get('yearEc').setValue(ec.annee+"-01");
    window.scrollTo(0,0);
  }

  onSousDomainSelect(e){
    this.selectedSousDomainId = e.target.value;
    this.getSousDomaineById(Number(this.selectedSousDomainId));
    this.getFilieresBySousDomaineId(this.selectedSousDomainId);
  }

  onDomainSelect(e){
    this.selectedDomainId = e.target.value;
    this.getDomainNameById(Number(this.selectedDomainId));
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

  getFiliereById(idFiliere){
    this.currentFiliere = this.utilsService.filterByOneField(this.filieres, "idfiliere", idFiliere);
    this.selectedFiliereId = this.currentFiliere.idfiliere;
    this.getSousDomaineById(this.currentFiliere.idsousdomaine);
    if (this.currentSousDomaine.idsousdomaine != 0) {
      this.getDomainNameById(this.currentSousDomaine.iddomaine);
    }
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.ecForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  createEc(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeEcObject();
    const content = {
      "idfiliere": this.ec.getIdFiliere(),
      "codeec": this.ec.getCodeEc(),
      "nom": this.ec.getNom(),
      "name": this.ec.getName(),
      "annee": this.ec.getAnnee()
    }
    this.ecService.postEc(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Ec créee avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllFilieres();
          this.getAllEcs();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Ec non enregistrée.";
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

  updateEc(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeEcObject();
    const content = [
      {
        "op": "replace",
        "path": "/idfiliere",
        "value": Number(this.selectedFiliereId)
      },
      {
        "op": "replace",
        "path": "/codeec",
        "value": this.ec.getCodeEc()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.ec.getNom()
      },
      {
        "op": "replace",
        "path": "/name",
        "value": this.ec.getName()
      },
      {
        "op": "replace",
        "path": "/annee",
        "value": this.ec.getAnnee()
      },
    ]
    this.ecService.updateEc(this.currentEcId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Ec modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllFilieres();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Ec non modifiée.";
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

  deleteEc(idEc) {
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
          this.ecService.deleteEc(idEc).then(
            (result) => {
              console.log("result:", result);
              this.getAllEcs().then((res) => {
                Swal.fire(
                  'Ec Supprimée!',
                  'supression!',
                  'success'
                )
              });
              this.reset();
              Swal.hideLoading();
            },
              (err) => {
                console.log("err:", err);
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
      this.updateEc();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createEc();
    }
  }

}
