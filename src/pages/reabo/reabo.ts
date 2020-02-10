import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, ViewController} from 'ionic-angular';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {GlobalProvider} from '../../providers/global/global';

@IonicPage()
@Component({
	selector: 'page-reabo',
	templateUrl: 'reabo.html',
})
export class ReaboPage {
	formgroup: FormGroup;
	nom: string;
	tel: string;
	decodeur: string;
	formule: string;
	option: string;
	showRef: any;
	duree: string;
	uRole: string;
	uId: string;
	boutique: string;
	bType: string;
	user: any;
	amount: any;
	nom_abo:any;
	tel_abo:any;
	decodeur_abo:any;
	formule_abo: any;
	duree_abo: any;
	showItem:boolean=false;

	constructor(
		public _SYGALIN: GlobalProvider,
		public navCtrl: NavController,
		public navParams: NavParams,
		public modalCtrl: ModalController) {
		this.showRef = false;
		this.tel_abo='';
		this.nom_abo='';
		this.decodeur_abo='';

	}

	ngOnInit() {
		this.user = this._SYGALIN.getCurUser();
		this.formgroup = new FormGroup({
			nom: new FormControl('', [Validators.required]),
			tel: new FormControl('', [Validators.required,Validators.minLength(9),Validators.maxLength(9)]),
			decodeur: new FormControl('', [Validators.minLength(12), Validators.maxLength(14)]),
			formule: new FormControl('', [Validators.required]),
			option: new FormControl('', [Validators.required]),
			duree: new FormControl('', [Validators.required]),
			pay_option: new FormControl('', [Validators.required]),
			search: new FormControl('', []),
			id_trans: new FormControl({disabled: true, value: ''}, [Validators.required])
		});
	}

	ionViewDidLoad() {
		this._SYGALIN.getCities();
		this._SYGALIN.getInitialData();
		this.formgroup.controls.option.setValue("0");
	}

	onSubmit() {
		if (this.formgroup.valid) {
			this.sendform();
		} else {
			this.validateAllFormFields(this.formgroup);
			this._SYGALIN.presentToast('Bien vouloir remplir tous les champs du formulaire', 'danger');
		}
	}

	searchInfos(){
		let postData = new FormData();
		postData.append('search', this.formgroup.value['search']);
		let that=this;
		this._SYGALIN.query("findReabo/", postData)
			.then(res => {
				console.log(res);
				let profileModal = this.modalCtrl.create(ReaboModal, {client:res, key: this.formgroup.value['search']});
				profileModal.onDidDismiss(data => {
					if (data && Object.getOwnPropertyNames(data).length!==0){
						this.nom_abo=data.nom_abo;
						this.tel_abo=(data.telReabo1 || data.tel_abo || data.telReabo2);
						this.decodeur_abo=data.carte_abo;
						this.formule_abo=data.formule1?data.formule1:data.formule;
						this.duree_abo=data.duree;
						console.log(this.duree_abo, this.formule_abo);
						that.formgroup.controls.duree.setValue(this.duree_abo);
						that.formgroup.controls.formule.setValue(this.formule_abo);
					}
				});
				profileModal.present();

			})
			.catch(error => {
				console.log("Une erreur survenue:  " , error);
				this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer", 'danger');
			});

	}

	sendform() {
		this._SYGALIN.loadingPresent("Enregistrement...");
		let postData = new FormData();
		var ctrlN = this.navCtrl;
		// var toast = this.presentToast;
		postData.append('nom', this.formgroup.value['nom']);
		postData.append('tel', this.formgroup.value['tel']);
		postData.append('decodeur', this.formgroup.value['decodeur']);
		postData.append('formule', this.formgroup.value['formule']);
		postData.append('option', this.formgroup.value['option']);
		postData.append('boutique', this.user.shop);
		postData.append('bType', this.user.shopType);
		postData.append('duree', this.formgroup.value['duree']);
		postData.append('uRole', this.user.role);
		postData.append('uId', this.user.id);
		postData.append('secteur', this.user.sector);
	
		postData.append('id_trans', this.formgroup.value['id_trans']);
		postData.append('pay_option', this.formgroup.value['pay_option']);
		this._SYGALIN.query("newRenewal/", postData)
			.then(res => {
				//console.log(res);
				this._SYGALIN.loadingDismiss();
				var type=(res.type=='success'?'success':'danger');
				this._SYGALIN.presentToast(res.message, type);
				if (type=='success')
					ctrlN.setRoot('ReaboPage');
			})
			.catch(error => {
				this._SYGALIN.loadingDismiss();
				//console.log("Une erreur survenue:  " + error);
				this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
			});
	}

	listReabo() {
		console.log('list reabo ');
		this.navCtrl.push("MesReaboPage", {page: 'forPDV'});
	}

	performReabo() {
		console.log("perform reabo ");
		this.navCtrl.push('PerfReaboPage');
	}

	isFieldValid(field: string) {
		return !this.formgroup.get(field).valid && this.formgroup.get(field).touched;
	}

	displayFieldCss(field: string) {
		return {
			'has-error': this.isFieldValid(field),
			'has-feedback': this.isFieldValid(field)
		};
	}

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

	selectChangedFormule(event) {
		console.log(event);
		if (this.formgroup.controls['duree'].value) {
			let postData = new FormData();
			postData.append('formule', event);
			postData.append('duree', this.formgroup.controls['duree'].value);
			postData.append('option', this.formgroup.controls['option'].value);

			let that = this;
			this._SYGALIN.query('getReaboAmount/', postData, true)
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
	}

	selectChangedDuree(event) {
		console.log(event);
		if (this.formgroup.controls['formule'].value) {
			let postData = new FormData();
			postData.append('duree', event);
			postData.append('formule', this.formgroup.controls['formule'].value);
			postData.append('option', this.formgroup.controls['option'].value);
			/*      if (this.formgroup.controls['option'].value && this.formgroup.controls['option'].value != 0) {
					postData['option'] = this.formgroup.controls['option'].value;
				  }*/
			let that = this;
			this._SYGALIN.query('getReaboAmount/', postData, true)
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
	}

	selectChangedOption(event) {
		console.log(event);
		if (this.formgroup.controls['duree'].value && this.formgroup.controls['formule'].value) {
			let postData = new FormData();
			postData.append('option', event);
			postData.append('duree', this.formgroup.controls['duree'].value);
			postData.append('formule', this.formgroup.controls['formule'].value);

			let that = this;
			this._SYGALIN.query('getReaboAmount/', postData, true)
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

		console.log("evaluation du prix ");
		if(this.formgroup.controls['option'].value &&  this.formgroup.controls['duree'].value && this.formgroup.controls['formule'].value ){
			this._SYGALIN.loadingPresent("Evaluation ... ");
			let postData = new FormData();
			postData.append('option', this.formgroup.controls['option'].value);
			postData.append('duree', this.formgroup.controls['duree'].value);
			postData.append('formule', this.formgroup.controls['formule'].value);

			let that = this;
			this._SYGALIN.query('getReaboAmount/', postData, true)
				.then(res => {
					console.log('Montant recru:', res);
					that.amount = res;
					this.showItem=true;
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

@Component({
	selector: 'page-reabo-modal',
	templateUrl: 'reabo-modal.html',
})

export class ReaboModal {
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
