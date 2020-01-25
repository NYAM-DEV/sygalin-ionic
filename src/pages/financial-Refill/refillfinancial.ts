import {Component} from '@angular/core';
import {IonicPage, NavController, Events, NavParams, ModalController, ViewController} from 'ionic-angular';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {GlobalProvider} from '../../providers/global/global';
import {animate, state, style, transition, trigger} from "@angular/animations";

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
	showDocFile:boolean=false;
	nom: string;
	tel: string;
	decodeur: string;
	formule: string;
	option: string;
	showRef: any;
	duree: string;
	uRole: string;
	uId: string;
	boutique: string;
	bType: string;
	user: any;
	amount: any;
	type_paie: any;
	showItem:boolean=false;
	page: any;
	orders: any;
	title: any;
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
			nom: new FormControl('', [Validators.required]),
			tel: new FormControl('', [Validators.required,Validators.minLength(9),Validators.maxLength(9)]),
			decodeur: new FormControl('', [Validators.minLength(12), Validators.maxLength(14)]),
			formule: new FormControl('', [Validators.required]),
			option: new FormControl('', [Validators.required]),
			file1: new FormControl({disabled: true, value: ''}, [Validators.required]),
			duree: new FormControl('', [Validators.required]),
			pay_option: new FormControl('', [Validators.required]),
			search: new FormControl('', []),
			doc:new FormControl('',[]),
			//file: new FormControl({disabled: true, value: ''}, [Validators.required]),
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
			console.log("Tpe de fichier")
			console.log(this.fileTypes)
	}


	isFieldValid(field: string) {
		return !this.formgroup.get(field).valid && this.formgroup.get(field).touched;
	}

	displayFieldCss(field: string) {
		return {
			'has-error': this.isFieldValid(field),
			'has-feedback': this.isFieldValid(field)
		};
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({
					onlySelf: true
				});
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	selectChangedOption(event) {
		console.log(event);
		if (this.formgroup.controls['duree'].value && this.formgroup.controls['formule'].value) {
			let postData = new FormData();
			postData.append('option', event);
			postData.append('duree', this.formgroup.controls['duree'].value);
			postData.append('formule', this.formgroup.controls['formule'].value);

			let that = this;
			this._SYGALIN.query('getReaboAmount/', postData, true)
				.then(res => {
					console.log('Montant recru:', res);
					that.amount = res;
				}, reason => {
					console.log('Raison:', reason);
				})
				.catch(error => {
					console.log('Erreur:', error);
				})
		}
	}

	selectChangeMopay(event) {
		console.log(event);
		this.showRef = event != 0;
		
	
		let payment=Array.from(this._SYGALIN.all_pay_options).filter((e: any)=> e.id==event) as Array<any>;
		this.type_paie=payment[0].type;
		console.log('TYPE PAIE: ', this.type_paie);

	if (this.type_paie == 3)
		{
			this.showRef=true;
			//this.formgroup.get('file1').enable();
		}
		else
		{
			this.showRef=false;
			//this.formgroup.get('file1').disable();
		}
	}

	getItem(item) {
		let pos = this._SYGALIN.pay_options.map(function (e) {
			return e.id;
		}).indexOf(item);
		return this._SYGALIN.pay_options[pos];
	}
	formCacher(field: string)
	{
		if (this.type_paie==2)
		{
			return this.formgroup.disable[field];
		}
		else
		{
			return this.formgroup.enable[field];
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

	

	sendform3() {
		this._SYGALIN.loadingPresent("Traitement...");
		
		let postData = new FormData();
		var ctrlN = this.navCtrl;
		if (this.showRef){
			//this._SYGALIN.presentToast("Veuillez renseigner le(s) fichier(s) justificatif(s)", 'danger', 4000);
			//for (const file of this.file){
				//postData.append('files[]', file);
			//}
		}
		for (const file of this.file){
			postData.append('files[]', file);
		}
			postData.append('reference', this.formgroup.value['reference']);
			postData.append('montant', this.formgroup.value['montant']);
			postData.append('boutique', this.user.shop);
			postData.append('bType', this.user.shopType);
			postData.append('duree', this.formgroup.value['duree']);
			postData.append('uRole', this.user.role);
			postData.append('uId', this.user.id);
			postData.append('sector', this.user.sector);
			postData.append('type_paie',this.type_paie);
			postData.append('id_trans', this.formgroup.value['id_trans']);
			postData.append('pay_option', this.formgroup.value['pay_option']);
			this._SYGALIN.query("refillfinancial/", postData)
				.then(res => {
					//console.log(res);
					this._SYGALIN.loadingDismiss();
					var type=(res.type=='success'?'success':'danger');
					this._SYGALIN.presentToast(res.message, type);
					if (type=='success')
						ctrlN.setRoot('RefillfinancialPage');
				})
				.catch(error => {
					this._SYGALIN.loadingDismiss();
					//console.log("Une erreur survenue:  " + error);
					this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
				});
			
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
			this.navCtrl.push("ListReffilfinancePage", {page: 'forPDV'});
		}
	
	
}
