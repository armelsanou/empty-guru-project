import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Ec } from '../../../entities/programme/ec';
import { EcService } from '../../../services/servicesProgramme/ec/ec.service';
import { Enseignant } from '../../../entities/programme/enseignant';
import { SendNotificationService } from './../../../services/send-notication/send-notification.service';
import { SettingService } from './../../../services/setting/setting.service';
import { UtilsService } from './../../../services/utils/utils.service';
import { EnseignantEc } from '../../../entities/programme/enseignant-ec';
import { EnseignantEcService } from '../../../services/servicesProgramme/enseignant-ec/enseignant-ec.service';
import { EnseignantService } from '../../../services/servicesProgramme/enseignant/enseignant.service';
import { IOption } from 'ng-select';
import { SelectOptionService } from './../../../shared/element/select-option.service';

@Component({
  selector: 'app-enseignant-ec',
  templateUrl: './enseignant-ec.component.html',
  styleUrls: ['./enseignant-ec.component.scss']
})
export class EnseignantEcComponent implements OnInit {

  simpleOptionEc: Array<IOption>;
  public ecData: any = [];

  public ecs: any[] = [];
  public enseignants: any[] = [];
  public enseignantsEcs: any[] = [];
  ec = new Ec();
  enseignantEc = new EnseignantEc();
  oldEnseignantEc = new EnseignantEc();
  ue = new Enseignant();
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  searchText: any;
  public sortOrder = 'desc';
  error: {};
  loadEnseignantsEcs = false;
  deleteLoading = false;
  showCancelBtn = false;
  deleteMessage = "Supprimer";
  createLoad = false;
  updateLoad = false;
  totalRecords: number;
  isEmpty = false;
  buttonAction = "Enregistrer";
  currentEnseignantEcCode: number;
  selectedUeId: any;
  selectedUeName: any;
  selectedEcCode: any;

  enseignantEcForm: FormGroup;
  eec = new FormControl('', [Validators.required]);
  eenseignant = new FormControl('', [Validators.required]);

  constructor(
    public enseignantService: EnseignantService,
    public enseignantEcService: EnseignantEcService,
    public httpClient: HttpClient,
    public ecService: EcService,
    private sendNotificationService: SendNotificationService,
    private settingService : SettingService,
    private utilsService : UtilsService,
    private selectOptionService: SelectOptionService,
  )
  {
    this.enseignantEcForm = new FormGroup({
      eec: this.eec,
      eenseignant: this.eenseignant
    });
  }

  ngOnInit() {
    this.loadEnseignantsEcs = true;
    this.getAllEnseignantsEc();
  }

  initializeDomaineObject(){
    this.enseignantEc.setIdEnseignant(Number(this.enseignantEcForm.get('eenseignant').value));
    this.enseignantEc.setIdEc(Number(this.enseignantEcForm.get('eec').value));
  }

