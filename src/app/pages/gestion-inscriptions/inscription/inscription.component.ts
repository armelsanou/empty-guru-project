import { SpecialiteService } from './../../../services/servicesDomaine/specialite/specialite.service';
import { FiliereService } from './../../../services/servicesDomaine/filiere/filiere.service';
import { SousDomaineService } from './../../../services/servicesDomaine/sous-domaine/sous-domaine.service';
import { DomaineService } from './../../../services/servicesDomaine/domaine/domaine.service';
import { EtudiantService } from './../../../services/servicesInscription/etudiant/etudiant.service';
import { DatePipe } from '@angular/common';
import { InscriptionService } from './../../../services/servicesInscription/inscription/inscription.service';
import { SelectOptionService } from './../../../shared/element/select-option.service';
import { ClasseService } from './../../../services/servicesDomaine/classe/classe.service';
import { Inscription } from './../../../entities/inscription/inscription';
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
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss',
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
export class InscriptionComponent implements OnInit {

  etudiant: any = null;
  public classeData: any = [];
  
  simpleOptionClasse: Array<IOption>;
  selectedOptionClasse = '';

  public inscriptions: any[] = [];
  public etudiants: any[] = [];
  inscription = new Inscription();
  oldInscription = new Inscription();
  public classes: any[] = [];

  loadInscription = false;
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

  selectedFiliereId: any;
  selectedSousDomainId: any;
  selectedDomainId: any;
  selectedSpecialiteId: any;
  currentSousDomaine: any;
  currentFiliere: any;
  currentClasse: any;
  selectedClasseId: any;
  currentDomaine: any;
  currentSpecialite: any;
  
  public specialites: any[] = [];
  public domaines: any[] = [];
  public sousDomaines: any[] = [];
  public filieres: any[] = [];

  public sousDomainesFiltered: any[] = [];
  public filieresFiltered: any[] = [];
  public classesFiltered: any[] = [];
  public specialitesFiltered: any[] = [];

  
  zeroResultat: string = "";
  zeroResultatFiliere: string = "";
  zeroResultatClasse: string = "";
  zeroResultatSpecialite: string = "";

  inscriptionForm: FormGroup;
  nomDomain = new FormControl('');
  nomSousDomaine = new FormControl('');
  filiere = new FormControl('');
  nomSpecialite = new FormControl('');
  matricule = new FormControl('', [Validators.required]);
  idclasse = new FormControl('', [Validators.required]);
  annee = new FormControl('', [Validators.required]);
  //nomEtud = new FormControl(this.etudiant);
  dateInscription = new FormControl('', [Validators.required]);

  constructor(
    private sendNotificationService: SendNotificationService,
    private settingService: SettingService,
    private utilsService: UtilsService,
    private inscriptionService: InscriptionService,
    private classeService: ClasseService,
    private selectOptionService: SelectOptionService,
    private datePipe: DatePipe,
    public domaineService: DomaineService,
    public sousDomaineService: SousDomaineService,
    public filiereService: FiliereService,
    public specialiteService: SpecialiteService,
    private etudiantService: EtudiantService
  )
  {
    this.inscriptionForm = new FormGroup({
      nomDomain: this.nomDomain,
      nomSousDomaine: this.nomSousDomaine,
      filiere: this.filiere,
      nomSpecialite: this.nomSpecialite,
      matricule: this.matricule,
      idclasse: this.idclasse,
      annee: this.annee,
      //nomEtud: this.nomEtud,
      dateInscription: this.dateInscription
    });
  }

  ngOnInit() {
    this.loadInscription = false;
    this.getAllClasses();
    //this.getAllInscriptions();
    //this.getAllEtudiants();
    this.getAllDomaines();
    this.utilsService.setDateOfToday(this.inscriptionForm,'annee');
    this.utilsService.setDateOfToday(this.inscriptionForm,'dateInscription',"yes");
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.inscriptionForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
    this.utilsService.setDateOfToday(this.inscriptionForm,'annee');
    this.utilsService.setDateOfToday(this.inscriptionForm,'dateInscription',"yes");
    this.etudiant = null;
  }
  
