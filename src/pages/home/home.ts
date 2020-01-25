import {Component, ViewChild} from '@angular/core';
import {NavController, MenuController, PopoverController, IonicPage, Events,ActionSheetController } from 'ionic-angular';
import {NativeStorage} from '@ionic-native/native-storage';
import { Slides } from 'ionic-angular';

import {PopoverPage} from '../popover/popover';
import {GlobalProvider} from '../../providers/global/global';

@IonicPage()
@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	@ViewChild(Slides) slides: Slides;
	cuser: any;
	login: string;
	password: string;
	boutique: any;
	popover: any;
	actionOpen:boolean;
	constructor(
		public _SYGALIN: GlobalProvider,
		public popoverCtrl: PopoverController,
		public actionSheetCtrl: ActionSheetController,
		public events: Events,
		public nativeStorage: NativeStorage,
		public navCtrl: NavController,
		private menuCtrl: MenuController,
		public _EVENT: Events) {
		this.actionOpen=false;
		this.menuCtrl.close();
		events.subscribe('user:openActionsheet', () => {
			this.presentActionSheet(this._SYGALIN._MultipleAccounts,this._SYGALIN._FinalGrossiste)
		});
	}

	ionViewDidLoad() {
		this.menuCtrl.close();
	}

	presentPopover(myEvent) {
		this.popover = this.popoverCtrl.create(PopoverPage);
		this.popover.present({
			ev: myEvent
		});
		this._EVENT.subscribe('user:logout', () => {
       if (this.popover!==undefined || this.popover!==null)
			    this.popover.dismiss();
		});
	}

	mesReabonnements() {
		if(this._SYGALIN.isRFVI()){
			this.navCtrl.push("MesReaboPage", {page: 'toTreat'});
		}else {
			this.navCtrl.push("MesReaboPage", {page: 'forPDV'});
		}
	}

	mesRecrutements() {

		if(this._SYGALIN.isRFVI()){
			this.navCtrl.push("MesRecruPage", {page: 'toTreat'});
		}else {
			this.navCtrl.push("MesRecruPage", {page: 'forPDV'});
		}
	}

	mesMigrations() {

		if(this._SYGALIN.isRFVI()){
			this.navCtrl.push("MesMigrationsPage", {page: 'toTreat'});
		}else{
			this.navCtrl.push("MesMigrationsPage", {page: 'forPDV'});
		}
	}

	mesReabonnementsSvod(){

		if(this._SYGALIN.isRFVI()){
			this.navCtrl.push("MesReaboSvodPage", {page: 'toTreat'});
		}else{
			this.navCtrl.push("MesReaboSvodPage", {page: 'forPDV'});
		}
	}

	mesReq() {

		if(this._SYGALIN.isRFVI()){
			console.log("is rfvi grossiste");
			//this.navCtrl.push("MesMigrationsPage", {page: 'toTreat'});
		}else{
			this.navCtrl.push("MesReqgrossistePage", { page: 'forPDV'});
		}
	}

	newRecruitement() {
		this.navCtrl.push("RecruPage");
	}

	newRenewal() {
		this.navCtrl.push("ReaboPage");
	}

	newMigration() {
		this.navCtrl.push("MigrPage");
	}

	mesCommission() {
		this.navCtrl.push("CommissionPage");
	}

	seeDetails(type: string, sector: any,  cb: any=null) {
		console.log('sent id', sector, cb);
		this.navCtrl.push('DetailsStatsPage', {type: type, sec: sector, cb: cb});
	}

	cga(){
		console.log("load cga page");
		this.navCtrl.push('CgaPage');
	}

	cgaPre(){
		console.log("load cga page");
		this.navCtrl.push('CgaprePage');
	}

	rechPre(){
		console.log("load FinancialPage page");
		this.navCtrl.push('FinancialPage');
	}

	loadMemo(){
		console.log("load memo");
		this.navCtrl.push('MemoPage');
	}

	loadCashing() {
		console.log("load Cashing page");
		this.navCtrl.push('CashingPage');
	}

	mesDSI() {
		this.navCtrl.push('ReqDsiPage');
	}
	mesOdm(){
		this.navCtrl.push('MesOrdresDeMissionsPage',{page: 'toTreat'});
	}
	disbursement():void {
		this.navCtrl.push('DecaissementPage')
	}

	prospectOfDay() {
		this.navCtrl.push('MesProspectPage',{page: "ofDay"})
	}

	presentActionSheet(res,grossiste) {
		if (!this.actionOpen){
			this.actionOpen=true;
			console.log(res);
			let compte=[];
			res.forEach((cpt)=>{
				if (cpt.cuser!==this._SYGALIN.user.cuser){
					compte.push({
						text :cpt.cuser,
						handler: ()=>{
							this.actionOpen=false;
							this.setUserData(cpt,grossiste);
						}
					})
				}

			});
			compte.push({
				text: 'Cancel',
				role: 'cancel',
				handler: () => {
					this.actionOpen=false;
					console.log('Cancel clicked');
				}
			});
			const actionSheet = this.actionSheetCtrl.create({
				title: 'CHOIX DU COMPTE',
				buttons: compte,
			});
			actionSheet.present();
		}
	}

	setUserData(res:any,grossiste:any){
		if (res !== undefined && res !== null) {
			let uId = res.id;
			let uName = res.nom;
			let cuser = res.cuser;
			let rId = res.rId;
			let uRole = res.rRole;
			let tel = res.tel;
			let bId = res.boutique;
			let bType = res.bType;
			let bNom = res.bNom;
			let dept=res.dept;
			let gNom = res.nomGroupe;
			let numDist = res.numDist;
			let sector = res.secId;
			let sectorName = res.secNom;
			let SIMmarchand = res.respoSIM?res.respoSIM:res.ownSIM;
			let token=res.token;
			console.log('Mercant SIM : ', SIMmarchand);

			let userData = {
				'id': uId,
				'name': uName,
				'cuser': cuser,
				'role': rId,
				'roleName': uRole,
				'tel': tel,
				'shop': bId,
				'shopType': bType,
				'shopName': bNom,
				'groupName': gNom,
				'numDist': numDist,
				'sector': sector,
				'dept':dept,
				'sectorName': sectorName,
				'get': btoa(this.login),
				'right': btoa(this.password),
				'MercantSIM': SIMmarchand?SIMmarchand.split('/'):undefined,
				'token':token,
			};
			this._SYGALIN.setToken(res.token);
			this._SYGALIN.setCurUser(userData);
			this._EVENT.publish('user:connected', userData, grossiste);
			//this.navCtrl.setRoot(HomePage);
		}
	}

	Cmdb(){
		this.navCtrl.push("InitCmdBPage")
	}


}