  async getAllEnseignants(){
    this.enseignantService.getAllEnseignants().subscribe(
      (result) => {
        this.enseignants = result;
        this.enseignants = this.enseignants.sort((a, b) => b.idenseignant - a.idenseignant);
        this.getAllEcs();
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  async getAllEnseignantsEc(){
    this.enseignantEcService.getListEnseignantsEc().subscribe(
      (result) => {
        this.enseignantsEcs = result;
        if (this.enseignantsEcs.length > 0) {
          this.isEmpty = false;
          this.loadEnseignantsEcs = false
        } else {
          this.isEmpty = true;
          this.loadEnseignantsEcs = false
        }
        this.getAllEnseignants();

      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        this.loadEnseignantsEcs = false;
      }
    );
  }

  async getAllEcs(){
    this.ecData = [];
    let data = {
      value: '',
      label: ''
    }
    this.ecService.getAllEcs().subscribe(
      (result) => {
        this.ecs = result;
        this.ecs.forEach(ec => {
          data = {
            value: '',
            label: ''
          }
          data.label = ec.codeec +" - "+ ec.nom;
          data.value = ec.idec;
          this.ecData.push(data);
        });
        this.simpleOptionEc = this.selectOptionService.getCharacters(this.ecData);
      },
      (err) => {
        this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    );
  }

  onEnseignantSelect(e){
    this.selectedUeId = e.target.value;
  }

  onEcSelect(e){
    //this.selectedEcCode = e.target.value;
    console.log("valeur:", e);
  }

  fillFormBeforUpdating(enseignantEc){
    this.oldEnseignantEc = enseignantEc;
    this.enseignantEcForm.reset();
    this.showCancelBtn = true;
    this.buttonAction = "Modifier";
    this.enseignantEcForm.get('eenseignant').setValue(enseignantEc.idenseignant);
    this.enseignantEcForm.get('eec').setValue(enseignantEc.idec);
    var optionsEcs = Array(document.getElementById('eec').getElementsByTagName('option'));
    for (let i = 0; i < optionsEcs[0].length; i++) {
      if(optionsEcs[0][i].value === enseignantEc.idec){
        $(document).ready(function () {
          document.getElementById('eec').getElementsByTagName('option')[optionsEcs[0][i].index].selected = true;
        })
        break;
      }
    }

    var optionsEnseignants = Array(document.getElementById('eenseignant').getElementsByTagName('option'));
    for (let i = 0; i < optionsEnseignants[0].length; i++) {
      if(Number(optionsEnseignants[0][i].value) === Number(enseignantEc.idenseignant)){
        $(document).ready(function () {
          document.getElementById('eenseignant').getElementsByTagName('option')[optionsEnseignants[0][i].index].selected = true;
        })
        break;
      }
    }
    window.scrollTo(0,0);
  }

  reset(){
    this.enseignantEcForm.reset();
    this.buttonAction = "Enregistrer";
    this.showCancelBtn = false;
    this.createLoad = false;
    this.updateLoad = false;
  }

  updateEnseignantEc(){
    this.buttonAction = "Modification...";
    this.updateLoad = true;
    this.initializeDomaineObject();
    const content =
    {
      "idenseignant": this.enseignantEc.getIdEnseignant(),
      "idec": this.enseignantEc.getIdEc(),
    }
    this.enseignantEcService.updateEnseignantEc(this.oldEnseignantEc, content).then(
      (result) => {
        if (result) {
          this.updateLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Modifié avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "info");
          this.getAllEnseignantsEc();
          this.reset();
        } else {
          this.updateLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Modification échouée.";
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

  createEnseignantEc(){
    this.buttonAction = "Enregistrement...";
    this.createLoad = true;
    this.initializeDomaineObject();
    const content = {
      "idenseignant": this.enseignantEc.getIdEnseignant(),
      "idec": this.enseignantEc.getIdEc()
    }

    this.enseignantEcService.postEnseignantEc(content).then(
      (result) => {
        if (result) {
          this.createLoad = false;
          this.settingService.option.title = "success";
          this.settingService.option.msg = "Crée avec succès.";
          this.sendNotificationService.addToast(this.settingService.option, "success");
          this.getAllEnseignantsEc();
          this.reset();
        } else {
          this.createLoad = false;
          this.settingService.option.title = "error";
          this.settingService.option.msg = "Non enregistré.";
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

  deleteEnseignantEc(enseignantEc) {
    const content  =
    {
      "idenseignant": enseignantEc.idenseignant,
      "idec": enseignantEc.idec,
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
          this.enseignantEcService.deleteEnseignantEc(enseignantEc).then(
            (result) => {
              this.getAllEnseignantsEc().then((res) => {
                Swal.fire(
                  'EnseignantEc Supprimé!',
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
      this.updateEnseignantEc();
    }
    if (this.buttonAction === 'Enregistrer') {
      this.createEnseignantEc();
    }
  }
}
