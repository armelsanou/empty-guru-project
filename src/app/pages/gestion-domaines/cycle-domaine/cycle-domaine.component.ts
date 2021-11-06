import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CycleDomaine } from '../../../entities/domaine/cycle-domaine';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Cycle } from '../../../entities/domaine/cycle';
import { CycleService } from '../../../services/servicesDomaine/cycle/cycle.service';
import { Domaine } from '../../../entities/domaine/domaine';
import { DomaineService } from '../../../services/servicesDomaine/domaine/domaine.service';
import { CycleDomaineService } from '../../../services/servicesDomaine/cycle-domaine/cycle-domaine.service';
import { SendNotificationService } from './../../../services/send-notication/send-notification.service';
import { SettingService } from './../../../services/setting/setting.service';
import { UtilsService } from './../../../services/utils/utils.service';

@Component({
  selector: 'app-cycle-domaine',
  templateUrl: './cycle-domaine.component.html',
  styleUrls: ['./cycle-domaine.component.scss']
})
export class CycleDomaineComponent implements OnInit {

  public cycles: any[] = [];
  public domaines: any[] = [];
  public cyclesDomaines: any[] = [];
  cycle = new Cycle();
  cycleDomaine = new CycleDomaine();
  oldCycleDomaine = new CycleDomaine();
  domaine = new Domaine();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadCyclesDomaines = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  createLoad = false;
  updateLoad = false;
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentCycleDomaineCode: number;
  selectedDomainId: any;
  selectedDomainName: any;
  selectedCycleCode: any;

  cycleDomaineForm: FormGroup;
  cycl = new FormControl('', [Validators.required]);
  domain = new FormControl('', [Validators.required]);
  annee = new FormControl('', [Validators.required]);

  constructor(
    public domaineService: DomaineService,
    public cycleDomaineService: CycleDomaineService,
    public httpClient: HttpClient,
    public cycleService: CycleService,
    private sendNotificationService: SendNotificationService,
    private settingService : SettingService,
    private utilsService : UtilsService
  )
  {
    this.cycleDomaineForm = new FormGroup({
      cycl: this.cycl,
      domain: this.domain,
      annee: this.annee
    });
  }

  ngOnInit() {
    this.loadCyclesDomaines = true;
    this.getAllDomaines();
  }

  initializeDomaineObject(){
    this.cycleDomaine.setIdDomaine(Number(this.cycleDomaineForm.get('domain').value));
    this.cycleDomaine.setCodeCycle(String(this.cycleDomaineForm.get('cycl').value));
    this.cycleDomaine.setAnnee(this.utilsService.extractDate(this.cycleDomaineForm.get('annee').value));
  }

  async getAllDomaines(){
    this.domaineService.getListDomaines().subscribe(
      (result) => {
        this.domaines = result;
        this.domaines = this.domaines.sort((a, b) => b.iddomaine - a.iddomaine);
        this.getAllCycles();
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
        this.totalRecords = this.cyclesDomaines.length;
        if (this.totalRecords > 0) {
          this.loadCyclesDomaines = false
          this.isEmpty = false;
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
          this.loadCyclesDomaines = false;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadCyclesDomaines = false;
      }
    );
  }

  async getAllCycles(){
    this.cycleService.getListCycles().subscribe(
      (result) => {
        this.cycles = result;
        this.getAllCyclesDomaines();
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  onDomainSelect(e){
    this.selectedDomainId = e.target.value;
  }

  onCycleSelect(e){
    this.selectedCycleCode = e.target.value;
  }

  fillFormBeforUpdating(cycleDomaine){
    this.oldCycleDomaine = cycleDomaine;
    this.cycleDomaineForm.reset();
    this.showCancelBtn = true;
    this.buttonAction = "Modifier";
    this.cycleDomaineForm.get('domain').setValue(cycleDomaine.iddomaine);
    this.cycleDomaineForm.get('cycl').setValue(cycleDomaine.codecycle);
    this.cycleDomaineForm.get('annee').setValue(cycleDomaine.annee+"-01");

    var optionsCycles = Array(document.getElementById('codeCycle').getElementsByTagName('option'));
    for (let i = 0; i < optionsCycles[0].length; i++) {
      if(optionsCycles[0][i].value === cycleDomaine.codecycle){
        $(document).ready(function () {
          document.getElementById('codeCycle').getElementsByTagName('option')[optionsCycles[0][i].index].selected = true;
        })
        break;
      }
    }

    var options = Array(document.getElementById('nomDomain').getElementsByTagName('option'));
    for (let i = 0; i < options[0].length; i++) {
      if(Number(options[0][i].value) === Number(cycleDomaine.iddomaine)){
        $(document).ready(function () {
          document.getElementById('nomDomain').getElementsByTagName('option')[options[0][i].index].selected = true;
        })
        break;
      }
    }
    window.scrollTo(0,0);
  }

  reset(){
    this.cycleDomaineForm.reset();
    this.buttonAction = "Enregistrer";
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  updateCycleDomaine(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeDomaineObject();
    const content  =
    {
      "iddomaine": this.cycleDomaine.getIdDomaine(),
      "codecycle": this.cycleDomaine.getCodeCycle(),
      "annee": this.cycleDomaine.getAnnee()
    }
    this.cycleDomaineService.updateCycleDomaine(this.oldCycleDomaine, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "CycleDomaine modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllCyclesDomaines();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "CycleDomaine non modifié.";
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

  createCycleDomaine(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeDomaineObject();
    const content = {
      "iddomaine": this.cycleDomaine.getIdDomaine(),
      "codecycle": this.cycleDomaine.getCodeCycle(),
      "annee": Number(this.cycleDomaine.getAnnee())
    }

    this.cycleDomaineService.postCycleDomaine(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "CycleDomaine crée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllCyclesDomaines();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "CycleDomaine non enregistré.";
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

  deleteCycleDomaine(cycleDomaine) {
    const content  =
    {
      "iddomaine": cycleDomaine.iddomaine,
      "codecycle": cycleDomaine.codecycle,
      "annee": cycleDomaine.annee
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
          this.cycleDomaineService.deleteCycleDomaine(content).then(
            (result) => {
              this.getAllCyclesDomaines().then((res) => {
                Swal.fire(
                  'CycleDomaine Supprimé!',
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
      this.updateCycleDomaine();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createCycleDomaine();
    }
  }

}
