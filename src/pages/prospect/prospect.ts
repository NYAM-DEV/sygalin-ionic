import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GlobalProvider} from "../../providers/global/global";




@IonicPage()
@Component({
  selector: 'page-prospect',
  templateUrl: 'prospect.html',
})
export class ProspectPage {
  formgroup: FormGroup;
  nom: any;
  user: any;
  hideQuartier: any;
  hideVille: any;
  tel: any;
  items: any;
  tags = ['Ionic', 'Angular', 'TypeScript'];
  preparedTags =[];
    today:any;

  constructor( public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public _SYGALIN: GlobalProvider,) {
    this.hideQuartier=true;
    this.hideVille=true;
    this.today = new Date().toISOString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProspectPage');
  }

  ngOnInit() {
    this.getville_quartier();
    this.user = this._SYGALIN.getCurUser();
    this.formgroup = new FormGroup({
      civ: new FormControl('', [Validators.required]),
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      tel: new FormControl('', [Validators.required,Validators.minLength(9),Validators.maxLength(9)]),
      region: new FormControl('', [Validators.required]),
      ville: new FormControl('', [Validators.required]),
      new_ville: new FormControl('', [Validators.required]),

      quartier: new FormControl('', [Validators.required]),
      new_quartier: new FormControl('', [Validators.required]),
      longitude: new FormControl('', [Validators.required]),
      latitude: new FormControl('', [Validators.required]),
      today: new FormControl('', [Validators.required]),
      lieu: new FormControl('', [Validators.required]),
    });
  }

  onSubmit1() {
    if (this.formgroup.valid) {
      this.sendform();
    } else {
      this.validateAllFormFields(this.formgroup);
      this._SYGALIN.presentToast('Bien vouloir remplir tous les champs du formulaire', 'danger');
    }
  }
  validateAllFormFields(formGroup: FormGroup) { //{1}
    Object.keys(formGroup.controls).forEach(field => { //{2}
      const control = formGroup.get(field); //{3}
      if (control instanceof FormControl) { //{4}
        control.markAsTouched({
          onlySelf: true
        });
      } else if (control instanceof FormGroup) { //{5}
        this.validateAllFormFields(control); //{6}
      }
    });
  }
  sendform(){
    console.log('new prospect ');
  }

  getville_quartier(){
    let that=this;
    let postData = new FormData();
    //Récupération des infos sur les villes dans la BD distante
    this._SYGALIN.query('AllVille/',postData,false)
      .then(v=>{
        //console.log(v);
        that._SYGALIN.setVilles(v);
      })
      .catch(error => {
        console.log(error);
        this._SYGALIN.presentToast("Impossible d'accéder à Internet. Veuillez vérifier que vous avez accès à Internet", "warning");
      });
    this._SYGALIN.query('AllQuartier/',postData,false)
      .then(q=>{
        //console.log(q);
        that._SYGALIN.setQuarier(q);
      })
      .catch(error => {
        console.log(error);
        this._SYGALIN.presentToast("Impossible d'accéder à Internet. Veuillez vérifier que vous avez accès à Internet", "warning");
      });

    this._SYGALIN.query('AllRegion/',postData,false)
      .then(r=>{
        console.log(r);
        that._SYGALIN.setRegion(r);
      })
      .catch(error => {
        console.log(error);
        this._SYGALIN.presentToast("Impossible d'accéder à Internet. Veuillez vérifier que vous avez accès à Internet", "warning");
      });
    for(let v of this._SYGALIN.villes){
      this.preparedTags.push(v.nom);
    }
  }

  selectChangedQuartier(event){
    console.log(event);
    if (event==0) {
      this.hideQuartier=false;
    }else {
      this.hideQuartier=true;
    }
  }
  selectChangedVille(event){
    console.log(event);
    if (event==0) {
      this.hideVille=false;
    }else {
      this.hideVille=true;
    }
  }
  initializeItems() {
    this.items = [
      'Amsterdam',
      'Bogota',
      'lponfo'
    ];
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }



}
