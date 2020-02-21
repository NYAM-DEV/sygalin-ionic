import { Component } from '@angular/core';
import {GlobalProvider} from '../../providers/global/global';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {animate, state, style, transition, trigger} from "@angular/animations";
import { CurrencyPipe, DeprecatedI18NPipesModule } from '@angular/common';

/**
 * Generated class for the ListReffilfinancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-reffilfinance',
  templateUrl: 'list-reffilfinance.html',
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
export class ListReffilfinancePage {
  	listerecharge: Array<any>;
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
    console.log('ionViewDidLoad ListReffilfinancePage');
	this._SYGALIN.loadingPresent("Chargement de la liste");
		console.log('voici le nom de la page');
		console.log(this.page);
			
		console.log('Page: Liste recharge');

		if (this.page === "myrequests") {
			this.title = "Mes récharges";
			console.log("myrequests");

		this.ListeRechargeFinanciere();
		} else if (this.page === "myrequestsdfin") {
			this.title = "Mes récharges traité";
		this.ListRechargFin();
		} else if (this.page === "rejected") {
			//this.title = "Réabonnements rejetés";
			//this.reaboRejected();
		}
  }
  doRefresh(event) {
		if (this.page === "myrequests") {
			this.ListeRechargeFinanciere(event);
		} else if (this.page === "myrequestsdfin") {
			this.ListRechargFin(event);
		} else if (this.page === "treated") {
		//	this.reaboTreated(event);
		} else if (this.page === "rejected") {
			//this.reaboRejected(event);
		}
	}

	ListeRechargeFinanciere(event?: any) {
		console.log('ListeRechargeFinanciere()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
	
			postData.append('boutique', cuser.shop);
			postData.append('bType', cuser.shopType);
			postData.append('uId', cuser.id);
			postData.append('Urole', cuser.role);
			postData.append('sector', cuser.sector);
			
			let that = this;
			this._SYGALIN.query('requests/myrequests', postData).then(res => {
				
			that.listerecharge = res;
			console.log("Liste des recharge CGA");
			console.log(this.listerecharge);
			this.solde_valide();
			console.log("Total");
			console.log(this.totalR);
			console.log("Jour");
			console.log(this.totalAJ);
			console.log("Mois");
			console.log(this.totalM);
			console.log(this.som2);

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
	
	valeur_b(id)
	{
		if(id==this._SYGALIN.BANQUE)
		{
			return "Banque";
		}
		else if(id==this._SYGALIN.MOBILE){
			return "Service mobile";
		}
		
	}
	valeur_valid(id)
	{
		if(id==this._SYGALIN.ENCOURS)
		{
			return "En attente de validation";
		}
		else{
			if(id==this._SYGALIN.ENCOURS)
			{
				return	"Demande céditée";
			}
			else
			{
				return "Demande rejetée";
			}
			
		}
	}
	valeur_resp(id)
	{
		if(id==GlobalProvider.roleDFIN)
		{
				return "DIRECTEUR FINANCIER";
		}
		else{
			
				return	"RESPONSABLE DES AA";
			
		}
	}
	
	getUrlFile(fileName){
		console.log('load cga img');
		console.log(fileName);
		this._SYGALIN.loadingPresent("Chargement ...");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('file', fileName);
		let that = this;
		this._SYGALIN.query('img/', postData).then(res => {
			console.log(res);
			that.img = res.url;
			that.openshowimg();
			that._SYGALIN.loadingDismiss();
		}).catch(error => {
			//console.log(error);
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}

	openshowimg(){
		this.navCtrl.push('ShowfilePage',{data: this.img})
	}
	
	solde_valide()
	{ 
		
		this.totalAJ =0;
		this.totalM=0;
		this.totalR=0;
		
		for(let r of this.listerecharge)
		{
		
			if(r.state=="1")
			{
				this.totalR += Number.parseInt(r.montant);
				if(this._SYGALIN.momentjs(r.open_date).format("MM")==this._SYGALIN.momentjs().format("MM"))
				{
					this.totalM +=Number.parseInt(r.montant);
					console.log("Mois");
					console.log(this.totalM);
				}
				if(this._SYGALIN.momentjs(r.open_date).format("DD MM YYYY")==this._SYGALIN.momentjs().format("DD MM YYYY"))
				{
					this.totalAJ+=Number.parseInt(r.montant);
					console.log("Jour");
					console.log(this.totalAJ);
				}
			}
			else
			{
				this.totalR+=0;
			}
		}
	}
	
	ListRechargFin(event?: any) {
		console.log('ListRechargFin()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
	
			
			postData.append('uId', cuser.id);
			postData.append('Urole', cuser.role);
						
			let that = this;
			this._SYGALIN.query('validatedRequestFinancier/', postData).then(res => {
				
			that.listerecharge = res;
			console.log("Liste des recharge CGA");
			console.log(this.listerecharge);
			this.solde_valide();
			
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
