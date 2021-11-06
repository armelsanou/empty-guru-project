import { Banque } from './../../../entities/inscription/banque';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { transition, trigger, style, animate } from '@angular/animations';
import { SendNotificationService } from '../../../services/send-notication/send-notification.service';
import { SettingService } from '../../../services/setting/setting.service';
import { UtilsService } from '../../../services/utils/utils.service';
import {BanqueService} from '../../../services/servicesInscription/banque/banque.service';

@Component({
  selector: 'app-banque',
  templateUrl: './banque.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './banque.component.scss',
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
export class BanqueComponent implements OnInit {
  public banques: any[] = [];
  banque = new Banque();

  loadBanques = false;
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
  currentBanqueId: number;

  banqueForm: FormGroup;
  codeBanque = new FormControl('', [Validators.required]);
  nomBanque = new FormControl('', [Validators.required]);
  nameBanque = new FormControl('', [Validators.required]);

  constructor(
    private sendNotificationService: SendNotificationService,
    private settingService: SettingService,
    private utilsService: UtilsService,
    private banqueService: BanqueService
  )
  {
    this.banqueForm = new FormGroup({
      codeBanque: this.codeBanque,
      nomBanque: this.nomBanque,
      nameBanque: this.nameBanque
    });
  }

  ngOnInit() {
    this.loadBanques = true;
    this.getAllBanques();
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.banqueForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  async getAllBanques(){
    this.banqueService.getListBanques().subscribe(
      (result) => {
        this.banques = result;
        this.banques = this.banques.sort((a, b) => b.idbanque - a.idbanque);
        if (this.banques.length > 0) {
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
    this.loadBanques = false;
  }

  initializeBanqueObject(){
    this.banque.setCodeBanque(this.banqueForm.get('codeBanque').value);
    this.banque.setNom(this.banqueForm.get('nomBanque').value);
    this.banque.setName(this.banqueForm.get('nameBanque').value);
  }

  fillFormBeforUpdating(banque){
    this.banqueForm.reset();
    this.showCancelBtn = true;
    this.currentBanqueId = Number(banque.idbanque);
    this.buttonAction = "Modifier";
    this.banqueForm.get('codeBanque').setValue(banque.codebanque);
    this.banqueForm.get('nomBanque').setValue(banque.nom);
    this.banqueForm.get('nameBanque').setValue(banque.name);
    window.scrollTo(0,0);
  }

  updateBanque(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeBanqueObject();
    const content = [
      {
        "op": "replace",
        "path": "/codebanque",
        "value": this.banque.getCodeBanque()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.banque.getNom()
      },
      {
        "op": "replace",
        "path": "/name",
        "value": this.banque.getName()
      }
    ]
    this.banqueService.updateBanque(this.currentBanqueId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Banque modifiée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllBanques();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Banque non modifiée.";
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

  createBanque(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeBanqueObject();
    const content = {
      "codebanque": this.banque.getCodeBanque(),
      "nom": this.banque.getNom(),
      "name": this.banque.getName()
    }
    this.banqueService.postBanque(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Banque créee avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllBanques();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Banque non enregistrée.";
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

  deleteBanque(idBanque) {
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
          this.banqueService.deleteBanque(idBanque).then(
            (result) => {
              this.getAllBanques().then((res) => {
                Swal.fire(
                  'Banque Supprimée!',
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
      this.updateBanque();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createBanque();
    }
  }
}
