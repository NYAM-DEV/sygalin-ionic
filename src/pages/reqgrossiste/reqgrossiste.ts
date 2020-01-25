import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {FormControl, FormGroup, Validators} from "@angular/forms";



@IonicPage()
@Component({
	selector: 'page-reqgrossiste',
	templateUrl: 'reqgrossiste.html',
})
export class ReqgrossistePage {
	type_req: string;
	formgroup: FormGroup;
	user: any;
	title: string;
	decodeur: string;
	today:any;
	kits:any;
	kitsKeys: any;
	isSX2:boolean;
	num:any;

	constructor(public navCtrl: NavController,
		    public navParams: NavParams,
		    public _SYGALIN: GlobalProvider,
		    public _ALERT: AlertController) {
		this.type_req = this.navParams.get('type_req');
		this.today = new Date().toISOString();
		this.num=-1000000000000;
		this.isSX2=true;
	}

	ionViewDidLoad() {
		this._SYGALIN.getCities();
		this._SYGALIN.getInitialData();
		this.kits = [];
		this.kits.push(
			{
				id: 7,
				iZ4:1,
				type: 'Kit Z4',
			},
			{
				id: 6,
				iZ4:0,
				type: 'Kit SX2',
			}
		);

		this.kitsKeys = Object.keys(this.kits);
	}

	ngOnInit() {
		this.today = new Date().toISOString();
		this.type_req = this.navParams.get('type_req');
		console.log(this.type_req);

		this.user = this._SYGALIN.getCurUser();
		if(this.type_req==='annulation'){
			this.title='Annulation';
			this.formgroup = new FormGroup({
				decodeur: new FormControl('', [Validators.minLength(12), Validators.maxLength(14), ,Validators.required]),
				formule: new FormControl('', [Validators.required]),
				option: new FormControl('', [Validators.required]),
				today: new FormControl('', [Validators.required])
			});
		}

		if(this.type_req==='modification'){
			this.title='Modification';
			this.formgroup = new FormGroup({
				decodeur: new FormControl('', [Validators.minLength(12), Validators.maxLength(14), Validators.required]),
				formule: new FormControl('', [Validators.required]),
				option: new FormControl('', [Validators.required]),
				duree: new FormControl('', [Validators.required]),
				formule1: new FormControl('', [Validators.required]),
				option1: new FormControl('', [Validators.required]),
				duree1: new FormControl('', [Validators.required]),
				today: new FormControl('', [Validators.required]),
			});
		}

		if(this.type_req==='suspenssion'){
			console.log("suspension");
			this.title='Suspension';
			this.formgroup = new FormGroup({
				numCarte: new FormControl({disabled: false, value: ''}, [Validators.minLength(12), Validators.maxLength(14), ,Validators.required]),
				decodeur: new FormControl('', [Validators.minLength(12), Validators.maxLength(14), Validators.required]),
				kit: new FormControl('', [Validators.required]),
				nomAbonne: new FormControl('', [Validators.required]),
				numAbonne: new FormControl('', [Validators.required]),
				motif: new FormControl('', [Validators.required])
			});
		}
		if(this.type_req==='Lsuspenssion'){
			console.log("Lsuspenssion");
			this.title='Levée de suspension';
			this.formgroup = new FormGroup({
				decodeur: new FormControl('', [Validators.minLength(12),Validators.required]),
				numCarte: new FormControl({disabled: false, value: ''}, [Validators.minLength(12),Validators.required]),
				kit: new FormControl('', [Validators.required]),
				nomAbonne: new FormControl('', [Validators.required]),
				numAbonne: new FormControl('', [Validators.required]),
				motif: new FormControl('', [Validators.required])
			});
		}

		if(this.type_req==='cptcga'){
			this.title='CGA bloqué';
			this.formgroup = new FormGroup({
				nom: new FormControl('', [Validators.required]),
				motif: new FormControl('', [Validators.required]),
				numDist: new FormControl('', [Validators.required]),
				debloquageType: new FormControl('', [Validators.required]),
			});
		}
		if(this.type_req==='transfert'){
			this.title='Transfert de droit';
			this.formgroup = new FormGroup({
				abonne: new FormControl('', [Validators.required]),
				carte: new FormControl('', [Validators.minLength(12), Validators.maxLength(14), Validators.required]),
				carte1: new FormControl('', [Validators.minLength(12), Validators.maxLength(14), Validators.required]),
				motif: new FormControl('', [Validators.required]),
			});
		}
	}

