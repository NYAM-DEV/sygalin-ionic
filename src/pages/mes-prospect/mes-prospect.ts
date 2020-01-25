import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {animate, state, style, transition, trigger} from "@angular/animations";

@IonicPage()
@Component({
	selector: 'page-mes-prospect',
	templateUrl: 'mes-prospect.html',
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
export class MesProspectPage {

	reqs: Array<any>;
	page: string;
	title: string;

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				public _SYGALIN: GlobalProvider) {
		this.page = this.navParams.get('page');
	}

	ionViewDidLoad() {

		console.log(this._SYGALIN.momentjs().format('YYYY-MM-DD'));
		console.log('ionViewDidLoad MesProspectPage');
		this._SYGALIN.loadingPresent("Chargement des prospects");
		if (this.page === "forPDV") {
			//this.title = "Mes Requettes";
			this.title = "Mes prospects";
			this.mesProspect();
		}
		if (this.page === "forRFVI") {
			//this.title = "Mes Requettes";
			this.title = "Liste des prospects";
			this.mesProspectRFVI();
		}
		if (this.page==="ofDay") {
			this.title = "prospects du jour";
			this.mesProspectOfDAy();
		}
	}

	doRefresh(event) {
		if (this.page === "forPDV") {
			this.mesProspect(event);
		} else if (this.page === "toTreat") {
			//this.reqToTreat(event);
		} else if (this.page === "treated") {
			//this.reqTreated(event);
		} else if (this.page === "rejected") {
			//this.reqRejected(event);
		}else if(this.page==="ofDay"){
			this.mesProspectOfDAy(event);
		}
	}

	mesProspect(event?: any) {
		console.log("mesReq");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('shop', cuser.shop);
		postData.append('uId', cuser.id);
		let that = this;
		this._SYGALIN.query('mine/', postData).then(res => {
			console.log(res);
			that.reqs = res;
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

	mesProspectRFVI(event?: any) {
		//this.title="Liste des prospects";
		console.log("mesReq");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('shop', cuser.shop);
		postData.append('uId', cuser.id);
		let that = this;
		this._SYGALIN.query('myShopProspect/', postData).then(res => {
			//console.log(res);
			that.reqs = res;
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

	mesRDV(data: any) {
		this.navCtrl.push('RdvProspectPage', {id: data});
	}

	isToday(date_rdv: any):boolean {
	 return date_rdv==this._SYGALIN.momentjs().format('YYYY-MM-DD');
	}

	private mesProspectOfDAy(event?:any) {
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('shop', cuser.shop);
		postData.append('uId', cuser.id);
		let that = this;
		this._SYGALIN.query('prospectOfDay/', postData).then(res => {
			console.log(res);
			that.reqs = res;
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
}
