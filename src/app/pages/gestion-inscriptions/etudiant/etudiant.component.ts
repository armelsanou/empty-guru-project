import { RegionService } from './../../../services/servicesInscription/region/region.service';
import { SelectOptionService } from './../../../shared/element/select-option.service';
import { IOption } from 'ng-select';
import { DepartementService } from './../../../services/servicesInscription/departement/departement.service';
import { Departement } from './../../../entities/inscription/departement';
import { EtudiantService } from '../../../services/servicesInscription/etudiant/etudiant.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { transition, trigger, style, animate } from '@angular/animations';
import { SendNotificationService } from '../../../services/send-notication/send-notification.service';
import { SettingService } from '../../../services/setting/setting.service';
import { UtilsService } from '../../../services/utils/utils.service';
import {Etudiant} from '../../../entities/inscription/etudiant';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-etudiant',
  templateUrl: './etudiant.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './etudiant.component.scss',
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

export class EtudiantComponent implements OnInit {

  public departementData: any = [];
  public departementsFiltered: any[] = [];
  public regions: any = [];
  simpleOptionDepartement: Array<IOption>;
  selectedOptionDepartement = '';

  public sexes: any = [
    {value: '1', label: 'M'},
    {value: '2', label: 'F'},
    {value: '3', label: 'Autre'}
  ];
  simpleOptionSexe: Array<IOption>;
  selectedOptionSexe = '';

  public mentions: any = [
    {value: '1', label: 'Passable'},
    {value: '2', label: 'Assez-bien'},
    {value: '3', label: 'Bien'},
    {value: '4', label: 'Très bien'},
    {value: '5', label: 'Honnorable'},
    {value: '6', label: 'Très Honnorable'},
    {value: '7', label: 'Excellent'},
    {value: '8', label: 'Parfait'},
    {value: '9', label: 'Autre'}
  ];
  simpleOptionMention: Array<IOption>;
  selectedOptionMention = '';

  public langues: any = [
    {value: '1', label: 'Français'},
    {value: '2', label: 'Anglais'},
    {value: '3', label: 'Autre'},
  ];
  simpleOptionLangue: Array<IOption>;
  selectedOptionLangue = '';

  public refugies: any = [
    {value: '1', label: 'Oui'},
    {value: '2', label: 'Non'},
  ];
  simpleOptionRefugie: Array<IOption>;
  selectedOptionRefugie = '';

  public handicaps: any = [
    {value: '1', label: 'Oui'},
    {value: '2', label: 'Non'},
  ];
  simpleOptionHandicap: Array<IOption>;
  selectedOptionHandicap = '';


  public etudiants: any[] = [];
  etudiant = new Etudiant();
  public departements: any[] = [];

  loadEtudiants = false;
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

  currentDepartement: any;
  zeroResultatDepartement: string = "";

  selectedDepartementId: any;
  selectedMentionId: any;
  selectedLangueId: any;
  selectedRefugieId: any;
  selectedHandicapId: any;
  selectedSexeId: any;
  selectedRegionId: any;
  currentRegion: any;
  


  etudiantForm: FormGroup;
  matricule = new FormControl('', [Validators.required]);
  nomEtudiant = new FormControl('', [Validators.required]);
  dept = new FormControl('', [Validators.required]);
  region = new FormControl('', [Validators.required]);
  sexe = new FormControl('', [Validators.required]);
  dateNaissance = new FormControl('', [Validators.required]);
  lieuNaissance = new FormControl('', [Validators.required]);
  adresse = new FormControl('', [Validators.required]);
  telephone = new FormControl('', [Validators.required]);
  pere = new FormControl('', [Validators.required]);
  mere = new FormControl('', [Validators.required]);
  telephoneParent = new FormControl('', [Validators.required]);
  diplome = new FormControl('', [Validators.required]);
  annee = new FormControl('', [Validators.required]);
  moyenneDiplome = new FormControl('', [Validators.required]);
  dateInscription = new FormControl('', [Validators.required]);
  langue = new FormControl('', [Validators.required]);
  refugie = new FormControl('', [Validators.required]);
  handicap = new FormControl('', [Validators.required]);
  mention = new FormControl('', [Validators.required]);

