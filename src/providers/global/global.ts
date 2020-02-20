import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AlertController, Events, LoadingController, ToastController} from 'ionic-angular';
import moment from 'moment';
import {NativeStorage} from '@ionic-native/native-storage';
import {NetworkService} from '../network/network';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {LoginPage} from "../../pages/login/login";


/**
 * Classe contenant l'ensemble des fonction générales à toute l'application
 */
//const DATABASE_NAME_FILE: string = "data.db";



//Type de grossiste
type DTYPE={ name: string, http: string, url: string, numdist: string|number};

/**
 * Ensemble des grossistes
 */
const DISTRIBUTORS: Array<DTYPE> =[
	{
		name: "DJABBAMA DOUNIA",
		http: "https",
		//url: 'test-dsi.sygalin.com',
		url:'djabbama-aws.sygalin-tvsat.com',
		numdist: 707
	},
	{
		name: "B.A.M.",
		http: "https",
		url: 'cga-bam.sygalin.com',
		numdist: 779
	},
	{
		name: "Ramana",
		http: "https",
		url: 'cga-ramana.sygalin.com',
		numdist: 17301
	},
];


/**
 * Constantes pour rôles
 */
const ROLES={
	FVI: {value: 25},
	RFVI: {value: 28},
	AAD: {value: 22},
	RAA: {value: 19},
	DG: {value: 8},
	RDSI: {value: 29},
	DEV: {value: 42},
	RT: {value: 39},
	PDG: {value: 31},
	COMPTAG: {value: 15},
	DFIN: {value: 18},
	CM: {value: 12},
	CONTROL:{value:14},
	SUPER:{value:16},
	DGEN:{value:47},
	RESPO_AG:{value:21},
};
/*const FVI: number = 25;
const RFVI: number = 28;
const AAD: number = 22;
const RAA: number = 19;*/

@Injectable()
export class GlobalProvider {
	//httpstest:boolean=true;
	base_url: string = null;
	// base_url: string = "https://cga-djabbama.groupelin.com/api/";
	db: any;
	ready: Promise<any>;
	load: any;
	toast: any;
	timer: any;
	timer2: any;

	// Final grosssiste
	_FinalGrossiste:any;

	//UTILISATEUR CONNECTÉ
	user: {
		'id': any,
		'name': any,
		'cuser': any,
		'role': any,
		'roleName': any,
		'tel': any,
		'shop': any,
		'shopName': any,
		'groupName': any,
		'shopType': any,
		'numDist': any,
		'sector': any,
		'sectorName': any,
		'MercantSIM': any,
		'collection': any,
		'get': any,
		'right': any,
		'dept': any,
		'token':any
	};

	//Données initiales
	region: {
		'id': any;
		'nom': any;
	};
	//regions: Array<region>
	public regions: [{
		'id': any;
		'nom': any;
	}];
	public quartiers: [{
		'id': any;
		'nom': any;
	}];
	public villes: [{
		'id': any;
		'nom': any;
	}];

//message pour avertissement  recrutement  fvi
	public outUser: {
		'nbre': any;
		'alert': any;
	}={
		'nbre':null,
		'alert':null,
	};
	public kits: any;
	public migrKits: Array<any>;
	public formules: any;
	public options: any;
	public pay_options: any;
	public all_pay_options: any;
	public compte_bancaire: any;
	public sectors: any;
	public prestations: any;
	public notifications: any;
	public grossiste: DTYPE;
	public currentYear:any;
	// connexion en https ou http
	public  isHttps:boolean=true;

