import { Component } from '@angular/core';
import {Events, IonicPage, ModalController, NavController, NavParams, ViewController,AlertController } from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";

@IonicPage()
@Component({
  selector: 'page-justif-disbursment',
  templateUrl: 'justif-disbursment.html',
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
export class JustifDisbursmentPage {
	justif:any;
	img:any;


  constructor(public navCtrl: NavController,
			  public events: Events,
			  public alertCtrl: AlertController,
			  public _SYGALIN: GlobalProvider,
			  public modalCtrl: ModalController,
			  public navParams: NavParams) {
  	this.justif=this.navParams.get('justifDfin');
  	console.log("my justifs",this.justif);
  }

	getUrlFile(fileName){
		console.log('load disbursment img');
		console.log(fileName);
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('file', fileName);
		postData.append('folder', 'decaissement');
		let that = this;
		this._SYGALIN.query('bestImg/', postData).then(res => {
			that.img = res.url;
			that.openshowimg();
		}).catch(error => {
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}

	openshowimg(){
		this.navCtrl.push('ShowfilePage',{data: this.img})
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad JustifDisbursmentPage');
  }

	openModal(details:any){
		let profileModal = this.modalCtrl.create(JustifModal,{req:details});
		profileModal.onDidDismiss(data => {
			if (data){
				this.removeItem(data.decaissement);

				console.log("mon test " + data.decaissement);
			}
		});
		profileModal.present();
	}

	myJustifiesDisbursements() {
		console.log('load disbursment img');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('folder', 'decaissement');
		let that = this;
		this._SYGALIN.query('myJustifiesDisbursements/', postData).then(res => {
			that.img = res.url;
			that.openshowimg();
		}).catch(error => {
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}
	removeItem(item) {
		let pos = this.justif.map(function (e) {
			return e.id;
		}).indexOf(item.id);
		this.justif.splice(pos, 1);
		console.log('taille',this.justif.length);
		if(this.justif.length==0){
			this.events.publish('treat:alldisbursment',item);
			this.navCtrl.pop().then(res=>{
				console.log('retour ok  ');
			});
		}
		console.log("mon justif ", this.justif);
	}

	presentPromptCashback(data ?:any) :void {
		const prompt = this.alertCtrl.create({
			title: 'Confirmation',
			message: "Affirmez vous avoir retourné en caisse la somme de " + data.restant + " XAF",
			buttons: [
				{
					text: 'Annuler',
					handler: res => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Oui',
					handler: res => {
						console.log(data);
						this.cashback(data);
					}
				}
			]
		});
		prompt.present();
	}

	cashback(r) {
  		this._SYGALIN.loadingPresent("Traitement ...");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('boutique_id',cuser.shop );
		let that = this;
		this._SYGALIN.query('confirmFinancialDisbursement1/'+r.id+'/'+r.decaissement, postData).then(res => {
			console.log(res);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
			if(res.type=="success"){
				console.log(r);
				this.removeDecaissement(r);
			}
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	removeDecaissement(item) :void {
		let pos = this.justif.map(function (e) {
			return e.id;
		}).indexOf(item.id);
		this.justif.splice(pos, 1);
	}
}

@Component({
	selector: 'page-justif-Disbursment-modal',
	templateUrl: 'justif-Disbursment-modal.html',
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
export class JustifModal {
	formgroup: FormGroup;
	message:any;
	request:any;
	img:any;
	showDocFile:boolean=false;
	banques:any;
	compte_bancaire:any;

	constructor(public _SYGALIN: GlobalProvider,
				public navparam: NavParams,
				public navCtrl: NavController,
				public navParams: NavParams,
				public _VIEW: ViewController) {

		this.banques = this.setfilter();
		this.compte_bancaire=this.setfilter_compte_banque();
		this.request = navParams.get('req');
	}

	ngOnInit(){
		this.formgroup = new FormGroup({
			ref: new FormControl('', [Validators.required]),
			montant: new FormControl('', [Validators.required]),
			pay_option: new FormControl('', [Validators.required]),
			file1: new FormControl({disabled: true, value: ''}, [Validators.required]),
			action: new FormControl({disabled: true, value: ''}, [Validators.required]),
			banque: new FormControl({disabled: true, value: ''}, [Validators.required]),
			cptDebiteur: new FormControl({disabled: true, value: ''}, [Validators.required]),
			cptcrediteur: new FormControl({disabled: true, value: ''}, [Validators.required])
		});
	}
	ionViewDidLoad(){
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
	}

	setForm(decaissement:any){
		let mesages=this.formgroup.controls['Shop'].value;
		let valeur={
			message:mesages,
			decaisement:decaissement,
		};
		this._VIEW.dismiss(valeur);
	}

	dismiss(){
		this._VIEW.dismiss()
	}

	getUrlFile(fileName){
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

	invalidField(field: string) {
		return this.formgroup.controls[field].invalid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	myJustifiesDisbursements() :void{
		console.log('load disbursment img');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		let that = this;
		this._SYGALIN.query('myJustifiesDisbursements/', postData).then(res => {
			console.log(res);
		}).catch(error => {
			//console.log(error);
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}

	validField(field: string)
	{
		return this.formgroup.controls[field].valid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	showInput(event) {
		let type:any;
		for (let p of  this._SYGALIN.all_pay_options){
			if (p.id==event){
				type=p.type;
			}
		}
		if (type==3 || type==1){
			this.showDocFile=true;
			this.formgroup.get('action').enable();
			this.formgroup.get('file1').enable();
		}else {
			this.showDocFile=false;
			this.formgroup.get('action').disable();
		}
	}
	justifFile: any;
	issetFile: boolean=false;
	file: any;
	fileTypes: any;
	labelJustif: any;
	banqueFlied: boolean=false;

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
	issetElem(key, obj){
		return (key in obj);
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

	setfilter():any[] {
		let microfinance:any[]=[];
		for (let p of this._SYGALIN.all_pay_options){
			if (p.micro_finance==="1"){
				microfinance.push(p)
			}
		}
		return microfinance;
	}

	setfilter_compte_banque():any[]{
		let compte_banque:any[]=[];
		for (let p of this._SYGALIN.compte_bancaire){
			if (p.moyen_payement==='4'){
				compte_banque.push(p);
			}
		}
		return compte_banque;
	}

	changeBanqueField(event):void {
		if (event==2) {
			this.banqueFlied=true;
			this.formgroup.get('banque').enable();
			this.formgroup.get('cptDebiteur').enable();
			this.formgroup.get('cptcrediteur').enable();
		}else{
			this.banqueFlied=false;
			this.formgroup.get('banque').enable();
			this.formgroup.get('cptDebiteur').enable();
			this.formgroup.get('cptcrediteur').enable();
		}

	}

	justifyDisbursements(request:any) {
		console.log('load disbursment img');
		this._SYGALIN.loadingPresent("Traitement ...");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('btqId', cuser.shop);
		postData.append('send','ok');
		console.log("POST DATA: ", postData);
		if(this.showDocFile){
			for (const file of this.file){
				postData.append('files[]', file);
			}
			postData.append('bqNom',this.formgroup.controls['banque'].value);
			postData.append('nCptD',this.formgroup.controls['cptDebiteur'].value);
			postData.append('nCptC',this.formgroup.controls['cptcrediteur'].value);
		}
		postData.append('montant',this.formgroup.controls['montant'].value);
		postData.append('reference',this.formgroup.controls['ref'].value);
		postData.append('action', this.formgroup.controls['action'].value);
		postData.append('paymode',this.formgroup.controls['pay_option'].value);
		console.log(" post  data ", postData);
		console.log(" FICHIERS: ", this.file);
		let that = this;
		this._SYGALIN.query('justifyDisbursements/'+request.id+"/"+request.decaissement, postData).then(res => {
			console.log(res);
			that.justifDfin(request);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
			if(res.type=="success"){
				that.inv(request);
			}
		}).catch(error => {
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}
	justifDfin(request:any):void {
		console.log("justif dfin");
		//this._SYGALIN.loadingPresent("Chargement de la liste ");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		let that = this;
		this._SYGALIN.query('justifDfin/'+request.decaissement, postData).then(res => {
			console.log(res);
		///	let justifDfin=res;
			//that._SYGALIN.loadingDismiss();
			//that.navCtrl.push('JustifDisbursmentPage',{justifDfin:justifDfin});
			//that._SYGALIN.presentToast(res.message, res.type, 4000);
		}).catch(error => {
			console.log(error);
			//that._SYGALIN.loadingDismiss();
			//that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}


	inv(reqData:any){
		let data={
			decaissement:reqData,
			type:0,
		};
		this._VIEW.dismiss(data);
	}

}
