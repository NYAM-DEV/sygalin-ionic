import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {GlobalProvider} from '../../providers/global/global';
import {animate, state, style, transition, trigger} from "@angular/animations";

/**
 * Generated class for the MesReaboSvodPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-mes-reabo-svod',
	templateUrl: 'mes-reabo-svod.html',
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
export class MesReaboSvodPage {
	reabos: any;
	title: string;
	page: string;
	checkedID: Array<any>;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public _ALERT: AlertController,
		public _SYGALIN: GlobalProvider) {
		this.page = this.navParams.get('page');
		// this.mesReabos();
	}

	ionViewDidLoad() {
		this._SYGALIN.loadingPresent("Chargement de la liste");
		this.checkedID=[];
		if (this.page === "forPDV") {
			this.title = "Mes réabonnements SVOD";
			this.mesReabos();
		} else if (this.page === "toTreat") {
			this.title = "Réabonnements SVOD à traiter";
			this.reaboToTreat();
		} else if (this.page === "treated") {
			this.title = "Réabonnements SVOD traités";
			this.reaboTreated();
		} else if (this.page === "rejected") {
			this.title = "Réabonnements SVOD rejetés";
			this.reaboRejected();
		}
	}

	mesReabos(event?: any) {
		console.log('mesReabo()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('shop', cuser.shop);
		postData.append('sector', cuser.sector);
		postData.append('user', cuser.id);
		let that = this;
		this._SYGALIN.query('mySvodReaboRequests/', postData).then(res => {
			//console.log(res);
			that.reabos = res;
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			//console.log(error);
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}

	reaboToTreat(event?: any) {
		//console.log('mesRecru()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('sector', cuser.sector);
		postData.append('role', cuser.role);
		let that = this;
		this._SYGALIN.query('svodToTreat/', postData).then(res => {
			//console.log(res);
			that.reabos = res;
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			//console.log(error);
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}

	reaboTreated(event?: any) {
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('sector', cuser.sector);
		postData.append('role', cuser.role);
		let that = this;
		this._SYGALIN.query('svodTreated/', postData).then(res => {
			//console.log(res);
			that.reabos = res;
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			//console.log(error);
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}

	reaboRejected(event?: any) {
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('sector', cuser.sector);
		postData.append('role', cuser.role);
		let that = this;
		this._SYGALIN.query('svodRejected/', postData).then(res => {
			//console.log(res);
			that.reabos = res;
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			//console.log(error);
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Une erreur interne s'est produite", "warning", 6000);
		});
	}

	validateReabo(request: any) {
		// Ref AlertController
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user', cuser.id);
		/* postData.append('formule', request.idFormule);
		postData.append('option', request.option);
		postData.append('kit', request.materiel); */
		postData.append('reaboRequest', request.id);
		postData.append('ticket', request.tkId);
		postData.append('montant', request.montant);
		postData.append('shop', request.boutique);
		let that = this;
		this._SYGALIN.loadingPresent("Validation du réabonnement SVOD");
		this._SYGALIN.query('validateSvodReabo/', postData).then(res => {
			//console.log(res);
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				that.removeItem(request);
				if (!that.reabos.length) {
					that.reaboToTreat();
				}
			}
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res['message'], type, 4000);
			//that.recruts=res;
		}).catch(error => {
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Une erreur s'est produite. Veuillez réessayer.", "danger", 4000);
			console.log(error);
		});
	}

	rejectReabo(request: any, motivation: string) {
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user', cuser.id);
		postData.append('sector', cuser.sector);
		postData.append('motivation', motivation);
		postData.append('reabo', request.id);
		postData.append('ticket', request.tkId);
		let that = this;
		this._SYGALIN.loadingPresent("Rejet du réabonnement SVOD");
		this._SYGALIN.query('rejectSvodReabo/', postData).then(res => {
			//console.log(res);
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				that.removeItem(request);
				if (!that.reabos.length) {
					that.reaboToTreat();
				}
			}
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res['message'], type, 4000);
		}).catch(error => {
			//console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Une erreur s'est produite. Veuillez réessayer.", "danger", 4000);
		});
	}

	presentConfirm(request: any, type: string) {
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
			message: 'Voulez-vous vraiment ' + msg + ' ce réabonnement SVOD? Cette opération est irréversible...',
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
							this.validateReabo(request);
						} else {
							this.presentPrompt(request);
						}
					}
				}
			]
		});
		alert.present();
	}

	presentPrompt(request: any) {
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
							this.rejectReabo(request, data.motivation);
						} else {
							return false;
						}
					}
				}
			]
		});
		alert.present();
	}

	removeItem(item) {
		let pos = this.reabos.map(function (e) {
			return e.ticket;
		}).indexOf(item.ticket);
		this.reabos.splice(pos, 1);
	}

	doRefresh(event) {
		if (this.page === "forPDV") {
			this.mesReabos(event);
		} else if (this.page === "toTreat") {
			this.reaboToTreat(event);
		} else if (this.page === "treated") {
			this.reaboTreated(event);
		} else if (this.page === "rejected") {
			this.reaboRejected(event);
		}
	}

	verifyID(request: any) {
		let options={
			title: 'Vérification de l\'ID de la transaction',
			inputs: [
				{
					name: 'id_trans',
					placeholder: 'ID Transaction reçu...'
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
					text: 'Comparer',
					handler: data => {
						if (data.id_trans == request.id_trans) {
							this.checkedID.push(request.numTicket);
							this._SYGALIN.presentToast('Les identifiants correspondent', 'success', 1500);
						} else {
							this._SYGALIN.presentToast('Les identifiants ne correspondent pas', 'danger', 1500);
						}
					}
				}
			]
		}
		let alert = this._ALERT.create(options);
		alert.present();
	}
}
