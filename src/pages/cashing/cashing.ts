import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {animate, state, style, transition, trigger} from "@angular/animations";


@IonicPage()
@Component({
  selector: 'page-cashing',
  templateUrl: 'cashing.html',
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
export class CashingPage {
	cash:any;
	img:any;

  constructor(public navCtrl: NavController,
			  public navParams: NavParams,
			  public _ALERT: AlertController,
			  public _SYGALIN: GlobalProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CashingPage');
	this._SYGALIN.loadingPresent('Chargement de la liste ...');
    this.cashingTotreat();
  }

  cashingTotreat(event?:any){
	  console.log('load cga postpayer');
	  let postData = new FormData();
	  let cuser = this._SYGALIN.getCurUser();
	  postData.append('user_id', cuser.id);
	  postData.append('user_role', cuser.role);
	  let that = this;
	  this._SYGALIN.query('cashingToTreat/', postData).then(res => {
		  console.log(res);
		  that.cash = res;
		  if (event) {
			  event.complete();
		  } else
		  this._SYGALIN.loadingDismiss();
	  }).catch(error => {
		  //console.log(error);
		  that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
	  });
  }
	getUrlFile(fileName){
		console.log('load cga img');
		console.log(fileName);
		this._SYGALIN.loadingPresent("Chargement ...");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('file', fileName);
		postData.append('folder', 'Versement');
		let that = this;
		this._SYGALIN.query('bestImg/', postData).then(res => {
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
			message: 'Voulez-vous vraiment ' + msg + ' ce Versement ? Cette opération est irréversible...',
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
							this.treatVersement(request);
						} else {
							this.presentPrompt(request);
						}
					}
				}
			]
		});
		alert.present();
	}
	treatVersement(r:any,type?:any,motif?:string){
  		console.log('validateVersement');
  		let url:string;
  		url='acceptCashing/';
		let postData = new FormData();
  		if(type=='reject'){
  			url='rejectCashing/';
			postData.append('msg', motif);
		}

		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('ticket', r.tkId);
		let that = this;
		this._SYGALIN.query(url, postData).then(res => {
			console.log(res);
			let type = "success";
			if (res['type'] === 'error') {
				type = "danger";
			} else if (res['type'] === 'success') {
				that.removeItem(r);
				if (!that.cash.length) {
					that.cashingTotreat();
				}
			}
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
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
							this.treatVersement(request,'reject', data.motivation);
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
		let pos = this.cash.map(function (e) {
			return e.ticket;
		}).indexOf(item.ticket);
		this.cash.splice(pos, 1);
	}

	doRefresh(event) {
		this.cashingTotreat(event);
	}
}
