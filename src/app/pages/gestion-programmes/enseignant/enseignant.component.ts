import { Enseignant } from '../../../entities/programme/enseignant';
import { EnseignantService } from '../../../services/servicesProgramme/enseignant/enseignant.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { transition, trigger, style, animate } from '@angular/animations';
import { SendNotificationService } from '../../../services/send-notication/send-notification.service';
import { SettingService } from '../../../services/setting/setting.service';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrls: ['./enseignant.component.scss']
})
export class EnseignantComponent implements OnInit {

  public enseignants: any[] = [];
  enseignant = new Enseignant();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadEnseignants = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  createLoad = false;
  updateLoad = false;
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentEnseignantId: number;

  enseignantForm: FormGroup;
  nomEnseignant = new FormControl('', [Validators.required]);
  genreEnseignant = new FormControl('', [Validators.required]);
  telephoneEnseignant = new FormControl('', [Validators.required]);
  villeEnseignant = new FormControl('', [Validators.required]);

  constructor(
    public enseignantService: EnseignantService,
    private sendNotificationService: SendNotificationService,
    private settingService : SettingService,
    private utilsService : UtilsService
  )
  {
    this.enseignantForm = new FormGroup({
      nomEnseignant: this.nomEnseignant,
      genreEnseignant: this.genreEnseignant,
      telephoneEnseignant: this.telephoneEnseignant,
      villeEnseignant: this.villeEnseignant
    });
  }

  ngOnInit() {
    this.loadEnseignants = true;
    this.getAllEnseignants();
  }

  async getAllEnseignants(){
    this.enseignantService.getAllEnseignants().subscribe(
      (result) => {
        this.enseignants = result;
        this.enseignants = this.enseignants.sort((a, b) => b.idenseignant - a.idenseignant);
        this.totalRecords = this.enseignants.length;
        if (this.totalRecords > 0) {
          this.isEmpty = false;
        }else{
          this.isEmpty = true;
        }
        this.loadEnseignants = false
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadEnseignants = false;
      }
    );
  }

  initializeEnseignantObject(){
    this.enseignant.setNom(this.enseignantForm.get('nomEnseignant').value);
    this.enseignant.setGenre(this.enseignantForm.get('genreEnseignant').value);
    this.enseignant.setTelephone(this.enseignantForm.get('telephoneEnseignant').value);
    this.enseignant.setVille(this.enseignantForm.get('villeEnseignant').value);
  }

  fillFormBeforUpdating(enseignant){
    this.enseignantForm.reset();
    this.showCancelBtn = true;
    this.currentEnseignantId = Number(enseignant.idenseignant);
    this.buttonAction = "Modifier";
    this.enseignantForm.get('nomEnseignant').setValue(enseignant.nom);
    this.enseignantForm.get('genreEnseignant').setValue(enseignant.genre);
    this.enseignantForm.get('telephoneEnseignant').setValue(enseignant.tel);
    this.enseignantForm.get('villeEnseignant').setValue(enseignant.ville);
    console.log("form value", this.enseignantForm.value);
    window.scrollTo(0,0);
  }

  reset(){
    this.enseignantForm.reset();
    this.buttonAction = "Enregistrer";
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  updateEnseignant(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeEnseignantObject();
    const content = [
      {
        "op": "replace",
        "path": "/nom",
        "value": this.enseignant.getNom()
      },
      {
        "op": "replace",
        "path": "/genre",
        "value": this.enseignant.getGenre()
      },
      {
        "op": "replace",
        "path": "/tel",
        "value": this.enseignant.getTelephone()
      },
      {
        "op": "replace",
        "path": "/ville",
        "value": this.enseignant.getVille()
      },
    ]
    this.enseignantService.updateEnseignant(this.currentEnseignantId, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Enseignant modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllEnseignants();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Enseignant non modifié.";
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

  createEnseignant(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeEnseignantObject();
    const content = {
      "nom": this.enseignant.getNom(),
      "genre": this.enseignant.getGenre(),
      "tel": this.enseignant.getTelephone(),
      "ville": this.enseignant.getVille()
    }
    this.enseignantService.postEnseignant(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Enseignant crée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllEnseignants();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Enseignant non enregistré.";
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

  deleteEnseignant(idEnseignant) {
    console.log("idEnseignant:",idEnseignant);
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
          this.enseignantService.deleteEnseignant(idEnseignant).then(
            (result) => {
              this.getAllEnseignants().then((res) => {
                Swal.fire(
                  'Enseignant Supprimé!',
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
      this.updateEnseignant();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createEnseignant();
    }
  }

  telInputObject(obj) {
    console.log(obj);
    obj.setCountry('in');
  }

}
