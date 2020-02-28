import {GlobalProvider} from '../../providers/global/global';
import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DocumentViewer, DocumentViewerOptions} from "@ionic-native/document-viewer";
import {animate, state, style, transition, trigger} from "@angular/animations";


@IonicPage()
@Component({
  selector: 'page-cga',
  templateUrl: 'cga.html',
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

export class CgaPage {
	cgaType:any;
	reqCga:any;
	img:any;

  constructor(public navCtrl: NavController,
			  public navParams: NavParams,
			  public _SYGALIN: GlobalProvider,
			  public _ALERT: AlertController,
			  private document: DocumentViewer) {
  	this.cgaType="post";
  }




  ionViewDidLoad() {
    console.log('ionViewDidLoad post');
    this._SYGALIN.loadingPresent("Chargement de la liste ");
    this.loadPost();
  }
	loadPre( event?:any){
  	var url="requestsCgaPre/";
  		if(this._SYGALIN.isCM()){
			url="requestsCgaPre/tocredit";
		}

  		console.log('load cga postpayer');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		let that = this;
		this._SYGALIN.query(url, postData).then(res => {
			console.log(res);
			that.reqCga = res;


		}).catch(error => {
			//console.log(error);
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}
	loadPost(event?:any){
		console.log('load cga POST');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		/*postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);

		let that = this;
		this._SYGALIN.query('requestCgaPost/', postData).then(res => {*/
			
		let that = this;
			postData.append('shop', cuser.shop);
			postData.append('shopType', cuser.shopType);
			postData.append('uId', cuser.id);
			postData.append('Urole', cuser.role);
			postData.append('sector', cuser.sector);
		this._SYGALIN.query('requestscgaprepaye/myrequests', postData).then(res => {
			console.log(res);
			that.reqCga = res;
			if (event) {
				event.complete();
			} else
			that._SYGALIN.loadingDismiss();
		}).catch(error => {
			//console.log(error);
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
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
							this.rejectRechargecga(request, data.motivation);
						} else {
							return false;
						}
					}
				}
			]
		});
		alert.present();
	}
	presentPromptCm(request: any,type?:string) {
		let alert = this._ALERT.create({
			title: 'Référence CGA (Obligatoire)',
			inputs: [
				{
					name: 'ref',
					placeholder: 'Entrez la reference ici...'
				}
			],
			buttons: [
				{
					text: 'Annuler',
					role: 'cancel',
					handler: data => {
						console.log('Opération recharge cga ok');
					}
				},
				{
					text: 'OK',
					handler: data => {
						if (data.ref !== null && data.ref !== undefined && data.ref !== "") {
							if(type=='post'){
								this.creditByCM(request,data.ref,'post')
							}else {
								this.creditByCM(request, data.ref);
							}

						} else {
							return false;
						}
					}
				}
			]
		});
		alert.present();
	}

	backToFin(request: any,type?:string) {
		let alert = this._ALERT.create({
			title: 'Confirmation',
			message:'Voulez-vous vraiment renvoyer ce ticket aux finances ?',
			buttons: [
				{
					text: 'Annuler',
					role: 'cancel',
					handler: data => {
						console.log('Backk to Fin ok');
					}
				},
				{
					text: 'OK',
					handler: data => {
						this.returnToFin(request,'post');
					}
				}
			]
		});
		alert.present();
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
			message: 'Voulez-vous vraiment ' + msg + ' cette recharge cga ? Cette opération est irréversible...',
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
							this.validateRecharge(request);
						} else {
							this.presentPrompt(request);
						}
					}
				}
			]
		});
		alert.present();
	}
	presentConfirmPost(request: any, type: string) {
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
			message: 'Voulez-vous vraiment ' + msg + ' cette recharge CGA? Cette opération est irréversible...',
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
							this.validateRechargePost(request);
						} else {
							this.presentPrompt(request);
						}
					}
				}
			]
		});
		alert.present();
	}
	validateRecharge(re){
  	console.log('validateRecharge');
  	console.log(re.id);
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('ref', re.n_versement);
		postData.append('amount', re.montant);
		postData.append('num', re.id);
		let that = this;
		this._SYGALIN.query('requestsCgaPre/validate/', postData).then(res => {
			console.log(res.message);
			that.reqCga = res;
			that._SYGALIN.presentToast(res.message, res.type, 4000);
		}).catch(error => {
			//console.log(error);
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}
	validateRechargePost(re){

		this._SYGALIN.loadingPresent("Traitement ");
  		console.log(re.id);
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('choice', 'cdt');
		postData.append('amount', re.montant);
		postData.append('num', re.id);
		let that = this;
		this._SYGALIN.query('requestsCgaPre/validate/', postData).then(res => {
			console.log(res);
			//that.reqCga = res;
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				that.removeItem(re);
				if (!that.reqCga.length) {
					that.loadPost();
				}
			}
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);

		}).catch(error => {
			//console.log(error);
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}
	rejectRechargecga(re,dad){
  	console.log('rejectRechargecga');
  	console.log(dad);
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('motivation', dad);
		postData.append('request', re.id);
		let that = this;
		this._SYGALIN.query('requestsCgaPre/reject/', postData).then(res => {
			console.log(res);
			//that.reqCga = res;
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				that.removeItem(re);
				if (!that.reqCga.length) {
					that.loadPre();
				}
			}
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);

		}).catch(error => {
			//console.log(error);
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}
	getUrlFile(fileName){
		console.log('load cga img');
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
		}).catch(error => {
			//console.log(error);
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}
	openshowimg(){
  		this.navCtrl.push('ShowfilePage',{data: this.img})
	}

	creditByCM(re: any, data: any,type?:any){
		console.log(re.id);
		let url='';
		let postData = new FormData();
		if(type=='post'){
			postData.append('choice', 'cdt');
			url='requestsCgaPre/validate/';
		}else {
			url='credit/' + re.id;
		}


		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('ref', data);
		postData.append('num', re.id);
		let that = this;
		this._SYGALIN.query(url, postData).then(res => {
			console.log(res);

			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				that.removeItem(re);
				if (!that.reqCga.length) {
					that.loadPost();
				}
			}
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);

		}).catch(error => {
			//console.log(error);
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}
	returnToFin(re: any,type?:any){
		console.log(re.id);
		let url='';
		let postData = new FormData();
		if(type=='post'){
			url='gobackFinanceCdt/';
		}else {
			url='gobackFinance/';
		}


		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('ticket', re.ticket);
		postData.append('id', re.id);
		let that = this;
		this._SYGALIN.query(url, postData).then(res => {
			console.log(res);

			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				that.removeItem(re);
				if (!that.reqCga.length) {
					that.loadPost();
				}
			}
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);

		}).catch(error => {
			//console.log(error);
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}


	removeItem(item) {
		let pos = this.reqCga.map(function (e) {
			return e.ticket;
		}).indexOf(item.ticket);
		this.reqCga.splice(pos, 1);
	}

	sayOK(r?:any){
		console.log(r.memo);
		this.navCtrl.push('MemoPage',{data: r.memo,page: 'voir_memo'});
  }

	doRefresh(event) {
		this.loadPost(event);
	}

	TreatTictek(id)
	{
		
		if(id==GlobalProvider.roleCONTROL())
			{
				return "VOTRE CONTROLEUR";
			}
			else if(id==GlobalProvider.roleSUPER())
			{return "SUPERVISEUR";}
			else if(id==GlobalProvider.roleDFIN())
			{return "DIRECTEUR FINANCIER";} 

	}
}
