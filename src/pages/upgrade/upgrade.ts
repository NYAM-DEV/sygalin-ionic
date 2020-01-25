import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams,ModalController, ViewController} from 'ionic-angular';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {GlobalProvider} from '../../providers/global/global';

/**
 * Generated class for the UpgradePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-upgrade',
	templateUrl: 'upgrade.html',
})
export class UpgradePage {
	formgroup: FormGroup;
	user: any;
	tel: string;
	decodeur: string;
	amount: any;
	nom_abo:any;
	tel_abo:any;
	decodeur_abo:any;
	formule_abo: any;
	option_abo: any;
	showRef: boolean=false;

	constructor(public navCtrl: NavController, public navParams: NavParams,public _SYGALIN: GlobalProvider,public modalCtrl: ModalController) {
		this.tel_abo='';
		this.nom_abo='';
		this.decodeur_abo='';
	}

	ionViewDidLoad() {
		this._SYGALIN.getCities();
		this._SYGALIN.getInitialData();
		this.formgroup.controls.option.setValue("0");
	}

	ngOnInit() {

		this.user = this._SYGALIN.getCurUser();
		this.formgroup = new FormGroup({
			nom: new FormControl('', [Validators.required]),
			tel: new FormControl('', [Validators.minLength(9), Validators.maxLength(9), Validators.required]),
			decodeur: new FormControl('', [Validators.minLength(12), Validators.maxLength(14), Validators.required]),
			formule: new FormControl('', [Validators.required]),
			formule2: new FormControl('', [Validators.required]),
			pay_option: new FormControl('', [Validators.required]),
			option: new FormControl('', [Validators.required]),
			search: new FormControl('', []),
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

	sendform() {
		this._SYGALIN.loadingPresent("Enregistrement...");
		let postData = new FormData();
		var ctrlN = this.navCtrl;
		// var toast = this.presentToast;
		postData.append('nom', this.formgroup.value['nom']);
		postData.append('decodeur', this.formgroup.value['decodeur']);
		postData.append('tel', this.formgroup.value['tel']);
		postData.append('formule', this.formgroup.value['formule']);
		postData.append('formule2', this.formgroup.value['formule2']);

		postData.append('option', this.formgroup.value['option']);
		postData.append('pay_option', this.formgroup.value['pay_option']);
		postData.append('id_trans', this.formgroup.value['id_trans']);
		postData.append('boutique', this.user.shop);
		postData.append('bType', this.user.shopType);
		postData.append('uRole', this.user.role);
		postData.append('uId', this.user.id);
		this._SYGALIN.query("updateRenewal/", postData)
			.then(res => {
				//console.log(res);
				this._SYGALIN.loadingDismiss();
				var type=(res.type=='success'?'success':'danger');
				this._SYGALIN.presentToast(res.message, type);
				if (type=='success')
					ctrlN.setRoot('UpgradePage');
			})
			.catch(error => {
				this._SYGALIN.loadingDismiss();
				this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
			});
	}

	mesReabo(){
		console.log('list reabo ');
		this.navCtrl.push("MesReaboPage", {page: 'forPDV'});
	}

	selectChangedOption(event) {
		console.log(event);
		if (this.formgroup.controls['formule'].value && this.formgroup.controls['formule2'].value ) {
			let postData = new FormData();
			postData.append('option', event);
			postData.append('formule2', this.formgroup.controls['formule2'].value);
			postData.append('formule', this.formgroup.controls['formule'].value);
			let that = this;
			this._SYGALIN.query('getDiffAmountArt/', postData, true)
				.then(res => {
					console.log('Montant upgrade:', res);
					that.amount = res;
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
		if (this.formgroup.controls['formule2'].value && this.formgroup.controls['option'].value) {
			let postData = new FormData();
			postData.append('formule', event);
			postData.append('formule2', this.formgroup.controls['formule2'].value);
			postData.append('option', this.formgroup.controls['option'].value);

			let that = this;
			this._SYGALIN.query('getDiffAmountArt/', postData, true)
				.then(res => {
					console.log('Montant upgrade:', res);
					that.amount = res;
				}, reason => {
					console.log('Raison:', reason);
				})
				.catch(error => {
					console.log('Erreur:', error);
				})
		}
	}

	selectChangedFormule2(event) {
		console.log(event);
		if (this.formgroup.controls['option'].value && this.formgroup.controls['formule'].value) {
			let postData = new FormData();
			postData.append('formule2', event);
			postData.append('formule', this.formgroup.controls['formule'].value);
			postData.append('option', this.formgroup.controls['option'].value);

			let that = this;
			this._SYGALIN.query('getDiffAmountArt/', postData, true)
				.then(res => {
					console.log('Montant upgrade:', res);
					that.amount = res;
				}, reason => {
					console.log('Raison:', reason);
				})
				.catch(error => {
					console.log('Erreur:', error);
				})
		}
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


	invalidField(field: string) {
		return this.formgroup.controls[field].invalid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	validField(field: string) {
		return this.formgroup.controls[field].valid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	searchInfos(){
		let postData = new FormData();
		//var ctrlN = this.navCtrl;
		postData.append('search', this.formgroup.value['search']);
		console.log(this.formgroup.value['search']);
		this._SYGALIN.query("findReabo/", postData)
			.then(res => {
				console.log(res);
				let profileModal = this.modalCtrl.create(UpgradeModal, {client:res, key: this.formgroup.value['search']});
				profileModal.onDidDismiss(data => {
					if (data && Object.getOwnPropertyNames(data).length!==0){
						this.nom_abo=data.nom_abo;
						this.tel_abo=(data.telReabo1 || data.tel_abo || data.telReabo2);
						this.decodeur_abo=data.carte_abo;
						this.formule_abo=data.formule1?data.formule1:data.formule;
						this.option_abo=data.option;
						//console.log(this.duree_abo, this.formule_abo);
						this.formgroup.controls.option.setValue(this.option_abo);
						this.formgroup.controls.formule.setValue(this.formule_abo);
					}
				});
				profileModal.present();
			})
			.catch(error => {
				console.log("Une erreur survenue:  " + error);
				this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer", 'danger');
			});
	}

}


@Component({
	selector: 'page-upgrade-modal',
	templateUrl: 'upgrade-modal.html',
})

export class UpgradeModal {
	formgroup: FormGroup;
	client:any;
	key: any;
	constructor(public _SYGALIN: GlobalProvider,public navparam:NavParams,public _VIEW: ViewController) {
		//console.log('UserId', params.get('userId'));
		this.client=this.navparam.get('client');

	}

	ngOnInit() {
		this.client=this.navparam.get('client');
		this.key=this.navparam.get('key');
	}

	setForm(user:any){
		console.log(user);
		this._VIEW.dismiss(user)
	}

	dismiss(){
		this._VIEW.dismiss()
	}


}
