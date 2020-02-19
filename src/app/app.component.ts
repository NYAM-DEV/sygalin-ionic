// RxJS
//import {ArrayObservable} from "rxjs/observable/ArrayObservable";
import {Component, ViewChild} from '@angular/core';
import {mobiscroll} from '@mobiscroll/angular-lite';
mobiscroll.settings = {
	lang: 'fr',
	theme: 'material'
};
import {
	Platform,
	Nav,
	MenuController,
	Events,
	AlertController
} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {LoginPage} from '../pages/login/login';
import {GlobalProvider} from '../providers/global/global';
import {SideMenuSettings} from '../shared/side-menu-content/models/side-menu-settings';
import {SideMenuOption} from '../shared/side-menu-content/models/side-menu-option';
import {SideMenuContentComponent} from '../shared/side-menu-content/side-menu-content.component';
import {NativeStorage} from '@ionic-native/native-storage';
import { App } from 'ionic-angular';


@Component({
	templateUrl: 'app.html'
})

export class MyApp {
	pages: Array<{ title: string, component: any, show: boolean, grades: Array<any> }>;
	names = [{
		text: 'Abigail Hodges',
		value: 1
	}, {
		text: 'Adam Robertson',
		value: 2
	}, {
		text: 'Adrian Mackay',
		value: 3
	}, {
		text: 'Adrian Springer',
		value: 4
	}
		// Showing partial data. Download full source.
	];

	public options: Array<SideMenuOption>;
	public sideMenuSettings: SideMenuSettings = {
		accordionMode: true,
		showSelectedOption: true,
		selectedOptionClass: 'active-side-menu-option'
	};

	infoUser: any;
	uNom: string;
	cuser: string;
	boutique: any;
	boutiqueNom: any;
	groupeNom: any;
	uRole: string;
	roleId: any;
	connected: boolean;
	public counter=0;
	APP_PAUSED_TIME: any;
	//APP_RESUMED_TIME: any;

	@ViewChild(Nav) nav: Nav;
	@ViewChild(SideMenuContentComponent) sideMenu: SideMenuContentComponent;

	rootPage: any = LoginPage;

	public onlineOffline: boolean = navigator.onLine;
	public previousState: boolean = true;
	public hasInternet: boolean = true;