	// PARAMETRES DE LANGUE POUR MOMENTJS
	frDateSettings = {
		months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
		monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
		monthsParseExact: true,
		weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
		weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
		weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
		weekdaysParseExact: true,
		longDateFormat: {
			LT: 'HH:mm',
			LTS: 'HH:mm:ss',
			L: 'DD/MM/YYYY',
			LL: 'D MMMM YYYY',
			LLL: 'D MMMM YYYY HH:mm',
			LLLL: 'dddd D MMMM YYYY HH:mm'
		},
		calendar: {
			sameDay: '[Aujourd’hui à] LT',
			nextDay: '[Demain à] LT',
			nextWeek: 'dddd [à] LT',
			lastDay: '[Hier à] LT',
			lastWeek: 'dddd [dernier à] LT',
			sameElse: 'L'
		},
		relativeTime: {
			future: 'dans %s',
			past: 'il y a %s',
			s: 'quelques secondes',
			m: 'une minute',
			mm: '%d minutes',
			h: 'une heure',
			hh: '%d heures',
			d: 'un jour',
			dd: '%d jours',
			M: 'un mois',
			MM: '%d mois',
			y: 'un an',
			yy: '%d ans'
		},
		dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
		ordinal: function (number) {
			return number + (number === 1 ? 'er' : 'e');
		}
		,
		meridiemParse: /PD|MD/,
		isPM:
			function (input) {
				return input.charAt(0) === 'M';
			}
		,
		meridiem:
			function (hours, minutes, isLower) {
				return hours < 12 ? 'PD' : 'MD';
			}
		,
		week: {
			dow: 1, // Monday is the first day of the week.
			doy: 4  // Used to determine first week of the year.
		}
	};

	isConnected: boolean=false;
	public isOnline: boolean=true;
	public canRequest: boolean=true;

	//INFORMATIONS POUR BADGES
	public unreadRecruObservable: any;
	public unreadReaboObservable: any;
	public unreadReaboSvodObservable: any;
	public unreadMigrObservable: any ;
	public unreadDetteObservable: any;
	public unreadEncaissementObservable: any;
	public unreadDComObservable: any;
	public unreadDReaboObservable: any;
	public unreadCgapreObservable: any;
	public unreadCgapostObservable: any;
	public unreadMemosObservable: any;
	public unreadFinanceObservable: any;
	public unreadRefRequestObservable: any;
	public unreadRequestRefToTreatObservable: any;
	public unreadVersementObservable: any;
	public unreadOdmObservable: any;
	public unreadReqDsiObservable: any;
	public unreadReqDisbursmenObservable: any;
	public unreadProspectObservable: any;

	public promoImage: any;
	public promoImg: any;
	// public unreadVilleObservable: any = new ReplaySubject<number>(0);

	//INFORMATIONS POUR AUTHENTIFICATION
	private _TOKEN: any;
	private _CREDS: any;
	public _AppPaused: boolean=false;

	//STATISTIQUES GLOBALES POUR ADMINISTRATEURS
	public _GLOBAL_STATS: any;
	public debtDay: any;

	//PERIODE DE VISU
	public viewPeriod: {
		start: any,
		end: any
	}= {start: "", end:""};

	 public _MultipleAccounts:any[];

