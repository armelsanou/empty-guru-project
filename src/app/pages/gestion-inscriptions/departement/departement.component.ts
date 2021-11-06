import { PaysService } from './../../../services/servicesInscription/pays/pays.service';
import { Departement } from './../../../entities/inscription/departement';
import { SelectOptionService } from './../../../shared/element/select-option.service';
import { DepartementService } from './../../../services/servicesInscription/departement/departement.service';
import { RegionService } from './../../../services/servicesInscription/region/region.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { transition, trigger, style, animate } from '@angular/animations';
import { SendNotificationService } from '../../../services/send-notication/send-notification.service';
import { SettingService } from '../../../services/setting/setting.service';
import { UtilsService } from '../../../services/utils/utils.service';
import {IOption} from 'ng-select';

@Component({
  selector: 'app-departement',
  templateUrl: './departement.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './departement.component.scss',
    './../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css',
    './../../../../../node_modules/famfamfam-flags/dist/sprite/famfamfam-flags.min.css'
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
export class DepartementComponent implements OnInit {

  public regionData: any[] = [];
  public paysData: any = [];
  allPays: any[] = [];
  simpleOptionPays: Array<IOption>;

  simpleOption: Array<IOption>;
  selectedOption = '';

  public regions: any[] = [];
  public departements: any[] = [];
  public regionsFiltered: any[] = [];
  departement = new Departement();
  
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};

  loadDepartement = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  createLoad = false;
  updateLoad = false;
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";

  currentRegion: any;
  selectedRegionId: any;
  selectedPaysId: any;
  currentPays: any;
  currentDepartementId: number;

  zeroResultatRegion: string = "";

  departementForm: FormGroup;
  pays = new FormControl('', [Validators.required]);
  idRegion = new FormControl('', [Validators.required]);
  codeDepartement = new FormControl('', [Validators.required]);
  nomDepartement = new FormControl('', [Validators.required]);
  nameDepartement = new FormControl('', [Validators.required]);

  constructor(
    private sendNotificationService: SendNotificationService,
    private settingService: SettingService,
    private utilsService: UtilsService,
    private regionService: RegionService,
    private departementService: DepartementService,
    private selectOptionService: SelectOptionService,
    private paysService: PaysService
  )
  {
    this.departementForm = new FormGroup({
      pays: this.pays,
      idRegion: this.idRegion,
      codeDepartement: this.codeDepartement,
      nomDepartement: this.nomDepartement,
      nameDepartement: this.nameDepartement
    });
  }

  ngOnInit() {
    this.loadDepartement = false;
    this.getAllRegions();
    this.getAllDepartements();
    this.getAllPays();
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.departementForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  async getAllDepartements(){
    this.departementService.getListDepartement().subscribe(
      (result) => {
        this.departements = result;
        this.departements = this.departements.sort((a, b) => b.iddept - a.iddept);
        if (this.departements.length > 0) {
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
    this.loadDepartement = false;
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
    this.regionData = [];
    let data = {
      value: '',
      label: ''
    }
    this.regionService.getListRegion().subscribe(
      (result) => {
        this.regions = result;
        this.regions = this.regions.sort((a, b) => b.idregion - a.idregion);
        this.regions.forEach(region => {
          data = {
            value: '',
            label: ''
          }
          data.label = region.coderegion +" - "+ region.nom;
          data.value = region.idregion;
          this.regionData.push(data);
        });
        if (this.regionData.length > 0) {
          this.simpleOption = this.selectOptionService.getCharacters(this.regionData);
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  onRegionSelect(e){
    this.selectedRegionId = e.target.value;
    this.getRegionById(Number(this.selectedRegionId));
  }

  onPaysSelect(e){
    this.selectedPaysId = e.target.value;
    this.getPaysById(Number(this.selectedPaysId));
    if (this.selectedPaysId != null && this.selectedPaysId != "") {
      this.getRegionsByPaysId(this.selectedPaysId);
    }
  }

  getPaysById(idPays){
    this.currentPays = this.utilsService.filterByOneField(this.allPays, "idpays", Number(idPays));
    this.selectedPaysId = idPays;
  }

  getRegionById(idRegion){
    this.currentRegion = this.utilsService.filterByOneField(this.regions, "idregion", Number(idRegion));
    this.selectedRegionId = idRegion;
  }

  getRegionsByPaysId(idPays){
    this.regionsFiltered = this.utilsService.getAllChildsByParentByValue(this.regions, "idpays", Number(idPays));
    if (this.regionsFiltered.length > 0) {
      this.zeroResultatRegion = "";
    }else{
      this.zeroResultatRegion = "rien";
    }
  }

  initializeDepartementObject(){
    this.departement.setIdRegion(this.departementForm.get('idRegion').value);
    this.departement.setCodeDepartement(this.departementForm.get('codeDepartement').value);
    this.departement.setNom(this.departementForm.get('nomDepartement').value);
    this.departement.setName(this.departementForm.get('nameDepartement').value);
  }

  fillFormBeforUpdating(departement){
    this.selectedOption = departement.idregion;
    this.getRegionById(departement.idregion);
    this.currentDepartementId = Number(departement.iddept);
    this.departementForm.reset();
    this.showCancelBtn = true;
    this.buttonAction = "Modifier";
    this.departementForm.get('pays').setValue(this.currentRegion.idpays);
    this.departementForm.get('idRegion').setValue(departement.idregion);
    this.departementForm.get('codeDepartement').setValue(departement.codedept);
    this.departementForm.get('nomDepartement').setValue(departement.nom);
    this.departementForm.get('nameDepartement').setValue(departement.name);
    window.scrollTo(0,0);
  }

  updateDepartement(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeDepartementObject();
    const content = [
      {
        "op": "replace",
        "path": "/idregion",
        "value": this.departement.getIdRegion()
      },
      {
        "op": "replace",
        "path": "/codedept",
        "value": this.departement.getCodeDepartement()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.departement.getNom()
      },
      {
        "op": "replace",
        "path": "/name",
        "value": this.departement.getName()
      }
    ]
    this.departementService.updateDepartement(this.currentDepartementId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Département modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllDepartements();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Département non modifié.";
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

  createDepartement(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeDepartementObject();
    const content = {
      "idregion": this.departement.getIdRegion(),
      "codedept": this.departement.getCodeDepartement(),
      "nom": this.departement.getNom(),
      "name": this.departement.getName()
    }
    this.departementService.postDepartement(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Département crée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllDepartements();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Département non enregistré.";
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

  deleteDepartement(idDepartement) {
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
          this.departementService.deleteDepartement(idDepartement).then(
            (result) => {
              this.getAllDepartements().then((res) => {
                Swal.fire(
                  'Departement Supprimé!',
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
      this.updateDepartement();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createDepartement();
    }
  }
}
