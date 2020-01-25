import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {FormControl, FormGroup, Validators} from "@angular/forms";

/**
 * Generated class for the PrestationTechniquePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-prestation-technique',
	templateUrl: 'prestation-technique.html',
})
export class PrestationTechniquePage {
	formgroup: FormGroup;
	showRef: boolean=false;
	isRegularPrice: boolean=true;
	requests: Array<any>;
	users: Array<any>;
	price: any=5000;
	user: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public _SYGALIN: GlobalProvider) {
	}

	ionViewDidLoad() {
		this._SYGALIN.getCities();
		this._SYGALIN.getInitialData();
		let post=new FormData();
		post.append('shop', this._SYGALIN.getCurUser().shop);
		this._SYGALIN.query("techAssistData/", post)
			.then(res=>{
				this.requests=res.requests;
				this.users=res.users;
				this.price=res.prix;
			});
	}

	ngOnInit() {
		this.user=this._SYGALIN.getCurUser();
		this.formgroup = new FormGroup({
			nom: new FormControl('', [Validators.required]),
			ville: new FormControl('', [Validators.required]),
			tel: new FormControl('', [Validators.minLength(9), Validators.maxLength(9),Validators.required]),
			quartier: new FormControl('', [Validators.required]),
			decodeur: new FormControl('', [Validators.minLength(12), Validators.maxLength(14),  Validators.required]),
			secteur: new FormControl('', [Validators.required]),
			typeIntervention: new FormControl('', [Validators.required]),
			prix: new FormControl({value: this.price}, [Validators.required]),
			offer: new FormControl({disabled: true, value: 0}, [Validators.required]),
			motif: new FormControl({disabled: true, value: ''}, [Validators.required]),
			pay_option: new FormControl('', [Validators.required]),
			id_trans: new FormControl({disabled: true, value: ''}, [Validators.required])
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
		let postData = new FormData();
		var ctrlN = this.navCtrl;
		postData.append('abone', this.formgroup.value['nom']);
		postData.append('telAbone', this.formgroup.value['tel']);
		postData.append('carte', this.formgroup.value['decodeur']);
		postData.append('ville', this.formgroup.value['ville']);
		postData.append('quartier', this.formgroup.value['quartier']);
		postData.append('user', this.user.id);
		postData.append('shop', this.user.shop);
		postData.append('secteur', this.user.sector);
		postData.append('shopName', this.user.shopName);
		postData.append('prix', this.formgroup.value['prix']);
		postData.append('typeIntervention', this.formgroup.value['typeIntervention']);
		postData.append('role', this.user.role);
		postData.append('users', this.formgroup.value['offer']);
		postData.append('motif', this.formgroup.value['motif']?this.formgroup.value['motif']:'');
		postData.append('id_trans', this.formgroup.value['id_trans']);
		postData.append('moyen', this.formgroup.value['pay_option']);

		this._SYGALIN.query("newTechAssistance/", postData)
			.then(res => {
				//console.log(res);
				this._SYGALIN.loadingDismiss();
				if (res.type === 'success') {
					this._SYGALIN.presentToast(res.message , 'success');
					ctrlN.setRoot('PrestationTechniquePage');
				} else {
					this._SYGALIN.presentToast(res.message, 'danger');
				}
			})
			.catch(error => {
				this._SYGALIN.loadingDismiss();
				console.log("Une erreur survenue:  ",  error);
				this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer", 'danger');
			});
	}

	isFieldValid(field: string) {
		return !this.formgroup.get(field).valid && this.formgroup.get(field).touched;
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

	myPrestations() {
		this.navCtrl.push("MesPrestationsTechniquesPage", {page: 'forPDV'});
	}

	selectChangeMopay(event) {
		console.log(event);
		this.showRef = event != 0;
		if (this.showRef) {
			this.formgroup.get('id_trans').enable();
		} else {
			this.formgroup.get('id_trans').disable();
		}
	}

	selectChangedPrice(event) {
		console.log(event);
		this.isRegularPrice = event._value == this.price;
		if (!this.isRegularPrice) {
			this.formgroup.get('offer').enable();
			this.formgroup.get('motif').enable();
		} else {
			this.formgroup.get('offer').disable();
			this.formgroup.get('motif').disable();
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
}
