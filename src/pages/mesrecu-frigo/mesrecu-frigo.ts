import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Refresher} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {animate, state, style, transition, trigger} from "@angular/animations";

@IonicPage()
@Component({
  selector: 'page-mesrecu-frigo',
  templateUrl: 'mesrecu-frigo.html',
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
export class MesrecuFrigoPage {
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
			this.title = "Mes recrutements Frigo";
			this.mesRecru();
		} else if (this.page === "toTreat") {
			this.title = "Recrutements à traiter";
			//this.recruToTreat();
			this.mesRecru();
		} else if (this.page === "treated") {
			this.title = "Recrutements traités";
			//this.recruTreated();
		} else if (this.page === "rejected") {
			this.title = "Recrutements rejetés";
			//this.recruRejected();
		}
	}
	mesRecru(event?: any) {
		//console.log('mesRecru()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('shop', cuser.shop);
		let that = this;
		this._SYGALIN.query('aaRecruRequestsFrigo/', postData).then(res => {
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

	doRefresh(event) {
		if (this.page === "forPDV") {
			this.mesRecru(event);
		} else if (this.page === "toTreat") {
			console.log("toTread")
			//this.recruToTreat(event);
		} else if (this.page === "treated") {
			console.log("treaded")
			//this.recruTreated(event);
		} else if (this.page === "rejected") {
			console.log('rejected')
			//this.recruRejected(event);
		}
	}

	recruToTreat(event?: any) {
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('sector', cuser.sector);
		postData.append('role', cuser.role);
		postData.append('uId', cuser.id);
		let that = this;
		this._SYGALIN.query('recruToTreat/', postData).then(res => {
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

}
