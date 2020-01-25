import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, ModalController, NavParams, ViewController} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FormControl, FormGroup, Validators} from "@angular/forms";


/**
 * Generated class for the RdvProspectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-rdv-prospect',
	templateUrl: 'rdv-prospect.html',
	animations: [
		trigger('listItemState', [
			state('in',
				style({
					opacity: 1,
					height: '*',
					minHeight: '*'
				})
			),
			transition('* => void', [
				animate('0.57s ease-out', style({
					opacity: 0,
					height: '1px',
					minHeight: '1px'
				}))
			])
		])
	]

})
export class RdvProspectPage {
	prosId: any;
	rdv: any;
	reabos: Array<any>;

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				public _SYGALIN: GlobalProvider,
				public _MODAL: ModalController,
				public _ALERT: AlertController) {
		this.prosId = this.navParams.get('id');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RdvProspectPage');
		this._SYGALIN.loadingPresent("Chargement des Rendez-vous");
		this.rvds();
	}

	recrutProspect(request: any) {
		// Ref AlertController
		let postData = new FormData();
		postData.append('prospect', request.prospect);
		postData.append('rdv', request.rdvId);
		let that = this;
		this._SYGALIN.loadingPresent("Validation du rendez-vous");
		this._SYGALIN.query('setOk/', postData).then(res => {
			console.log(res);
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				that.removeItem(request);
				if (!that.rdv.length) {
					this.rvds();
				} else
					that._SYGALIN.loadingDismiss();
			}

			that._SYGALIN.presentToast(res['message'], type, 4000);
			//that.recruts=res;
		}).catch(error => {
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Une erreur s'est produite. Veuillez réessayer.", "danger", 4000);
			console.log(error);
		});
		//this._SYGALIN.loadingDismiss();
	}

	rejectProspect(request: any) {

		let postData = new FormData();
		postData.append('prospect', request.prospect);
		postData.append('rdv', request.rdvId);
		//postData.append('motivation', motivation);
		let that = this;
		this._SYGALIN.loadingPresent("Annulation du rendez-vous");
		this._SYGALIN.query('setKo/', postData).then(res => {
			console.log(res);
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				that.removeItem(request);
				if (!that.rdv.length) {
					this.rvds();
				} else
					that._SYGALIN.loadingDismiss();
			}
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res['message'], type, 4000);
			//that.recruts=res;
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Une erreur s'est produite. Veuillez réessayer.", "danger", 4000);
		});
	}

	rvds() {
		console.log('rdv()');
		console.log('mesReabo()');
		let postData = new FormData();
		postData.append('idP', this.prosId);
		let that = this;
		this._SYGALIN.query('listRdv/', postData).then(res => {
			console.log(res);
			that.rdv = res;
			that._SYGALIN.loadingDismiss();
		}).catch(error => {
			console.log(error);

			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}

	presentConfirm(request: any, type: string) {
		let msg = "", title = "";
		if (type === 'recrut') {
			title = "validation";
			msg = 'valider';
		} else {
			title = "rejet";
			msg = 'annuler';
		}

		let alert = this._ALERT.create({
			title: 'Confirmation de ' + title,
			message: 'Voulez-vous vraiment ' + msg + ' ce RDV? Cette opération est irréversible...',
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
						if (type === 'recrut') {
							this.recrutProspect(request);
						} else {
							this.rejectProspect(request);
						}
					}
				}
			]
		});
		alert.present();
	}

/*
	presentPrompt(request: any) {
		let alert = this._ALERT.create({
			title: 'Report du RDV',
			inputs: [
				{
					name: 'date_rdv',
					placeholder: 'Date...'
				},
				{
					name: 'lieu',
					placeholder: 'Lieu...'
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
							this.rejectProspect(request, data.motivation);
						} else {
							return false;
						}
					}
				}
			]
		});
		alert.present();
	}
*/

	removeItem(item) {
		let pos = this.rdv.map(function (e) {
			return e.rdvId;
		}).indexOf(item.rdvId);
		this.rdv.splice(pos, 1);
	}

	reportModal(request: any)
	{
		let rdvModal = this._MODAL.create(RDVModal);
		rdvModal.onDidDismiss(data => {
			console.log(data);
			if (data && Object.getOwnPropertyNames(data).length!==0){
				this.reportProspect(request, data);
				console.log('REPORTED!');
			}
		});
		rdvModal.present();
	}

	reportProspect(request: any, data: any)
	{
		let postData = new FormData();
		postData.append('prospect', request.prospect);
		postData.append('date_rdv', data.date_rdv);
		postData.append('lieu', data.lieu);
		let that = this;
		this._SYGALIN.loadingPresent("Report du rendez-vous");
		this._SYGALIN.query('saveRdv/', postData).then(res => {
			console.log(res);
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				this.rvds();
			}

			that._SYGALIN.presentToast(res['message'], type, 4000);
			//that.recruts=res;
		}).catch(error => {
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Une erreur s'est produite. Veuillez réessayer.", "danger", 4000);
			console.log(error);
		});
		//this._SYGALIN.loadingDismiss();
	}

}

@Component({
	selector: 'page-rdv-modal',
	templateUrl: 'rdv-modal.html',
})
export class RDVModal {
	formgroup: FormGroup;
	constructor(public _SYGALIN: GlobalProvider, public _VIEW: ViewController) {
		//console.log('UserId', params.get('userId'));
	}

	ngOnInit() {
		this.formgroup = new FormGroup({
			date_rdv: new FormControl('', [Validators.required]),
			lieu: new FormControl('', [Validators.required]),
		});
	}

	onSubmit() {
		if (this.formgroup.valid) {
			let data = {
				'date_rdv': this.formgroup.controls['date_rdv'].value,
				'lieu': this.formgroup.controls['lieu'].value
			};
			this._VIEW.dismiss(data);
		} else {
			this.validateAllFormFields(this.formgroup);
			this._SYGALIN.presentToast('Bien vouloir remplir tous les champs du formulaire', 'danger');
		}
	}

	dismiss(){
		this._VIEW.dismiss();
	}

	validateAllFormFields(formGroup: FormGroup) {
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

	invalidField(field: string)
	{
		return this.formgroup.controls[field].invalid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	validField(field: string)
	{
		return this.formgroup.controls[field].valid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}
}
