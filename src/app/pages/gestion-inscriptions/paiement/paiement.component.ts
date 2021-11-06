import { EtudiantService } from './../../../services/servicesInscription/etudiant/etudiant.service';
import { BanqueService } from '../../../services/servicesInscription/banque/banque.service';
import { PaiementService } from '../../../services/servicesInscription/paiement/paiement.service';
import { Paiement } from '../../../entities/inscription/paiement';
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
import {SelectOptionService} from '../../../shared/element/select-option.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './paiement.component.scss',
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

export class PaiementComponent implements OnInit {

  nomEtudiant: any = null;
  public banqueData: any = [];

  public observations: any = [
    {value: '1', label: 'Première tranche'},
    {value: '2', label: 'Deuxième tranche'},
    {value: '3', label: 'Totalité'},
    {value: '4', label: 'Autre'}
  ];

  simpleOption: Array<IOption>;
  selectedOption = '';

  public paiements: any[] = [];
  paiement = new Paiement();
  oldPaiement = new Paiement();
  allBanques: any[] = [];
  public etudiants: any[] = [];

  loadPaiements = false;
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
  currentPaiementId: number;

  currentBanque: any;
  selectedBanqueId: any;
  selectedObservationId: any;

  paiementForm: FormGroup;
  matricule = new FormControl('', [Validators.required]);
  bankPaiement = new FormControl('', [Validators.required]);
  numeroPaiement = new FormControl('', [Validators.required]);
  anneePaiement = new FormControl('', [Validators.required]);
  montantPaiement = new FormControl('', [Validators.required]);
  datePaiement = new FormControl('', [Validators.required]);
  nomEtud = new FormControl(this.nomEtudiant);
  observationPaiement = new FormControl('', [Validators.required]);

  constructor(
    private sendNotificationService: SendNotificationService,
    private settingService: SettingService,
    private utilsService: UtilsService,
    private paiementService: PaiementService,
    private banqueService: BanqueService,
    private selectOptionService: SelectOptionService,
    private datePipe: DatePipe,
    private etudiantService: EtudiantService
  )
  {
    this.paiementForm = new FormGroup({
      matricule: this.matricule,
      bankPaiement: this.bankPaiement,
      numeroPaiement: this.numeroPaiement,
      anneePaiement: this.anneePaiement,
      montantPaiement: this.montantPaiement,
      datePaiement: this.datePaiement,
      nomEtud: this.nomEtud,
      observationPaiement: this.observationPaiement
    });
  }