  constructor(
    private sendNotificationService: SendNotificationService,
    private settingService: SettingService,
    private utilsService: UtilsService,
    private etudiantService: EtudiantService,
    private departementService: DepartementService,
    private selectOptionService: SelectOptionService,
    private datePipe: DatePipe,
    private regionService: RegionService,
  )
  {
    this.etudiantForm = new FormGroup({
      matricule: this.matricule,
      nomEtudiant: this.nomEtudiant,
      dept: this.dept,
      region: this.region,
      sexe: this.sexe,
      dateNaissance: this.dateNaissance,
      lieuNaissance: this.lieuNaissance,
      adresse: this.adresse,
      telephone: this.telephone,
      pere: this.pere,
      mere: this.mere,
      telephoneParent: this.telephoneParent,
      diplome: this.diplome,
      annee: this.annee,
      moyenneDiplome: this.moyenneDiplome,
      dateInscription: this.dateInscription,
      langue: this.langue,
      refugie: this.refugie,
      handicap: this.handicap,
      mention: this.mention
    });
  }

  ngOnInit() {
    this.loadEtudiants = true;
    this.getAllEtudiants();
    this.getAllDepartements();
    this.getAllRegions();
    this.utilsService.setDateOfToday(this.etudiantForm,'dateInscription', "yep");
    this.utilsService.setDateOfToday(this.etudiantForm,'annee');
  }

  initializeAllSimplesOptions(){
    this.simpleOptionSexe = this.selectOptionService.getCharacters(this.sexes);
    this.simpleOptionMention = this.selectOptionService.getCharacters(this.mentions);
    this.simpleOptionLangue = this.selectOptionService.getCharacters(this.langues);
    this.simpleOptionRefugie = this.selectOptionService.getCharacters(this.refugies);
    this.simpleOptionHandicap = this.selectOptionService.getCharacters(this.handicaps);
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.etudiantForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
    this.utilsService.setDateOfToday(this.etudiantForm,'dateInscription', "yep");
    this.utilsService.setDateOfToday(this.etudiantForm,'annee');
  }

