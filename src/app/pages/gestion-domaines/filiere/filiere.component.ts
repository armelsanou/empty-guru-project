import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Filiere } from '../../../entities/domaine/filiere';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SendNotificationService } from './../../../services/send-notication/send-notification.service';
import { SettingService } from './../../../services/setting/setting.service';
import { FiliereService } from '../../../services/servicesDomaine/filiere/filiere.service';
import { SousDomaineService } from '../../../services/servicesDomaine/sous-domaine/sous-domaine.service';
import { UtilsService } from './../../../services/utils/utils.service';
import { DomaineService } from '../../../services/servicesDomaine/domaine/domaine.service';

@Component({
  selector: 'app-filiere',
  templateUrl: './filiere.component.html',
  styleUrls: ['./filiere.component.scss']
})
export class FiliereComponent implements OnInit {

  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  public domaines: any[] = [];
  public sousDomaines: any[] = [];
  public filieres: any[] = [];
  public sousDomainesFiltered: any[] = [];
  filiere = new Filiere();
  error: {};
  loadFilieres = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  createLoad = false;
  updateLoad = false;
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentFiliereId: number;
  selectedSousDomainId: any;
  selectedDomainId: any;
  selectedDomainName: any = "";
  currentSousDomaine: any;

  filiereForm: FormGroup;
  nomDomain = new FormControl('', [Validators.required]);
  nomSousDomaine = new FormControl('', [Validators.required]);
  codeFiliere = new FormControl('', [Validators.required]);
  nomFiliere = new FormControl('', [Validators.required]);
  nameFiliere = new FormControl('');
  yearFiliere = new FormControl('', [Validators.required]);
  zeroResultat: string = "";

  constructor(
    public httpClient: HttpClient,
    public domaineService: DomaineService,
    public sousDomaineService: SousDomaineService,
    private sendNotificationService: SendNotificationService,
    private filiereService : FiliereService,
    private settingService : SettingService,
    private utilsService : UtilsService,
  )
  {
    this.filiereForm = new FormGroup({
      nomSousDomaine: this.nomSousDomaine,
      codeFiliere: this.codeFiliere,
      nomFiliere: this.nomFiliere,
      nameFiliere: this.nameFiliere,
      yearFiliere: this.yearFiliere,
      nomDomain: this.nomDomain
    });
  }

  ngOnInit() {
    this.loadFilieres = true;
    this.getAllSousDomaines();
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
        this.totalRecords = this.filieres.length;
        if (this.totalRecords > 0) {
          this.isEmpty = false;
          this.loadFilieres = false;
        } else {
          this.isEmpty = true;
        }
        this.loadFilieres = false;
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadFilieres = false;
      }
    );
  }

  initializeFiliereObject(){
    this.filiere.setCodeFiliere(this.filiereForm.get('codeFiliere').value);
    this.filiere.setIdSousDomaine(this.filiereForm.get('nomSousDomaine').value);
    this.filiere.setNom(this.filiereForm.get('nomFiliere').value);
    this.filiere.setName(this.filiereForm.get('nameFiliere').value);
    this.filiere.setAnnee(this.utilsService.extractDate(this.filiereForm.get('yearFiliere').value));
  }

  fillFormBeforUpdating(filiere){
    this.filiereForm.reset();
    this.showCancelBtn = true;
    this.getSousDomaineById(filiere.idsousdomaine);
    this.currentFiliereId = Number(filiere.idfiliere);
    this.buttonAction = "Modifier";
    this.filiereForm.get('nomDomain').setValue(this.currentSousDomaine.iddomaine);
    this.filiereForm.get('codeFiliere').setValue(filiere.codefiliere);
    this.filiereForm.get('nomSousDomaine').setValue(filiere.idsousdomaine);
    this.filiereForm.get('nomFiliere').setValue(filiere.nom);
    this.filiereForm.get('nameFiliere').setValue(filiere.name);
    this.filiereForm.get('yearFiliere').setValue(filiere.annee+"-01");

    var optionsSousDomaine = Array(document.getElementById('nomSousDomaine').getElementsByTagName('option'));
    for (let i = 0; i < optionsSousDomaine[0].length; i++) {
      if(Number(optionsSousDomaine[0][i].value) === Number(filiere.idsousdomaine)){
        $(document).ready(function () {
          document.getElementById('nomSousDomaine').getElementsByTagName('option')[optionsSousDomaine[0][i].index].selected = true;
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
    window.scrollTo(0,0);
  }

  onSousDomainSelect(e){
    this.selectedSousDomainId = e.target.value;
    this.getSousDomaineById(Number(this.selectedSousDomainId));
  }

  onDomainSelect(e){
    this.selectedDomainId = e.target.value;
    this.getDomainNameById(Number(this.selectedDomainId));
  }

  getSousDomaineById(idSousDomaine){
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
    if (this.sousDomainesFiltered.length > 0) {
      this.zeroResultat = "";
    }else{
      this.zeroResultat = "rien";
    }
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.filiereForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
    this.sousDomainesFiltered = [];
  }

  createFiliere(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeFiliereObject();
    const content = {
      "idsousdomaine": this.filiere.getIdSousDomaine(),
      "codefiliere": this.filiere.getCodeFiliere(),
      "nom": this.filiere.getNom(),
      "name": this.filiere.getName(),
      "annee": this.filiere.getAnnee()
    }
    this.filiereService.postFiliere(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Filière créee avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllFilieres();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Filière non enregistrée.";
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

  updateFiliere(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeFiliereObject();
    const content = [
      {
        "op": "replace",
        "path": "/idsousdomaine",
        "value": this.filiere.getIdSousDomaine()
      },
      {
        "op": "replace",
        "path": "/codefiliere",
        "value": this.filiere.getCodeFiliere()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.filiere.getNom()
      },
      {
        "op": "replace",
        "path": "/name",
        "value": this.filiere.getName()
      },
      {
        "op": "replace",
        "path": "/annee",
        "value": this.filiere.getAnnee()
      },
    ]
    this.filiereService.updateFiliere(this.currentFiliereId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Filière modifiée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllFilieres();
          this.getAllSousDomaines();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Filière non modifiée.";
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

  deleteFiliere(idFiliere) {
    Swal.fire({
      title: 'Etes-vous sûr?',
      text: "Cette action irréversible",
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.filiereService.deleteFiliere(idFiliere).then(
            (result) => {
              this.getAllSousDomaines().then((res) => {
                Swal.fire(
                  'Filière Supprimée!',
                  'supression!',
                  'success'
                )
              });
              this.getAllFilieres();
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
      this.updateFiliere();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createFiliere();
    }
  }


}