	mesrequettes(){
		this.navCtrl.push("MesReqgrossistePage", { page: 'forPDV'});
	}

	saveReq() {
		if (this.formgroup.valid) {
			this.sendform();
		} else {
			this.validateAllFormFields(this.formgroup);
			this._SYGALIN.presentToast('Bien vouloir remplir tous les champs du formulaire', 'danger');
		}

	}

	sendform(){
		console.log("send form");
		this._SYGALIN.loadingPresent("Enregistrement...");
		let postData = new FormData();
		var ctrlN = this.navCtrl;
		// var toast = this.presentToast;
		console.log(this.type_req);

		if(this.type_req=="annulation"){
			postData.append('carte', this.formgroup.value['decodeur']);
			postData.append('formule', this.formgroup.value['formule']);
			postData.append('option', this.formgroup.value['option']);
			postData.append('date', this.formgroup.value['today']);
			postData.append('uId', this._SYGALIN.user.id);
			postData.append('sector', this._SYGALIN.user.sector);
			postData.append('roleId', this._SYGALIN.user.role);
			postData.append('shop', this._SYGALIN.user.shop);
			postData.append('bType', this._SYGALIN.user.shopType);
			postData.append('cuser', this._SYGALIN.user.cuser);

			this._SYGALIN.query("typingErrorAnnulation/", postData)
				.then(res => {
					//console.log(res);
					this._SYGALIN.loadingDismiss();
					if (res.type === 'success') {
						this._SYGALIN.presentToast(res.message, 'success');
						ctrlN.setRoot('ReqgrossistePage',{type_req: 'annulation'});
					} else {
						this._SYGALIN.presentToast(res.message, 'danger');
					}
				})
				.catch(error => {
					this._SYGALIN.loadingDismiss();
					this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
				});
		}
		if (this.type_req=="modification") {
			postData.append('carte', this.formgroup.value['decodeur']);
			postData.append('formule', this.formgroup.value['formule']);
			postData.append('option', this.formgroup.value['option']);
			postData.append('duree', this.formgroup.value['duree']);
			postData.append('formule1', this.formgroup.value['formule1']);
			postData.append('option1', this.formgroup.value['option1']);
			postData.append('duree1', this.formgroup.value['duree1']);

			postData.append('uId', this._SYGALIN.user.id);
			postData.append('sector', this._SYGALIN.user.sector);
			postData.append('roleId', this._SYGALIN.user.role);
			postData.append('shop', this._SYGALIN.user.shop);
			postData.append('bType', this._SYGALIN.user.shopType);
			postData.append('cuser', this._SYGALIN.user.cuser);

			this._SYGALIN.query("typingErrorDowngrade/", postData)
				.then(res => {
					//console.log(res);
					this._SYGALIN.loadingDismiss();
					if (res.type === 'success') {
						this._SYGALIN.presentToast(res.message, 'success');
						ctrlN.setRoot('ReqgrossistePage',{type_req: 'modification'});
					} else {
						this._SYGALIN.presentToast(res.message, 'danger');
					}
				})
				.catch(error => {
					this._SYGALIN.loadingDismiss();
					this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
				});
		}
		if (this.type_req=="suspenssion") {

			if(this.isSX2){
				postData.append('carte', this.formgroup.value['numCarte']);
			}
			postData.append('decodeur', this.formgroup.value['decodeur']);
			postData.append('motif', this.formgroup.value['motif']);
			postData.append('abonne', this.formgroup.value['nomAbonne']);
			postData.append('num_abo', this.formgroup.value['numAbonne']);

			let kitform = this.formgroup.value['kit'];
			let id = this.kits[kitform].id;
			let iZ4 = this.kits[kitform].iZ4;
			postData.append('kit', id);
			postData.append('isZ', iZ4);

			postData.append('uId', this._SYGALIN.user.id);
			postData.append('sector', this._SYGALIN.user.sector);
			postData.append('roleId', this._SYGALIN.user.role);
			postData.append('shop', this._SYGALIN.user.shop);
			postData.append('bType', this._SYGALIN.user.shopType);
			postData.append('cuser', this._SYGALIN.user.cuser);

			this._SYGALIN.query("typingErrorSuspension/", postData)
				.then(res => {
					//console.log(res);
					this._SYGALIN.loadingDismiss();
					if (res.type === 'success') {
						this._SYGALIN.presentToast(res.message, 'success');
						ctrlN.setRoot('ReqgrossistePage',{type_req: 'suspenssion'});
					} else {
						this._SYGALIN.presentToast(res.message, 'danger');
					}
				})
				.catch(error => {
					this._SYGALIN.loadingDismiss();
					this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
				});
		}
		if (this.type_req=="Lsuspenssion") {

			if(this.isSX2){
				postData.append('carte', this.formgroup.value['numCarte']);
			}
			postData.append('decodeur', this.formgroup.value['decodeur']);
			postData.append('motif', this.formgroup.value['motif']);
			postData.append('abonne', this.formgroup.value['nomAbonne']);
			postData.append('num_abo', this.formgroup.value['numAbonne']);

			let kitform = this.formgroup.value['kit'];
			let id = this.kits[kitform].id;
			let iZ4 = this.kits[kitform].iZ4;
			postData.append('kit', id);
			postData.append('isZ', iZ4);

			postData.append('uId', this._SYGALIN.user.id);
			postData.append('sector', this._SYGALIN.user.sector);
			postData.append('roleId', this._SYGALIN.user.role);
			postData.append('shop', this._SYGALIN.user.shop);
			postData.append('bType', this._SYGALIN.user.shopType);
			postData.append('cuser', this._SYGALIN.user.cuser);

			this._SYGALIN.query("typingSuspensionRemove/", postData)
				.then(res => {
					//console.log(res);
					this._SYGALIN.loadingDismiss();
					if (res.type === 'success') {
						this._SYGALIN.presentToast(res.message, 'success');
						ctrlN.setRoot('ReqgrossistePage',{type_req: 'Lsuspenssion'});
					} else {
						this._SYGALIN.presentToast(res.message, 'danger');
					}
				})
				.catch(error => {
					this._SYGALIN.loadingDismiss();
					this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
				});
		}
		if (this.type_req=="cptcga") {

			postData.append('user', this.formgroup.value['nom']);
			postData.append('motif', this.formgroup.value['motif']);
			postData.append('abonne', this.formgroup.value['numDist']);
			postData.append('init_mdp', this.formgroup.value['debloquageType']);

			postData.append('uId', this._SYGALIN.user.id);
			postData.append('btqId', this._SYGALIN.user.shop);



			postData.append('uId', this._SYGALIN.user.id);
			postData.append('sector', this._SYGALIN.user.sector);
			postData.append('roleId', this._SYGALIN.user.role);
			postData.append('shop', this._SYGALIN.user.shop);
			postData.append('bType', this._SYGALIN.user.shopType);
			postData.append('cuser', this._SYGALIN.user.cuser);

			this._SYGALIN.query("typingBlockedCga/", postData)
				.then(res => {
					//console.log(res);
					this._SYGALIN.loadingDismiss();
					if (res.type === 'success') {
						this._SYGALIN.presentToast(res.message, 'success');
						ctrlN.setRoot('ReqgrossistePage',{type_req: 'cptcga'});
					} else {
						this._SYGALIN.presentToast(res.message, 'danger');
					}
				})
				.catch(error => {
					this._SYGALIN.loadingDismiss();
					this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
				});
		}
		if (this.type_req=="transfert") {
			postData.append('abonne', this.formgroup.value['abonne']);
			postData.append('carte', this.formgroup.value['carte']);
			postData.append('carte1', this.formgroup.value['carte1']);
			postData.append('motif', this.formgroup.value['motif']);
			postData.append('uId', this._SYGALIN.user.id);
			postData.append('sector', this._SYGALIN.user.sector);
			postData.append('roleId', this._SYGALIN.user.role);
			postData.append('shop', this._SYGALIN.user.shop);
			postData.append('bType', this._SYGALIN.user.shopType);
			postData.append('cuser', this._SYGALIN.user.cuser);

			this._SYGALIN.query("typingTransfertRight/", postData)
				.then(res => {
					//console.log(res);
					this._SYGALIN.loadingDismiss();
					if (res.type === 'success') {
						this._SYGALIN.presentToast(res.message, 'success');
						ctrlN.setRoot('ReqgrossistePage',{type_req: 'modification'});
					} else {
						this._SYGALIN.presentToast(res.message, 'danger');
					}
				})
				.catch(error => {
					this._SYGALIN.loadingDismiss();
					this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
				});
		}
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

	selectChangedKit(event) {
		/*console.log(event);
		console.log("event");*/
		if (event==0)
		{
			this.isSX2=false;
			this.formgroup.get('numCarte').disable();
			console.log("test dsi");
		}else {
			this.formgroup.get('numCarte').enable();
			this.isSX2=true;
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