  async getAllEtudiants(){
    this.etudiantService.getListEtudiants().subscribe(
      (result) => {
        this.etudiants = result;
        this.etudiants = this.etudiants.sort((a, b) => b.idetudiant - a.idetudiant);
        if (this.etudiants.length > 0) {
          this.isEmpty = false;
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
    this.loadEtudiants = false;
  }

  onSexeSelect(e){
    this.selectedSexeId = e.target.value;
  }

  onRegionSelect(e){
    this.selectedRegionId = e.target.value;
    this.getDepartementByRegionId(this.selectedRegionId);
    console.log("filtres:", this.departementsFiltered);
    if (this.departementsFiltered.length > 0) {
      this.zeroResultatDepartement = "";
    }else{
      this.zeroResultatDepartement = "rien";
    }
  }

  onMentionSelect(e){
    this.selectedMentionId = e.target.value;
  }

  onLangueSelect(e){
    this.selectedLangueId = e.target.value;
  }

  onRefugieSelect(e){
    this.selectedRefugieId = e.target.value;
  }

  onHandicapSelect(e){
    this.selectedHandicapId = e.target.value;
  }

  onDepartementSelect(e){
    this.selectedDepartementId = e.target.value;
    this.getDepartementById(Number(this.selectedDepartementId));
  }

  getDepartementById(idDepartement){
    this.currentDepartement = this.utilsService.filterByOneField(this.departements, "iddept", Number(idDepartement));
    this.selectedDepartementId = idDepartement;
  }

  getRegionById(idRegion){
    this.currentRegion = this.utilsService.filterByOneField(this.regions, "idregion", Number(idRegion));
    this.selectedRegionId = idRegion;
  }

  getDepartementByRegionId(idregion){
    this.departementsFiltered = this.utilsService.getAllChildsByParentByValue(this.departements, "idregion", Number(idregion));
  }

  async getAllRegions(){
    this.regionService.getListRegion().subscribe(
      (result) => {
        this.regions = result;
        this.regions = this.regions.sort((a, b) => b.idregion - a.idregion);
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getAllDepartements(){
    this.departementData = [];
    let data = {
      value: '',
      label: ''
    }
    this.departementService.getListDepartement().subscribe(
      (result) => {
        this.departements = result;
        this.departements = this.departements.sort((a, b) => b.iddept - a.iddept);
        this.departements.forEach(dept => {
          data = {
            value: '',
            label: ''
          }
          data.label = dept.codedept +" - "+ dept.nom;
          data.value = dept.iddept;
          this.departementData.push(data);
        });
        if (this.departementData.length > 0) {
          this.simpleOptionDepartement = this.selectOptionService.getCharacters(this.departementData);
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  initializeEtudiantObject(){
    this.etudiant.setMatricule(this.etudiantForm.get('matricule').value);
    this.etudiant.setNom(this.etudiantForm.get('nomEtudiant').value);
    this.etudiant.setIdDepartement(this.etudiantForm.get('dept').value);
    this.etudiant.setSexe(this.etudiantForm.get('sexe').value);
    this.etudiant.setDateNaissance(this.etudiantForm.get('dateNaissance').value);
    this.etudiant.setLieuNaissance(this.etudiantForm.get('lieuNaissance').value);
    this.etudiant.setAdresse(this.etudiantForm.get('adresse').value);
    this.etudiant.setTelephone(this.etudiantForm.get('telephone').value);
    this.etudiant.setPere(this.etudiantForm.get('pere').value);
    this.etudiant.setMere(this.etudiantForm.get('mere').value);
    this.etudiant.setTelParent(this.etudiantForm.get('telephoneParent').value);
    this.etudiant.setDiplome(this.etudiantForm.get('diplome').value);
    this.etudiant.setAnneeDiplome(this.utilsService.extractDate(this.etudiantForm.get('annee').value));
    this.etudiant.setMoyenneDiplome(this.etudiantForm.get('moyenneDiplome').value);
    this.etudiant.setDateInscription(this.etudiantForm.get('dateInscription').value);
    this.etudiant.setLangue(this.etudiantForm.get('langue').value);
    this.etudiant.setRefugie(this.etudiantForm.get('refugie').value);
    this.etudiant.setHandicape(this.etudiantForm.get('handicap').value);
    this.etudiant.setMentionDiplome(this.etudiantForm.get('mention').value);
  }

  fillFormBeforUpdating(etudiant){
    let month = etudiant.dateinscription.split("-")[1];
    this.getDepartementById(etudiant.iddept);
    this.getRegionById(this.currentDepartement.idregion);
    this.getDepartementByRegionId(this.currentRegion.idregion);
    this.etudiantForm.reset();
    this.showCancelBtn = true;
    this.buttonAction = "Modifier";
    this.etudiantForm.get('matricule').setValue(etudiant.matricule);
    this.etudiantForm.get('nomEtudiant').setValue(etudiant.nom);
    this.etudiantForm.get('dept').setValue(etudiant.iddept);
    this.etudiantForm.get('region').setValue(this.selectedRegionId);
    this.etudiantForm.get('sexe').setValue(etudiant.sexe);
    this.etudiantForm.get('dateNaissance').setValue(this.datePipe.transform(etudiant.datenaissance, 'yyyy-MM-dd'));
    this.etudiantForm.get('lieuNaissance').setValue(etudiant.lieunaissance);
    this.etudiantForm.get('adresse').setValue(etudiant.adresse);
    this.etudiantForm.get('telephone').setValue(etudiant.telephone);
    this.etudiantForm.get('pere').setValue(etudiant.pere);
    this.etudiantForm.get('mere').setValue(etudiant.mere);
    this.etudiantForm.get('telephoneParent').setValue(etudiant.telparent);
    this.etudiantForm.get('diplome').setValue(etudiant.diplome);
    this.etudiantForm.get('annee').setValue(etudiant.anneediplome+"-"+month);
    this.etudiantForm.get('moyenneDiplome').setValue(etudiant.moyennediplome);
    this.etudiantForm.get('dateInscription').setValue(this.datePipe.transform(etudiant.dateinscription, 'yyyy-MM-dd'));
    this.etudiantForm.get('langue').setValue(etudiant.langue);
    this.etudiantForm.get('refugie').setValue(etudiant.refugie);
    this.etudiantForm.get('handicap').setValue(etudiant.handicape);
    this.etudiantForm.get('mention').setValue(etudiant.mentiondiplome);
    console.log("formulaire", this.etudiantForm.value);
    window.scrollTo(0,0);
  }

  updateEtudiant(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeEtudiantObject();
    const content = [
      {
        "op": "replace",
        "path": "/nom",
        "value": this.etudiant.getNom()
      },
      {
        "op": "replace",
        "path": "/sexe",
        "value": this.etudiant.getSexe()
      },
      {
        "op": "replace",
        "path": "/iddept",
        "value": Number(this.etudiant.getIdDepartement())
      },
      {
        "op": "replace",
        "path": "/datenaissance",
        "value": this.etudiant.getDateNaissance()
      },
      {
        "op": "replace",
        "path": "/lieunaissance",
        "value": this.etudiant.getLieuNaissance()
      },
      {
        "op": "replace",
        "path": "/adresse",
        "value": this.etudiant.getAdresse()
      },
      {
        "op": "replace",
        "path": "/telephone",
        "value": this.etudiant.getTelephone()
      },
      {
        "op": "replace",
        "path": "/pere",
        "value": this.etudiant.getPere()
      },
      {
        "op": "replace",
        "path": "/mere",
        "value": this.etudiant.getMere()
      },
      {
        "op": "replace",
        "path": "/telparent",
        "value": this.etudiant.getTelParent()
      },
      {
        "op": "replace",
        "path": "/diplome",
        "value": this.etudiant.getDiplome()
      },
      {
        "op": "replace",
        "path": "/anneediplome",
        "value": this.etudiant.getAnneeDiplome()
      },
      {
        "op": "replace",
        "path": "/moyennediplome",
        "value": this.etudiant.getMoyenneDiplome()
      },
      {
        "op": "replace",
        "path": "/dateinscription",
        "value": this.etudiant.getDateInscription()
      },
      {
        "op": "replace",
        "path": "/langue",
        "value": this.etudiant.getLangue()
      },
      {
        "op": "replace",
        "path": "/refugie",
        "value": this.etudiant.getRefugie()
      },
      {
        "op": "replace",
        "path": "/handicape",
        "value": this.etudiant.getHandicape()
      },
      {
        "op": "replace",
        "path": "/mentiondiplome",
        "value": this.etudiant.getMentionDiplome()
      }
    ]
    this.etudiantService.updateEtudiant(this.etudiant, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Etudiant modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllEtudiants();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Etudiant non modifié.";
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

  createEtudiant(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeEtudiantObject();
    const content = 
      {
        "matricule": this.etudiant.getMatricule(),
        "nom": this.etudiant.getNom(),
        "iddept": Number(this.etudiant.getIdDepartement()),
        "sexe": this.etudiant.getSexe(),
        "datenaissance": this.etudiant.getDateNaissance(),
        "lieunaissance": this.etudiant.getLieuNaissance(),
        "adresse": this.etudiant.getAdresse(),
        "telephone": this.etudiant.getTelephone(),
        "pere": this.etudiant.getPere(),
        "mere": this.etudiant.getMere(),
        "telparent": this.etudiant.getTelParent(),
        "diplome": this.etudiant.getDiplome(),
        "anneediplome": this.etudiant.getAnneeDiplome(),
        "moyennediplome": this.etudiant.getMoyenneDiplome(),
        "dateinscription": this.etudiant.getDateInscription(),
        "langue": this.etudiant.getLangue(),
        "refugie": this.etudiant.getRefugie(),
        "handicape": this.etudiant.getHandicape(),
        "mentiondiplome": this.etudiant.getMentionDiplome()
      }
    this.etudiantService.postEtudiant(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Etudiant crée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllEtudiants();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Etudiant non enregistré.";
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

  deleteEtudiant(etudiant) {
    const content = 
    {
      "adresse": etudiant.adresse,
      "anneediplome": etudiant.anneediplome,
      "dateinscription": etudiant.dateinscription,
      "datenaissance": etudiant.datenaissance,
      "diplome": etudiant.diplome,
      "handicape": etudiant.handicape,
      "iddept": etudiant.iddept,
      "langue": etudiant.langue,
      "lieunaissance": etudiant.lieunaissance,
      "matricule": etudiant.matricule,
      "mentiondiplome": etudiant.mentiondiplome,
      "mere": etudiant.mere,
      "moyennediplome": etudiant.moyennediplome,
      "nom": etudiant.nom,
      "pere": etudiant.pere,
      "refugie": etudiant.refugie,
      "sexe": etudiant.sexe,
      "telephone": etudiant.telephone,
      "telparent": etudiant.telparent,
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
          this.etudiantService.deleteEtudiant(content).then(
            (result) => {
              this.getAllEtudiants().then((res) => {
                Swal.fire(
                  'Etudiant Supprimée!',
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

  telInputObject(obj) {
    //console.log(obj);
    obj.setCountry('in');
  }

  submitAction(){
    if (this.buttonAction === 'Modifier') {
      this.updateEtudiant();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createEtudiant();
    }
  }
}
