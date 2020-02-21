import {Component} from '@angular/core';
import {IonicPage, NavController, Events, NavParams, ModalController, ViewController} from 'ionic-angular';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {GlobalProvider} from '../../providers/global/global';
import {animate, state, style, transition, trigger} from "@angular/animations";
import { empty } from 'rxjs/Observer';

@IonicPage()
@Component({
	selector: 'page-refilpreped',
  	templateUrl: 'refilpreped.html',
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
export class RefilprepedPage {
	Data:[
		{

		},
		{

		}
	];
	formgroup: FormGroup;
	img:any;
	option: string;
	showRef: any;
	uRole: string;
	uId: string;
	user: any;
	type_paie: any;
	showItem:boolean=false;
	page: any;
	orders: any;
	toJustif: any;
	justifFile: any;
	labelJustif: any;
	issetFile: boolean=false;
	fileTypes: any;
  file:any;
  today:any;
  checked:boolean=false;
 
  
  constructor(
		public _SYGALIN: GlobalProvider,
		public navCtrl: NavController,
		public navParams: NavParams,
		public modalCtrl: ModalController,
		public _EVENT: Events) {
		this.showRef = false;
		
	}
  
	ngOnInit() {
		this.user = this._SYGALIN.getCurUser();
		this.today = new Date().toTimeString();
		this.formgroup = new FormGroup({
			
			montant: new FormControl('', [Validators.required]),
			Remboursement:new FormControl('', [Validators.required]),
			date:new FormControl('', [Validators.required]),
			motivation: new FormControl('',[Validators.required]),
			checked: new FormControl('',[]),
			file1: new FormControl({disabled: true, value: ''}, [Validators.required]),
		});
	}

	ionViewDidLoad() {
		this._SYGALIN.getCities();
		this._SYGALIN.getInitialData();
		
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
	}

	invalidField(field: string)
	{
		return this.formgroup.controls[field].invalid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	validField(field: string)
	{
		return this.formgroup.controls[field].valid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
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
  
  listReffilfinance() {
    console.log('list recharge financiere ');
    this.navCtrl.push("ListReffilfinancePage", {page: 'myrequests'});
  }
  hideButton() {
	this.showItem=false;
}
sendform() {
	this.showItem=true;
/*	this._SYGALIN.loadingPresent("Enregistrement...");
	let postData = new FormData();
	let ctrlN = this.navCtrl;
	postData.append('nom', this.formgroup.value['nom']);
	postData.append('tel', this.formgroup.value['tel']);
	postData.append('decodeur', this.formgroup.value['decodeur']);
	postData.append('formule', this.formgroup.value['formule']);
	postData.append('option', this.formgroup.value['option']);
	postData.append('vile', this.formgroup.value['ville']);
	postData.append('quartier', this.formgroup.value['quartier']);
	postData.append('boutique', this.user.shop);
	postData.append('bType', this.user.shopType);
	postData.append('duree', this.formgroup.value['duree']);
	postData.append('kit', this.formgroup.value['kit']);
	postData.append('uRole', this.user.role);
	postData.append('uId', this.user.id);
	postData.append('secteur', this._SYGALIN.user.sector);
	postData.append('tech', this.formgroup.value['tech']);
	
	this._SYGALIN.query("newRecruitment/", postData)
		.then(res => {
			//console.log(res);
			this.showItem=true;
			this._SYGALIN.loadingDismiss();
			if (res.type === 'success') {
				this._SYGALIN.presentToast("Recrutement effectué avec succès!", 'success');
				ctrlN.setRoot('RecruPage');
			} else {
				this._SYGALIN.presentToast(res.message, 'danger');
			}
		})
		.catch(error => {
			this._SYGALIN.loadingDismiss();
			this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
		});
	*/}

	addValue(e): void {
		var isChecked = e.currentTarget.checked;
		console.log(e.currentTarget);//undefined
		console.log(this.checked);//it is working !!!
	
	  } 
	// getUrlFile(fileName){
	  getUrlFile(){
		console.log('load cga img');
		//console.log(fileName);
		this._SYGALIN.loadingPresent("Chargement ...");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		//postData.append('file', fileName);
		let that = this;
		this._SYGALIN.query('imgT/', postData).then(res => {
			console.log(res);
			that.img = res.url;
			that.openshowimg();
			that._SYGALIN.loadingDismiss();
		}).catch(error => {
			//console.log(error);
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}

	openshowimg(){
		this.navCtrl.push('ShowfilePage',{data: this.img})
	}
}
