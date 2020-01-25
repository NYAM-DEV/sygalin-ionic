import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {GlobalProvider} from '../../providers/global/global';
//import {MesMigrationsPage} from '../mes-migrations/mes-migrations';

@IonicPage()
@Component({
	selector: 'page-migr',
	templateUrl: 'migr.html'
})
export class MigrPage {
	formgroup: FormGroup;
	user: any;
	tel: string;
	old_decodeur: string;
	new_decodeur: string;
	kit: any;
	nom: any;
	typeMigrations: any;
	//migrationKeys: any;
	amount: any;
	showRef: any;
	masks: any;

	constructor(public navCtrl: NavController,
		    public navParams: NavParams,
		    public _SYGALIN: GlobalProvider) {
		this.showRef = false;
		this.masks = {
			tel: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/],
			decodeur: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
		};
	}

	ionViewDidLoad() {
		this._SYGALIN.getCities();
		this._SYGALIN.getInitialData();
		this.typeMigrations = [];
		this._SYGALIN.migrKits.forEach((kit, index)=>{
			this.typeMigrations.push({
				id: kit.id,
				type: 'SX2 ---> '+kit.libelle,
				prix: kit.prix_migr_std
			});
		});
		let last= this._SYGALIN.migrKits.slice(-1)[0];
		this.typeMigrations.push(
			{
				id: last.id,
				type: 'S10 & S11 ---> '+last.libelle,
				prix: 5000,
			}
		);
	}

	ngOnInit() {
		this.user = this._SYGALIN.getCurUser();
		this.formgroup = new FormGroup({
			nom: new FormControl('', [Validators.required]),
			// tel: new FormControl(this.createPhone()),
			tel: new FormControl('', [Validators.minLength(9), Validators.maxLength(9),Validators.required]),
			old_decodeur: new FormControl('', [Validators.minLength(12), Validators.maxLength(14), Validators.required]),
			new_decodeur: new FormControl('', [Validators.minLength(12), Validators.maxLength(14),  Validators.required]),
			kit: new FormControl('', [Validators.required]),
			pay_option: new FormControl('', [Validators.required]),
			id_trans: new FormControl({disabled: true, value: ''}, [Validators.required])
		});
	}

	onSubmit() {
		if (this.formgroup.valid) {
			this.sendform();
		} else {
			this.validateAllFormFields(this.formgroup);
			this._SYGALIN.presentToast('Bien vouloir remplir tous les champs du formulaire', 'danger');
		}
	}

	sendform() {
		this._SYGALIN.loadingPresent("Enregistrement...");
		let postData = new FormData();
		var ctrlN = this.navCtrl;
		postData.append('nom', this.formgroup.value['nom']);
		postData.append('tel', this.formgroup.value['tel']);
		postData.append('old_decodeur', this.formgroup.value['old_decodeur']);
		postData.append('new_decodeur', this.formgroup.value['new_decodeur']);
		let kit = this.formgroup.value['kit'];
		// let prix = this.typeMigrations[kit].prix;
		postData.append('kit', kit);
		/*let pos = this.typeMigrations.map(function (e) {
			return e.id;
		}).indexOf(kit);*/
		//console.log('POS: ', pos, 'Type: ', this.typeMigrations);
		postData.append('prix', this.typeMigrations[kit].prix);

		postData.append('boutique', this.user.shop);
		postData.append('bType', this.user.shopType);
		postData.append('uRole', this.user.role);
		postData.append('uId', this.user.id);
		postData.append('secteur_Id', this.user.sector);

		postData.append('id_trans', this.formgroup.value['id_trans']);
		postData.append('pay_option', this.formgroup.value['pay_option']);

		this._SYGALIN.query("newMigrationRecru/", postData)
			.then(res => {
				//console.log(res);
				this._SYGALIN.loadingDismiss();
				var type=(res.type=='success'?'success':'danger');
				this._SYGALIN.presentToast(res.message, type);
				if (type=='success')
					ctrlN.setRoot(MigrPage);
			})
			.catch(error => {
				this._SYGALIN.loadingDismiss();
				console.log("Une erreur survenue:  ", error);
				this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer", 'danger');
			});

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

	performMigration() {
		this.navCtrl.push("PerfMigrPage");
	}

	mesMigrations() {
		this.navCtrl.push('MesMigrationsPage', {page: 'forPDV'});
	}

	selectChangedKit(event) {
		console.log(event);
		this.amount = this.typeMigrations[event].prix;
	}

	selectChangeMopay(event) {
		console.log(event);
		this.showRef = event != 0;
		if (this.showRef) {
			this.formgroup.get('id_trans').enable();
		} else {
			this.formgroup.get('id_trans').disable();
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
}