	constructor(
			platform: Platform,
			statusBar: StatusBar,
			public menu: MenuController,
			splashScreen: SplashScreen,
			private menuCtrl: MenuController,
			public _EVENT: Events,
			public _SYGALIN: GlobalProvider,
			public _STORAGE: NativeStorage,
		        public _ALERT: AlertController,
		       // private _FINGER_AUTH: AndroidFingerprintAuth,
		        public app: App) {
		_EVENT.subscribe('user:connected', (udata, grossiste) => {
			this._STORAGE.setItem('sygalinUser', {user: udata, grossiste: grossiste})
				.then(
					() => console.log('Stored item!'),
					error => console.error('Erreur de stockage', error)
				);
			console.log('user:connected');
			console.log(udata);
			//let role = Number(udata.role);
			this.uNom = udata.name;
			this.boutique = udata.shop;
			this.boutiqueNom = udata.shopName;
			this.groupeNom = udata.groupName;
			this.cuser = udata.cuser;
			this.uRole = udata.roleName;
			this.roleId = udata.role;

			this.initializeOptions();
		});

		_EVENT.subscribe('user:logout', () => {
			this._SYGALIN.logout();
			this.nav.setRoot(LoginPage);
		});

		_EVENT.subscribe('prospet:ville', () => {
			this.getville_quartier();
		});

		/*window.addEventListener('offline', () => {
			console.log('-------------------> YOU ARE OFFLINE <------------------');
			this._SYGALIN.isOnline=false;
			this.onlineOffline=false;
		});
		window.addEventListener('online', () => {
			console.log('-------------------> YOU ARE NOW ONLINE <------------------');
			this._SYGALIN.isOnline=true;
			this.onlineOffline=true;
		});*/

		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			// statusBar.styleDefault();
			console.log('************   PLATFORM READY ***************');

			/*_NETWORK.onDisconnect().subscribe(() => {
				if (this.previousState===true){
					console.log('-------------------> YOU ARE OFFLINE <------------------');
					this._SYGALIN.presentToast("Vous êtes hors-ligne", "danger");
					this._SYGALIN.isOnline=false;
					this.onlineOffline=false;
				}
				this.previousState=false;
			});

			_NETWORK.onConnect().subscribe(() => {
				if (this.previousState===false){
					console.log('-------------------> YOU ARE NOW ONLINE <------------------');
					this._SYGALIN.presentToast("Vous êtes en ligne", "success");
					this._SYGALIN.isOnline=true;
					this.onlineOffline=true;
					setTimeout(() => {
						if (_NETWORK.type === 'wifi') {
							console.log('we got a wifi connection, woohoo!');
						}
					}, 3000);
				}
				this.previousState=true;
			});

			window.addEventListener('offline', () => {
				console.log('-------------------> YOU ARE OFFLINE <------------------');
				this._SYGALIN.isOnline=false;
				this.onlineOffline=false;
			});
			window.addEventListener('online', () => {
				console.log('-------------------> YOU ARE NOW ONLINE <------------------');
				this._SYGALIN.isOnline=true;
				this.onlineOffline=true;
			});*/

			
			//OneSignal
			if (platform.is('cordova')) {
        
     
				//code pour gerer les notification
				var notificationOpenedCallback = function(jsonData) {
				  console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
				};
			
				window["plugins"].OneSignal
				  .startInit("3f1c6646-3b24-471d-8442-a67f94189155", "267579579268")
				  .handleNotificationOpened(notificationOpenedCallback)
				  .handleNotificationReceived().subscribe(data => {
					let msg = data.payload.body;
					let title = data.payload.title;
					let additionalData = data.payload.additionalData;
					this.showAlert(title, msg, additionalData.task);
				  })
				  .endInit();
			   }

			statusBar.backgroundColorByHexString('#3F51B5');
			splashScreen.hide();
			this.initializeOptions();

			platform.registerBackButtonAction(() => {
				let nav = this.app.getActiveNavs()[0];
				let activeView = nav.getActive();
				if(activeView.name === 'HomePage') {
					if (nav.canGoBack()){
						nav.pop();
					} else {
						const alert = this._ALERT.create({
							title: 'Fermer l\'application',
							message: 'Vous avez appuyé sur le bouton retour. Voulez-vous fermer l\'application ?',
							buttons: [{
								text: 'Annuler',
								role: 'cancel',
								handler: () => {
									//this.nav.setRoot('HomePage');
									console.log('cancelled');
									//console.log('** Saída do App Cancelada! **');
								}
							},{
								text: 'Oui, fermer',
								handler: () => {
									platform.exitApp();
								}
							}]
						});
						alert.present();
					}
				}
				else if (activeView.name === 'LoginPage'){
					return;
				}
				else {
					if (nav.canGoBack()){
						nav.pop();
					} else {
						/*if (this.counter == 0) {
							this.counter++;
							this.presentToast();
							setTimeout(() => { this.counter = 0 }, 3000)
						} else {
							// console.log("exitapp");
							platform.exitApp();
						}*/
						this.nav.setRoot('HomePage');
					}
				}
			}, 0);
		});

		
		platform.resume.subscribe((result) => {
			this._SYGALIN._AppPaused=false;
			/*let NOW=this._SYGALIN.momentjs();
			let diff=NOW.diff(this.APP_PAUSED_TIME, "seconds");
			console.log(diff);
			if (diff>10){
				this._FINGER_AUTH.isAvailable()
					.then((result)=> {
						if(result.isAvailable){
							// it is available
							this._FINGER_AUTH.encrypt({ clientId: 'myAppName', username: 'myUsername', password: 'myPassword' })
								.then(result => {
									if (result.withFingerprint) {
										/!*console.log('Successfully encrypted credentials.');
										console.log('Encrypted credentials: ' + result.token);*!/
										this._SYGALIN.presentToast('Encrypted credentials: ' + result.token, 'success');
									} else if (result.withBackup) {
										this._SYGALIN.presentToast('Successfully authenticated with backup password!', 'success');
									} else this._SYGALIN.presentToast('Didnt authenticate', 'danger');
								})
								.catch(error => {
									if (error === this._FINGER_AUTH.ERRORS.FINGERPRINT_CANCELLED) {
										this._SYGALIN.presentToast('Fingerprint authentication cancelled', 'danger');
									} else console.error(error)
								});

						} else {
							// fingerprint auth isn't available
						}
					})
					.catch(error => console.error(error));
			}*/
		});

		platform.pause.subscribe((result) => {
			this.APP_PAUSED_TIME=this._SYGALIN.momentjs();
			this._SYGALIN._AppPaused=true;
		});


	}
	//OneSignal
	async showAlert(title, msg, task) {
		const alert = await this._ALERT.create({
		  title: title,
		  message: msg,
		  buttons: [
			{
			  text: `Action: ${task}`,
			  handler: () => {
				// E.g: Navigate to a specific screen
			  }
			}
		  ]
		})
		alert.present();
	  }

	public onOptionSelected(option: SideMenuOption): void {
		this.menuCtrl.close().then(() => {
			const params = option.custom && option.custom.data;
			if (params) {
				this.nav.setRoot(option.component, option.custom.data);
			} else {
				this.nav.setRoot(option.component);
			}
		});
	}

	public collapseMenuOptions(): void {
		this.sideMenu.collapseAllOptions();
	}

	onNavigate(page) {
		/* this.rootPage = page; */
		this.menuCtrl.close();
		this.nav.push(page.component);
	}

	editProfile() {
		this.menuCtrl.close();
		this.nav.push('ProfilPage');
	}

	private initializeOptions(): void {
		this.options = new Array<SideMenuOption>();
		/**
		 * DEPARTEMENTS
		 */

		let reaboDept = {
			iconName: 'contact',
			displayText: 'Dépt. réabo. & S.A.V',
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleRFVI(), GlobalProvider.roleRAA(), GlobalProvider.roleCM(), GlobalProvider.roleRESPO_AG()]
			},
			suboptions: []
		};

		let comDept = {
			iconName: 'cart',
			displayText: 'Dépt.  commercial & Marketing',
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()]
			},
			suboptions: []
		};

		let techDept = {
			iconName: 'build',
			displayText: 'Dépt. technique',
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(),GlobalProvider.roleRFVI()]
			},
			suboptions: []
		};

		let dfinDept = {
			iconName:'logo-usd',
			displayText: 'Dépt. finances',
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleDFIN(), GlobalProvider.roleRAA()],
			},
			suboptions: []
		};

		let dlogDept = {
			iconName:'bus',
			displayText: 'Dépt. logistique',
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()]
			},
			suboptions: []
		};

		let comptaDept = {
			iconName:'trending-up',
			displayText: 'Dépt. comptabilité & fisc.',
			custom: {
				allowed: [GlobalProvider.roleDFIN(), GlobalProvider.roleCOMPTAG(), GlobalProvider.rolePDG()]
			},
			suboptions: []
		};

		let creditDept = {
			iconName:'card',
			displayText: 'Dépt. credit & com. manager',
			custom: {
				allowed: [GlobalProvider.roleDFIN(), GlobalProvider.roleCM(), GlobalProvider.roleCONTROL(), GlobalProvider.roleSUPER]
			},
			suboptions: []
		};

		let dsiDept = {
			iconName:'card',
			displayText: 'Dépt. système d\'information',
			custom: {
				allowed: [GlobalProvider.roleDFIN(), GlobalProvider.roleCM(), GlobalProvider.roleCONTROL()]
			},
			suboptions: []
		};

		/**
		 *  MENUS
		 */

		let recruOption = {
			iconName: 'person-add',
			displayText: 'Recrutements',
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()]
			},
			suboptions: []
		};

		let recruFrigoOption = {
			iconName: 'person-add',
			displayText: 'Recrutements Frigo',
			custom: {
				allowed: [ GlobalProvider.roleFVI(), GlobalProvider.roleRFVI()]
			},
			suboptions: []
		};

		let reaboOption = {
			iconName: 'refresh',
			displayText: 'Réabonnements Canal',
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()]
			},
			suboptions: []
		};

		let refilprepedOption = {
			iconName: 'refresh',
			displayText: 'Recharge Prépayé',
			custom: {
				allowed: [GlobalProvider.roleRESPO_AG()]
			},
			suboptions: []
		};

		let migrOption = {
			iconName: 'swap',
			displayText: 'Migrations',
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()]
			},
			suboptions: []
		};

		let reaboSvodOption = {
			iconName: 'refresh',
			displayText: 'Réabonnements SVOD',
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleRAA(), GlobalProvider.roleRFVI()]
			},
			suboptions: []
		};

		let grossisteOption = {
			iconName: 'eye',
			displayText: 'Requêttes vers grossiste',
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleRFVI(), GlobalProvider.roleRAA(), GlobalProvider.roleCM()]
			},
			suboptions: []
		};

		let prospectOption = {
			iconName: 'contact',
			displayText: 'Prospect',
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()]
			},
			suboptions: []
		};

		let prestationOption = {
			iconName: 'construct',
			displayText: 'Prestation technique',
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(),GlobalProvider.roleRFVI()]
			},
			suboptions: []
		};

		let cMatOption = {
			iconName: 'send',
			displayText: 'Cmd. Mat. vers boutique',
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()]
			},
			suboptions: []
		};

		let odmOption = {
			iconName: 'jet',
			displayText: 'Ordre de mission',
			custom: {
				allowed: [GlobalProvider.roleDFIN(), GlobalProvider.roleCOMPTAG(), GlobalProvider.rolePDG(),]
			},
			suboptions: []
		};

		let reqrefOption = {
			iconName: 'logo-usd',
			displayText: 'Requette pour reference',
			custom: {
				allowed: [GlobalProvider.roleDFIN()]
			},
			suboptions: []
		};

		let rfinOption = {
			iconName: 'logo-usd',
			displayText: 'Recharge compte financier',
			custom: {
				allowed: [GlobalProvider.roleDFIN(), GlobalProvider.roleRAA(),GlobalProvider.roleAAD(),GlobalProvider.roleCM()]
			},
			suboptions: []
		};

		
		

		let memoOption = {
			iconName: 'card',
			displayText: 'Mémos',
			custom: {
				allowed: [GlobalProvider.roleDFIN(), GlobalProvider.roleCONTROL(), GlobalProvider.roleSUPER(),]
			},
			suboptions: []
		};

		let cgaOption = {
			iconName: 'card',
			displayText: 'Recharge CGA',
			custom: {
				allowed: [GlobalProvider.roleDFIN(), GlobalProvider.roleCM(), GlobalProvider.roleCONTROL(), GlobalProvider.roleSUPER()]
			},
			suboptions: []
		};

		let cashingOption = {
			iconName: 'card',
			displayText: 'Versement',
			custom: {
				allowed: [GlobalProvider.roleDFIN()]
			},
			suboptions: []
		};

		/**
		 * SOUS-MENUS
		 */

		let refilperpedSub = [
			{
				iconName: 'add-circle',
				displayText: 'Recharge Prépayé',
				component: 'RefilprepedPage',
				custom: {
					allowed: [GlobalProvider.roleAAD()]
				},
			},
			{
				iconName: 'radio-button-off',
				displayText: 'À traiter',
				//badge: this._SYGALIN.unreadReaboObservable,
				component: 'MesReaboPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'toTreat'
					}
				},
			},
			/*{
				iconName: 'checkmark-circle-outline',
				displayText: 'Traités',
				component: 'MesReaboPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'treated'
					}
				},
			},
			{
				iconName: 'remove-circle-outline',
				displayText: 'Rejetés',
				component: 'MesReaboPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'rejected'
					}
				},
			}*/
		];


		let reaboSub = [
			{
				iconName: 'add-circle',
				displayText: 'Nouveau réabonnement',
				component: 'ReaboPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()]
				},
			},
			{
				iconName: 'add-circle',
				displayText: 'Nouvel ugrade',
				component: 'UpgradePage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()]
				},
			},
			{
				iconName: 'list',
				displayText: 'Mes réabonnements',
				component: 'MesReaboPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()],
					data: {
						page: 'forPDV'
					}
				},
			},
			{
				iconName: 'pulse',
				displayText: 'Performances réabonnement',
				component: 'PerfReaboPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()]
				},
			},
			{
				iconName: 'radio-button-off',
				displayText: 'À traiter',
				badge: this._SYGALIN.unreadReaboObservable,
				component: 'MesReaboPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'toTreat'
					}
				},
			},
			{
				iconName: 'checkmark-circle-outline',
				displayText: 'Traités',
				component: 'MesReaboPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'treated'
					}
				},
			},
			{
				iconName: 'remove-circle-outline',
				displayText: 'Rejetés',
				component: 'MesReaboPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'rejected'
					}
				},
			}
		];

		let reaboSvodSub = [
			{
				iconName: 'add-circle',
				displayText: 'Nouveau réab. SVOD',
				component: 'ReaboSvodPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()]
				},
			},
			{
				iconName: 'list',
				displayText: 'Mes réabonnements',
				component: 'MesReaboSvodPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()],
					data: {
						page: 'forPDV'
					}
				},
			},
			{
				iconName: 'pulse',
				displayText: 'Mes Performances SVOD',
				component: 'PerfReaboSvodPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()]
				},
			},
			{
				iconName: 'radio-button-off',
				displayText: 'À traiter',
				badge: this._SYGALIN.unreadReaboSvodObservable,
				component: 'MesReaboSvodPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'toTreat'
					}
				},
			},
			{
				iconName: 'checkmark-circle-outline',
				displayText: 'Traités',
				component: 'MesReaboSvodPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'treated'
					}
				},
			},
			{
				iconName: 'remove-circle-outline',
				displayText: 'Rejetés',
				component: 'MesReaboSvodPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'rejected'
					}
				},
			}
		];

		let migrSub = [
			{
				iconName: 'add-circle',
				displayText: 'Nouvelle migration',
				component: 'MigrPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()]
				},
			},
			{
				iconName: 'list',
				displayText: 'Mes migrations',
				component: 'MesMigrationsPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()],
					data: {
						page: 'forPDV'
					}
				},
			},
			{
				iconName: 'pulse',
				displayText: 'Performances migration',
				component: 'PerfMigrPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()]
				},
			},
			{
				iconName: 'radio-button-off',
				displayText: 'À traiter',
				badge: this._SYGALIN.unreadMigrObservable,
				component: 'MesMigrationsPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'toTreat'
					}
				},
			},
			{
				iconName: 'checkmark-circle-outline',
				displayText: 'Traités',
				component: 'MesMigrationsPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'treated'
					}
				},
			},
			{
				iconName: 'remove-circle-outline',
				displayText: 'Rejetés',
				component: 'MesMigrationsPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'rejected'
					}
				},
			}
		];

		let recruSub = [
			{
				iconName: 'add-circle',
				displayText: 'Ajouter',
				component: 'RecruPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()]
				}
			},
			{
				iconName: 'list',
				displayText: 'Mes recrutements',
				component: 'MesRecruPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()],
					data: {
						page: 'forPDV'
					}
				},
			},
			{
				iconName: 'pulse',
				displayText: 'Performances recrutement',
				component: 'PerfRecruPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()]
				},
			},
			{
				iconName: 'radio-button-off',
				displayText: 'À traiter',
				badge: this._SYGALIN.unreadRecruObservable,
				component: 'MesRecruPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'toTreat'
					}
				},
			},
			{
				iconName: 'checkmark-circle-outline',
				displayText: 'Traités',
				component: 'MesRecruPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'treated'
					}
				},
			},
			{
				iconName: 'remove-circle-outline',
				displayText: 'Rejetés',
				component: 'MesRecruPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'rejected'
					}
				},
			}
		];

		let recruFigoSub = [
			{
				iconName: 'add-circle',
				displayText: 'Ajouter',
				component: 'RecruFrigoPage',
				custom: {
					allowed: [ GlobalProvider.roleFVI()]
				}
			},
			{
				iconName: 'list',
				displayText: 'Mes recrutements',
				component: 'MesrecuFrigoPage',
				custom: {
					allowed: [ GlobalProvider.roleFVI()],
					data: {
						page: 'forPDV'
					}
				},
			},
			/*{
				iconName: 'pulse',
				displayText: 'Performances recrutement',
				component: 'PerfRecruPage',
				custom: {
					allowed: [ GlobalProvider.roleFVI(), GlobalProvider.roleRFVI()]
				},
			},*/
			{
				iconName: 'radio-button-off',
				displayText: 'À traiter',
				//badge: this._SYGALIN.unreadRecruObservable,
				component: 'MesrecuFrigoPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI()],
					data: {
						page: 'toTreat'
					}
				},
			},
			/*{
				iconName: 'checkmark-circle-outline',
				displayText: 'Traités',
				component: 'MesRecruPage',
				custom: {
					allowed: [GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()],
					data: {
						page: 'treated'
					}
				},
			},*/
		];

		let grossisteSub = [
			{
				iconName: 'undo',
				displayText: 'Annulation',
				component: 'ReqgrossistePage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()],
					data: {
						type_req: 'annulation'
					}
				},
			},
			{
				iconName: 'undo',
				displayText: 'Requette d\' Erreur',
				component: 'MesReqgrossistePage',
				custom: {
					allowed: [GlobalProvider.roleRAA(), GlobalProvider.roleRFVI(), GlobalProvider.roleCM()],
					data: {
						page: 'toTreat'
					}
				},
			},
			{
				iconName: 'create',
				displayText: 'Modification',
				component: 'ReqgrossistePage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()],
					data: {
						type_req: 'modification'
					}
				}
			},
			{
				iconName: 'trash',
				displayText: 'Suspension',
				component: 'ReqgrossistePage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()],
					data: {
						type_req: 'suspenssion'
					}
				},
			},
			{
				iconName: 'trash',
				displayText: 'Levée suspension',
				component: 'ReqgrossistePage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()],
					data: {
						type_req: 'Lsuspenssion'
					}
				},
			},
			{
				iconName: 'lock',
				displayText: 'Cga bloqué',
				component: 'ReqgrossistePage',
				custom: {
					allowed: [GlobalProvider.roleRFVI()],
					data: {
						type_req: 'cptcga'
					}
				},
			}
			,
			{
				iconName: 'lock',
				displayText: 'Transfert de droit',
				component: 'ReqgrossistePage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()],
					data: {
						type_req: 'transfert'
					}
				},
			}
		];

		let prospectSub = [
			{
				iconName: 'add-circle',
				displayText: 'Ajouter',
				component: 'MyProspectPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()],

				},
			},
			{
				iconName: 'create',
				displayText: 'Mes prospects',
				component: 'MesProspectPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()],
					data: {
						page: 'forPDV'
					}
				}
			}
			,
			{
				iconName: 'list-box',
				displayText: 'Liste des prospects',
				component: 'MesProspectPage',
				custom: {
					allowed: [GlobalProvider.roleRAA(), GlobalProvider.roleRFVI()],
					data: {
						page: 'forRFVI'
					}
				},
			}
		];

		let prestationSub = [
			{
				iconName: 'add-circle',
				displayText: 'Nouvelle prestation',
				component: 'PrestationTechniquePage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()],
				},
			},
			{
				iconName: 'create',
				displayText: 'Prestations envoyées',
				component: 'MesPrestationsTechniquesPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(),GlobalProvider.roleRFVI()],
					data: {
						page: 'forPDV'
					}
				}
			}
		];

		let logSub = [
			/*{
				iconName: 'add-circle',
				displayText: 'Nouvelle prestation',
				component: 'PrestationTechniquePage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI()],
				},
			},*/
			{
				iconName: 'list',
				displayText: 'Commandes passées',
				component: 'MesCmdMaterielPage',
				custom: {
					allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(),GlobalProvider.roleRFVI()],
					data: {
						page: 'forPDV'
					}
				}
			}
		];

		let comptaSub = [
			{
				iconName: 'radio-button-off',
				displayText: 'À traiter',
				component: 'MesOrdresDeMissionsPage',
				custom: {
					allowed: [GlobalProvider.roleCOMPTAG(), GlobalProvider.roleDFIN(),GlobalProvider.rolePDG()],
					data: {
						page: 'toTreat'
					}
				}
			},
			{
				iconName: 'checkmark-circle-outline',
				displayText: 'Traités',
				component: 'MesOrdresDeMissionsPage',
				custom: {
					allowed: [GlobalProvider.roleCOMPTAG(), GlobalProvider.roleDFIN(),GlobalProvider.rolePDG()],
					data: {
						page: 'treated'
					}
				}
			},
			{
				iconName: 'remove-circle-outline',
				displayText: 'Rejetés',
				component: 'MesOrdresDeMissionsPage',
				custom: {
					allowed: [GlobalProvider.roleCOMPTAG(), GlobalProvider.roleDFIN(),GlobalProvider.rolePDG()],
					data: {
						page: 'rejected'
					}
				}
			},
			{
				iconName: 'list',
				displayText: 'Mes ODM',
				component: 'MesOrdresDeMissionsPage',
				custom: {
					allowed: [GlobalProvider.roleCOMPTAG(), GlobalProvider.roleDFIN(),GlobalProvider.rolePDG()],
					data: {
						page: 'myODM'
					}
				}
			},
			{
				iconName: 'radio-button-off',
				displayText: 'À traiter',
				component: 'FinancialPage',
				custom: {
					allowed: [GlobalProvider.roleDFIN(),GlobalProvider.roleRAA()],
					data: {
						page: 'toTreat'
					}
				}
			},
		];

		let rfinSub=[
		{
				iconName: 'radio-button-off',
				displayText: 'À traiter',
				component: 'FinancialPage',
				custom: {
					allowed: [GlobalProvider.roleDFIN(),GlobalProvider.roleRAA()],
					data: {
						page: 'toTreat'
					}
				}
			},

			{
				iconName: 'checkmark-circle-outline',
				displayText: 'Traités',
				component: 'ListReffilfinancePage',
				custom: {
					allowed: [GlobalProvider.roleDFIN(),GlobalProvider.roleRAA()],
					data: {
						page: 'myrequestsdfin'
					}
				}
			},

			{
				iconName: 'checkmark-circle-outline',
				displayText: 'Demandere une recharge',
				component: 'RefillfinancialPage',
				custom: {
					allowed: [GlobalProvider.roleAAD()],
					
				}
			},

			{
				iconName: 'compass-outline',
				displayText: 'Recap solde',
				component: 'RecapSoldPage',
				custom: {
					allowed: [GlobalProvider.roleAAD()],
					
				}
			},
			
		];
		let refSub=[
			{
					iconName: 'radio-button-off',
					displayText: 'À traiter',
					component: 'MesReferencePage',
					custom: {
						allowed: [GlobalProvider.roleDFIN(),GlobalProvider.roleRAA()],
						data: {
							page: 'toTreat'
						}
					}
				},
	
				/*{
					iconName: 'checkmark-circle-outline',
					displayText: 'Traités',
					component: 'MesReferencePage',
					custom: {
						allowed: [GlobalProvider.roleDFIN(),GlobalProvider.roleRAA()],
						data: {
							page: 'myrequestsdfin'
						}
					}
				},*/
			];
	
		
		let cgaSub = [
			{
				iconName: 'radio-button-off',
				displayText: 'CGA Prépayé',
				component: 'CgaprePage',
				custom: {
					allowed: [GlobalProvider.roleDFIN()],
					data: {
						page: 'toTreat'
					}
				}
			},
			{
				iconName: 'radio-button-off',
				displayText: 'CGA Postpayé',
				component: 'CgaPage',
				custom: {
					allowed: [GlobalProvider.roleCONTROL(), GlobalProvider.roleSUPER(), GlobalProvider.roleDFIN(),GlobalProvider.roleCM()],
					data: {
						page: 'toTreat'
					}
				}
			},
		];

		let cashingSub = [
			{
				iconName: 'radio-button-off',
				displayText: 'À traiter',
				component: 'CashingPage',
				custom: {
					allowed: [GlobalProvider.roleDFIN()],
					data: {
						page: 'toTreat'
					}
				}
			},
		];

		let memoSub = [
			{
				iconName: 'radio-button-off',
				displayText: 'À traiter',
				component: 'MemoPage',
				custom: {
					allowed: [GlobalProvider.roleDFIN(),GlobalProvider.roleCONTROL(), GlobalProvider.roleSUPER()],
					data: {
						page: 'toTreat'
					}
				}
			},
		];






		recruSub.forEach((option) => {
			// console.log("allowed Recrus: ", option.custom.allowed, "Role ID: "+this.roleId);
			// console.log("option.custom.allowed.indexOf(this.roleId)>=0", option.custom.allowed.indexOf(Number(this.roleId))>=0);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				recruOption.suboptions.push(option);
			}
		});

		recruFigoSub.forEach((option) => {
			// console.log("allowed Recrus: ", option.custom.allowed, "Role ID: "+this.roleId);
			// console.log("option.custom.allowed.indexOf(this.roleId)>=0", option.custom.allowed.indexOf(Number(this.roleId))>=0);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				recruFrigoOption.suboptions.push(option);
			}
		});

		reaboSub.forEach((option) => {
			// console.log("allowed Reabos: ", option.custom.allowed, "Role ID: "+this.roleId);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				reaboOption.suboptions.push(option);
			}
		});

		refilperpedSub.forEach((option) => {
			// console.log("allowed Reabos: ", option.custom.allowed, "Role ID: "+this.roleId);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				refilprepedOption.suboptions.push(option);
			}
		});

		migrSub.forEach((option) => {
			// console.log("allowed Migr: ", option.custom.allowed, "Role ID: "+this.roleId);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				migrOption.suboptions.push(option);
			}
		});

		reaboSvodSub.forEach((option) => {
			// console.log("allowed Migr: ", option.custom.allowed, "Role ID: "+this.roleId);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				reaboSvodOption.suboptions.push(option);
			}
		});

		grossisteSub.forEach((option) => {
			// console.log("allowed Migr: ", option.custom.allowed, "Role ID: "+this.roleId);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				grossisteOption.suboptions.push(option);
			}
		});

		prospectSub.forEach((option) => {
			// console.log("allowed Migr: ", option.custom.allowed, "Role ID: "+this.roleId);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				prospectOption.suboptions.push(option);
			}
		});

		prestationSub.forEach((option) => {
			// console.log("allowed Migr: ", option.custom.allowed, "Role ID: "+this.roleId);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				prestationOption.suboptions.push(option);
			}
		});

		logSub.forEach((option) => {
			// console.log("allowed Migr: ", option.custom.allowed, "Role ID: "+this.roleId);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				cMatOption.suboptions.push(option);
			}
		});

		comptaSub.forEach((option) => {
			// console.log("allowed Migr: ", option.custom.allowed, "Role ID: "+this.roleId);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				odmOption.suboptions.push(option);
			}
		});

		rfinSub.forEach((option) => {
			// console.log("allowed Migr: ", option.custom.allowed, "Role ID: "+this.roleId);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				rfinOption.suboptions.push(option);
			}
		});

		refSub.forEach((option) => {
			// console.log("allowed Migr: ", option.custom.allowed, "Role ID: "+this.roleId);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				reqrefOption.suboptions.push(option);
			}
		});
		cashingSub.forEach((option) => {
			// console.log("allowed Migr: ", option.custom.allowed, "Role ID: "+this.roleId);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				cashingOption.suboptions.push(option);
			}
		});

		memoSub.forEach((option) => {
			// console.log("allowed Migr: ", option.custom.allowed, "Role ID: "+this.roleId);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				memoOption.suboptions.push(option);
			}
		});

		cgaSub.forEach((option) => {
			// console.log("allowed Migr: ", option.custom.allowed, "Role ID: "+this.roleId);
			if (option.custom.allowed.indexOf(Number(this.roleId)) >= 0) {
				// console.log('Allowed option: '+option.displayText);
				cgaOption.suboptions.push(option);
			}
		});


		/**
		 *  INSERTION DES MENUS DANS LES DEPARTEMENTS
		 */

		this.options.push({
			iconName: 'home',
			displayText: 'Accueil',
			component: 'HomePage',
			selected: true,
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()]
			}
		});

		
		// dept reabo
		if (reaboOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			reaboDept.suboptions.push(reaboOption);

		if (reaboSvodOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			reaboDept.suboptions.push(reaboSvodOption);

		if (grossisteOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			reaboDept.suboptions.push(grossisteOption);
		if (refilprepedOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			reaboDept.suboptions.push(refilprepedOption);
		// dept commer

		if (recruOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			comDept.suboptions.push(recruOption);

		if (migrOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			comDept.suboptions.push(migrOption);

		if (prospectOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			comDept.suboptions.push(prospectOption);
		if (recruFrigoOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			comDept.suboptions.push(recruFrigoOption);

		// dept technique
		if (prestationOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			techDept.suboptions.push(prestationOption);

		if (cMatOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			dlogDept.suboptions.push(cMatOption);

		if (odmOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			comptaDept.suboptions.push(odmOption);
		//finDept
		let remunOption={
			iconName: 'cash',
			displayText: 'Rémunérations',
			component: 'CommissionPage',
			selected: false,
			custom: {
				allowed: [GlobalProvider.roleAAD(), GlobalProvider.roleFVI(), GlobalProvider.roleRFVI(), GlobalProvider.roleRAA()]
			}
		};
		let reffinOption={
			iconName: 'cash',
			displayText: 'Requette ref.',
			component: 'RefFinancialPage',
			selected: false,
			custom: {
				allowed: [GlobalProvider.roleAAD()]
			}
		};
	
		if (reffinOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			dfinDept.suboptions.push(reffinOption);
			
		if (remunOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			dfinDept.suboptions.push(remunOption);
		
		if (cashingOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			dfinDept.suboptions.push(cashingOption);

		if (rfinOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			dfinDept.suboptions.push(rfinOption);

		if (reqrefOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			dfinDept.suboptions.push(reqrefOption);
		if (memoOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			dfinDept.suboptions.push(memoOption);

		if (cgaOption.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			creditDept.suboptions.push(cgaOption);

		/**
		 *  INSERTION DES DEPARTEMENTS DANS LE MENU
		 */

		if (reaboDept.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			this.options.push(reaboDept);

		if (comDept.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			this.options.push(comDept);

		if (techDept.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			this.options.push(techDept);

		if (dfinDept.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			this.options.push(dfinDept);

		/*if (dlogDept.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			this.options.push(dlogDept);*/

		if (comptaDept.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			this.options.push(comptaDept);

		if (creditDept.custom.allowed.indexOf(Number(this.roleId)) >= 0)
			this.options.push(creditDept);

	}
	 getville_quartier() {
		let that = this;
		let postData = new FormData();
		//Récupération des infos sur les villes dans la BD distante
		this._SYGALIN.query('AllVille/', postData, false)
			.then(v => {
				console.log(v);
				that._SYGALIN.setVilles(v);

			})
			.catch(error => {
				console.log(error);
				this._SYGALIN.presentToast("Impossible d'accéder à Internet. Veuillez vérifier que vous avez accès à Internet", "warning");
			});
		this._SYGALIN.query('AllQuartier/', postData, false)
			.then(q => {
				console.log(q);
				that._SYGALIN.setQuarier(q);
			})
			.catch(error => {
				console.log(error);
				this._SYGALIN.presentToast("Impossible d'accéder à Internet. Veuillez vérifier que vous avez accès à Internet", "warning");
			});

		this._SYGALIN.query('AllRegion/', postData, false)
			.then(r => {
				console.log(r);
				that._SYGALIN.setRegion(r);
			})
			.catch(error => {
				console.log(error);
				this._SYGALIN.presentToast("Impossible d'accéder à Internet. Veuillez vérifier que vous avez accès à Internet", "warning");
			});
	}
}








