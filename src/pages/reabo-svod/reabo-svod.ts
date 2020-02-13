import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {GlobalProvider} from '../../providers/global/global';

@IonicPage()
@Component({
	selector: 'page-reabo-svod',
	templateUrl: 'reabo-svod.html',
})
export class ReaboSvodPage {
	formgroup: FormGroup;
	showItem:boolean=false;
	nom: string;
	tel: string;
	decodeur: string;
	formule: string;
	showRef: any;
	option: string;
	duree: string;
	uRole: string;
	uId: string;
	boutique: string;
	bType: string;
	user: any;
	amount: any;

	constructor(
		public _SYGALIN: GlobalProvider,
		public navCtrl: NavController,
		public navParams: NavParams) {
		this.showRef = false;
	}

	ngOnInit() {
		this.user = this._SYGALIN.getCurUser();
		if(this._SYGALIN.isFVI())
		{
			this.formgroup = new FormGroup({
				nom: new FormControl('', [Validators.required]),
				tel1: new FormControl('', [Validators.required,Validators.minLength(9),Validators.maxLength(9)]),
				tel2: new FormControl('',[Validators.minLength(9),Validators.maxLength(9)]),
				decodeur: new FormControl('', [Validators.minLength(12), Validators.maxLength(14), Validators.required]),
				duree: new FormControl('', [Validators.required]),
				pay_option: new FormControl('', [Validators.required]),
				id_trans: new FormControl({disabled: true, value: ''}, [Validators.required])
			});
		}
		else if(this._SYGALIN.isAAD())
		{
			this.formgroup = new FormGroup({
				nom: new FormControl('', [Validators.required]),
				tel1: new FormControl('', [Validators.required,Validators.minLength(9),Validators.maxLength(9)]),
				tel2: new FormControl('',[Validators.minLength(9),Validators.maxLength(9)]),
				decodeur: new FormControl('', [Validators.minLength(12), Validators.maxLength(14), Validators.required]),
				duree: new FormControl('', [Validators.required]),
				pay_option: new FormControl('', []),
				id_trans: new FormControl('', [])
			});
		}
	}

	ionViewDidLoad() {
		this._SYGALIN.getCities();
		this._SYGALIN.getInitialData();
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
		postData.append('nom', this.formgroup.value['nom']);
		postData.append('tel1', this.formgroup.value['tel1']);
		postData.append('tel2', this.formgroup.value['tel2']);
		postData.append('carte', this.formgroup.value['decodeur']);
		postData.append('shop', this.user.shop);
		postData.append('sector', this.user.sector);
		postData.append('bType', this.user.shopType);
		postData.append('duree', this.formgroup.value['duree']);
		postData.append('role', this.user.role);
		postData.append('user', this.user.id);
		if(this._SYGALIN.isFVI())
		{
			postData.append('id_trans', this.formgroup.value['id_trans']);
			postData.append('pay_option', this.formgroup.value['pay_option']);
		}
		
		this._SYGALIN.query("newRenewalSvod/", postData)
			.then(res => {
				//console.log(res);
				this._SYGALIN.loadingDismiss();
				var type=(res.type=='success'?'success':'danger');
				this._SYGALIN.presentToast(res.message, type);
				if (type=='success')
					ctrlN.setRoot('ReaboSvodPage');
			})
			.catch(error => {
				this._SYGALIN.loadingDismiss();
				this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
			});
	}

	listReabo() {
		console.log('list reabo ');
		this.navCtrl.push('MesReaboSvodPage', {page: 'forPDV'});
	}

	performReabo() {
		//console.log("perform reabo ");
		this.navCtrl.push('PerfReaboSvodPage');
	}

	invalidField(field: string)
	{
		return this.formgroup.controls[field].invalid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	validField(field: string)
	{
		return this.formgroup.controls[field].valid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	fieldStyle(field: string) {
		//return !this.formgroup.get(field).valid && this.formgroup.get(field).touched;
		//!formgroup.controls.nom.valid && formgroup.controls.nom.dirty
		if (!this.formgroup.controls[field].valid && this.formgroup.controls[field].dirty && this.formgroup.controls[field].touched){
			return "1.2px solid #ff1717;"
		}
		else if  (!(!this.formgroup.controls[field].valid && this.formgroup.controls[field].dirty && this.formgroup.controls[field].touched)){
			return "1.2px solid #28d908;"
		}
	}

	/*displayFieldCss(field: string) {
		return {
			'has-error': this.isFieldValid(field),
			'has-feedback': this.isFieldValid(field)
		};
	}*/

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({
					onlySelf: true
				});
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	selectChangedDuree(event) {
		//console.log(event);
		let postData = new FormData();
		postData.append('duree', event);
		let that = this;
		this._SYGALIN.query('getReaboSvodAmount/', postData, true)
			.then(res => {
				console.log('Montant recru:', res);
				that.amount = res;
			}, reason => {
				console.log('Raison:', reason);
			})
			.catch(error => {
				console.log('Erreur:', error);
			})
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


	simuler():void {
		if (this.formgroup.value['duree']) {
			this._SYGALIN.loadingPresent("Evaluation ... ");
			let postData = new FormData();
			postData.append('duree', this.formgroup.value['duree']);
			let that = this;
			this._SYGALIN.query('getReaboSvodAmount/', postData, true)
				.then(res => {
					console.log('Montant recru:', res);
					that.amount = res;
					that.showItem=true
					that._SYGALIN.loadingDismiss();
				}, reason => {
					console.log('Raison:', reason);
				})
				.catch(error => {
					console.log('Erreur:', error);
				})
		}else
		{
			this._SYGALIN.presentToast("Bien vouloir remplir tous les champs du formulaire", 'danger');
		}

	}

	hideButton() {
		this.showItem=false;
	}
}
