import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams,ModalController, ViewController} from 'ionic-angular';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {GlobalProvider} from '../../providers/global/global';


@IonicPage()
@Component({
  selector: 'page-recap-sold',
  templateUrl: 'recap-sold.html',
})
export class RecapSoldPage {
  formgroup: FormGroup;
  showItem:boolean=false; 
  curentyear:any;
  lastyear:any; 
  soldecga: Array<any>;
  mois:any;
  annee:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _SYGALIN: GlobalProvider,
    public modalCtrl: ModalController) {

      this.formgroup = new FormGroup({
      search: new FormControl('', [Validators.required]),
      mois: new FormControl('', [Validators.required]),
      annee: new FormControl('', [Validators.required]),  
     
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecapSoldPage');
    this._SYGALIN.getCities();
    this._SYGALIN.getInitialData();
    this.curentyear= this._SYGALIN.curYear;
    this.lastyear=Number.parseInt(this.curentyear)  -1

    
  }

  searchInfos(event?: any){
		console.log('solde CGA');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
	
			
			postData.append('uId', cuser.id);
			postData.append('Urole', cuser.role);
			postData.append('mois', this.formgroup.value['mois']);
      postData.append('annee',this.formgroup.value['annee']);	
      postData.append('secteur', cuser.sector);
      postData.append('boutiqueId',cuser.shop);
      postData.append('user_role', cuser.role);
      
			let that = this;
			this._SYGALIN.query('updateSoldeCgaVisu/', postData).then(res => {
				
			that.soldecga = res;
			console.log("solde CGA");
			console.log(this.soldecga);
			
			
			if (event) {
				event.complete();
				
			} else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			console.log(error);
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}
  mesRecharges(){

  }

  invalidField(field: string) {
		return this.formgroup.controls[field].invalid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	validField(field: string) {
		return this.formgroup.controls[field].valid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
  }
  hideButton() {
		this.showItem=false;
	}
  
}