	constructor(
		public _HTTPC: HttpClient,
		public _EVENT: Events,
		public _TOAST: ToastController,
		public _LOADER: LoadingController,
		public _ALERT: AlertController,
		public _STORAGE: NativeStorage,
		public _NETSERVICE: NetworkService,
		private _NOTIF: LocalNotifications) {
		this._MultipleAccounts=[];
		this.viewPeriod.start="";
		this.viewPeriod.end="";
		moment.locale('fr', this.frDateSettings);
		/**
		 * VERIFICATION DE LA CONNECTIVITE
		 */
/*		setTimeout(()=>{
			console.log("Timeout network");*/
			this._NETSERVICE.getNetworkStatus().subscribe((connected: boolean) => {
				this.isOnline = connected;
				this.canRequest=this.isOnline;
				//console.log("CONNECTION STATUS: ", connected);
				if (this.isOnline){
					//this.canRequest=true;
					this.presentToast("Vous êtes connecté", "success");
				} else {
					this.presentToast("Vous êtes hors-ligne", "warning");
				}
			});
		/*}, 2000);*/

		/**
		 * QUAND L'UTILISATEUR S'AUTHENTIFIE AVEC SUCCÈS
		 */
		_EVENT.subscribe('user:connected', (udata, grossiste) => {
			this.isConnected = true;
			if (this.isConnected && this.isOnline)
			{
				//this.getPromoImage();
				this.getPromoImg();
				this.getCities();
				this.getNotifs();
				if (this.isRAA() || this.isRFVI()){
					this.recruToTreat();
					this.reaboToTreat();
					this.reaboSvodToTreat();
					this.migrationToTreat();
				}
				if (this.isFVI() || this.isAAD()){
					this.outVad();
					if (this.isFVI()){
						this.prospectOfDay();
					}
				}
				if (this.isDG()){
					this.unreadDetteObservable=0;
					this.unreadEncaissementObservable=0;
					this.getStatistics();
				}
				if(this.isSUPER()||this.isDFIN() || this.isCM()|| this.isCONTROL()){
					this.cgaPost();
					this.cgaPre();
				}
				if (this.isPDG() || this.isDFIN()){
					this.OdmToTreat();
				}
				if (this.isAAD()){
					this.ReqToTreatRef();
				}
				if (this.isDFIN()){
					this.FinanceToTreat();
					this.VersementToTreat();
					this.ListToTreatRef();
					this.ReqToTreatRef();
				}
				if (this.isRDSI()|| this.isDEV() || this.isRT() || this.isPDG()){
					this.reqdsiToTreat()
				}
				if(this.isDFIN() || this.isDG() || this.isDGEN() || this.isPDG() || this.isCOMPTAG()){
					this.disbursmentToTreat();
				}
				setInterval(()=>{
					if (this.isDG() && this.isOnline){
						this.getStatistics();
					}

				}, 10000);
				this.timer2 = setInterval(() => {
					if (this.isConnected && !this._AppPaused && this.isOnline)
					{
						this.getNotifs();
						if (this.isRAA() || this.isRFVI())
						{
							this.recruToTreat();
							this.reaboToTreat();
							this.reaboSvodToTreat();
							this.migrationToTreat();
							this.unreadDComObservable=this.unreadRecruObservable;
							this.unreadDReaboObservable=this.unreadReaboSvodObservable+this.unreadReaboObservable;
						}
						if (this.isFVI() || this.isAAD()){
							this.dette();
							this.encaissement();
							if (this.isFVI()){
								this.prospectOfDay();
							}
						}
						if(this.isSUPER()||this.isDFIN() || this.isCM() ){
							this.cgaPost();
							this.cgaPre();
							this.MemoToTreat();
						}
						if(this.isCONTROL()){
							this.MemoToTreat();
							this.cgaPost();
						}
						if (this.isPDG() || this.isDFIN()){
							this.OdmToTreat();
						}
						if (this.isAAD()){
							this.ReqToTreatRef();
						}
						if (this.isDFIN()){
							this.FinanceToTreat();
							this.VersementToTreat();
							this.ListToTreatRef();
							this.ReqToTreatRef()
						}
						if (this.isRDSI()|| this.isDEV() || this.isRT()|| this.isPDG()){
							this.reqdsiToTreat()
						}
						if(this.isDFIN() || this.isDG() || this.isDGEN() || this.isPDG() || this.isCOMPTAG()){
							this.disbursmentToTreat();
						}
					}
				}, 5000);
				this.getInitialData();
			}
		});
	}

	/**
	 * Fonction pour recupérer les infos d'un grossiste à partir de son NumDist
	 * @param numdist: NumDist du grossiste
	 * @returns un objet si le grossiste existe,  null sinon
	 */
	getDistributor(numdist: string|number){
		let numdists=DISTRIBUTORS.map((e)=> {
			return e.numdist;
		});
		let pos = numdists.indexOf(Number(numdist));
		console.log(numdists, numdist, pos);
		if (pos>=0)
		{
			console.log(DISTRIBUTORS[pos]);
			return DISTRIBUTORS[pos];
		}
		else
			return null;
	}

	setBaseUrl(dist: DTYPE){
		let valhttp:string="";
		if (this.isHttps) {
			valhttp='https';
		}else {
			valhttp='http';
		}

		//this.base_url=dist.http+'://'+dist.url+'/index.php/api/';
		this.base_url=valhttp+'://'+dist.url+'/index.php/api/';
		console.log(dist);
		this.grossiste=dist;
	}



	getInitialData() {
		this.query('getInitialData/', null, false, 'get')
			.then(res=>{
				this.kits=res.kits;
				this.migrKits=res.migrKits;
				this.formules=res.formules;
				this.options=res.options;
				this.pay_options=res.pay_options;
				this.all_pay_options=res.all_pay_options;
				this.compte_bancaire=res.compte_bancaire;
				this.sectors=res.secteurs;
				this.prestations=res.type_intervention;
				this.currentYear=res.currentYear;
				console.log("all pay option",this.all_pay_options);
			});
	}

