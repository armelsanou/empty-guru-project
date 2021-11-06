import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { transition, trigger, style, animate } from '@angular/animations';
import { SendNotificationService } from '../../../services/send-notication/send-notification.service';
import { SettingService } from '../../../services/setting/setting.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { PaysService } from './../../../services/servicesInscription/pays/pays.service';
import { Pays } from './../../../entities/inscription/pays';

@Component({
  selector: 'app-pays',
  templateUrl: './pays.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './pays.component.scss',
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
export class PaysComponent implements OnInit {

  public pays: any[] = [];
  pay = new Pays();

  loadPays = false;
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
  currentPaysId: number;

  paysForm: FormGroup;
  codePays = new FormControl('', [Validators.required]);
  nomPays = new FormControl('', [Validators.required]);
  namePays = new FormControl('', [Validators.required]);

  constructor(
    private sendNotificationService: SendNotificationService,
    private settingService: SettingService,
    private utilsService: UtilsService,
    private PayService: PaysService
  )
  {
    this.paysForm = new FormGroup({
      codePays: this.codePays,
      nomPays: this.nomPays,
      namePays: this.namePays
    });
  }

  ngOnInit() {
    this.loadPays = true;
    this.getAllPays();
  }

  reset(){
    this.buttonAction = "Enregistrer";
    this.paysForm.reset();
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  async getAllPays(){
    this.PayService.getListPays().subscribe(
      (result) => {
        this.pays = result;
        this.pays = this.pays.sort((a, b) => b.idpay - a.idpay);
        if (this.pays.length > 0) {
          this.isEmpty = false;
          console.log(this.pays);
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          this.isEmpty = true;
        }
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
    this.loadPays = false;
  }

  initializePaysObject(){
    this.pay.setCodePays(this.paysForm.get('codePays').value);
    this.pay.setNom(this.paysForm.get('nomPays').value);
    this.pay.setName(this.paysForm.get('namePays').value);
  }

  fillFormBeforUpdating(pay){
    this.paysForm.reset();
    this.showCancelBtn = true;
    this.currentPaysId = Number(pay.idpays);
    this.buttonAction = "Modifier";
    this.paysForm.get('codePays').setValue(pay.codepays);
    this.paysForm.get('nomPays').setValue(pay.nom);
    this.paysForm.get('namePays').setValue(pay.name);
    window.scrollTo(0,0);
  }

  updatePays(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializePaysObject();
    const content = [
      {
        "op": "replace",
        "path": "/codepays",
        "value": this.pay.getCodePays()
      },
      {
        "op": "replace",
        "path": "/nom",
        "value": this.pay.getNom()
      },
      {
        "op": "replace",
        "path": "/name",
        "value": this.pay.getName()
      }
    ]
    this.PayService.updatePays(this.currentPaysId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Pays modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllPays();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Pays non modifié.";
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

  createPays(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializePaysObject();
    const content = {
      "codepays": this.pay.getCodePays(),
      "nom": this.pay.getNom(),
      "name": this.pay.getName()
    }
    this.PayService.postPays(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Pays crée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllPays();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Pays non enregistrée.";
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

  deletePays(idPays) {
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
          this.PayService.deletePays(idPays).then(
            (result) => {
              this.getAllPays().then((res) => {
                Swal.fire(
                  'Pays Supprimée!',
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
      this.updatePays();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createPays();
    }
  }

}
