import { PaysService } from './../../../services/servicesInscription/pays/pays.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Region } from './../../../entities/inscription/region';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { transition, trigger, style, animate } from '@angular/animations';
import { SendNotificationService } from '../../../services/send-notication/send-notification.service';
import { SettingService } from '../../../services/setting/setting.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { RegionService } from './../../../services/servicesInscription/region/region.service';
import {IOption} from 'ng-select';
import { SelectOptionService } from './../../../shared/element/select-option.service';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './region.component.scss',
    './../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'
  ],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class RegionComponent implements OnInit {
  public regions: any[] = [];
  region = new Region();
  public allPays: any[] = [];
  simpleOptionPays: Array<IOption>;
  public paysData: any = [];

  loadRegion = false;

  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  error: {};
  public sortOrder = 'desc';

  createLoad = false;
  updateLoad = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";

  currentRegionId: number;
  currentPays: any;
  selectedPaysId: any;

  regionsForm: FormGroup;
  pays = new FormControl('', [Validators.required]);
  codeRegion = new FormControl('', [Validators.required]);
  nomRegion = new FormControl('', [Validators.required]);
  nameRegion = new FormControl('', [Validators.required]);

  constructor(
    private sendNotificationService: SendNotificationService,
    private settingService: SettingService,
    private utilsService: UtilsService,
    private regionService: RegionService,
    private paysService: PaysService,
    private selectOptionService: SelectOptionService
  )
  {
    this.regionsForm = new FormGroup({
      pays: this.pays,
      codeRegion: this.codeRegion,
      nomRegion: this.nomRegion,
      nameRegion: this.nameRegion
    });
  }

  ngOnInit() {
    this.loadRegion = true;
    this.getAllPays();
    this.getAllRegions();
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.regionsForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  getPaysById(idPays){
    this.currentPays = this.utilsService.filterByOneField(this.allPays, "idpays", Number(idPays));
    this.selectedPaysId = idPays;
  }

  onPaysSelect(e){
    this.selectedPaysId = e.target.value;
    console.log("pays choisi:", this.selectedPaysId);
    this.getPaysById(Number(this.selectedPaysId));
  }

  async getAllPays(){
    this.paysData = [];
    let data = {
      value: '',
      label: ''
    }
    this.paysService.getListPays().subscribe(
      (result) => {
        this.allPays = result;
        this.allPays = this.allPays.sort((a, b) => b.idpays - a.idpays);
        this.allPays.forEach(pays => {
          data = {
            value: '',
            label: ''
          }
          data.label = pays.codepays +" - "+ pays.nom;
          data.value = pays.idpays;
          this.paysData.push(data);
        });
        if (this.paysData.length > 0) {
          this.simpleOptionPays = this.selectOptionService.getCharacters(this.paysData);
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getAllRegions(){
    this.regionService.getListRegion().subscribe(
      (result) => {
        this.regions = result;
        this.regions = this.regions.sort((a, b) => b.idregion - a.idregion);
        if (this.regions.length > 0) {
          this.isEmpty = false;
          this.totalRecords = this.regions.length;
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
    this.loadRegion = false;
  }

  initializeRegionObject(){
    this.region.setIdPays(this.regionsForm.get('pays').value);
    this.region.setCodeRegion(this.regionsForm.get('codeRegion').value);
    this.region.setNom(this.regionsForm.get('nomRegion').value);
    this.region.setName(this.regionsForm.get('nameRegion').value);
  }

  fillFormBeforUpdating(region){
    this.regionsForm.reset();
    this.showCancelBtn = true;
    this.currentRegionId = Number(region.idregion);
    this.buttonAction = "Modifier";
    this.regionsForm.get('pays').setValue(region.idpays);
    this.regionsForm.get('codeRegion').setValue(region.coderegion);
    this.regionsForm.get('nomRegion').setValue(region.nom);
    this.regionsForm.get('nameRegion').setValue(region.name);
    window.scrollTo(0,0);
  }

  updateRegion(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeRegionObject();
    const content = [
      {
        "op": "replace",
        "path": "/idpays",
        "value": this.regionsForm.get('pays').value
      },
      {
        "op": "replace",
        "path": "/coderegion",
        "value": this.region.getCodeRegion()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.region.getNom()
      },
      {
        "op": "replace",
        "path": "/name",
        "value": this.region.getName()
      }
    ]
    console.log("content", content);
    this.regionService.updateRegion(this.currentRegionId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Region modifiée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllRegions();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Region non modifiée.";
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

  createRegion(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeRegionObject();
    const content = {
      "pays": this.selectedPaysId,
      "codeRegion": this.region.getCodeRegion(),
      "nom": this.region.getNom(),
      "name": this.region.getName()
    }
    this.regionService.postRegion(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Region créee avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllRegions();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Region non enregistrée.";
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

  deleteRegion(idRegion) {
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
          this.regionService.deleteRegion(idRegion).then(
            (result) => {
              this.getAllRegions().then((res) => {
                Swal.fire(
                  'Region Supprimée!',
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
      this.updateRegion();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createRegion();
    }
  }
}
