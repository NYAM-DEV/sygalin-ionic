import {Component} from '@angular/core';
import {IonicPage, NavController, Events, NavParams, ModalController, ViewController, DateTime} from 'ionic-angular';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {GlobalProvider} from '../../providers/global/global';
import {animate, state, style, transition, trigger} from "@angular/animations";
import { empty } from 'rxjs/Observer';

/**
 * Generated class for the RefFinancialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ref-financial',
  templateUrl: 'ref-financial.html',
})
export class RefFinancialPage {
  formgroup: FormGroup;
	img:any;
  option: string;
  today:any;
  showRef: any;
	uRole: string;
	uId: string;
	user: any;
	type_paie: any;
	showItem:boolean=false;
	page: any;
	orders: any;
	toJustif: any;
	justifFile: any;
	labelJustif: any;
	issetFile: boolean=false;
	fileTypes: any;
  file:any;
  totime:any;
  simMarchand:any;

  constructor(
    public _SYGALIN: GlobalProvider,
		public navCtrl: NavController,
		public navParams: NavParams,
		public modalCtrl: ModalController,
		public _EVENT: Events) {
      this.today = new Date().toISOString();
     
	  this.totime= new Date().toTimeString();
	  
  }

  ionViewDidLoad() {
 
	console.log('ionViewDidLoad RefFinancialPage');
	//this.simMarchand=this._SYGALIN.user.MercantSIM;
  }
  ngOnInit() {
		this.today = new Date().toTimeString();
		this.simMarchand=this._SYGALIN.user.MercantSIM;
	
	this.formgroup = new FormGroup({
      pay_option: new FormControl('', [Validators.required]),
      montant: new FormControl('', [Validators.required]),
      today: new FormControl('', [Validators.required]),
      totime: new FormControl('', [Validators.required]),
	  commentaire: new FormControl('', []),
	  sim_marchande: new FormControl('', []),
			});
			
	}

	invalidField(field: string) {
		return this.formgroup.controls[field].invalid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	validField(field: string) {
		return this.formgroup.controls[field].valid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
  }			
	selectChangeMopay(event) {
		console.log(event);
		this.showRef = event != 0;
		
		if(event==0)
		{

		}
		else
		{
			let payment=Array.from(this._SYGALIN.all_pay_options).filter((e: any)=> e.id==event) as Array<any>;
			this.type_paie=payment[0].type;
			console.log('TYPE PAIE: ', this.type_paie);
		}

	if (this.type_paie == 3 || this.type_paie == 6)
		{
			this.showRef=true;
			
		}
		else
		{
			this.showRef=false;
			
		}
	}
  sendform():void {
				
		//if(this.formgroup.controls['reference'].value &&  this.formgroup.controls['montant'].value && this.formgroup.controls['pay_option'].value ){
		this._SYGALIN.loadingPresent("Traitement...");	
			let postData = new FormData();
			var ctrlN = this.navCtrl;
			
				postData.append('todate', this.formgroup.value['today']);
				postData.append('totime', this.formgroup.value['totime']);
				postData.append('montant', this.formgroup.value['montant']);
				postData.append('shop', this._SYGALIN.user.shop);
				postData.append('bType', this._SYGALIN.user.shopType);
				postData.append('roleId', this._SYGALIN.user.role);
				postData.append('user', this._SYGALIN.user.id);
				postData.append('sector', this._SYGALIN.user.sector);
				postData.append('commentaire', this.formgroup.value['commentaire'])
				postData.append('sim_marchand', this._SYGALIN.user.MercantSIM)
				postData.append('operateur', this.formgroup.value['pay_option']);
				this._SYGALIN.query("saveRefRequest/", postData)
					.then(res => {
						
						this._SYGALIN.loadingDismiss();
						var type=(res.type=='success'?'success':'danger');
						this._SYGALIN.presentToast(res.message, type);
						if (type=='success')
							ctrlN.setRoot('RefFinancialPage');
					})
					.catch(error => {
						this._SYGALIN.loadingDismiss();
						
						this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
					});
				
	
		//}
		//else
		//{
			//this._SYGALIN.presentToast("Bien vouloir remplir tous les champs du formulaire", 'danger');
		//}	
}	
	listReffilfinance() {
		console.log('list recharge financiere ');
		this.navCtrl.push("MesReferencePage", {page: 'myrequests'});
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

	onSubmit() {
		if (this.formgroup.valid) {
			this.sendform();
		} else {
			this.validateAllFormFields(this.formgroup);
			this._SYGALIN.presentToast('Bien vouloir remplir tous les champs du formulaire', 'danger');
		}
	}
}

