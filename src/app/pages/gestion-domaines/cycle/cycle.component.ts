import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Cycle } from '../../../entities/domaine/cycle';
import { CycleService } from '../../../services/servicesDomaine/cycle/cycle.service';
import { SendNotificationService } from './../../../services/send-notication/send-notification.service';
import { SettingService } from './../../../services/setting/setting.service';
import { UtilsService } from './../../../services/utils/utils.service';

@Component({
  selector: 'app-cycle',
  templateUrl: './cycle.component.html',
  styleUrls: ['./cycle.component.scss']
})
export class CycleComponent implements OnInit {

  public cycles: any[] = [];
  cycle = new Cycle();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadCycles = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  createLoad = false;
  updateLoad = false;
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentCycleCode: number;

  cycleForm: FormGroup;
  codeCycle = new FormControl('', [Validators.required]);
  nomCycle = new FormControl('', [Validators.required]);
  nameCycle = new FormControl('');
  yearCycle = new FormControl('', [Validators.required, , Validators.minLength(4)]);

  constructor(
    public httpClient: HttpClient,
    public cycleService: CycleService,
    private sendNotificationService: SendNotificationService,
    private settingService : SettingService,
    private utilsService : UtilsService
  )
  {
    this.cycleForm = new FormGroup({
      codeCycle: this.codeCycle,
      nomCycle: this.nomCycle,
      nameCycle: this.nameCycle,
      yearCycle: this.yearCycle
    });
  }

  ngOnInit() {
    this.loadCycles =true;
    this.getAllCycles();
  }

  async getAllCycles(){
    this.cycleService.getListCycles().subscribe(
      (result) => {
        this.cycles = result;
        this.totalRecords = this.cycles.length;
        if (this.totalRecords > 0) {
          this.loadCycles = false;
          this.isEmpty = false;
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
          this.loadCycles = false;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadCycles = false;
      }
    );
  }

  initializeCycleObject(){
    this.cycle.setCodeCycle(this.cycleForm.get('codeCycle').value);
    this.cycle.setNom(this.cycleForm.get('nomCycle').value);
    this.cycle.setName(this.cycleForm.get('nameCycle').value);
    this.cycle.setAnnee(this.utilsService.extractDate(this.cycleForm.get('yearCycle').value));
  }

  fillFormBeforUpdating(cycle){
    this.cycleForm.reset();
    this.showCancelBtn = true;
    this.currentCycleCode = cycle.codecycle;
    this.buttonAction = "Modifier";
    this.cycleForm.get('codeCycle').setValue(cycle.codecycle);
    this.cycleForm.get('nomCycle').setValue(cycle.nom);
    this.cycleForm.get('nameCycle').setValue(cycle.name);
    this.cycleForm.get('yearCycle').setValue(cycle.annee+"-01");
    window.scrollTo(0,0);
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.cycleForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  updateCycle(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeCycleObject();
    const content = [
      {
        "op": "replace",
        "path": "/codecycle",
        "value": this.cycle.getCodeCycle()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.cycle.getNom()
      },
      {
        "op": "replace",
        "path": "/name",
        "value": this.cycle.getName()
      },
      {
        "op": "replace",
        "path": "/annee",
        "value": this.cycle.getAnnee()
      },
    ]
    this.cycleService.updateCycle(String(this.currentCycleCode), content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Cycle modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllCycles();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Cycle non modifié.";
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

  createCycle(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeCycleObject();
    const content = {
      "codecycle": this.cycle.getCodeCycle(),
      "nom": this.cycle.getNom(),
      "name": this.cycle.getName(),
      "annee": this.cycle.getAnnee()
    }
    this.cycleService.postCycle(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Cycle crée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllCycles();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Cycle non enregistré.";
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

  deleteCycle(codeCycle) {
    Swal.fire({
      title: 'Etes-vous sure?',
      text: "Cette action est irréversible!",
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.cycleService.deleteCycle(codeCycle).then(
            (result) => {
              this.getAllCycles().then((res) => {
                Swal.fire(
                  'Cycle Supprimé!',
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
      this.updateCycle();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createCycle();
    }
  }

}
