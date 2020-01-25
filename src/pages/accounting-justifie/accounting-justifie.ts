import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams,Events} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";


@IonicPage()
@Component({
  selector: 'page-accounting-justifie',
  templateUrl: 'accounting-justifie.html',
})
export class AccountingJustifiePage {
	ticket:any;
	Justifies:any;
	resteRetourner:any;
	img:any;
	rest:any;
  constructor(public navCtrl: NavController,
			  public _SYGALIN: GlobalProvider,
			  public _ALERT: AlertController,
			  public _EVENT:Events,
			  public navParams: NavParams) {
  	this.ticket=this.navParams.get('ticket');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountingJustifiePage');
    this.justifiesDisbursementsToTreat();

  }

	justifiesDisbursementsToTreat(event?:any):void{
		this._SYGALIN.loadingPresent("Chargement de la liste ");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		//postData.append('motif', 'message');

		let that = this;
		this._SYGALIN.query('justifiesDisbursementsToTreat/'+this.ticket, postData).then(res => {
			that.Justifies = res[0];
			that.resteRetourner=res[1];
			that.rest=this.resteRetourner[0].reste_retourner;
			console.log(res[0]);
			console.log("listes Justifies "+ this.Justifies[0]);
			//console.log(this.Justifies);
			//console.log("reste retourner ",this.resteRetourner[0].reste_retourner);
			if (event){
				event.complete();
			}
			that._SYGALIN.loadingDismiss();
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	doRefresh(event) {
		this.justifiesDisbursementsToTreat(event);
	}

	myJson(data:any){
  		return JSON.parse(data);
	}

	getUrlFile(fileName: any) {
  		//let fileName=JSON.parse(fileName1)
		console.log('load disbursment img');
		console.log(fileName);
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('file', fileName);
		postData.append('folder', 'decaissement');
		let that = this;
		this._SYGALIN.query('bestImg/', postData).then(res => {
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

	confirmAction(r: any,type?:any) {
		alert("confirm action");
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
			message: 'Voulez-vous vraiment ' + msg + ' ce justif ? Cette opération est irréversible...',
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
							this.valider(request)
						} else {
							this.presentPrompt(request,"reject");
						}
					}
				}
			]
		});
		alert.present();
	}

	presentPrompt(request: any,action?:any) {
		let title="";
		let placeholder="";
		let texOK="";
		if (action=="reject"){
			title="Rejet de demande";
			placeholder="Motif de rejet";
			texOK="Rejeter la demande";
		}
		let alert = this._ALERT.create({
			title: title,
			inputs: [
				{
					name: 'motivation',
					placeholder: placeholder,
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
					text: texOK,
					handler: data => {
						if (action=="reject"){
							this.invalider(request,data.motivation);
						}
					}
				}
			]
		});
		alert.present();
	}


	valider(request:any){
		this._SYGALIN.loadingPresent("Traitement du ticket");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('jId',request.id);
		//postData.append('motif', 'message');

		let that = this;
		this._SYGALIN.query('confirmJustifyDisbursements/', postData).then(res => {
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
			if (res.type=="success"){
				this.justifiesDisbursementsToTreat();

			}
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	invalider(request:any,motivation:any){
		this._SYGALIN.loadingPresent("Traitement du ticket");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('jId',request.id);
		postData.append('msg', motivation);
		postData.append('ticket', request.ticket);
		postData.append('idDT', request.idDT);

		let that = this;
		this._SYGALIN.query('infirmJustifyDisbursement/', postData).then(res => {
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
			if (res.type=="success"){
				this.justifiesDisbursementsToTreat();
			}
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	treatAll(request?:any){
		this._SYGALIN.loadingPresent("Traitement du ticket");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		//postData.append('jId',request.id);
		let that = this;
		this._SYGALIN.query('moveTicket/'+this.ticket, postData).then(res => {
			that._SYGALIN.loadingDismiss();
			//that._SYGALIN.presentToast(res.message, res.type, 4000);
			if (res.type=="success"){
				//this.justifiesDisbursementsToTreat();
				this._EVENT.publish('AllJustifies:treat',this.ticket);
				this.navCtrl.pop();
			}
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	disbursmentDetailReaffect() {
  	console.dir("aaaaaaaaaaaaaa"+ this.Justifies[0].decaissement);
  	this.disbursmentdetailReaffect();

		/*this.navCtrl.push("AccountingAssignmentPage",{
			ticket:this.ticket,decaissement:this.Justifies[0].decaissement,type:"reaffect"
		})*/
	}
	disbursmentdetailReaffect(){

		this._SYGALIN.loadingPresent("Chargement ...");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		let that = this;
		this._SYGALIN.query('disbursementDetailReaffect/'+this.Justifies[0].decaissement+"/"+this.ticket, postData).then(res => {
			that._SYGALIN.loadingDismiss();
			console.log(res);
			this.navCtrl.push("AccountingAssignmentPage",{ data:res[6],boutiques:res[3],planComptable:res[0],departement:res[4],journal:res[7],type:"normal",ticket:res[5][0].num});
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}
}
