import { Component } from '@angular/core';
import {AlertController, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {selectValueAccessor} from "@angular/forms/src/directives/shared";

/**
 * Generated class for the DetailsOdmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-details-odm',
	templateUrl: 'details-odm.html',
})
export class DetailsOdmPage {
	requests: any;
	formgroup: FormGroup;
	user: any;
	odm: any;
	title: any;
	data: any;
	amount: any;
	amountFM: any;
	globalAmount: any;
	subsidizedAmount: any;
	diffAmount: any;
	ready: boolean=false;
	expenses: Array<any>;
	show: boolean= true;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public _SYGALIN: GlobalProvider,
		public _ALERT: AlertController,
		public _EVENT: Events) {
		this.odm=this.navParams.get('odm');
		this.title=this.navParams.get('ref');
	}

	ngOnInit(){
		this.expenses=[];
		if (this._SYGALIN.isPDG()){
			this.formgroup = new FormGroup({
				//depenses: new FormControl("", [Validators.required]),
				other_expenses: new FormControl(""),
				other_mnt_expenses: new FormControl(""),
				other_expenses_topay: new FormControl(""),
				motivation: new FormControl(""),
			});
		} else if (this._SYGALIN.isDFIN()){
			this.formgroup = new FormGroup({
				//depenses: new FormControl("", [Validators.required]),
				boutique: new FormControl(""),
				motivation: new FormControl(""),
			});
		}
	}

	populateForm()
	{
		if (this._SYGALIN.isPDG()){
			if (this.data.requests!==undefined && this.data.requests!==null)
			{
				this.amount=0;
				this.amountFM=0;
				this.data.requests.forEach((request, index)=>{
					this.amount+=parseInt(request.montant);
					let idDM='idDM_'+(index+1);
					let moyen='moyen_'+(index+1);
					let moyenDpl='moyDpl_'+(index+1);
					let agence='agence_'+(index+1);
					let ville_d='ville_d_'+(index+1);
					let ville_a='ville_a_'+(index+1);
					let montant='montant_'+(index+1);
					let payer='a_payer_'+(index+1);

					this.formgroup.addControl(idDM, new FormControl(request.id));
					this.formgroup.addControl(moyen, new FormControl(request.mdplNom));
					this.formgroup.addControl(moyenDpl, new FormControl(request.mId));
					this.formgroup.addControl(agence, new FormControl(request.details));
					this.formgroup.addControl(ville_d, new FormControl(request.ville_depart));
					this.formgroup.addControl(ville_a, new FormControl(request.ville_arrive));
					this.formgroup.addControl(montant, new FormControl(request.montant));
					this.formgroup.addControl(payer, new FormControl(""));
				});
				this.data.requestsFM.forEach((request, index)=>{
					this.amountFM+=parseInt(request.montant);
					let montant='mnt_'+(index+1);
					let idFM='idFM_'+(index+1);
					let depense='depense_'+(index+1);
					this.formgroup.addControl(montant, new FormControl(request.montant));
					this.formgroup.addControl(idFM, new FormControl(request.id));
					this.formgroup.addControl(depense, new FormControl(request.meId));
				});
				this.formgroup.controls['other_expenses'].setValue(this.data.requestsO[0].autre_depense);
				this.formgroup.controls['other_mnt_expenses'].setValue(this.data.requestsO[0].montant_autre_depense);
				this.amountFM+=parseInt(this.data.requestsO[0].montant_autre_depense);
				this.globalAmount=this.amountFM+this.amount;
				this.subsidizedAmount=parseInt(this.data.subsidizedAmount);
				this.diffAmount=this.globalAmount-parseInt(this.subsidizedAmount);
				//console.log('REQUESTS: ', indexes);
			}
		}
		else if (this._SYGALIN.isDFIN()){
			if (this.data.requests!==undefined && this.data.requests!==null)
			{
				this.amount=0;
				this.amountFM=0;
				this.data.requests.forEach((request, index)=>{
					this.amount+=parseInt(request.montant);
				});
				this.data.requestsFM.forEach((request, index)=>{
					this.amountFM+=parseInt(request.montant);
				});
				this.amountFM+=parseInt(this.data.requestsO[0].montant_autre_depense);
				this.globalAmount=this.amountFM+this.amount;
				this.subsidizedAmount=parseInt(this.data.subsidizedAmount);
				this.diffAmount=this.globalAmount-parseInt(this.subsidizedAmount);
				this.formgroup.controls['boutique'].setValue("-1");
				//console.log('REQUESTS: ', indexes);
			}
		}

		this.ready=true;
		this._SYGALIN.loadingDismiss();
	}

	ionViewDidLoad() {
		this._SYGALIN.loadingPresent("Chargement");
		//this.title="Détails ODM";
		console.log('ionViewDidLoad DetailsOdmPage');
		this.user = this._SYGALIN.getCurUser();
		let post=new FormData();
		post.append('user', this.user.id);
		post.append('role', this.user.role);
		post.append('odm', this.odm);
		let link="";
		if (this._SYGALIN.isPDG()) link="editMissionExpenses/";
		if (this._SYGALIN.isDFIN()) link="consultMissionExpenses/";
		this._SYGALIN.query(link, post)
			.then(res=>{
				//console.log(res);
				this.data=res;
				this.populateForm();
			}).catch(error=>{
				this._SYGALIN.loadingDismiss();
				console.log(error);
		});
	}

	invalidField(field: string)
	{
		//console.log('INVALID: ', field);
		return this.formgroup.controls[field].invalid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	validField(field: string)
	{
		return this.formgroup.controls[field].valid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	updateData(event)
	{
		this.show=false;
		console.log('EVENT: ', event);
		let values=event;
		let inds=['mnt', 'topay'];
		let that=this;
		console.log('EXPENSES BEFORE: ', that.expenses);

		Object.keys(this.formgroup.controls).forEach(field => {
			//console.log(field);
			var split=field.split('_');
			if (split.length>1 && (inds.indexOf(split[0])>=0 && values.indexOf(split[1])<0)){
				console.log('SPLIT TO REMOVE: ', field);
				let pos=that.expenses.map((e)=>{
					return e.id;
				}).indexOf(split[1]);
				if (pos>=0)
				{
					that.expenses.splice(pos, 1);
				}
				that.formgroup.removeControl(field);
			}
		});
		console.log('EXPENSES AFTER: ', that.expenses);
		//this.expenses=[];
		let exp_map=this.expenses.map((e)=>{
			return e.id;
		})
		event.forEach((value)=>{
			let pos=exp_map.indexOf(value);
			if (pos<0){
				that.formgroup.addControl("mnt_"+value, new FormControl("", [Validators.required]));
				that.formgroup.addControl("topay_"+value, new FormControl("", [Validators.required]));
				let exp=this.data.missionE.map((e)=>{
					return e.id;
				}).indexOf(value);
				that.expenses.push({id: value, label: that.data.missionE[exp].nom});
			}
		});
		this.show=true;
	}

	inExpenses(obj) {
		let pos=this.expenses.map((e)=>{
			return e.id;
		}).indexOf(obj.id);
		console.log('IN EXPENSES: ', obj, pos>=0);
		return pos>=0;
	}

	refreshDplAmount(event, i) {
		this.amount=0;
		this.data.requests.forEach((request, index)=>{
			if (index!==i)
				this.amount+=parseInt(this.formgroup.controls['montant'+(index+1)].value);
			else
				this.amount+=parseInt(event.value);
		});
		this.globalAmount=this.amountFM+this.amount;
		this.subsidizedAmount=this.data.subsidizedAmount;
		this.diffAmount=this.globalAmount-parseInt(this.subsidizedAmount);
	}

	refreshExpAmount(event, i) {
		this.amountFM=0;
		this.data.requestsFM.forEach((request, index)=>{
			if (index!==i)
				this.amountFM+=parseInt(this.formgroup.controls['mnt_'+(index+1)].value);
			else
				this.amountFM+=parseInt(event.value);
		});
		this.amountFM+=parseInt(this.formgroup.controls['other_mnt_expenses'].value);
		this.globalAmount=this.amountFM+this.amount;
		this.subsidizedAmount=this.data.subsidizedAmount;
		this.diffAmount=this.globalAmount-parseInt(this.subsidizedAmount);
	}

	refreshExpAmountO(event) {
		console.log('EVENT', event.value);
		this.amountFM=0;
		this.data.requestsFM.forEach((request, index)=>{
			this.amountFM+=parseInt(this.formgroup.controls['mnt_'+(index+1)].value);
		});
		this.amountFM+=parseInt(event.value);
		this.globalAmount=this.amountFM+this.amount;
		this.subsidizedAmount=this.data.subsidizedAmount;
		this.diffAmount=this.globalAmount-parseInt(this.subsidizedAmount);
	}

	presentConfirm(type: string) {
		let msg = "", title = "";
		if (type === 'validate') {
			title = "validation";
			msg = 'valider';
		} else {
			title = "rejet";
			msg = 'rejeter';
		}

		let alert = this._ALERT.create({
			title: 'Confirmation de ' + title,
			message: 'Voulez-vous vraiment ' + msg + ' cet ODM? Cette opération est irréversible...',
			buttons: [
				{
					text: 'Non',
					role: 'cancel',
					handler: () => {
						console.log('Opération annulée');
					}
				},
				{
					text: 'Oui',
					handler: () => {
						if (type === 'validate') {
							if (!this.formgroup.valid) {
								this.validateAllFormFields(this.formgroup);
								this._SYGALIN.presentToast('Bien vouloir remplir tous les champs du formulaire', 'danger');
							} else {
								this.presentPromptValid();
							}
						} else {
							this.presentPrompt();
						}
					}
				}
			]
		});
		alert.present();
	}

	presentPrompt() {
		let alert = this._ALERT.create({
			title: 'Motif de rejet (Obligatoire)',
			inputs: [
				{
					name: 'motivation',
					placeholder: 'Redigez votre motif ici...'
				}
			],
			buttons: [
				{
					text: 'Annuler',
					role: 'cancel',
					handler: data => {
						console.log('Opération annulée');
					}
				},
				{
					text: 'OK',
					handler: data => {
						if (data.motivation !== null && data.motivation !== undefined && data.motivation !== "") {
							this.rejectODM(data.motivation);
						} else {
							return false;
						}
					}
				}
			]
		});
		alert.present();
	}

	presentPromptValid() {
		let alert = this._ALERT.create({
			title: 'Un commentaire ?',
			inputs: [
				{
					name: 'comment',
					placeholder: 'Redigez votre commentaire ici...'
				}
			],
			buttons: [
				{
					text: 'Passer',
					handler: data => {
						this.validateODM();
					}
				},
				{
					text: 'OK',
					handler: data => {
						if (data.comment !== null && data.comment !== undefined && data.comment !== "") {
							this.validateODM(data.comment);
						} else {
							return false;
						}
					}
				}
			]
		});
		alert.present();
	}

	validateODM(comment?) {
		let post=new FormData();
		post.append('user', this.user.id);
		post.append('role', this.user.role);
		post.append('odm', this.odm);
		post.append('comment', comment);
		if (this._SYGALIN.isPDG()){
			this.data.requests.forEach((request, index)=>{
				//this.amount+=parseInt(request.montant);
				post.append('idDM_'+(index+1), this.formgroup.controls['idDM_'+(index+1)].value);
				post.append('moyDpl_'+(index+1), this.formgroup.controls['moyDpl_'+(index+1)].value);
				post.append('villeD_'+(index+1), this.formgroup.controls['ville_d_'+(index+1)].value);
				post.append('villeA_'+(index+1), this.formgroup.controls['ville_a_'+(index+1)].value);
				post.append('agence_'+(index+1), this.formgroup.controls['agence_'+(index+1)].value);
				post.append('montantDpl_'+(index+1), this.formgroup.controls['montant_'+(index+1)].value);
			});
			this.data.requestsFM.forEach((request, index)=>{
				//this.amount+=parseInt(request.montant);
				post.append('montantDepense_'+(index+1), this.formgroup.controls['mnt_'+(index+1)].value);
				post.append('idFM_'+(index+1), this.formgroup.controls['idFM_'+(index+1)].value);
				post.append('depense_'+(index+1), this.formgroup.controls['depense_'+(index+1)].value);
			});
			post.append('depenseAutre', this.formgroup.controls['other_expenses'].value);
			post.append('montantDA', this.formgroup.controls['other_mnt_expenses'].value);
			post.append('motif', this.formgroup.controls['motivation'].value);
		}
		else {
			post.append('boutique', this.formgroup.controls['boutique'].value);
		}
		post.append('to_save', "to_save");
		let that=this;
		this._SYGALIN.loadingPresent("Validation de l'ODM");
		let link="";
		if (this._SYGALIN.isPDG()) link="editMissionExpenses/";
		if (this._SYGALIN.isDFIN()) link="consultMissionExpenses/";
		this._SYGALIN.query(link, post).then(res => {
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			}
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res['message'], type, 4000);
			if (res['type'] === 'success') {
				that._EVENT.publish('ODM:closed-detail-'+this.odm, this.odm);
				this.navCtrl.pop().then(res=>{
					console.log('ODM DETAIL RESENT: ', this.odm);
				});
			}
		}).catch(error => {
			that._SYGALIN.loadingDismiss();
			console.log("ERROR: ", error);
			that._SYGALIN.presentToast("Une erreur s'est produite. Veuillez réessayer.", "danger", 4000);
			console.log(error);
		});
	}

	rejectODM(motivation){
		console.log('Motivation', motivation);
		let post=new FormData();
		post.append('user', this.user.id);
		post.append('role', this.user.role);
		post.append('odm', this.odm);
		post.append('ticket', this.data.requestsO[0].ticket);
		post.append('comment', motivation);
		//post.append('motif', motivation);
		let that=this;
		this._SYGALIN.loadingPresent("Rejet de l'ODM");
		this._SYGALIN.query('infirmMissionOrder/', post).then(res => {
			//console.log(res);
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			}
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res['message'], type, 4000);
			if (res['type'] === 'success') {
				that._EVENT.publish('ODM:closed-detail-'+this.odm, this.odm);
				this.navCtrl.pop().then(res=>{
					console.log('ODM DETAIL RESENT: ', this.odm);
				});
			}
		}).catch(error => {
			that._SYGALIN.loadingDismiss();
			console.log("ERROR: ", error);
			that._SYGALIN.presentToast("Une erreur s'est produite. Veuillez réessayer.", "danger", 4000);
			console.log(error);
		});
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
			console.log(field, control.errors);
		});
	}


}
