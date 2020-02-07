import {GlobalProvider} from '../../providers/global/global';
import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, Refresher} from 'ionic-angular';
import {animate, state, style, transition, trigger} from "@angular/animations";


@IonicPage()
@Component({
	selector: 'page-mes-recru',
	templateUrl: 'mes-recru.html',
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

export class MesRecruPage {
	@ViewChild("refresherRef") refresherRef: Refresher;
	recruts: Array<any>;
	page: string;
	title: string;
	checkedID: Array<any>;

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				public _SYGALIN: GlobalProvider,
				public _ALERT: AlertController) {
		this.page = this.navParams.get('page');
	}

	ionViewDidLoad() {
		console.log("ADDED CHECKED-ID");
		this.checkedID=['none'];
		this._SYGALIN.loadingPresent("Chargement de la liste");

		
		console.log('Page: recrutements');
		if (this.page === "forPDV") {
			this.title = "Mes recrutements";
			this.mesRecru();
		} else if (this.page === "toTreat") {
			console.log("toTreat");
			this.title = "Recrutements à traiter";
			this.recruToTreat();
		} else if (this.page === "treated") {
			this.title = "Recrutements traités";
			this.recruTreated();
		} else if (this.page === "rejected") {
			this.title = "Recrutements rejetés";
			this.recruRejected();
		}
	}

	mesRecru(event?: any) {
		//console.log('mesRecru()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('shop', cuser.shop);
		postData.append('secteur', cuser.sector);
		postData.append('role', cuser.role);
		postData.append('uId', cuser.id);
		let that = this;
		this._SYGALIN.query('myRecruitmentsRequests/', postData).then(res => {
			
			console.log(res);
			that.recruts = res;
			if (event)
			{
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			console.log(error);
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}

	recruToTreat(event?: any) {
		
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('sector', cuser.sector);
		postData.append('role', cuser.role);
		postData.append('uId', cuser.id);
		postData.append('boutique', cuser.shop);
		let that = this;
		
		this._SYGALIN.query('listToTreat/', postData).then(res => {
			console.log("res");
			that.recruts = res;
			console.log(res)
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			console.log(error);
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}

	recruTreated(event?: any) {
		//console.log('mesRecru()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('sector', cuser.sector);
		postData.append('uId', cuser.id);
		postData.append('role', cuser.role);
		let that = this;
		this._SYGALIN.query('recruTreated/', postData).then(res => {
			console.log(res);
			that.recruts = res;
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			console.log(error);
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}

	recruRejected(event?: any) {
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('sector', cuser.sector);
		postData.append('uId', cuser.id);
		postData.append('role', cuser.role);
		let that = this;
		this._SYGALIN.query('recruRejected/', postData).then(res => {
			console.log(res);
			that.recruts = res;
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			console.log(error);
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}

	validateRecru(request: any) {
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user', cuser.id);
		postData.append('tel', cuser.tel);
		postData.append('formule', request.idFormule);
		postData.append('option', request.option);
		postData.append('kit', request.materiel);
		postData.append('recruRequest', request.id);
		postData.append('ticket', request.tkId);
		postData.append('montant', request.montant);
		postData.append('shop', request.boutique);
		let that = this;
		this._SYGALIN.loadingPresent("Validation du recrutement");
		this._SYGALIN.query('validateRecru/', postData).then(res => {
			console.log(res);
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				that.removeItem(request);
				if (!that.recruts.length) {
					that.recruToTreat();
				}
			}
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res['message'], type, 4000);
		}).catch(error => {
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Une erreur s'est produite. Veuillez réessayer.", "danger", 4000);
			console.log(error);
		});
	}

	rejectRecru(request: any, motivation: string) {
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user', cuser.id);
		postData.append('motivation', motivation);
		// postData.append('kit', request.kitId);
		postData.append('recruRequest', request.id);
		postData.append('ticket', request.tkId);
		let that = this;
		this._SYGALIN.loadingPresent("Rejet du recrutement");
		this._SYGALIN.query('rejectRecru/', postData).then(res => {
			console.log(res);
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				that.removeItem(request);
				if (!that.recruts.length) {
					that.recruToTreat();
				}
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
			message: 'Voulez-vous vraiment ' + msg + ' ce recrutement? Cette opération est irréversible...',
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
							this.validateRecru(request);
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
		let options=null;
		options={
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
							this.rejectRecru(request, data.motivation);
						} else {
							return false;
						}
					}
				}
			]
		}

		let alert = this._ALERT.create(options);
		alert.present();
	}

	removeItem(item) {
		let pos = this.recruts.map(function (e) {
			return e.ticket;
		}).indexOf(item.ticket);
		this.recruts.splice(pos, 1);
	}


	doRefresh(event) {
		if (this.page === "forPDV") {
			this.mesRecru(event);
		} else if (this.page === "toTreat") {
			this.recruToTreat(event);
		} else if (this.page === "treated") {
			this.recruTreated(event);
		} else if (this.page === "rejected") {
			this.recruRejected(event);
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
		};

		let alert = this._ALERT.create(options);
		alert.present();
	}
}