  ngOnInit() {
    this.loadPaiements = false;
    this.getAllBanques();
    this.getPaiements();
    this.getAllEtudiants();
    this.utilsService.setDateOfToday(this.paiementForm,'anneePaiement');
    this.utilsService.setDateOfToday(this.paiementForm,'datePaiement', "yep");
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.paiementForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
    this.utilsService.setDateOfToday(this.paiementForm,'anneePaiement');
    this.utilsService.setDateOfToday(this.paiementForm,'datePaiement', "yep");
    this.nomEtudiant = null;
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

  onMatriculeChange() {
    const currentMatricule: any = this.paiementForm.get('matricule').value;
    if (currentMatricule.length > 5) {
      this.nomEtudiant = this.utilsService.filterByOneField(this.etudiants, "matricule", currentMatricule).nom;
    }
    this.paiementForm.get('nomEtud').setValue(this.nomEtudiant);
  }

  onObservationSelect(e){
    this.selectedObservationId = e.target.value;
  }

  async getPaiements(){
    this.paiementService.getListPaiements().subscribe(
      (result) => {
        this.paiements = result;
        if (this.paiements.length > 0) {
          this.isEmpty = false;
          this.totalRecords = this.paiements.length;
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
    this.loadPaiements = false;
  }

  getBanqueById(idBanque){
    this.currentBanque = this.utilsService.filterByOneField(this.allBanques, "idbanque", Number(idBanque));
    this.selectedBanqueId = idBanque;
  }

  onBanqueSelect(e){
    this.selectedBanqueId = e.target.value;
    this.getBanqueById(Number(this.selectedBanqueId));
  }

  onDateSelect(e){
    let dat = e.target.value;
    dat = dat.split("-");
    this.paiementForm.get('anneePaiement').setValue(dat[0]+"-"+dat[1]);
  }

  async getAllBanques(){
    this.banqueData = [];
    let data = {
      value: '',
      label: ''
    }
    this.banqueService.getListBanques().subscribe(
      (result) => {
        this.allBanques = result;
        this.allBanques = this.allBanques.sort((a, b) => b.idbanque - a.idbanque);
        this.allBanques.forEach(banque => {
          data = {
            value: '',
            label: ''
          }
          data.label = banque.codebanque +" - "+ banque.nom;
          data.value = banque.idbanque;
          this.banqueData.push(data);
        });
        if (this.banqueData.length > 0) {
          this.simpleOption = this.selectOptionService.getCharacters(this.banqueData);
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  initializePaiementObject(){
    this.paiement.setMatricule(this.paiementForm.get('matricule').value);
    this.paiement.setIdBanque(this.paiementForm.get('bankPaiement').value);
    this.paiement.setNumero(this.paiementForm.get('numeroPaiement').value);
    this.paiement.setAnnee(this.utilsService.extractDate(this.paiementForm.get('anneePaiement').value));
    this.paiement.setMontant(this.paiementForm.get('montantPaiement').value);
    this.paiement.setDatePaiement(this.paiementForm.get('datePaiement').value);
    this.paiement.setObservation(this.paiementForm.get('observationPaiement').value);
  }

  fillFormBeforUpdating(paiement){
    let month = paiement.dateinscription.split("-")[1];
    this.oldPaiement = paiement;
    this.getBanqueById(paiement.idbanque);
    this.paiementForm.reset();
    this.showCancelBtn = true;
    this.buttonAction = "Modifier";
    this.paiementForm.get('matricule').setValue(paiement.matricule);
    this.paiementForm.get('bankPaiement').setValue(this.selectedBanqueId);
    this.paiementForm.get('numeroPaiement').setValue(paiement.numero);
    this.paiementForm.get('anneePaiement').setValue(paiement.annee+"-"+month);
    this.paiementForm.get('montantPaiement').setValue(paiement.montant);
    this.paiementForm.get('datePaiement').setValue(this.datePipe.transform(paiement.datepaiement, 'yyyy-MM-dd'));
    this.paiementForm.get('observationPaiement').setValue(paiement.observation);
    this.onMatriculeChange();
    window.scrollTo(0,0);
  }

  updatePaiement(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializePaiementObject();
    const content = {
      "matricule": this.paiement.getMatricule(),
      "datepaiement": this.paiement.getDatePaiement(),
      "idbanque": this.paiement.getIdBanque(),
      "annee": this.paiement.getAnnee(),
      "montant": this.paiement.getMontant(),
      "numero": this.paiement.getNumero(),
      "observation": this.paiement.getObservation()
    }
    this.paiementService.updatePaiement(this.oldPaiement, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Paiement modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getPaiements();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Paiement non modifié.";
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

  createPaiement(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializePaiementObject();
    const content = {
      "matricule": this.paiement.getMatricule(),
      "datepaiement": this.paiement.getDatePaiement(),
      "idbanque": this.paiement.getIdBanque(),
      "annee": this.paiement.getAnnee(),
      "montant": this.paiement.getMontant(),
      "numero": this.paiement.getNumero(),
      "observation": this.paiement.getObservation()
    }
    this.paiementService.postPaiement(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Paiement crée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getPaiements();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Paiement non enregistré.";
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

  deletePaiement(paiement) {
    const content = {
      "matricule": paiement.matricule,
      "datepaiement": paiement.datepaiement,
      "idbanque": paiement.idbanque,
      "annee": paiement.annee,
      "montant": paiement.montant,
      "numero": paiement.numero,
      "observation": paiement.observation
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
          this.paiementService.deletePaiement(content).then(
            (result) => {
              this.getPaiements().then((res) => {
                Swal.fire(
                  'Paiement Supprimé!',
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
      this.updatePaiement();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createPaiement();
    }
  }

}