  async getAllEtudiants(){
    this.etudiantService.getListEtudiants().subscribe(
      (result) => {
        this.etudiants = result;
        this.etudiants = this.etudiants.sort((a, b) => b.idetudiant - a.idetudiant);
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getAllClasses(){
    this.classeData = [];
    let data = {
      value: '',
      label: ''
    }
    this.classeService.getListClasses().subscribe(
      (result) => {
        this.classes = result;
        this.classes = this.classes.sort((a, b) => b.idclasse - a.idclasse);
        this.classes.forEach(classe => {
          data = {
            value: '',
            label: ''
          }
          data.label = classe.codeclasse +" - "+ classe.nom;
          data.value = classe.idclasse;
          this.classeData.push(data);
        });
        if (this.classeData.length > 0) {
          this.simpleOptionClasse = this.selectOptionService.getCharacters(this.classeData);
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getAllSpecialites(){
    this.specialiteService.getAllSpecialites().subscribe(
      (result) => {
        this.specialites = result;
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
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
        this.getAllSpecialites();
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }
  
  async getAllInscriptions(){
    this.inscriptionService.getListInscriptions().subscribe(
      (result) => {
        this.inscriptions = result;
        if (this.inscriptions.length > 0) {
          this.isEmpty = false;
          this.totalRecords = this.inscriptions.length;
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
    this.loadInscription = false;
  }

  onDomainSelect(e){
    this.selectedDomainId = e.target.value;
    this.getDomainNameById(this.selectedDomainId);
  }
  
  onClasseSelect(e){
    this.selectedClasseId = e.target.value;
    this.getClasseById(Number(this.selectedClasseId));
  }
  
  onMatriculeChange() {
    const currentMatricule: any = this.inscriptionForm.get('matricule').value;
    if (currentMatricule.length > 5) {
      this.etudiant = this.FindInfoStudentBy(this.utilsService.extractDate(this.inscriptionForm.get('annee').value),currentMatricule);
    }
    //this.inscriptionForm.get('nomEtud').setValue(this.etudiant);
  }
  
  onDateSelect(e){
    let dat = e.target.value;
    dat = dat.split("-");
    this.inscriptionForm.get('annee').setValue(dat[0]+"-"+dat[1]);
  }

  onSousDomainSelect(e){
    this.selectedSousDomainId = e.target.value;
    this.getSousDomaineById(Number(this.selectedSousDomainId));
    this.getFilieresBySousDomaineId(this.selectedSousDomainId);
  }

  onSpecialiteSelect(e){
    this.selectedSpecialiteId = e.target.value;
    this.getClassesBySpecialiteId(this.selectedSpecialiteId);
  }

  onFiliereSelect(e){
    this.selectedFiliereId = e.target.value;
    this.getSpecialitesByFiliereId(this.selectedFiliereId);
  }

  FindInfoStudentBy(annee = null, matricule){
    let etu: any = "";
    this.inscriptionService.FindInfoStudentBy(annee,matricule).then(
      (result) => {
        if (result) {
          etu = result;
          console.log("etudiant", etu);
        } else {
        }
      },
      (err) => {
      }
    );
    return etu;
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

  getSpecialiteById(idSpecialite){
    this.currentSpecialite = this.utilsService.filterByOneField(this.specialites, "idspecialite", idSpecialite);
    this.getFiliereById(this.currentSpecialite.idfiliere);
  }

  getFiliereById(idFiliere){
    this.currentFiliere = this.utilsService.filterByOneField(this.filieres, "idfiliere", idFiliere);
    this.selectedFiliereId = this.currentFiliere.idfiliere;
    this.getSousDomaineById(this.currentFiliere.idsousdomaine);
    if (this.currentSousDomaine.idsousdomaine != 0) {
      this.getDomainNameById(this.currentSousDomaine.iddomaine);
    }
  }

  getClasseById(idClasse){
    this.selectedClasseId = idClasse;
    this.currentClasse = this.utilsService.filterByOneField(this.classes, "idclasse", Number(idClasse));
    this.getSpecialiteById(this.currentClasse.idspecialite);
  }

  getFilieresBySousDomaineId(idSousDomaine){
    this.filieresFiltered = this.utilsService.getAllChildsByParentByValue(this.filieres, "idsousdomaine", Number(idSousDomaine));
    if (this.filieresFiltered.length > 0) {
      this.zeroResultatFiliere = "";
    }else{
      this.zeroResultatFiliere = "rien";
    }
  }

  getClassesBySpecialiteId(idSpecialite){
    this.classesFiltered = this.utilsService.getAllChildsByParentByValue(this.classes, "idspecialite", Number(idSpecialite));
    if (this.classesFiltered.length > 0) {
      this.zeroResultatClasse = "";
    }else{
      this.zeroResultatClasse = "rien";
    }
  }

  getSpecialitesByFiliereId(idFiliere){
    this.specialitesFiltered = this.utilsService.getAllChildsByParentByValue(this.specialites, "idfiliere", Number(idFiliere));
    if (this.specialitesFiltered.length > 0) {
      this.zeroResultatSpecialite = "";
    }else{
      this.zeroResultatSpecialite = "rien";
    }
  }

  initializeInscriptionObject(){
    this.inscription.setIdclasse(this.inscriptionForm.get('idclasse').value);
    this.inscription.setMatricule(this.inscriptionForm.get('matricule').value);
    this.inscription.setDateInscription(this.inscriptionForm.get('dateInscription').value);
    this.inscription.setAnnee(this.utilsService.extractDate(this.inscriptionForm.get('annee').value));
  }

  fillFormBeforUpdating(inscription){
    let month = inscription.dateinscription.split("-")[1];
    this.getClasseById(inscription.idclasse);
    this.getSpecialiteById(this.currentClasse.idspecialite);
    this.getSpecialitesByFiliereId(this.currentSpecialite.idfiliere);
    this.getClassesBySpecialiteId(this.currentClasse.idspecialite);
    this.getFiliereById(this.currentSpecialite.idfiliere);
    this.getFilieresBySousDomaineId(this.currentFiliere.idsousdomaine);
    this.oldInscription = inscription;
    this.inscriptionForm.reset();
    this.showCancelBtn = true;
    this.buttonAction = "Modifier";
    this.inscriptionForm.get('nomDomain').setValue(this.currentDomaine.iddomaine);
    this.inscriptionForm.get('nomSousDomaine').setValue(this.currentSousDomaine.idsousdomaine);
    this.inscriptionForm.get('filiere').setValue(this.currentSpecialite.idfiliere);
    this.inscriptionForm.get('nomSpecialite').setValue(this.currentSpecialite.idspecialite);
    this.inscriptionForm.get('matricule').setValue(inscription.matricule);
    this.inscriptionForm.get('idclasse').setValue(this.selectedClasseId);
    this.inscriptionForm.get('dateInscription').setValue(this.datePipe.transform(inscription.dateinscription, 'yyyy-MM-dd'));
    this.inscriptionForm.get('annee').setValue(inscription.annee+"-"+month);
    this.onMatriculeChange();
    window.scrollTo(0,0);
  }

  updateInscription(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeInscriptionObject();
    const content = {
      "matricule": this.inscription.getMatricule(),
      "idclasse": this.inscription.getIdClasse(),
      "dateinscription": this.inscription.getDateInscription(),
      "annee": this.inscription.getAnnee()
    }
    this.inscriptionService.updateInscription(this.oldInscription, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Inscription modifiée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllInscriptions();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Inscription non modifiée.";
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

  createInscription(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeInscriptionObject();
    const content = {
      "matricule": this.inscription.getMatricule(),
      "idclasse": this.inscription.getIdClasse(),
      "dateinscription": this.inscription.getDateInscription(),
      "annee": this.inscription.getAnnee(),
    }
    this.inscriptionService.postInscription(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Inscription créee avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllInscriptions();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Inscription non enregistrée.";
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

  deleteInscription(inscription) {
    const content = {
      "matricule": inscription.matricule,
      "idclasse": inscription.idclasse,
      "dateinscription": inscription.dateinscription,
      "annee": inscription.annee,
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
          this.inscriptionService.deleteInscription(content).then(
            (result) => {
              this.getAllInscriptions().then((res) => {
                Swal.fire(
                  'Inscription Supprimée!',
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
      this.updateInscription();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createInscription();
    }
  }
}
