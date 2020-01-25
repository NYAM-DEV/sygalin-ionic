import { Component } from '@angular/core';
import {AlertController, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {animate, state, style, transition, trigger} from "@angular/animations";


@IonicPage()
@Component({
	selector: 'page-mes-ordres-de-missions',
	templateUrl: 'mes-ordres-de-missions.html',
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
export class MesOrdresDeMissionsPage {
	page: any;
	orders: any;
	title: any;
	toJustif: any;
	justifFile: any;
	labelJustif: any;
	issetFile: boolean=false;
	file: any;
	fileTypes: any;
	constructor(public navCtrl: NavController,
		    public navParams: NavParams,
		    public _SYGALIN: GlobalProvider,
		    public _ALERT: AlertController,
		    public _EVENT: Events){
		this.page=this.navParams.get('page');

	}

	ionViewDidLoad() {
		this._SYGALIN.loadingPresent("Chargement");
		this.labelJustif="Cliquer ici pour renseigner le fichier...";
		this.fileTypes= {
			'docx': 'word',
			'doc': 'word',
			'otf': 'word',
			'xlsx': 'excel',
			'xls': 'excel',
			'png': 'png',
			'jpg': 'jpg',
			'pdf': 'pdf'
		};
		this.toJustif=null;
		if (this.page=="toTreat"){
			this.ordersToTreat();
			this.title="ODM à traiter";
		} else if (this.page=="treated"){
			this.ordersTreated();
			this.title="ODM traités";
		}
		else if (this.page=="rejected"){
			this.ordersRejected();
			this.title="ODM rejetés";
		}else if (this.page=="myODM"){
			this.myODM();
			this.title="Mes ODM";
		}
	}

	ordersToTreat(){
		let postData=new FormData();
		postData.append("user", this._SYGALIN.getCurUser().id);
		postData.append("shop", this._SYGALIN.getCurUser().shop);
		postData.append("role", this._SYGALIN.getCurUser().role);
		this._SYGALIN.query("missionOrderToTreat/", postData)
			.then(res=>{
				console.log(res);
				this.orders=res;
					this._SYGALIN.loadingDismiss();
				},
				rej=>{
					this._SYGALIN.loadingDismiss();
					this._SYGALIN.presentToast("Une erreur est survenue (Code 101)", "danger");
				}).catch(error=>{
			this._SYGALIN.loadingDismiss();
			this._SYGALIN.presentToast("Une erreur est survenue (Code 201)", "danger");
			console.log(error);
		})
	}

	ordersTreated(){
		let postData=new FormData();
		postData.append("user", this._SYGALIN.getCurUser().id);
		postData.append("shop", this._SYGALIN.getCurUser().shop);
		postData.append("role", this._SYGALIN.getCurUser().role);
		this._SYGALIN.query("missionOrderTreated/", postData)
			.then(res=>{
					console.log(res);
					this.orders=res;
					this._SYGALIN.loadingDismiss();
				},
				rej=>{
					this._SYGALIN.loadingDismiss();
					this._SYGALIN.presentToast("Une erreur est survenue (Code 101)", "danger");
				}).catch(error=>{
			this._SYGALIN.loadingDismiss();
			this._SYGALIN.presentToast("Une erreur est survenue (Code 201)", "danger");
			console.log(error);
		})
	}

	ordersRejected(){

	}

	myODM(){
		let postData=new FormData();
		postData.append("user", this._SYGALIN.getCurUser().id);
		/*postData.append("shop", this._SYGALIN.getCurUser().shop);
		postData.append("role", this._SYGALIN.getCurUser().role);*/
		this._SYGALIN.query("myMissionOrder/", postData)
			.then(res=>{
					console.log(res);
					this.orders=res;
					this._SYGALIN.loadingDismiss();
				},
				rej=>{
					this._SYGALIN.loadingDismiss();
					this._SYGALIN.presentToast("Une erreur est survenue (Code 101)", "danger");
				})
			.catch(error=>{
				this._SYGALIN.loadingDismiss();
				this._SYGALIN.presentToast("Une erreur est survenue (Code 201)", "danger");
				console.log(error);
			});
	}

	presentConfirm(idOdm: any) {
		let msg = "", title = "";
		title = "justification";
		msg = 'justifier';

		let alert = this._ALERT.create({
			title: 'Confirmation de ' + title,
			message: 'Voulez-vous vraiment ' + msg + ' cet ODM? Cette opération est irréversible...',
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
						this.justifyOdm(idOdm)
					}
				}
			]
		});
		alert.present();
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
							//this.rejectReabo(request, data.motivation);
						} else {
							return false;
						}
					}
				}
			]
		});
		alert.present();
	}

	detailsOdm(idOdm, refOdm)
	{
		console.log('SENT ODM: ', idOdm);
		this.navCtrl.push('DetailsOdmPage', {odm: idOdm, ref: refOdm})
			.then(res=>{
				console.log('NAV RESULT: ', res);
			}).catch(error=>{
				console.log('NAV ERROR: ', error);
			});
		this._EVENT.subscribe('ODM:closed-detail-'+idOdm, (odmId)=>{
			console.log('ODM VALIDATED!!!!!');
			console.log('RECEIVED ODM: ', odmId);
			this.removeItem(odmId);
			if (!this.orders.length) {
				this.ordersToTreat();
			}
		});
	}

	justifyOdm(idOdm){
		console.log(idOdm);
		if (!this.issetFile){
			this._SYGALIN.presentToast("Veuillez renseigner le(s) fichier(s) justificatif(s)", 'danger', 4000);
		} else {
			this._SYGALIN.loadingPresent("Enregistrement du justificatif");
			let postData=new FormData();
			postData.append("user", this._SYGALIN.getCurUser().id);
			postData.append("role", this._SYGALIN.getCurUser().role);
			postData.append("odm", idOdm);

			for (const file of this.file){
				postData.append('files[]', file);
			}
			this._SYGALIN.query("saveGlobalJustif/", postData)
				.then(res=>{
						console.log(res);
						let type = "success";
						if (res['type'] === 'error') {
							type = "danger";
						}
						this._SYGALIN.loadingDismiss();
						this._SYGALIN.presentToast(res['message'], type, 4000);
						if (res['type'] === 'success') {
							this.removeItem(idOdm);
						}
					},
					rej=>{
						this._SYGALIN.loadingDismiss();
						this._SYGALIN.presentToast("Une erreur est survenue (Code 101)", "danger");
					}).catch(error=>{
				this._SYGALIN.loadingDismiss();
				this._SYGALIN.presentToast("Une erreur est survenue (Code 201)", "danger");
				console.log(error);
			})
		}
	}

	setToJustif(idOdm){
		if (this.toJustif!==idOdm)
		{
			this.toJustif=idOdm;
			this.labelJustif="Cliquer ici pour renseigner le fichier...";
			this.justifFile=null;
		}
		else {
			this.toJustif=null;
		}
		this.file=null;
		this.issetFile=false;
	}

	removeItem(item) {
		let pos = this.orders.map(function (e) {
			return e.id;
		}).indexOf(item);
		if (pos>=0){
			this.orders.splice(pos, 1);
			console.log('ODM REMOVED!!');
		} else {
			console.log('WEIRD POS: ', pos);
		}
	}

	updateFile(event){
		if (event!==undefined && event.target!==undefined && event.target.files!==undefined){
			console.log('FICHIER: ', event,  event.target.files[0].name);
			if (event.target.files.length>1){
				this.labelJustif=event.target.files.length+" fichiers sélectionnés";
			} else {
				this.labelJustif=event.target.files[0].name;
			}

			this.file=Array.from(event.target.files);
			this.issetFile=true;
		}
		console.log('ACTUAL FILE: ', this.file);
	}

	removeFile(i){
		console.log(this.file);
		this.file.splice(i, 1);
		if (this.file.length<1){
			this.file=null;
			this.labelJustif="Cliquer ici pour renseigner le(s) fichier(s)...";
			this.justifFile=null;
			this.issetFile=false;
		}
	}

	issetElem(key, obj){
		return (key in obj);
	}

}
