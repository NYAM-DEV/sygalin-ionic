import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {animate, state, style, transition, trigger} from "@angular/animations";


@IonicPage()
@Component({
  selector: 'page-memo',
  templateUrl: 'memo.html',
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
export class MemoPage {
	mem:any;
	data:any;
	memo:boolean;
	img:any;
	bon_memo:Array<any>


  constructor(public navCtrl: NavController,
			  public navParams: NavParams,
			  public _SYGALIN: GlobalProvider,
			  public _ALERT: AlertController) {
  	this.memo=true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemoPage');
    this._SYGALIN.loadingPresent("Chargement de la liste ");

     this.data=this.navParams.get('data');
     if(this.data){
		this.getOneMemo(this.data);
	 }else {
		 this.memoToTreat();
	 }
  }
  memoToTreat(event?:any){
	  let postData = new FormData();
	  let cuser = this._SYGALIN.getCurUser();
	  postData.append('user_id', cuser.id);
	  postData.append('user_role', cuser.role);
	  let that = this;
	  this._SYGALIN.query('memosToTreats/', postData).then(res => {
		  that.mem = res;
		  if (event){
		  	event.complete();
		  } else
		  that._SYGALIN.loadingDismiss();
	  }).catch(error => {
		  console.log(error);
		  that._SYGALIN.loadingDismiss();
		  that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
	  })
  }

  memoDetail(req:any){
  	console.log("loadMemo deatails");
  	console.log(req);

  }

	RejectMemo(request: any) {
		let alert = this._ALERT.create({
			title: 'Rejet du memo',
			inputs: [
				{
					name: 'motif',
					placeholder: 'Entrez le motif ici...'
				}
			],
			buttons: [
				{
					text: 'Annuler',
					role: 'cancel',
					handler: data => {
						console.log('rejet du memo');
					}
				},
				{
					text: 'OK',
					handler: data => {
						if (data.motif !== null && data.motif !== undefined && data.motif !== "") {
							this.TreatMemo(request,'rejet');
						} else {
							return false;
						}
					}
				}
			]
		});
		alert.present();
	}

  TreatMemo(r:any,type:any,motif?:string){
	  let postData = new FormData();
	  let cuser = this._SYGALIN.getCurUser();
	  if(type=='rejet'){
		  postData.append('valider', "-1");
	  }else{
		  postData.append('valider', "1");
	  }
	  postData.append('user_id', cuser.id);
	  postData.append('user_role', cuser.role);
	  postData.append('message', motif);
	  let that = this;
	  this._SYGALIN.query('validateMemo/'+r.id, postData).then(res => {
		  console.log(res);

		  let type = "success";
		  if (res['type'] === 'error') {
			  type = "danger";
		  } else if (res['type'] === 'success') {
			  that.removeItem(r);
			  if (!that.mem.length) {
				  that.memoToTreat();
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
	removeItem(item) {
		let pos = this.mem.map(function (e) {
			return e.ticket;
		}).indexOf(item.ticket);
		this.mem.splice(pos, 1);
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
			message: 'Voulez-vous vraiment ' + msg + ' ce Memo ? Cette opération est irréversible...',
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
							this.TreatMemo(request,'valider');
						} else {
							console.log("non oki");
						}
					}
				}
			]
		});
		alert.present();
	}
	getOneMemo(id:any){
  		this.memo=false;
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		let that = this;
		this._SYGALIN.query('consultingMemo/'+id, postData).then(res => {
		//this._SYGALIN.query('showMemo/'+id, postData).then(res => {
			console.log('ok');
			//console.log(res);
			that.mem = res;
			console.log(that.mem);
			that._SYGALIN.loadingDismiss();
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	doRefresh(event) {
		this.memoToTreat(event)
	}

	TreatTictek(id)
	{
		
		if(id==GlobalProvider.roleCONTROL())
			{
				return "CONTROLEUR";
			}
			else if(id==GlobalProvider.roleSUPER())
			{return "SUPERVISEUR";}
			else if(id==GlobalProvider.roleDFIN())
			{return "DIRECTEUR FINANCIER";} 

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
}
