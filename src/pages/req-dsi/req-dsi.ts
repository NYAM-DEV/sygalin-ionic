import { Component } from '@angular/core';
import {Events, IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {GlobalProvider} from '../../providers/global/global';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FormGroup} from "@angular/forms";


@IonicPage()
@Component({
  selector: 'page-req-dsi',
  templateUrl: 'req-dsi.html',
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
export class ReqDsiPage {
	reqDSI:any;
	reqDetail:any;
	userDept:any;
	Dept:any;
	All:any;
	responses:any;
	buttonClick:boolean=false;

  constructor(public navCtrl: NavController,
			  public _SYGALIN: GlobalProvider,
			  public _EVENT: Events,
			  public modalCtrl: ModalController,
			  public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReqDsiPage');
    this._SYGALIN.loadingPresent("Chargement de la liste");
    this.myHelpRequets();
  }
  myHelpRequets(event?: any):void {
	  let postData = new FormData();
	  let url:string='requestDSIToTreat/';
	  if (this._SYGALIN.isPDG()){
	  	url="listRequestDuring/";
	  }
	  let cuser = this._SYGALIN.getCurUser();
	  postData.append('user_id', cuser.id);
	  postData.append('user_role', cuser.role);
	  postData.append('dept_id', cuser.dept);
	  let that = this;
	  this._SYGALIN.query(url, postData).then(res => {
		  that.reqDSI=res;
		  if (event) {
			  event.complete();
		  } else
		  that._SYGALIN.loadingDismiss();
	  }).catch(error => {
		  console.log(error);
		  that._SYGALIN.loadingDismiss();
		  that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
	  })
  }

  details(req:any){
  	this._SYGALIN.loadingPresent('Chargement de la liste ...');
  	//this.buttonClick=true;
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('dept_id', cuser.dept);
		let that = this;
		this._SYGALIN.query('answerRequest/'+ req.id, postData).then(res => {
			that.Dept=res[0] ;
			that.userDept=res[1] ;
			that.reqDetail=res[2] ;
			that.responses=res[3] ;
			that._SYGALIN.loadingDismiss();
			that.navCtrl.push('MesAidesDsiPage',{ detail: that.reqDetail,dept:that.Dept,userDept:that.userDept,responses:that.responses,idReq:req.id});
			//that._SYGALIN.loadingDismiss();
			this._EVENT.subscribe('DSIreq:closed', (req)=>{
				console.log('ODM VALIDATED!!!!!');
				console.log('RECEIVED ODM: ', req);
				this.removeItem(req);
				if (!this.reqDSI.length) {
					this.myHelpRequets();
				}
			});
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	removeItem(item) {
		let pos = this.reqDSI.map(function (e) {
			return e.ticket;
		}).indexOf(item.ticket);
		this.reqDSI.splice(pos, 1);
	}
	doRefresh(event) {
  		this.myHelpRequets(event);
	}
}

