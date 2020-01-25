import {Component} from "@angular/core";
import {NavController, ToastController, MenuController, Events, Platform,ActionSheetController } from "ionic-angular";
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {HomePage} from '../home/home'
import {GlobalProvider} from "../../providers/global/global";
import {NativeStorage} from '@ionic-native/native-storage';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage {
	login: any;
	password: any;
	formgroup: FormGroup;
	nom: any;
	role: any;
	autoLogin: boolean=false;
	data: any = {};

	constructor(
				private platform: Platform,
				public _SYGALIN: GlobalProvider,
				public navCtrl: NavController,
				public menu: MenuController,
				public toast: ToastController,
				public actionSheetCtrl: ActionSheetController,
				public _EVENT: Events,
				public _STORAGE: NativeStorage) {
	}

	ngOnInit() {
		this.formgroup = new FormGroup({
			login: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
		});
	}

	ionViewWillEnter() {
		//let that = this;
		//this.menu.enable(false);
		this.platform.ready().then(()=>{
			this._STORAGE.getItem('sygalinUser')
				.then(
					data => {
/*						let postData=new FormData();
						postData.append('login', data.user.cuser);
						postData.append('pwd', data.user.password);
						that._SYGALIN.setBaseUrl(data.grossiste);
						that._SYGALIN.query('login/', postData, true)
							.then(res => {
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
									let gNom = res.nomGroupe;
									let numDist = res.numDist;
									let sector = res.secId;
									let sectorName = res.secNom;
									let SIMmarchand = res.respoSIM?res.respoSIM:res.ownSIM;
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
										'sectorName': sectorName,
										'MercantSIM': SIMmarchand?SIMmarchand.split('/'):undefined
									};
									that._SYGALIN.setToken(res.token);
									that._SYGALIN.setCurUser(userData);
									that._EVENT.publish('user:connected', userData, grossiste);
									that._SYGALIN.loadingDismiss();
									that.navCtrl.setRoot(HomePage);
								}
								else {
									that._SYGALIN.loadingDismiss();
									this._SYGALIN.presentToast("Login/Mot de passe incorrect (Code 101)", "danger", 6000);
									console.log('Erreur de connexion');
								}
							})
							.catch(error => {
								console.log(error);
								that._SYGALIN.loadingDismiss();
								this.presentToast("Une erreur interne est survenue (Code 102)", "warning");
							});
						that._SYGALIN.setCurUser(data);

						that._EVENT.publish('user:connected', data, Date.now());
						that.navCtrl.setRoot(HomePage);*/
						this.login=atob(data.user.get);
						this.password=atob(data.user.right);
						this.formgroup.controls.login.setValue(atob(data.user.get));
						this.formgroup.controls.password.setValue(atob(data.user.right));
						this.autoLogin=true;
						this.validation();
					},
					error => console.error(error)
				);
		});
	}

	ionViewDidEnter(){
		if (this.autoLogin){
			this.formgroup.controls.login.markAsTouched({
				onlySelf: true
			});
			this.formgroup.controls.password.markAsTouched({
				onlySelf: true
			});
		}
	}
	/*
	* Fonction de validation du formulaire de connexion
	*/

	validation() {
		if (this.formgroup.valid) {
			if (!this._SYGALIN.isOnline) {
				this._SYGALIN.presentToast("Impossible d'accéder à Internet. Vérifez que vous avez accès à Internet (Code 104)", "warning", 6000);
			} else {
				this._SYGALIN.loadingPresent("Connexion");
				let postData = new FormData();
				postData.append('login', this.login);
				postData.append('pwd', this.password);
				let that = this;
				let numdist=this.login.split('-');
				if (numdist.length==2){
					let part2=numdist[1].split('&');
					let grossiste=null;
					if (part2.length==2)
					{
						grossiste=this._SYGALIN.getDistributor(part2[0]);
					} else {
						grossiste=this._SYGALIN.getDistributor(numdist[1]);
					}
					if (grossiste)
					{
						this._SYGALIN._FinalGrossiste=grossiste;
						this._SYGALIN.setBaseUrl(grossiste);
						this._SYGALIN.query('login/', postData)
							.then(res => {
								console.log(res);
								that._SYGALIN.loadingDismiss();
								if(res.length>1){
									this._SYGALIN.setMUltipleAccounts(res);
									that.presentActionSheet(res,grossiste);
									return;
								}

								if (res[0] !== undefined && res[0] !== null) {
									let uId = res[0].id;
									let uName = res[0].nom;
									let cuser = res[0].cuser;
									let rId = res[0].rId;
									let uRole = res[0].rRole;
									let tel = res[0].tel;
									let bId = res[0].boutique;
									let bType = res[0].bType;
									let bNom = res[0].bNom;
									let dept=res[0].dept;
									let gNom = res[0].nomGroupe;
									let numDist = res[0].numDist;
									let sector = res[0].secId;
									let sectorName = res[0].secNom;
									let SIMmarchand = res[0].respoSIM?res[0].respoSIM:res[0].ownSIM;
									let token=res[0].token;
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
										'get': btoa(that.login),
										'right': btoa(that.password),
										'MercantSIM': SIMmarchand?SIMmarchand.split('/'):undefined,
										'token':token,
									};
									that._SYGALIN.setToken(res[0].token);
									that._SYGALIN.setCurUser(userData);
									that._EVENT.publish('user:connected', userData, grossiste);
									//that._SYGALIN.loadingDismiss();
									that.navCtrl.setRoot(HomePage);
								}
								else {
									that._SYGALIN.loadingDismiss();
									this._SYGALIN.presentToast("Login/Mot de passe incorrect (Code 101)", "danger", 6000);
									console.log('Erreur de connexion');
								}
							})
							.catch(error => {
								console.log(error);
								that._SYGALIN.loadingDismiss();
								if (this._SYGALIN.isHttps){
									this.presentToast("Tentative de connexion alternative ... ", "warning");
									this._SYGALIN.isHttps=!this._SYGALIN.isHttps;
									this.validation();
								}else {
									this.presentToast("Une erreur interne est survenue (Code 102)", "warning");
								}

							});
					}
					else {
						that._SYGALIN.loadingDismiss();
						this._SYGALIN.presentToast("Login/Mot de passe incorrect (Code 103)", "danger", 6000);
					}
				}
			//Récupération des infos du user dans la BD distante
			}
		} else {
			this._SYGALIN.presentToast("Veuillez renseigner le login et le mot de passe", "danger");
		}
	}


	presentToast(text: string, type: string = "info") {
		this.toast.create({
			message: text,
			duration: 3000,
			cssClass: "toast-" + type
		}).present();
	}

	presentActionSheet(res,grossiste) {
		let compte=[];
		res.forEach((cpt)=>{
			compte.push({
				text :cpt.cuser,
				handler: ()=>{
					this.setUserData(cpt,grossiste);
				}
			})
		});
		compte.push({
			text: 'Cancel',
			role: 'cancel',
			handler: () => {
				compte=[];
			}
		});
		const actionSheet = this.actionSheetCtrl.create({
			title: 'CHOIX DU COMPTE',
			buttons: compte,
		});
		actionSheet.present();
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
			this.navCtrl.setRoot(HomePage);
		}
	}

}
