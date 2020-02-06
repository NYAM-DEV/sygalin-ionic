//import {ApiUserProvider} from './../../providers/api-user/api-user';
import {GlobalProvider} from '../../providers/global/global';
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormGroup, FormControl, Validators} from '@angular/forms';


@IonicPage()
@Component({
	selector: 'page-recru',
	templateUrl: 'recru.html',
})
export class RecruPage {
	showItem:boolean=false;
	formgroup: FormGroup;
	nom: any;
	ville: any;
	tel: any;
	quartier: any;
	decodeur: any;
	formule: any;
	option: any;
	duree: any;
	user: any;
	kit: any;
	tech: any;
	amount: any;
	showRef: any;
	recruts: Array<any>;
	price: any;
	showPrice:any;
	prix_installation:any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public _SYGALIN: GlobalProvider) {
		this.showRef = false;
		this.showPrice=false;
		this.prix_installation=0;
	}

	ngOnInit() {
		this.user = this._SYGALIN.getCurUser();
		this.formgroup = new FormGroup({
			nom: new FormControl('', [Validators.required]),
			ville: new FormControl('', [Validators.required]),
			tel: new FormControl('', [Validators.required,Validators.minLength(9),Validators.maxLength(9)]),
			quartier: new FormControl('', [Validators.required]),
			decodeur: new FormControl('', [Validators.minLength(12), Validators.required]),
			formule: new FormControl('', [Validators.required]),
			option: new FormControl('', [Validators.required]),
			duree: new FormControl('', [Validators.required]),
			kit: new FormControl('', [Validators.required]),
			tech: new FormControl('', []),
			pay_option: new FormControl('', [Validators.required]),
			id_trans: new FormControl({disabled: true, value: ''}, [Validators.required]),
			installation: new FormControl( '', [Validators.required]),

		});
	}

	ionViewDidLoad() {
		this._SYGALIN.getCities();
		this._SYGALIN.getInitialData();
		this.formgroup.controls.option.setValue("0");
		let post=new FormData();
		post.append('shop', this._SYGALIN.getCurUser().shop);
		this._SYGALIN.query("techAssistData/", post)
			.then(res=>{
				this.price=res.prix;
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

	sendform() {
		this._SYGALIN.loadingPresent("Enregistrement...");
		this.simuler();
		let postData = new FormData();
		let ctrlN = this.navCtrl;
		
		postData.append('nom', this.formgroup.value['nom']);
		postData.append('pay_option', this.formgroup.value['pay_option']);
		postData.append('montant_abo', this.amount);
		postData.append('tel', this.formgroup.value['tel']);
		postData.append('decodeur', this.formgroup.value['decodeur']);
		postData.append('formule', this.formgroup.value['formule']);
		postData.append('option', this.formgroup.value['option']);
		postData.append('vile', this.formgroup.value['ville']);
		postData.append('quartier', this.formgroup.value['quartier']);
		postData.append('boutique', this.user.shop);
		postData.append('bType', this.user.shopType);
		postData.append('duree', this.formgroup.value['duree']);
		postData.append('kit', this.formgroup.value['kit']);
		postData.append('uRole', this.user.role);
		postData.append('uId', this.user.id);
		postData.append('secteur', this.user.sector);
		postData.append('tech', this.formgroup.value['tech']);
		postData.append('carte', this.formgroup.value['decodeur']);
		postData.append('pay_option', this.formgroup.value['pay_option']);
		if(this.showPrice){
			postData.append('installation', this.price);
		}

		postData.append('id_trans', this.formgroup.value['id_trans']);
		postData.append('pay_option', this.formgroup.value['pay_option']);
		this._SYGALIN.query("newRecruitment/", postData)
			.then(res => {
				//console.log(res);
				this._SYGALIN.loadingDismiss();
				if (res.type === 'success') {
					this._SYGALIN.presentToast("Recrutement effectué avec succès!", 'success');
					ctrlN.setRoot('RecruPage');
				} else {
					this._SYGALIN.presentToast(res.message, 'danger');
				}
			})
			.catch(error => {
				this._SYGALIN.loadingDismiss();
				this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
			});
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

	myRecruitments() {
		this.navCtrl.push("MesRecruPage", {page: 'forPDV'});
	}

	myPerformances() {
		this.navCtrl.push('PerfRecruPage');
	}

	selectChangedOption(event) {
		console.log(event);
		if (this.formgroup.controls['duree'].value && this.formgroup.controls['kit'].value && this.formgroup.controls['formule'].value) {
			let postData = new FormData();
			postData.append('option', event);
			postData.append('duree', this.formgroup.controls['duree'].value);
			postData.append('kit', this.formgroup.controls['kit'].value);
			postData.append('formule', this.formgroup.controls['formule'].value);

			let that = this;
			this._SYGALIN.query('getRecruAmount/', postData, true)
				.then(res => {
					console.log('Montant recru:', res);
					that.amount = res ;
				}, reason => {
					console.log('Raison:', reason);
				})
				.catch(error => {
					console.log('Erreur:', error);
				})
		}
	}

	selectChangedFormule(event) {
		console.log(event);
		if (this.formgroup.controls['duree'].value && this.formgroup.controls['kit'].value) {
			let postData = new FormData();
			postData.append('formule', event);
			postData.append('duree', this.formgroup.controls['duree'].value);
			postData.append('kit', this.formgroup.controls['kit'].value);
			postData.append('option', this.formgroup.controls['option'].value);

			let that = this;
			this._SYGALIN.query('getRecruAmount/', postData, true)
				.then(res => {
					console.log('Montant recru:', res);
					that.amount = res ;
				}, reason => {
					console.log('Raison:', reason);
				})
				.catch(error => {
					console.log('Erreur:', error);
				})
		}
	}

	selectChangedKit(event) {
		console.log(event);
		if (this.formgroup.controls['duree'].value && this.formgroup.controls['formule'].value) {
			let postData = new FormData();
			postData.append('kit', event);
			postData.append('duree', this.formgroup.controls['duree'].value);
			postData.append('formule', this.formgroup.controls['formule'].value);
			postData.append('option', this.formgroup.controls['option'].value);
			/*if (this.formgroup.controls['option'].value && this.formgroup.controls['option'].value != 0) {
			  postData['option'] = this.formgroup.controls['option'].value;
			}*/
			let that = this;
			this._SYGALIN.query('getRecruAmount/', postData, true)
				.then(res => {
					console.log('Montant recru:', res );
					that.amount = res;
				}, reason => {
					console.log('Raison:', reason);
				})
				.catch(error => {
					console.log('Erreur:', error);
				})
		}
	}

	selectChangedDuree(event) {
		console.log(event);
		if (this.formgroup.controls['formule'].value && this.formgroup.controls['kit'].value) {
			let postData = new FormData();
			postData.append('duree', event);
			postData.append('formule', this.formgroup.controls['formule'].value);
			postData.append('kit', this.formgroup.controls['kit'].value);
			postData.append('option', this.formgroup.controls['option'].value);
			let that = this;
			this._SYGALIN.query('getRecruAmount/', postData, true)
				.then(res => {
					console.log('Montant recru:', res);
					that.amount = res ;
				}, reason => {
					console.log('Raison:', reason);
				})
				.catch(error => {
					console.log('Erreur:', error);
				})
		}
	}
	selectChangedInstall(event) {
		console.log(event==1);
		this.showPrice=(event==1);
		this.showItem=false;
	}

	selectChangeMopay(event) {
		console.log(event);
		this.showRef = event != 0;
		if (event != 0) {
			this.formgroup.get('id_trans').enable();
		} else {
			this.formgroup.get('id_trans').disable();
		}
	}

	invalidField(field: string)
	{
		return this.formgroup.controls[field].invalid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	validField(field: string)
	{
		return this.formgroup.controls[field].valid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	simuler():void {
		if (this.formgroup.controls['duree'].value && this.formgroup.controls['formule'].value && this.formgroup.controls['kit'].value && this.formgroup.controls['option'].value &&  this.price ) {
			this._SYGALIN.loadingPresent("Evaluation ... ");
			let postData = new FormData();
			postData.append('duree', this.formgroup.controls['duree'].value);
			postData.append('formule', this.formgroup.controls['formule'].value);
			postData.append('kit', this.formgroup.controls['kit'].value);
			postData.append('option', this.formgroup.controls['option'].value);
			if(this.showPrice){
				postData.append('installation', this.price);
			}

			let that = this;
			this._SYGALIN.query('getRecruAmount/', postData, true)
				.then(res => {
					console.log('Montant recru:', res );
					that.amount = res ;
					that.showItem=true;
					that._SYGALIN.loadingDismiss();
				}, reason => {
					console.log('Raison:', reason);
				})
				.catch(error => {
					console.log('Erreur:', error);
				})
		} else
		{
			this._SYGALIN.presentToast("Bien vouloir remplir tous les champs du formulaire", 'danger');
		}


	}
	hideButton() {
		this.showItem=false;
	}

}
