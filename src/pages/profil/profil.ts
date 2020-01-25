import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from '../../providers/global/global';
import {FormControl, FormGroup, Validators} from "@angular/forms";


@IonicPage()
@Component({
	selector: 'page-profil',
	templateUrl: 'profil.html',
})
export class ProfilPage {
	formgroup: FormGroup;
	uNom:any;
	cuser:any;
	user:any;
	tel:any;
	pwd1;pwd2;pwd3;uId:any;

	constructor(public navCtrl: NavController, public navParams: NavParams,public _SYGALIN: GlobalProvider, public _EVENT: Events) {

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ProfilPage');
	}

	ngOnInit() {

		this.user = this._SYGALIN.user;
		this.uNom=this._SYGALIN.user.name;
		this.tel=this._SYGALIN.user.tel;
		this.cuser=this._SYGALIN.user.cuser;
		this.formgroup = new FormGroup({
			pwd1: new FormControl('', [Validators.required]),
			pwd2: new FormControl('', [Validators.required]),
			pwd3: new FormControl('', [Validators.required]),
		});
	}

	invalidField(field: string)
	{
		return this.formgroup.controls[field].invalid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	validField(field: string)
	{
		return this.formgroup.controls[field].valid && (this.formgroup.controls[field].dirty || this.formgroup.controls[field].touched);
	}

	onSubmit() {
		if (this.formgroup.valid) {
			this.editok();
		} else {
			this.validateAllFormFields(this.formgroup);
			this._SYGALIN.presentToast('Bien vouloir remplir tous les champs du formulaire', 'danger');
		}
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


	editok(){
		//var ctrlN = this.navCtrl;

		if(this.formgroup.value["pwd2"]!==this.formgroup.value["pwd3"]){
			this._SYGALIN.presentToast("Les mots de passe ne correspondent pas", "danger");
		}else{
			this._SYGALIN.loadingPresent("Enregistrement...");
			let postData= new FormData();

			postData.append('uId',this._SYGALIN.user.id);
			postData.append('new_pwd',this.formgroup.value["pwd2"]);
			postData.append('last_pwd',this.formgroup.value["pwd1"]);
			this._SYGALIN.query("new_pwd/", postData)
				.then(res => {
					console.log(res);
					this._SYGALIN.loadingDismiss();
					var type=(res.type=='success'?'success':'danger');
					this._SYGALIN.presentToast(res.message, type);
					this._EVENT.publish('user:logout');
				})
				.catch(error => {
					this._SYGALIN.loadingDismiss();
					console.log("Une erreur survenue:  ", error);
					this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 600)", 'danger');
				});
		}

	}

}
