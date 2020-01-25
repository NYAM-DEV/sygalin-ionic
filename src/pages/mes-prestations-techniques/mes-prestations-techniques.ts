import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {animate, state, style, transition, trigger} from "@angular/animations";


/**
 * Generated class for the MesPrestationsTechniquesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-mes-prestations-techniques',
	templateUrl: 'mes-prestations-techniques.html',
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
export class MesPrestationsTechniquesPage {
	prestations: any;
	title: any;
	page: any;
	checkedID: Array<any>;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public _SYGALIN: GlobalProvider,
		public _ALERT: AlertController) {
		this.page = this.navParams.get('page');

	}

	ionViewDidLoad() {
		this.checkedID=[];
		//console.log('ionViewDidLoad MesPrestationsTechniquesPage');
		this._SYGALIN.loadingPresent("Chargement de la liste");
		if (this.page === "forPDV") {
			this.title = "Prestations envoyées";
			this.mesPrestations();
		}
	}

	mesPrestations(event?: any) {
		//console.log('mesRecru()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('shop', cuser.shop);
		postData.append('role', cuser.role);
		let that = this;
		this._SYGALIN.query('myAssistanceRequest/', postData).then(res => {
			//console.log(res);
			that.prestations = res;
			if (event)
			{
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

	doRefresh(event) {
		if (this.page === "forPDV") {
			this.mesPrestations(event);
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
							this.checkedID.push(request.num);
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
