import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {animate, state, style, transition, trigger} from "@angular/animations";


@IonicPage()
@Component({
  selector: 'page-financial',
  templateUrl: 'financial.html',
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
export class FinancialPage {
	reqfin:any;
	img:any;

  constructor(public navCtrl: NavController,
			  public navParams: NavParams,
			  public _SYGALIN: GlobalProvider,
			  public _ALERT: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FinancialPage');
	  this._SYGALIN.loadingPresent("Chargement de la liste ");
    this.finTotreat();
  }

	finTotreat(type?:any,motif?:any){
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		if(type=='reject'){
			postData.append('valider', "-1");
		}else{
			postData.append('valider', "1");
		}
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('message', motif);
		let that = this;
		this._SYGALIN.query('requestsFinancial/', postData).then(res => {
			console.log(res);
			that.reqfin=res;
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}
	finTotreatRefresh(event?:any){
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('valider', "1");
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		let that = this;
		this._SYGALIN.query('requestsFinancial/', postData).then(res => {
			console.log(res);
			that.reqfin=res;
			if (event){
				event.complete();
			}else
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}
	//validateRequestFinancier
	TreatFin(req:any,type:any,motif?:any){
		let postData = new FormData();
		let url='validateRequestFinancier/'+ req.id;
		let cuser = this._SYGALIN.getCurUser();
		if(type=='reject'){
			url='requestsFinancial/reject'
			postData.append('motivation', motif);
			postData.append('request', req.id);

		}else{
			postData.append('ref', req.n_versement);
			postData.append('amount', req.montant);
		}
		
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('message', motif);
		let that = this;
		this._SYGALIN.query(url, postData).then(res => {
			console.log(res);
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				that.removeItem(req);
				if (!that.reqfin.length) {
					that.finTotreat();
				}
			}
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
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
			message: 'Voulez-vous vraiment ' + msg + ' cette recharge ? Cette opération est irréversible...',
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
							console.log('test dsi ');
							this.TreatFin(request,"validate");
						} else {
							console.log("non oki");
							//this.TreatFin(request,"reject");
							
							this.presentPrompt(request,"reject");
						}
					}
				}
			]
		});
		alert.present();
	}
	removeItem(item) {
		let pos = this.reqfin.map(function (e) {
			return e.ticket;
		}).indexOf(item.ticket);
		this.reqfin.splice(pos, 1);
	}

	presentPrompt(request: any,type?:any) {
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
							//this.rejectRechargecga(request, data.motivation);
							this.TreatFin(request,"reject",data.motivation);
							console.log('rejet des recharge financier');
						} else {
							return false;
						}
					}
				}
			]
		});
		alert.present();
	}

	getUrlFile(fileName){
		console.log('load cga img');
		this._SYGALIN.loadingPresent("Chargement ...");
		console.log(fileName);
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('file', fileName);
		postData.append('folder', 'cga-request');
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

	doRefresh(event) {
		this.finTotreatRefresh(event);
	}
	rejectrifll(motif?:any) {
		
			
		console.log('reject');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
			postData.append('motivation', motif);
			postData.append('boutique', cuser.shop);
			postData.append('motif', motif);
			postData.append('bType', cuser.shopType);
			postData.append('uId', cuser.id);
			postData.append('Urole', cuser.role);
			postData.append('sector', cuser.sector);
			
			let that = this;
			this._SYGALIN.query('requests/reject', postData).then(res => {
				
			if (event) {
			//	event.complete();
				
			} else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			console.log(error);
			if (event) {
				//event.complete();
			} else
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}
}
