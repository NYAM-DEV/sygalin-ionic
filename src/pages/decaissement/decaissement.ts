import { Component } from '@angular/core';
import {
	IonicPage,
	NavController,
	NavParams,
	ModalController,
	ViewController,
	AlertController,
	Events
} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";



@IonicPage()
@Component({
  selector: 'page-decaissement',
  templateUrl: 'decaissement.html',
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
export class DecaissementPage {
	Decaissements:any;
	DetailsDisbursment:any;
	planComptable:any;
	departement:any;
	img:any;
	boutiques:any;
	boutique:any;
	journal:any;

  constructor(public navCtrl: NavController,
			  public _SYGALIN: GlobalProvider,
			  public _EVENT: Events,
			  public modalCtrl: ModalController,
			  public navParams: NavParams) {

	 this._EVENT.subscribe('treat:alldisbursment', (decaissement)=>{
	 	//alert("alldisbursment oki");

		  console.log('disbursment VALIDATED!!!!!');
		  console.log('justif: ', decaissement);
		  this.removeItem(decaissement.id);
		 this.DecaissementToTreat();
	  });
	  /*
	  this._EVENT.subscribe('detail:disbursment', (request_ticket) => {
	  	this.removeItem1(request_ticket);
		  if (!this.Decaissements.length) {
			  this.DecaissementToTreat();
		  }
	  });*/
	 this._EVENT.subscribe('AllJustifies:treat',(ticket)=>{
	 	this.removeItem(ticket);
	 });

	 this._EVENT.subscribe('accounting:disbursment',(request)=>{
	 	//alert("just enter to envent subscribe");
	 	console.log("data",request[0].ticket);
	 	//alert(request[0].ticket);
	 	this.removeItem1(request);
	 });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DecaissementPage');
	  //this._SYGALIN.loadingPresent("Chargement de la liste ");
    this.DecaissementToTreat();
	  /*this._EVENT.subscribe('treat:alldisbursment', (decaissement)=>{
		  console.log('disbursment VALIDATED!!!!!');
		  console.log('justif: ', decaissement);
		  this.removeItem(decaissement);
		  if (!this.Decaissements.length) {
			  this.DecaissementToTreat();
		  }
	  });*/
  }

	DecaissementToTreat(event?:any):void {
		this._SYGALIN.loadingPresent("Chargement de la liste ");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		let that = this;
		this._SYGALIN.query('disbursementToTreat/', postData).then(res => {
			that.Decaissements = res;
			//console.log("messsssage",res);
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

	openDisbursementDetail(idDisbursment:any,IdT?:any):void{
		this._SYGALIN.loadingPresent("Chargement de la liste ");
		let link:string='';
		if (this._SYGALIN.isCOMPTAG()){
			link='openDisbursementDetail/'+ idDisbursment + '/'+ IdT+'/';
		} else {
			link='openDisbursementDetail/'+ idDisbursment;
		}

		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		let that = this;
		this._SYGALIN.query(link, postData).then(res => {
			that.DetailsDisbursment = res[1] ;
			that.boutiques = res[0] ;
			that.departement=res[2];
			that.planComptable=res[3];
			that.journal=res[4];
			console.log("all data journal ",res[4]);
			that._SYGALIN.loadingDismiss();
			if(this._SYGALIN.isCOMPTAG()){
				console.log("I am accountant",res[1]);
				this.navCtrl.push("AccountingAssignmentPage",{ data:that.DetailsDisbursment,departement:that.departement,planComptable:that.planComptable,boutiques:that.boutiques,journal:this.journal,ticket:this.Decaissements[0].num});
				return;
			}else {
				if (that._SYGALIN.isDGEN()|| this._SYGALIN.isPDG()){
					that.openModdalValidate(that.DetailsDisbursment,that.boutiques);
				} else {
					that.openModdal(that.DetailsDisbursment,that.boutiques);
				}
			}
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	openModdal(details:any,boutiques ?:any){

		let profileModal = this.modalCtrl.create(DisbursmentModal,{req:details,boutique:boutiques});
		profileModal.onDidDismiss(data => {
			if (data){
				if (data.type==1){
					this.boutique=data.message;
					let idTicket:any=data.decaissement.ticket;
					let idDis:any=data.decaissement.decaissement;
					//this.confirmFinancialDisbursement1(this.boutique,'motif',idTicket,idDis);
					//console.log("mon test " + data.message);
					this.removeItem(data.decaissement);
					if (this.Decaissements.length) {
						this.DecaissementToTreat();
					}
				} else if (data.type==0)
				{
					this.removeItem(data.decaissement);
					if (this.Decaissements.length) {
						this.DecaissementToTreat();
					}
				}

			}
		});
		profileModal.present();
	}
	openModdalValidate(details:any,boutiques ?:any){

		let profileModal = this.modalCtrl.create(ValidDisbursmentModal,{req:details,boutique:boutiques});
		profileModal.onDidDismiss(data => {
			if (data){
				if (data.type==1){
					this.boutique=data.message;
					let idTicket:any=data.decaissement.ticket;
					let idDis:any=data.decaissement.decaissement;
					this.confirmFinancialDisbursement1(this.boutique,'motif',idTicket,idDis);
				} else if (data.type==0)
				{
					console.log("valeur decaissement", data.decaissement);
					//this.removeItem(data.decaissement);
					if (this.Decaissements.length) {
						this.DecaissementToTreat();
					}
				}

			}
		});
		profileModal.present();
	}

	removeItem(item) {
		let pos = this.Decaissements.map(function (e) {
			return e.ticket;
		}).indexOf(item);
		this.Decaissements.splice(pos, 1);
	}

	removeItem1(item) {
		let pos = this.Decaissements.map(function (e) {
			return e.ticket;
		}).indexOf(item[0].ticket);
		this.Decaissements.splice(pos, 1);
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

	confirmFinancialDisbursement1(boutique:any,motif:any,idTicket:any,idDis:any):void {
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('boutique', boutique);
		postData.append('motif', motif);
		postData.append('idTick',idTicket);
		postData.append('idDis',idDis);
		let that = this;
		this._SYGALIN.query('confirmFinancialDisbursement1/', postData).then(res => {
			console.log(res);
			//that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
		}).catch(error => {
			console.log(error);
			//that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	justifDfin(request:any):void {
  		console.log("justif dfin");
		this._SYGALIN.loadingPresent("Chargement de la liste ");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		let that = this;
		this._SYGALIN.query('justifDfin/'+request.id, postData).then(res => {
			console.log(res);
			let justifDfin=res;
			that._SYGALIN.loadingDismiss();
			that.navCtrl.push('JustifDisbursmentPage',{justifDfin:justifDfin});
			//that._SYGALIN.presentToast(res.message, res.type, 4000);
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	reorienting(request:any):void {
  	console.log("reorienting");
		this._SYGALIN.loadingPresent("Traitement ...");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		let that = this;
		this._SYGALIN.query('reorienting/'+request.id, postData).then(res => {
			//console.log(res);
			that.Decaissements = res[1];
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res[0].message, res[0].type, 4000);
			if(res[0].type=="success"){
				that.DecaissementToTreat();
			}
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	doRefresh(event) {
  		this.DecaissementToTreat(event);
	}

	comptag(r: any) {
		this.navCtrl.push("AccountingAssignmentPage",{data:r});
	}

	openDisbursementDetail1(id?: any, ticket?: any) {
		console.log("zezezezezezeze");
	}

	openAccountingJustifie(id: any) {
		this.navCtrl.push("AccountingJustifiePage",{ticket:id})
	}
}

@Component({
	selector: 'page-Disbursment-modal',
	templateUrl: 'Disbursment-modal.html',
})
export class DisbursmentModal {
	formgroup: FormGroup;
	formgroup_gen: FormGroup;
	message:any;
	Decaissements_detail:any;
	boutiques:any;
	img:any;
	Shop:any;
	montant:any;

	constructor(public _SYGALIN: GlobalProvider,
				public navparam:NavParams,
				public navCtrl :NavController,
				public _ALERT: AlertController,
				public navParams: NavParams,
				public _VIEW: ViewController) {
		this.Decaissements_detail = navParams.get('req');
		this.boutiques = navParams.get('boutique');
	}

	ngOnInit(){
		this.formgroup = new FormGroup({
			Shop: new FormControl('', [Validators.required])
		});
		this.formgroup_gen=new FormGroup({
			montant: new FormControl('',[Validators.required])
		});
	}

	populateForm():void {
		this.Decaissements_detail.forEach((elt,index)=>{
			let montant='montant_'+(index+1);
			this.formgroup_gen.addControl(montant, new FormControl(elt.montant));
		})
	}

	ionViewDidLoad(){
		this.populateForm();
	}

	setForm(decaissement:any){
		let mesages=this.formgroup.controls['Shop'].value;
		let valeur={
			message:mesages,
			decaissement:decaissement,
			type: 1,
		};
		this._VIEW.dismiss(valeur);
	}

	validateDisbursment():void {

		this.populateForm();

		/*let amount=this.formgroup_gen.controls['montant'].value;
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('boutique', cuser.shop);
		let that = this;
		this._SYGALIN.query('confirmFinancialDisbursement1/', postData).then(res => {
			console.log(res);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})

		console.log(amount);*/
	}

	inv(reqData:any){
		let data={
			decaissement:reqData,
			type:0,
		};
		this._VIEW.dismiss(data);
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


	invalidate(decaissementsDetailElement: any,message ?:any) {
		console.log("invalidation du decaisement infirmDisbursement ");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('motif', message);
		postData.append('ticket', decaissementsDetailElement.ticket);
		let that = this;
		this._SYGALIN.query('infirmDisbursement/', postData).then(res => {
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
			//console.log('invalidate aaaa',decaissementsDetailElement);
			that.inv(decaissementsDetailElement);

		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	confirmFinancialDisbursement1(boutique:any,motif:any,idTicket:any,idDis:any,dis?:any):void {
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('boutique', boutique);
		postData.append('motif', motif);
		postData.append('idTick',idTicket);
		postData.append('idDis',idDis);
		let that = this;
		this._SYGALIN.query('confirmFinancialDisbursement1/', postData).then(res => {
			console.log(res);
			//that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
			if (res.type=="success"){
				that.setForm(dis);
			}
		}).catch(error => {
			console.log(error);
			//that._SYGALIN.loadingDismiss();
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
			message: 'Voulez-vous vraiment ' + msg + ' ce decaissement ? Cette opération est irréversible...',
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
							console.log('test');
						} else {
							console.log('test');
							console.log(request);
							this.presentPrompt(request);
						}
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
							this.invalidate(request, data.motivation);

						} else {
							return false;
						}
					}
				}
			]
		});
		alert.present();
	}


	invalidField1(field: string)
	{
		return this.formgroup_gen.controls[field].invalid && (this.formgroup_gen.controls[field].dirty || this.formgroup_gen.controls[field].touched);
	}

	validField1(field: string)
	{
		return this.formgroup_gen.controls[field].valid && (this.formgroup_gen.controls[field].dirty || this.formgroup_gen.controls[field].touched);
	}

	call(decaissementsDetailElement: any) {
		this.confirmFinancialDisbursement1(this.formgroup.controls['Shop'].value,'motif',decaissementsDetailElement.ticket,decaissementsDetailElement.decaissement,decaissementsDetailElement);
	}
}





@Component({
	selector: 'page-Disbursment-modal',
	templateUrl: 'Validate-disbursment-modal.html',
})
export class ValidDisbursmentModal {
	formgroup: FormGroup;
	formgroup_gen: FormGroup;
	message:any;
	Decaissements_detail:any;
	boutiques:any;
	img:any;
	Shop:any;
	montant:any;
	montanTotal:any;
	journal:any;

	constructor(public _SYGALIN: GlobalProvider,
				public navparam:NavParams,
				public navCtrl :NavController,
				public _ALERT: AlertController,
				public navParams: NavParams,
				public _VIEW: ViewController) {
		this.Decaissements_detail = navParams.get('req');
		this.boutiques = navParams.get('boutique');
		console.log(this.Decaissements_detail);
	}

	ngOnInit(){
		this.formgroup = new FormGroup({
			Shop: new FormControl('', [Validators.required])
		});
		this.formgroup_gen=new FormGroup({
			montant: new FormControl('',[Validators.required])
		});
		this.populateForm();
	}

	populateForm():void {
		var total=0;
		this.Decaissements_detail.forEach((elt,index)=>{
			let montant='montant_'+(index+1);
			this.formgroup_gen.addControl(montant, new FormControl(elt.montant));
			total=parseInt(elt.montant) + total;
		});
		this.montanTotal=total;
	}

	ionViewDidLoad(){
		this.populateForm();
	}

	setForm(decaissement:any){
		let mesages=this.formgroup.controls['Shop'].value;
		let valeur={
			message:mesages,
			decaisement:decaissement,
			type: 1,
		};
		this._VIEW.dismiss(valeur);
	}

	validateDisbursment(motif:any):void {
		this._SYGALIN.loadingPresent("Traitement ");
		let amount=this.formgroup_gen.controls['montant'].value;
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('boutique', cuser.shop);
		postData.append('idDis', this.Decaissements_detail[0].decaissement);
		postData.append('idTick', this.Decaissements_detail[0].ticket);
		postData.append('montantT', this.montanTotal);
		postData.append('motif', motif);

		this.Decaissements_detail.forEach((elt,index)=>{
			let montant='montant_'+(index+1);
			let motif='motivation_'+(index+1);
			let idDT='idDT_'+(index+1);
			postData.append(montant,this.formgroup_gen.controls[montant].value);
			postData.append(motif,elt.objet);
			postData.append(idDT,elt.id);
		});
		let that = this;
		this._SYGALIN.query('confirmFinancialDisbursement1/', postData).then(res => {
			console.log(res);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
			that.inv(this.Decaissements_detail[0]);
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	inv(reqData:any){
		console.log('req data dismiss',reqData);
		let data={
			decaissement:reqData,
			type:0,
		};
		this._VIEW.dismiss(data);
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

	invalidate(decaissementsDetailElement: any,message ?:any) {
		this._SYGALIN.loadingPresent("Traitment ... ");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('motif', message);
		postData.append('ticket', decaissementsDetailElement.ticket);
		let that = this;
		this._SYGALIN.query('infirmDisbursement/', postData).then(res => {
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
			that.inv(decaissementsDetailElement);
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
			message: 'Voulez-vous vraiment ' + msg + ' ce decaissement ? Cette opération est irréversible...',
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
							console.log('test');
						} else {
							console.log('test');
							console.log(request);
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
		}else{
			title="Commentaire";
			placeholder=" votre Consigne ici...";
			texOK="OK";
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
							this.invalidate(request,data.motivation);
						} else{
							this.validateDisbursment(data.motivation);
						}
					}
				}
			]
		});
		alert.present();
	}

	invalidField1(field: string)
	{
		return this.formgroup_gen.controls[field].invalid && (this.formgroup_gen.controls[field].dirty || this.formgroup_gen.controls[field].touched);
	}

	validField1(field: string)
	{
		return this.formgroup_gen.controls[field].valid && (this.formgroup_gen.controls[field].dirty || this.formgroup_gen.controls[field].touched);
	}

	refrech() {
		console.log('ok');
		let total=0;
		this.Decaissements_detail.forEach((elt,index)=>{
			let montant='montant_'+(index+1);
			total=parseInt(this.formgroup_gen.controls[montant].value) + total;
		});
		this.montanTotal=total;
	}
}
