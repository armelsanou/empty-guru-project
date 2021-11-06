import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NiveauService } from '../../../services/servicesDomaine/niveau/niveau.service';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Niveau } from '../../../entities/domaine/niveau';
import { SendNotificationService } from './../../../services/send-notication/send-notification.service';
import { SettingService } from './../../../services/setting/setting.service';
import { UtilsService } from './../../../services/utils/utils.service';
import { CycleService } from '../../../services/servicesDomaine/cycle/cycle.service';
import { Cycle } from '../../../entities/domaine/cycle';

@Component({
  selector: 'app-niveau',
  templateUrl: './niveau.component.html',
  styleUrls: ['./niveau.component.scss']
})
export class NiveauComponent implements OnInit {

  public niveaux: any[] = [];
  public cycles: any[] = [];
  niveau = new Niveau();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadNiveaux = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentNiveauCode: any;
  selectedCycleCode: any;
  createLoad = false;
  updateLoad = false;

  niveauForm: FormGroup;
  codeNiveau = new FormControl('', [Validators.required]);
  codeCycle = new FormControl('', [Validators.required]);
  nomNiveau = new FormControl('', [Validators.required]);
  numeroNiveau = new FormControl('', [Validators.required]);
  yearNiveau = new FormControl('', [Validators.required]);

  constructor(
    public httpClient: HttpClient,
    public niveauService: NiveauService,
    private sendNotificationService: SendNotificationService,
    private settingService : SettingService,
    private utilsService : UtilsService,
    public cycleService: CycleService
  )
  {
    this.niveauForm = new FormGroup({
      codeCycle: this.codeCycle,
      codeNiveau: this.codeNiveau,
      nomNiveau: this.nomNiveau,
      numeroNiveau: this.numeroNiveau,
      yearNiveau: this.yearNiveau
    });
  }

  ngOnInit() {
    this.loadNiveaux = true;
    this.getAllCycles();
  }

  async getAllCycles(){
    this.cycleService.getListCycles().subscribe(
      (result) => {
        this.cycles = result;
        this.cycles = this.cycles.sort((a, b) => b.idcycle - a.idcycle);
        this.totalRecords = this.cycles.length;
        this.getAllNiveaux();
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  onCycleSelect(e){
    this.selectedCycleCode = e.target.value;
  }

  async getAllNiveaux(){
    this.niveauService.getListNiveaux().subscribe(
      (result) => {
        this.niveaux = result;
        this.niveaux = this.niveaux.sort((a, b) => b.idniveau - a.idniveau);
        this.totalRecords = this.niveaux.length;
        if (this.totalRecords > 0) {
          this.loadNiveaux = false;
          this.isEmpty = false;
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
          this.loadNiveaux = false;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadNiveaux = false;
      }
    );
  }

  deleteNiveau(codeNiveau) {
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
          this.niveauService.deleteNiveau(codeNiveau).then(
            (result) => {
              this.getAllNiveaux().then((res) => {
                Swal.fire(
                  'Niveau Supprimé!',
                  'supression!',
                  'success'
                );
              });
              this.reset();
              Swal.hideLoading();
            },
              (err) => {
                Swal.fire(
                  'Une erreur est survenue!',
                  'Veuillez réessayer plustard.',
                  'error'
                );
              }
            );
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    })
  }

  initializeNiveauObject(){
    this.niveau.setCycle(this.niveauForm.get('codeCycle').value);
    this.niveau.setCodeNiveau(this.niveauForm.get('codeNiveau').value);
    this.niveau.setNom(this.niveauForm.get('nomNiveau').value);
    this.niveau.setNumero(this.niveauForm.get('numeroNiveau').value);
    this.niveau.setAnnee(this.utilsService.extractDate(this.niveauForm.get('yearNiveau').value));
  }

  fillFormBeforUpdating(niveau){
    this.niveauForm.reset();
    this.showCancelBtn = true;
    this.currentNiveauCode = niveau.codeniveau;
    this.buttonAction = "Modifier";
    this.niveauForm.get('codeCycle').setValue(niveau.codecycle);
    this.niveauForm.get('codeNiveau').setValue(niveau.codeniveau);
    this.niveauForm.get('nomNiveau').setValue(niveau.nom);
    this.niveauForm.get('numeroNiveau').setValue(niveau.numero);
    this.niveauForm.get('yearNiveau').setValue(niveau.annee+"-01");

    var optionsCycles = Array(document.getElementById('codeCycle').getElementsByTagName('option'));
    for (let i = 0; i < optionsCycles[0].length; i++) {
      if(optionsCycles[0][i].value === niveau.codecycle){
        $(document).ready(function () {
          document.getElementById('codeCycle').getElementsByTagName('option')[optionsCycles[0][i].index].selected = true;
        })
        break;
      }
    }
    window.scrollTo(0,0);
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.niveauForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  updateNiveau(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeNiveauObject();
    const content = [
      {
        "op": "replace",
        "path": "/codecycle",
        "value": this.niveau.getCycle()
      },
      {
        "op": "replace",
        "path": "/codeniveau",
        "value": this.niveau.getCodeNiveau()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.niveau.getNom()
      },
      {
        "op": "replace",
        "path": "/numero",
        "value": this.niveau.getNumero()
      },
      {
        "op": "replace",
        "path": "/annee",
        "value": this.niveau.getAnnee()
      },
    ]
    this.niveauService.updateNiveau(String(this.currentNiveauCode), content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Niveau modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllNiveaux();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Niveau non modifié.";
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

  createNiveau(){
    this.buttonAction = "Enregistrer...";
    this.createLoad = true;
    this.initializeNiveauObject();
    const content = {
      "codecycle": this.niveau.getCycle(),
      "codeniveau": this.niveau.getCodeNiveau(),
      "nom": this.niveau.getNom(),
      "numero": this.niveau.getNumero(),
      "annee": this.niveau.getAnnee()
    }
    this.niveauService.postNiveau(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Niveau crée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllNiveaux();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Niveau non enregistré.";
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

  submitAction(){
    if (this.buttonAction === 'Modifier') {
      this.updateNiveau();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createNiveau();
    }
  }

}

