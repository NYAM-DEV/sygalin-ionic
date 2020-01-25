import { Component } from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, ViewController,Events} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";


@IonicPage()
@Component({
  selector: 'page-accounting-assignment',
  templateUrl: 'accounting-assignment.html',
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
export class AccountingAssignmentPage {
	Decaissements:any;
	IdDecaissements:any;
	img:any;
	departement:any;
	planComptable:any;
	boutiques:any;
	journal:any;
	montantJ:any;
	ticket:any;
	type:any;

  constructor(public navCtrl: NavController,
			  public _SYGALIN: GlobalProvider,
			  public _ALERT: AlertController,
			  public  events :Events,
			  public modalCtrl: ModalController,
			  public navParams: NavParams) {
  	//this.type=this.navParams.get("type");
  	this.Decaissements=this.navParams.get('data');
  	this.ticket=this.navParams.get('ticket');
  	console.log("decaissement",this.Decaissements);
  	this.departement=this.navParams.get('departement');
  	this.planComptable=this.navParams.get('planComptable');
  	this.boutiques=this.navParams.get('boutiques');
  	this.journal=this.navParams.get('journal');
  	console.log('liste des decaissements',this.Decaissements);

	 this.events.subscribe('detail:disbursment', (request_detail,type,amount) => {
		  console.log('Welcome to req detail', request_detail);
		  //this.removeReq(request_detail);
		  this.Decaissements.forEach((element)=>{
		  	if (element.id==request_detail.id) {
				element.taite=true;
			}
			  if ((type==true ) && (element.id==request_detail.id)){
				  element.montantM=Number(amount);
				  element.state=1;
				  this.montantJ +=Number(amount);
			  }
			  if ((type==false) && (element.id==request_detail.id)){
			  	element.state=-1;
			  }

		  });


	  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountingAssignmentPage');
    let totalM=0;
	  this.Decaissements.forEach((element)=>{
	  	if(element.montantM==null){
			element.taite=false;
		}else{
	  		totalM +=Number(element.montantM);
			element.taite=true;
		}
	  	if (element.state==-1){
	  		element.taite=true;
		}
	  	this.montantJ=totalM;

	  });
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
			console.log("mon image",res.url);
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
	openModal(r:any){
		let myModal = this.modalCtrl.create(AccountingModal,
			{ req:r,boutiques:this.boutiques,planComptable:this.planComptable,departement:this.departement,journal:this.journal});
		myModal.onDidDismiss(data => {
			console.log("modal closed !!!");
		});
		myModal.present();
	}

	openAcountingdetail(r: any) {
		this.navCtrl.push("AcountingDetailsPage",{ req:r,boutiques:this.boutiques,planComptable:this.planComptable,departement:this.departement,journal:this.journal,type:"normal"});
	}



	removeReq(item) :void {
		let pos = this.Decaissements.map(function (e) {
			return e.id;
		}).indexOf(item.id);
		this.Decaissements.splice(pos, 1);
		console.log("taille des justifs!!!!!",this.Decaissements.length);
	}

	valider(motif?:any) {
		this._SYGALIN.loadingPresent("Traitement ...",3000);
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('motif',motif);
		postData.append('idReq','idReq');
		postData.append('idTick','idReq');
		postData.append('idT',this.Decaissements[0].ticket);
		postData.append('idD',this.Decaissements[0].decaissement);
		postData.append('montantJ',this.montantJ);

		let that = this;
		this._SYGALIN.query('confirmFinancialDisbursementsByAccountant/', postData).then(res => {
			that._SYGALIN.presentToast(res.message, res.type, 4000);
			if (res.type=="success"){
				this.events.publish('accounting:disbursment',this.Decaissements);
				that.navCtrl.pop();
			}
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	invalider(motif?:any) {
		this._SYGALIN.loadingPresent("Traitement ...",3000);
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('motif',motif);
		postData.append('ticket',this.Decaissements[0].ticket);
		let that = this;
		this._SYGALIN.query('infirmDisbursement/', postData).then(res => {
			that._SYGALIN.presentToast(res.message, res.type, 4000);
			if (res.type=="success"){
				this.events.publish('accounting:disbursment',this.Decaissements);
				that.navCtrl.pop();
			}
		}).catch(error => {
			console.log(error);
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
							this.presentPrompt(request,"validate")
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
							this.invalider(data.motivation);
						} else{
							this.valider(data.motivation);
						}
					}
				}
			]
		});
		alert.present();
	}

	disbursmentdetailReaffect(){
  	alert('test');

		/*this._SYGALIN.loadingPresent("Chargement ...");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		let that = this;
		this._SYGALIN.query('disbursementDetailReaffect/'+this.IdDecaissements+"/"+this.ticket, postData).then(res => {
			that._SYGALIN.loadingDismiss();
			//that._SYGALIN.presentToast(res.message, res.type, 4000);
			console.log(res);
			console.log("res")
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})*/
	}



}




@Component({
	selector: 'page-accounting-assignment',
	templateUrl: 'accounting-modal.html',
})
export class AccountingModal{
	request_detail:any;
	departement:any;
	planComptable:any;
	boutiques:any;
	journal:any;
	formgroup: FormGroup;

	constructor(public _SYGALIN: GlobalProvider,
				public navCtrl :NavController,
				public _ALERT: AlertController,
				public _VIEW: ViewController,
				public navParams: NavParams) {
		this.request_detail = navParams.get('req');
		this.planComptable = navParams.get('planComptable');
		this.boutiques = navParams.get('boutiques');
		this.departement = navParams.get('departement');
		this.journal = navParams.get('journal');
	}
	ngOnInit(){
		this.formgroup = new FormGroup({
			motif: new FormControl(this.request_detail.objet, [Validators.required]),
			montant: new FormControl(this.request_detail.montant, [Validators.required]),
			departement: new FormControl('', [Validators.required]),
			boutique: new FormControl('', [Validators.required]),
			journal: new FormControl('', [Validators.required]),
			debit: new FormControl('', [Validators.required]),
			credit: new FormControl('', [Validators.required]),
		});
	}
	ionViewDidLoad(){
		this.populateForm();
	}

	populateForm():void{
		this.formgroup.addControl("motif", new FormControl(this.request_detail.objet));
	}

	dismiss(){
		this._VIEW.dismiss()
	}

}