	setMUltipleAccounts(data:any[]){
		this._MultipleAccounts=data;
		console.log("data in multipleaccounts",this._MultipleAccounts);
	}

	/**
	 * Fonction pour effectuer des requêtes http vers le serveur distant
	 * @param link: Fonction de l'API à appeler
	 * @param data: data (PostData) contenant les valeurs à envoyer
	 * @param single: Précise si oui ou non on veut retourner un seul objet
	 * @param type: Méthode le la requête (get/post)
	 * @param raw: détermine si oui ou non la réponse de la requête doit être renvoyée telle quelle
	 * @returns un Promise contenant le résultat de la requête
	 */

	dataToJson(formData: any){
		var object = {};
		formData.forEach((value, key) => {object[key] = value});
		var json=JSON.stringify(object);
		console.log(json);
		return json;
	}

	jsonParse(value)
	{
		return JSON.parse(value);
	}

	makeOptions(Params: any){
		if (!Params){
			if (!Params) {
				Params = {
					headers: new HttpHeaders(),
					params: new HttpParams()
				};
			}
			return Params;
		}
	}

	setHeaders(header: HttpHeaders, URL: any, data: any) {
		header=null;
		/*header = header.append('Content-Type','application/json');
		header = header.append('Accept','application/json');*/
		if (URL=='login/')
		{
			this._CREDS=btoa(this.dataToJson(data));
			header=new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'HeadName': this._CREDS
			});
			//header = header.append('Authorization','Bearer '+this._CREDS);
		} else {
			header=new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'HeadName': this._TOKEN
			});
			// header = header.append('Authorization','Bearer '+this._TOKEN);
		}
		console.log(header);
		return header;
	}

	query(link: string, data: any, single: boolean = false, type: string = "post", raw: boolean = false): Promise<any> {
		let that=this;
		return new Promise((resolve, reject) => {
			if (this.isOnline) {
				//console.log("ONLINE. CAN RESUEST: ", this.canRequest);
				this.canRequest=this.isOnline;
				let req=null;

				if (link=='login/'){
					var value=this.dataToJson(data);
					var pData=new FormData();
					pData.append('Authorization', value);
				} else {
					if (!data){
						data=new FormData();
					}
					data.append('user_token', this._TOKEN);
					data.append('start', this.viewPeriod.start);
					data.append('user', this.user.id);
					data.append('cuser', this.user.cuser);
					data.append('role', this.user.role);
					data.append('user_dept', this.user.dept);
					data.append('end', this.viewPeriod.end);
				}

					req = this._HTTPC.post(this.api_url(link), pData?pData:data).toPromise();
					req.then((res) => {
							if (res.type!=undefined && res.type=="fail"){
								console.log(res.code);
								that._EVENT.publish('user:logout');
								that.presentToast("Votre session a expiré (Code 107)", "danger", 5000);
							}
							console.log("Request response from " + link + ":  ", res);
							if (raw) {
								resolve(res);
							} else if (single) {
								resolve(res[0]);
							} else {
								resolve(res);
							}
						},
						(reason) => {
							reject(reason);
							that._EVENT.publish('https:availability');
						}).catch(error => {
						console.log(error);
						reject("Une erreur interne est survenue (Code 500)");
					})



			} else {
				//console.log("OFFLINE. CAN RESUEST: ", this.canRequest);
				if (this.canRequest)
					this.presentToast("Aucun accès à Internet (Code 501)", "danger", 10000, true);
				this.canRequest=false;
				reject("Une erreur interne est survenue (Code 502)");
			}
		});
	}


	/**
	 * Fonction pour obtenir l'instance actuelle de la base de données SQLite
	 * @returns un SQLiteObject
	 */
	dbase() {
		return this.db;
	}

	setToken(_token: any) {
		this._TOKEN=_token;
	}

	/**
	 * Fonction pour obtenir l'url complète connaissant là fonction à appeler
	 * @returns le lien absolu vers la fonction
	 */
	api_url(link: string = ""): string {
		return this.base_url + link;
	}


	/**
	 * Fonction pour afficher un toast
	 * @param text: Message à afficher
	 * @param type: Type du toast (info, success, warning et danger)
	 * @param duration: Temps d'affichage du toast (en ms)
	 * @param closeButton: Spécifie si oui ou non on peut fermer le toast (avec un bouton) avant le temps défini
	 * @returns Nothing
	 */
	presentToast(text: string, type: string = "info", duration: number = 3000, closeButton: boolean = false) {
		this.toast = this._TOAST.create({
			message: text,
			duration: duration,
			cssClass: "toast-" + type,
			showCloseButton: closeButton,
			closeButtonText: 'Fermer'
		});
		let that = this;
		this.toast.onDidDismiss((data, role) => {
			if (role == 'close' && this.load) {
				that.loadingDismiss();
			}
		});
		this.toast.present();
	}

	dismissToast() {
		this.toast.dismiss();
	}

	/**
	 * Fonction pour ouvrir le loader
	 * @param content: Message à afficher
	 * @param timeout: Temps (en ms) avant la fermeture
	 * @param dismissPageChanging: Permet de spécifier si oui ou non le loader doit se fermer si la page est changée
	 * @param spinner: Type de spinner à affiher (ios, ios-small, bubbles, circles, crescent, dots)
	 * @returns Nothing
	 */
	loadingPresent(content: string = "", timeout: number = null, dismissPageChanging: boolean = false, spinner: string = "dots") {
		this.load = this._LOADER.create({
			spinner: spinner,
			content: content,
			dismissOnPageChange: dismissPageChanging
		});
		this.load.present();

		if (timeout !== null) {
			setTimeout(() => {
				this.loadingDismiss();
			}, timeout);
		}

		this.timer = setTimeout(() => {
			setTimeout(() => {
				this.loadingDismiss();
			}, 30000);
			this.presentToast("Il semblerait que votre connexion à Internet soit lente.", "warning", 30000, true);
		}, 30000);
	}

	/**
	 * Fonction pour fermer le loader
	 * @returns Nothing
	 */
	loadingDismiss() {
		clearTimeout(this.timer);
		this.load.dismiss();
	}

	getStatistics(){
		this.query('getReals/', null)
			.then(res=>{
				this._GLOBAL_STATS=res;
				console.log('STATS:', this._GLOBAL_STATS, 'type: ', typeof this._GLOBAL_STATS);
				this.isEmpty(this._GLOBAL_STATS);
			});
	}

	isEmpty(obj)
	{
		return Object.entries(obj).length === 0 && obj.constructor === Object
	}

	isEmptyVal(value){
		return !(value!==null && value!==undefined && value!=='');
	}

	setCurUser(udata: any) {
		console.log('SETTING CUR_USER:', udata);
		this.user = udata;
	}

	getCurUser() {
		return this.user;
	}

	// Fonctions de manipulation des rôles

	isRAA(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleRAA():false;
	}

	isRFVI(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleRFVI():false;
	}

	isFVI(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleFVI():false;
	}

	isAAD(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleAAD():false;
	}

	isDG(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleDG():false;
	}
	isRESPO_AG(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleRESPO_AG():false;
	}


	isDGEN(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleDGEN():false;
	}

	isRDSI(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleRDSI():false;
	}

	isDEV(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleDEV():false;
	}

	isRT(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleRT():false;
	}

	isPDG(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.rolePDG():false;
	}

	isCOMPTAG(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleCOMPTAG():false;
	}

	isDFIN(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleDFIN():false;
	}

	isCM(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleCM():false;
	}

	isSUPER(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleSUPER():false;
	}

	isCONTROL(): boolean {
		return this.getCurUser()!==null?parseInt(this.getCurUser().role) == GlobalProvider.roleCONTROL():false;
	}

	static roleRAA(): any {
		return ROLES.RAA.value;
	}

	static roleRFVI(): any {
		return ROLES.RFVI.value;
	}
	static roleRESPO_AG(): any {
		return ROLES.RESPO_AG.value;
	}

	static roleFVI(): any {
		return ROLES.FVI.value;
	}

	static roleAAD(): any {
		return ROLES.AAD.value;
	}

	static roleDG(): any {
		return ROLES.DG.value;
	}
	static roleDGEN(): any {
		return ROLES.DGEN.value;
	}

	static roleRDSI(): any {
		return ROLES.RDSI.value;
	}

	static roleDEV(): any {
		return ROLES.DEV.value;
	}

	static roleRT(): any {
		return ROLES.RT.value;
	}

	static rolePDG(): any {
		return ROLES.PDG.value;
	}

	static roleCOMPTAG(): any {
		return ROLES.COMPTAG.value;
	}

	static roleDFIN(): any {
		return ROLES.DFIN.value;
	}

	static roleCM(): any {
		return ROLES.CM.value;
	}

	static roleSUPER(): any {
		return ROLES.SUPER.value;
	}

	static roleCONTROL(): any {
		return ROLES.CONTROL.value;
	}

	alertify(message: string, type: string = "simple", title?: string) {
		if (type === "simple") {
			this._ALERT.create({
				title: title,
				subTitle: message,
				buttons: ['OK']
			}).present();
		} else if (type === "confirm") {
			console.log('confirm');
		}
	}

	momentjs(value?: any) {
		return moment(value);
	}

	recruToTreat() {
		let postData = new FormData();
		postData.append('sector', this.user.sector);
		postData.append('role', this.user.role);
		postData.append('uId', this.user.id);
		this.query('recruToTreat/', postData).then(res=>{
			this.unreadRecruObservable=res.length;
		});

	}

	disbursmentToTreat():void {
		let postData = new FormData();
		postData.append('sector', this.user.sector);
		postData.append('role', this.user.role);
		postData.append('uId', this.user.id);
		postData.append('user_id', this.user.id);
		postData.append('user_role', this.user.role);
		this.query('disbursementToTreat/', postData).then(res=>{
			this.unreadReqDisbursmenObservable=res.length;
		});
	}

	reaboSvodToTreat() {
		let postData = new FormData();
		postData.append('sector', this.user.sector);
		postData.append('role', this.user.role);
		this.query('svodToTreat/', postData).then(res => {
			this.unreadReaboSvodObservable=res.length;

		});
	}

	reaboToTreat() {
		let postData = new FormData();
		postData.append('sector', this.user.sector);
		postData.append('uId', this.user.id);
		postData.append('role', this.user.role);
		this.query('reaboToTreat/', postData).then(res=>{
			this.unreadReaboObservable=res.length;
		});
	}

	migrationToTreat() {
		let postData = new FormData();
		postData.append('sector', this.user.sector);
		postData.append('role', this.user.role);
		postData.append('uId', this.user.id);
		this.query('migrationToTreat/', postData).then(res=>{
			this.unreadMigrObservable=res.length;
		});
	}

	cgaPost() {
		let postData = new FormData();
		postData.append('sector', this.user.sector);
		postData.append('user_role', this.user.role);
		postData.append('user_id', this.user.id);
		this.query('requestCgaPost/', postData).then(res=>{
			this.unreadCgapostObservable=res.length;
		});
	}

	cgaPre() {
		var url="requestsCgaPre/";
		if(this.isCM()){
			url="requestsCgaPre/tocredit";
		}
		let postData = new FormData();
		postData.append('user_role', this.user.role);
		postData.append('user_id', this.user.id);
		this.query(url, postData).then(res=>{
			this.unreadCgapreObservable=res.length;
		});
	}

	MemoToTreat() {

		let postData = new FormData();
		postData.append('user_role', this.user.role);
		postData.append('user_id', this.user.id);
		this.query('memosToTreats/', postData).then(res=>{
			this.unreadMemosObservable=res.length;
		});
	}

	VersementToTreat() {

		let postData = new FormData();
		postData.append('user_role', this.user.role);
		postData.append('user_id', this.user.id);
		this.query('cashingToTreat/', postData).then(res=>{
			this.unreadVersementObservable=res.length;
		});
	}

	FinanceToTreat() {

		let postData = new FormData();
		postData.append('user_role', this.user.role);
		postData.append('user_id', this.user.id);
		this.query('requestsFinancial/', postData).then(res=>{
			this.unreadFinanceObservable=res.length;
		});
	}
	ListToTreatRef() {

		let postData = new FormData();  
		postData.append('uId', this.user.id);
		postData.append('Urole', this.user.role);
		postData.append('Tbtq', this.user.shopType);
		this.query('listRefRequestToTreat/', postData).then(res => {
			this.unreadRefRequestObservable=res.length;
		})
	  }
	  ReqToTreatRef() {

		let postData = new FormData();  
		postData.append('uId', this.user.id);
		postData.append('Tbtq', this.user.shopType);
		postData.append('role', this.user.role);
		this.query('myRefRequest/', postData).then(res => {
			console.log("valeur possible",res);
			this.unreadRequestRefToTreatObservable=res.length;
		})
	  }
	OdmToTreat() {

		let postData = new FormData();
		postData.append('user_role', this.user.role);
		postData.append('user_id', this.user.id);
		this.query('missionOrderToTreat/', postData).then(res=>{
			this.unreadOdmObservable=res.length;
		});
	}
	reqdsiToTreat() {

		let postData = new FormData();
		postData.append('user_role', this.user.role);
		postData.append('user_id', this.user.id);
		if(this.isPDG()){
			this.query('listRequestDuring/', postData).then(res=>{
				this.unreadReqDsiObservable=res.length;

			});
		}else {
			this.query('badgeRqdsi/', postData).then(res=>{
				this.unreadReqDsiObservable=res.num;
			});
		}

	}

	prospectOfDay() {
		let postData = new FormData();
		postData.append('shop', this.user.shop);
		this.query('prospectOfDay/', postData).then(res=>{
			this.unreadProspectObservable=res.length;
		});
	}

	dette() {
		let postData = new FormData();
		postData.append('boutique', this.user.shop);
		this.query('myDept/', postData, false).then(res=>{
			this.unreadDetteObservable=res.montant;
			this. debtDay=res.jour;
		});
	}

	encaissement() {
		let postData = new FormData();
		postData.append('boutique', this.user.shop);
		this.query('collection/', postData, false).then(res=>{
			this.unreadEncaissementObservable=res.montant;
			//console.log('ENCAISSEMENT ', res.montant);
		});
	}

	getPromoImage() {
		this.query('getPromoImage/', null, false, 'get').then(res=>{
			this.promoImage=res.data;
		});
	}
	getPromoImg() {
		this.query('getPromoImg/', null, false, 'get').then(res=>{
			this.promoImg=Array.from(res);
			console.log('promo images', res);
		});
	}

	logout() {
		clearInterval(this.timer2);
		//this._EVENT.unsubscribe('user:connected');
		this._STORAGE.remove('sygalinUser');
		this.isConnected=false;
		this.user = null;
	}

	setVilles(udata: any) {
		this.villes = udata;
		var autre = {id: 0, nom: "(Autre)"};
		this.villes.push(autre);
		//console.log('villes global', this.villes);
	}

	setQuarier(udata: any) {
		this.quartiers = udata;
		var autre = {id: 0, nom: "(Autre)"};
		this.quartiers.push(autre);
		//console.log('quartiers global', this.quartiers);
	}

	setRegion(udata: any) {
		this.regions = udata;
		//console.log('regions global', this.regions);
	}

	getCities() {
		let that = this;
		let postData = new FormData();
		//Récupération des infos sur les villes dans la BD distante
		this.query('AllVille/', postData, false)
			.then(v => {
				that.setVilles(v);
			})
			.catch(error => {
				console.log(error);
				this.presentToast("Impossible d'accéder à Internet. Veuillez vérifier que vous avez accès à Internet (Code 105)", "warning");
			});
		this.query('AllQuartier/', postData, false)
			.then(q => {
				that.setQuarier(q);
			})
			.catch(error => {
				//console.log(error);
				this.presentToast("Impossible d'accéder à Internet. Veuillez vérifier que vous avez accès à Internet (Code 106)", "warning");
			});

		this.query('AllRegion/', postData, false)
			.then(r => {
				//console.log(r);
				that.setRegion(r);
			})
			.catch(error => {
				//console.log(error);
				this.presentToast("Impossible d'accéder à Internet. Veuillez vérifier que vous avez accès à Internet (Code 107)", "warning");
			});
	}

	getObjKeys(Obj){
		return Object.keys(Obj);
	}

	// FONCTIONS POUR GESTION DES STATISTIQUES

	/*getSectorValue(field, sfield, index){
		let pos = this._GLOBAL_STATS.parSecteur[field].map(function (e, index) {
			return e[sfield];
		}).indexOf(index);
	}*/

	getCBs(sector?, cb?) {
		let recs=this._GLOBAL_STATS.cb.recrutement;
		let parcs=this._GLOBAL_STATS.cb.reabonnement;
		let migrs=this._GLOBAL_STATS.cb.migration;
		let indexes=Object.keys(recs);
		let cbs=indexes.map((key, index)=> {
			// console.log(recs[key].nom, '=>', sector && sector==recs[key].secteur);
			if ((cb && (cb==recs[key].id || cb=='0')) || (!cb && sector && (sector==recs[key].secteur || sector=='0')) || (!cb && !sector)) {
				return {
					id: recs[key].id,
					index: key,
					name: recs[key].nom,
					secteur: recs[key].secteur,
					recru: recs[key].nbr,
					parc: parcs[key].parcSum,
					migr: migrs[key].nbr
				};
			}
		});

		/*let cbs=this._GLOBAL_STATS.cb.recrutement.map(function (e, index) {
			return {id: index, name: e.nom, secteur: e.secteur, recru: e.nbr}
		});*/
		//console.log(cbs);
		for( var i = 0; i < cbs.length; i++){
			if ( cbs[i] === undefined) {
				cbs.splice(i, 1);
				i--;
			}
		}
		return cbs;
	}

	getStatSectors(sec?){
		let recs=this._GLOBAL_STATS.parSecteur.recrutement;
		let parcs=this._GLOBAL_STATS.parSecteur.reabonnement;
		let migrs=this._GLOBAL_STATS.parSecteur.migration;
		let indexes=Object.keys(recs);
		let secs=indexes.map((key, index)=> {
			if ((sec && (sec==recs[key].id || sec=='0'))||(!sec)) {
				return {
					id: recs[key].id,
					index: key,
					name: recs[key].nom,
					recru: recs[key].nbr,
					parc: parcs[key].parcSum,
					migr: migrs[key].nbr
				}
			}
		});
		for( var i = 0; i < secs.length; i++){
			if ( secs[i] === undefined) {
				secs.splice(i, 1);
				i--;
			}
		}
		secs.sort((a, b)=>(a.recru > b.recru) ? -1 : (a.recru === b.recru)?((a.parc > b.parc)?-1:(a.parc === b.parc)?((a.migr > b.migr)?-1:1):1):1);
		return secs;
	}

	getFirstCBs() {
		let cbs=this.getCBs();
		cbs.sort((a, b)=>(a.recru > b.recru) ? -1 : (a.recru === b.recru)?((a.parc > b.parc)?-1:(a.parc === b.parc)?((a.migr > b.migr)?-1:1):1):1);
		return cbs.slice(0, 5);
			// list.sort((a, b) => (a.color > b.color) ? 1 : (a.color === b.color) ? ((a.size > b.size) ? 1 : -1) : -1 )
	}

	getStatSector(id){
		let secs=this._GLOBAL_STATS.global.secteurs.map(function (e) {
			return e.id;
		});
		let secInd=secs.indexOf(id);
		//console.log(secs, secInd);
		return this._GLOBAL_STATS.global.secteurs[secInd];
	}

	getVADStats(sector?, cb?){
		if (!sector && !cb){

		}
	}

	ObjectToArray(obj){
		return Object.entries(obj);
	}

	outVad(){
		let that = this;
		let postData = new FormData();
		postData.append('shop', this.user.shop);
		//Récupération des infos sur les recrutements et migrations dans la BD distante
		this.query('outVad/', postData, false)
			.then(v => {
				//that.setVilles(v);
				that.outUser.nbre=v.nombre;
				that.outUser.alert=v.message;
				console.log(v);
			})
			.catch(error => {
				console.log(error);
				this.presentToast("Impossible d'accéder à Internet. Veuillez vérifier que vous avez accès à Internet (Code 105)", "warning");
			});
	}

	getNotifs(){
		let that = this;
		let postData = new FormData();
		postData.append('user', this.user.id);
		postData.append('role', this.user.role);
		//Récupération des infos sur les recrutements et migrations dans la BD distante
		this.query('getNotifs/', postData, false)
			.then(res => {
				that.notifications=res;
				console.log('NOTIFS VAR: ', this.notifications);
			})
			.catch(error => {
				console.log(error);
				this.presentToast("Impossible d'accéder à Internet. Veuillez vérifier que vous avez accès à Internet (Code 105)", "warning");
			});
	}


}
