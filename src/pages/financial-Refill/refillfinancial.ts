import {Component} from '@angular/core';
import {IonicPage, NavController, Events, NavParams, ModalController, ViewController} from 'ionic-angular';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {GlobalProvider} from '../../providers/global/global';
import {animate, state, style, transition, trigger} from "@angular/animations";
import { empty } from 'rxjs/Observer';

@IonicPage()
@Component({
	selector: 'page-refillfinancial',
	templateUrl: 'refillfinancial.html',
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
export class RefillfinancialPage {
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
		this.formgroup = new FormGroup({
			option: new FormControl('', [Validators.required]),
			file1: new FormControl({disabled: true, value: ''}, [Validators.required]),
			pay_option: new FormControl('', [Validators.required]),
			search: new FormControl('', []),
			id_trans: new FormControl({disabled: true, value: ''}, [Validators.required]),
			montant: new FormControl('',[Validators.required]),
			reference: new FormControl('',[Validators.required])
		});
	}

	ionViewDidLoad() {
		this._SYGALIN.getCities();
		this._SYGALIN.getInitialData();
		this.formgroup.controls.option.setValue("0");
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


	selectChangeMopay(event) {
		console.log(event);
		this.showRef = event != 0;
		
		if(event==0)
		{

		}
		else
		{
			let payment=Array.from(this._SYGALIN.all_pay_options).filter((e: any)=> e.id==event) as Array<any>;
			this.type_paie=payment[0].type;
			console.log('TYPE PAIE: ', this.type_paie);
		}

	if (this.type_paie == 3 || this.type_paie == 6)
		{
			this.showRef=true;
			
		}
		else
		{
			this.showRef=false;
			
		}
	}

	invalidField(field: string)
	{
		return this.formgroup.controls[field].invalid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	validField(field: string)
	{
		return this.formgroup.controls[field].valid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	sendform():void {
				
		if(this.formgroup.controls['reference'].value &&  this.formgroup.controls['montant'].value && this.formgroup.controls['pay_option'].value ){
		this._SYGALIN.loadingPresent("Traitement...");	
			let postData = new FormData();
			var ctrlN = this.navCtrl;
			if (this.showRef){
			
				for (const file of this.file){
					postData.append('file[]', file);
				}
			}	
				postData.append('reference', this.formgroup.value['reference']);
				postData.append('montant', this.formgroup.value['montant']);
				postData.append('boutique', this.user.shop);
				postData.append('bType', this.user.shopType);
				postData.append('uRole', this.user.role);
				postData.append('uId', this.user.id);
				postData.append('sector', this.user.sector);
				postData.append('type_paie',this.type_paie);
				postData.append('id_trans', this.formgroup.value['id_trans']);
				postData.append('pay_option', this.formgroup.value['pay_option']);
				postData.append('shop', this.user.shop);

				let url="";
				if(this._SYGALIN.isAAD())
				{
					url="refillfinancial/";
				}
				else if(this._SYGALIN.isRESPO_AG())
				{
					url="refill/std";
				}
				this._SYGALIN.query(url, postData)
					.then(res => {
						
						this._SYGALIN.loadingDismiss();
						var type=(res.type=='success'?'success':'danger');
						this._SYGALIN.presentToast(res.message, type);
						if (type=='success')
							ctrlN.setRoot('RefillfinancialPage');
					})
					.catch(error => {
						this._SYGALIN.loadingDismiss();
						
						this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
					});
				
	
		}else
		{
			this._SYGALIN.presentToast("Bien vouloir remplir tous les champs du formulaire", 'danger');
		}	
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
	
	
}
