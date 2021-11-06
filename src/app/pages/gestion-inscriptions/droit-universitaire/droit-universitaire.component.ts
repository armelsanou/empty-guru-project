import { SpecialiteService } from './../../../services/servicesDomaine/specialite/specialite.service';
import { FiliereService } from './../../../services/servicesDomaine/filiere/filiere.service';
import { SousDomaineService } from './../../../services/servicesDomaine/sous-domaine/sous-domaine.service';
import { DomaineService } from './../../../services/servicesDomaine/domaine/domaine.service';
import { SelectOptionService } from './../../../shared/element/select-option.service';
import { ClasseService } from './../../../services/servicesDomaine/classe/classe.service';
import { PaysService } from './../../../services/servicesInscription/pays/pays.service';
import { Banque } from '../../../entities/inscription/banque';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { transition, trigger, style, animate } from '@angular/animations';
import { SendNotificationService } from '../../../services/send-notication/send-notification.service';
import { SettingService } from '../../../services/setting/setting.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { DroitUniversitaire } from './../../../entities/inscription/droit-universtaire';
import { DroitUniversitaireService } from './../../../services/servicesInscription/droit-universitaire/droit-universitaire.service';
import {IOption} from 'ng-select';

@Component({
  selector: 'app-droit-universitaire',
  templateUrl: './droit-universitaire.component.html',
  styleUrls: [
    './droit-universitaire.component.scss',
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
export class DroitUniversitaireComponent implements OnInit {

  public paysData: any = [];
  public classeData: any = [];

  simpleOptionPays: Array<IOption>;
  simpleOptionClasse: Array<IOption>;
  selectedOptionPays = '';
  selectedOptionClasse = '';

  public droitsUniversitaires: any[] = [];
  droitUniversitaire = new DroitUniversitaire();
  oldDroitUniversitaire = new DroitUniversitaire();
  allPays: any[] = [];
  classes: any[] = [];

  loadDroitUniv = false;
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

  currentPays: any;
  selectedPaysId: any;

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

  droitUnivForm: FormGroup;
  nomDomain = new FormControl('');
  nomSousDomaine = new FormControl('');
  filiere = new FormControl('');
  nomSpecialite = new FormControl('');
  pays = new FormControl('', [Validators.required]);
  idclasse = new FormControl('', [Validators.required]);
  annee = new FormControl('', [Validators.required]);
  montant = new FormControl('', [Validators.required]);

  constructor(
    private sendNotificationService: SendNotificationService,
    private settingService: SettingService,
    private utilsService: UtilsService,
    private droitUniversitaireService: DroitUniversitaireService,
    private paysService: PaysService,
    private classeService: ClasseService,
    public domaineService: DomaineService,
    public sousDomaineService: SousDomaineService,
    public filiereService: FiliereService,
    public specialiteService: SpecialiteService,
    private selectOptionService: SelectOptionService
  )
   {
    this.droitUnivForm = new FormGroup({
      nomDomain: this.nomDomain,
      nomSousDomaine: this.nomSousDomaine,
      filiere: this.filiere,
      nomSpecialite: this.nomSpecialite,
      pays: this.pays,
      idclasse: this.idclasse,
      annee: this.annee,
      montant: this.montant
    });
  }

  ngOnInit() {
    this.loadDroitUniv = true;
    this.getAllPays();
    this.getAllClasses();
    this.getAllsDroitUniversistaires();
    this.getAllDomaines();
    this.utilsService.setDateOfToday(this.droitUnivForm,'annee');
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.droitUnivForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  async getAllsDroitUniversistaires(){
    this.droitUniversitaireService.getListDroitUniversitaires().subscribe(
      (result) => {
        this.droitsUniversitaires = result;
        //this.droitsUniversitaires = this.droitsUniversitaires.sort((a, b) => b.iddroitUniversitaire - a.iddroitUniversitaire);
        if (this.droitsUniversitaires.length > 0) {
          this.isEmpty = false;
          this.totalRecords = this.droitsUniversitaires.length;
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
    this.loadDroitUniv = false;
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

  onDomainSelect(e){
    this.selectedDomainId = e.target.value;
    this.getDomainNameById(this.selectedDomainId);
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

  onClasseSelect(e){
    this.selectedClasseId = e.target.value;
    this.getClasseById(this.selectedClasseId);
  }

  onPaysSelect(e){
    this.selectedPaysId = e.target.value;
    this.getPaysById(Number(this.selectedPaysId));
  }

  getPaysById(idPays){
    this.currentPays = this.utilsService.filterByOneField(this.allPays, "idpays", Number(idPays));
    this.selectedPaysId = idPays;
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



  initializeDroitUniversitaireObject(){
    this.droitUniversitaire.setIdpays(this.droitUnivForm.get('pays').value);
    this.droitUniversitaire.setIdclasse(this.droitUnivForm.get('idclasse').value);
    this.droitUniversitaire.setMontant(this.droitUnivForm.get('montant').value);
    this.droitUniversitaire.setAnnee(this.utilsService.extractDate(this.droitUnivForm.get('annee').value));
  }

  fillFormBeforUpdating(droitUniversitaire){
    this.oldDroitUniversitaire = droitUniversitaire;
    this.getClasseById(droitUniversitaire.idclasse);
    this.getSpecialiteById(this.currentClasse.idspecialite);
    this.getSpecialitesByFiliereId(this.currentSpecialite.idfiliere);
    this.getClassesBySpecialiteId(this.currentClasse.idspecialite);
    this.getFiliereById(this.currentSpecialite.idfiliere);
    this.getFilieresBySousDomaineId(this.currentFiliere.idsousdomaine);
    this.getPaysById(droitUniversitaire.idpays);
    this.droitUnivForm.reset();
    this.showCancelBtn = true;
    this.buttonAction = "Modifier";
    this.droitUnivForm.get('nomDomain').setValue(this.currentDomaine.iddomaine);
    this.droitUnivForm.get('nomSousDomaine').setValue(this.currentSousDomaine.idsousdomaine);
    this.droitUnivForm.get('filiere').setValue(this.currentSpecialite.idfiliere);
    this.droitUnivForm.get('nomSpecialite').setValue(this.currentSpecialite.idspecialite);
    this.droitUnivForm.get('pays').setValue(droitUniversitaire.idpays);
    this.droitUnivForm.get('idclasse').setValue(droitUniversitaire.idclasse);
    this.droitUnivForm.get('montant').setValue(droitUniversitaire.montant);
    this.droitUnivForm.get('annee').setValue(droitUniversitaire.annee+"-01");
    window.scrollTo(0,0);
  }

  updateDroitUniversitaire(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeDroitUniversitaireObject();
    const content = {
      "idpays": this.droitUniversitaire.getIdPays(),
      "idclasse": this.droitUniversitaire.getIdClasse(),
      "montant": this.droitUniversitaire.getMontant(),
      "annee": this.droitUniversitaire.getAnnee()
    }
    this.droitUniversitaireService.updateDroitUniversitaire(this.oldDroitUniversitaire, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Droit universitaire modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllsDroitUniversistaires();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Droit universitaire non modifié.";
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

  createDroitUniversitaire(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeDroitUniversitaireObject();
    const content = {
      "idpays": Number(this.droitUniversitaire.getIdPays()),
      "idclasse": this.droitUniversitaire.getIdClasse(),
      "montant": this.droitUniversitaire.getMontant(),
      "annee": this.droitUniversitaire.getAnnee(),
    }
    this.droitUniversitaireService.postDroitUniversitaire(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Droit universitaire crée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllsDroitUniversistaires();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Droit universitaire non enregistré.";
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

  deleteDroitUniversitaire(droitUniversitaire) {
    const content = {
      "idpays": droitUniversitaire.idpays,
      "idclasse": droitUniversitaire.idclasse,
      "montant": droitUniversitaire.montant,
      "annee": droitUniversitaire.annee,
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
          this.droitUniversitaireService.deleteDroitUniversitaire(content).then(
            (result) => {
              this.getAllsDroitUniversistaires().then((res) => {
                Swal.fire(
                  'Droit universitaire Supprimé!',
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
      this.updateDroitUniversitaire();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createDroitUniversitaire();
    }
  }

}
