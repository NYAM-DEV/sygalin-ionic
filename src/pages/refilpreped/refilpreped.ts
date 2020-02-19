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
}
