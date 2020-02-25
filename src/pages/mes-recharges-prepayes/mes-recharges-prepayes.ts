import { Component } from '@angular/core';
import {GlobalProvider} from '../../providers/global/global';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {animate, state, style, transition, trigger} from "@angular/animations";
import { CurrencyPipe, DeprecatedI18NPipesModule } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-mes-recharges-prepayes',
  templateUrl: 'mes-recharges-prepayes.html',animations: [
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
		]),
		trigger('fileItemState', [
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

export class MesRechargesPrepayesPage {
  listerecharge: Array<any>;
  listememo:Array<any>;
	page: string;
	title: string;
	checkedID: Array<any>;
	nom: string;
	uRole: string;
	uId: string;
	boutique: string;
	bType: string;
	user: any;
	orders: any;
	val:any;
	type_paie:any;
	reqCga:any;
	img:any;
	som2:number;
	unit:String="XAF";
	totalR:number; 
  totalAJ:number;
	totalM:number;
	etat_tick:String;
	
constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public _SYGALIN: GlobalProvider,
		public _ALERT: AlertController) {
	this.page = this.navParams.get('page');

  }
  
   ionViewDidLoad() {
    console.log('ionViewDidLoad MesRechargesPrepayesPage');
    
	  this._SYGALIN.loadingPresent("Chargement de la liste");
		console.log('voici le nom de la page');
		console.log(this.page);
			
		console.log('Page: Liste recharge');

		if (this.page === "myrequests") {
			this.title = "Mes récharges";
			this.listRechargeCGAprepaye();
		} else if (this.page === "myrequestsdfin") {
			this.title = "Mes récharges traité";
		    //this.ListRechargFin();
		} else if (this.page === "rejected") {
			//this.title = "Réabonnements rejetés";
			//this.reaboRejected();
		}
  }
  doRefresh(event) {
		if (this.page === "myrequests") {
			//this.ListeRechargeFinanciere(event);
		} else if (this.page === "treated") {
		//	this.reaboTreated(event);
		} else if (this.page === "rejected") {
			//this.reaboRejected(event);
		}
	}

	listRechargeCGAprepaye(event?: any) {
		console.log('listRechargeCGAprepaye()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
	
			postData.append('shop', cuser.shop);
			postData.append('shopType', cuser.shopType);
			postData.append('uId', cuser.id);
			postData.append('Urole', cuser.role);
			postData.append('sector', cuser.sector);
			
			let that = this;
			this._SYGALIN.query('requestscgaprepaye/myrequests', postData).then(res => {
				
			that.listerecharge = res;
			console.log("Liste des recharge CGA");
			console.log(this.listerecharge);
      this.RequestMemo(this.listerecharge)
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
RequestMemo(Request:any) {
		console.log('Request Memo()');
		let postData = new FormData();
			
		let url='consultingMemo/'+Request.memo
			console.log(url);
			let that = this;
			this._SYGALIN.query(url, postData).then(res => {
				
			that.listememo = res;
			console.log("Liste des recharge CGA");
			console.log(this.listememo);
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			console.log(error);
			
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}
}
