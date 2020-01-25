import { Component } from '@angular/core';
import {
	AlertController,
	Events,
	IonicPage,
	ModalController,
	NavController,
	NavParams,
	ViewController
} from 'ionic-angular';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {GlobalProvider} from "../../providers/global/global";
import {FormGroup, Validators, FormControl} from '@angular/forms';



@IonicPage()
@Component({
  selector: 'page-mes-aides-dsi',
  templateUrl: 'mes-aides-dsi.html',
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
export class MesAidesDsiPage {
	formgroup: FormGroup;
	helpQuery:any;
	pj:any;
	img:any;
	mess:any;
	dept:any;
	userDept:any;
	departement:string;
	responses:any;
	toJustif:any;
	idReq:number;
	justifFile: any;
	issetFile: boolean=false;
	file: any;
	fileTypes: any;
	labelJustif: any;
	aa:any;

  constructor(public navCtrl: NavController,
			  public _SYGALIN: GlobalProvider,
			  private alertCtrl: AlertController,
			  public modalCtrl: ModalController,
			  public _EVENT: Events,
			  public navParams: NavParams)
  {
	  this.helpQuery=this.navParams.get('detail');
	  this.dept=this.navParams.get('dept');
	  this.userDept=this.navParams.get('userDept');
	  this.idReq=this.navParams.get('idReq');
	  this.responses=this.navParams.get('responses');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MesAidesDsiPage');
      //this._SYGALIN.loadingPresent("Chargement de la liste");
	  this.labelJustif="Cliquer ici pour renseigner le fichier...";
	  this.helpQuery=this.navParams.get('detail');
	  this.dept=this.navParams.get('dept');
	  this.userDept=this.navParams.get('userDept');
	  this.responses=this.navParams.get('responses');
	  this.idReq=this.navParams.get('idReq');
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
	  console.log(this.responses);
	  console.log("okookokokokkoko");

  }
  ngOnInit(){
	  this.formgroup = new FormGroup({
		  departement: new FormControl('', [Validators.required])
	  });
  }
  presentAlert(data:any,type?:any) {
  	let titre="Message";
		let alert = this.alertCtrl.create({
			title: titre,
			message: data,
			buttons: ['ok']
		});
		alert.present();
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

  presentPrompt(request: any,type?:string) {
  	let titre="Votre réponse (Obligatoire)";
	 if(type=='orienter' && !this.formgroup.value['departement'] ){
  		let atention=this.alertCtrl.create({
			title: 'ATTENTION!',
			subTitle: 'Bien vouloir choisir le departement pour orientation!',
			buttons: ['OK']
		});
  		atention.present();
	}else {
		 if (type=="reject") {
			 titre = "Entrez le motif (obligatoire)";
		 }
		if(type=="orienter"){
			titre="Votre Commentaire.";
		}
		let alert = this.alertCtrl.create({
			title: titre,
			inputs: [
				{
					name: 'message',
					placeholder: 'Rédigez votre message ici...'
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
					text: 'Envoyer',
					handler: data => {
						if (data.message !== null && data.message!== undefined && data.message !== "") {
							//console.log(data.message);
							if (type=="reject"){
								this.treatRequests(request,'reject',data.message);
							}else if(type=="orienter") {
								console.log("votre commentaire:"+ data.message);
								this.orienter(request,data.message);
							}else{
								this.sendMessage(request,data.message);
							}

						} else if (type=="orienter") {
							this.orienter(request,data.message);
						} else {
							return false;
						}
					}
				}
			]
		});
		alert.present();
	}

	}

	sendMessage(req:any,message:any){

		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('dept_id', cuser.dept);
		postData.append('idReq', req.id);
		postData.append('message', message);
		let that = this;
		this._SYGALIN.query('answerRequest/', postData).then(res => {
			console.log(res);
			//that.navCtrl.popTo('ReqDsiPage');
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	getUrlFile(fileName){
		console.log('load cga img');
		console.log(fileName);
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('file', fileName);
		postData.append('folder', 'pj-requettes-dsi');
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

	orienter(req:any, commentaire ?:any){
  	console.log(req);
		/*let test=this.formgroup.value['departement'];
  		console.log(test);*/
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('idTick', req.ticket);
		postData.append('idReq', req.id);
		postData.append('motif', commentaire);
		postData.append('departement',this.formgroup.value['departement'] );
		let that = this;
		this._SYGALIN.query('nextUser/', postData).then(res => {
			console.log(res);

			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
			if (res.type=='success'){
				that.navCtrl.pop();
				that._EVENT.publish('DSIreq:closed', req);
			}
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	treatRequests(req:any,type?:any,motif?:string){
		console.log(req);
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('idTick', req.ticket);
		postData.append('idReq', req.id);
		postData.append('motif', motif);
		let that = this;
		this._SYGALIN.query('validateRequest/reject', postData).then(res => {
			console.log(res);

			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
			if (res.type=='success'){
				that.navCtrl.pop();
				that._EVENT.publish('DSIreq:closed', req);
			}
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	suspendRequest(req:any,action?:any,idReq?:any,ticket?:any){
  		let url="";
  		if (action=="close"){
  			url="suspendRequest/"+action+'/'+req.id+'/'+req.ticket;
		}else if (action=="suspend" || action=="resume" ){
			url="suspendRequest/"+action+'/'+req.id;
		}
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('idTick', req.ticket);
		postData.append('idReq', req.id);
		let that = this;
		this._SYGALIN.query(url, postData).then(res => {
			console.log(res);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);
			if (res.type=='success'){
				if (action=='close' || action=="suspend" || action=="resume") {
					that._EVENT.publish('DSIreq:closed', req);
				}
				that.navCtrl.pop();
			}
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}


  test(req?:any){

	  let profileModal = this.modalCtrl.create(ReqDSIModal,{req:req});
	  profileModal.onDidDismiss(data => {
		  if (data){
			  this.mess=data.message;
			  this.sendMessage(req,data.message);
			  this.details();
		  }
	  });
	  profileModal.present();
  }

	doRefresh(event) {
		this.details(event);
	}
	details(event?:any){
		//this._SYGALIN.loadingPresent('Chargement de la liste ...');
		//this.buttonClick=true;
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('dept_id', cuser.dept);
		let that = this;
		this._SYGALIN.query('answerRequest/'+ that.idReq, postData).then(res => {
			//that.Dept=res[0] ;
			that.userDept=res[1] ;
			//that.reqDetail=res[2] ;
			that.responses=res[3] ;
			if (event) {
				event.complete();
				//that._SYGALIN.loadingDismiss();
			}else
				that._SYGALIN.loadingDismiss();
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

}




@Component({
	selector: 'page-reqDSI-modal',
	templateUrl: 'req-dsi-modal.html',
})

export class ReqDSIModal {
	formgroup: FormGroup;
	message:any;
	req:any;

	constructor(public _SYGALIN: GlobalProvider,
				public navparam:NavParams,
				public navParams: NavParams,
				public _VIEW: ViewController) {
		this.req = navParams.get('req');
	}

	ngOnInit() {
		this.formgroup = new FormGroup({
			message: new FormControl('', [Validators.required]),
		});
	}

	setForm(){
		let mesages=this.formgroup.controls['message'].value;
		let valeur={
			message:mesages,
			myId:this.req.id,
		};
		this._VIEW.dismiss(valeur);
	}

	dismiss(){
		this._VIEW.dismiss()
	}

}
