import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GlobalProvider} from "../../providers/global/global";
import {Events} from 'ionic-angular';
import {IonicSelectableComponent} from 'ionic-selectable';

class Port {
	public id: number;
	public nom: string;
}


@IonicPage()
@Component({
	selector: 'page-my-prospect',
	templateUrl: 'my-prospect.html',
})
export class MyProspectPage {
	ports: Port[];
	port: Port;
	villes: Port[];
	quartiers: Port[];
	formgroup: FormGroup;
	hideQuartier: any;
	hideVille: any;
	today: any;
	user: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public _SYGALIN: GlobalProvider, public events: Events) {
		this.hideQuartier = true;
		this.hideVille = true;
		this.today = new Date().toISOString();

		//this.ports = [
		//{ id: 1, name: 'Tokai' },
		//{ id: 2, name: 'Vladivostok' },
		//{ id: 3, name: 'Navlakhi' }
		//];
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad MyProspectPage');
		this._SYGALIN.getCities();
		this._SYGALIN.getInitialData();
		this.ports = this._SYGALIN.villes;
		this.villes = this._SYGALIN.villes;
		this.quartiers = this._SYGALIN.quartiers;
	}

	ngOnInit() {
		this.getville_quartier();
		this.user = this._SYGALIN.getCurUser();
		this.formgroup = new FormGroup({
			civ: new FormControl('', [Validators.required]),
			nom: new FormControl('', [Validators.required]),
			prenom: new FormControl('', [Validators.required]),
			tel: new FormControl('', [Validators.minLength(9), Validators.maxLength(9),Validators.required]),
			region: new FormControl('', [Validators.required]),
			ville: new FormControl('', [Validators.required]),
			new_ville: new FormControl('', []),
			quartier: new FormControl('', [Validators.required]),
			new_quartier: new FormControl('', []),
			longitude: new FormControl('', []),
			latitude: new FormControl('', []),
			today: new FormControl('', [Validators.required]),
			lieu: new FormControl('', [Validators.required])
		});
	}

	onSubmit1() {
		if (this.formgroup.valid) {
			this.sendform();
		} else {
			this.validateAllFormFields(this.formgroup);
			this._SYGALIN.presentToast('Bien vouloir remplir tous les champs du formulaire', 'danger');
		}
	}

	validateAllFormFields(formGroup: FormGroup) { //{1}
		Object.keys(formGroup.controls).forEach(field => { //{2}
			const control = formGroup.get(field); //{3}
			if (control instanceof FormControl) { //{4}
				control.markAsTouched({
					onlySelf: true
				});
			} else if (control instanceof FormGroup) { //{5}
				this.validateAllFormFields(control); //{6}
			}
		});
	}

	sendform() {
		this._SYGALIN.loadingPresent("Enregistrement...");
		//console.log('new prospect ');
		let postData = new FormData();
		var ctrlN = this.navCtrl;
		// var toast = this.presentToast;
		postData.append('civilite', this.formgroup.value['civ']);
		postData.append('nom', this.formgroup.value['nom']);
		postData.append('prenom', this.formgroup.value['prenom']);
		postData.append('tel', this.formgroup.value['tel']);
		postData.append('region', this.formgroup.value['region']);
		if (this.formgroup.value['ville'].id == 0) {
			postData.append('ville', this.formgroup.value['new_ville']);
		} else {
			postData.append('ville', this.formgroup.value['ville'].id);
		}
		if (this.formgroup.value['quartier'].id == 0) {
			postData.append('quartier', this.formgroup.value['new_quartier']);
		} else {
			postData.append('quartier', this.formgroup.value['quartier'].id);
		}
		postData.append('lng', this.formgroup.value['longitude']);
		postData.append('lat', this.formgroup.value['latitude']);
		postData.append('date_rdv', this.formgroup.value['today']);
		postData.append('lieu', this.formgroup.value['lieu']);

		postData.append('option', this.formgroup.value['option']);
		postData.append('boutique', this.user.shop);
		postData.append('sector', this.user.sector);
		postData.append('uRole', this.user.role);
		postData.append('uId', this.user.id);
		this._SYGALIN.query("saveProspect/", postData)
			.then(res => {
				//console.log(res);
				this._SYGALIN.loadingDismiss();
				var type=(res.type=='success'?'success':'danger');
				this._SYGALIN.presentToast(res.message, type);
				if (type=='success')
					ctrlN.setRoot('MyProspectPage');

			})
			.catch(error => {
				this._SYGALIN.loadingDismiss();
				this._SYGALIN.presentToast("Une erreur interne est survenue. Veuillez réessayer (Code 104)", 'danger');
			});
		//this.events.publish('prospet:ville',  Date.now());
	}

	getville_quartier() {
		let that = this;
		let postData = new FormData();
		//Récupération des infos sur les villes dans la BD distante
		this._SYGALIN.query('AllVille/', postData, false)
			.then(v => {
				//console.log(v);
				that._SYGALIN.setVilles(v);
			})
			.catch(error => {
				console.log(error);
				this._SYGALIN.presentToast("Impossible d'accéder à Internet. Veuillez vérifier que vous avez accès à Internet", "warning");
			});
		this._SYGALIN.query('AllQuartier/', postData, false)
			.then(q => {
				//console.log(q);
				that._SYGALIN.setQuarier(q);
			})
			.catch(error => {
				//console.log(error);
				this._SYGALIN.presentToast("Impossible d'accéder à Internet. Veuillez vérifier que vous avez accès à Internet", "warning");
			});

		this._SYGALIN.query('AllRegion/', postData, false)
			.then(r => {
				//console.log(r);
				that._SYGALIN.setRegion(r);
			})
			.catch(error => {
				//console.log(error);
				this._SYGALIN.presentToast("Impossible d'accéder à Internet. Veuillez vérifier que vous avez accès à Internet", "warning");
			});
		this.ports = this._SYGALIN.villes;
	}


	selectChangedQuartier(event: {
		component: IonicSelectableComponent,
		value: Port;
	}) {
		console.log('port:', event.value.id);
		this.hideQuartier = event.value.id != 0;
	}

	selectChangedVille(event: {
		component: IonicSelectableComponent,
		value: Port;
	}) {
		console.log('port:', event.value.id);
		this.hideVille = event.value.id != 0;
	}

	listProspect() {
		this.navCtrl.push("MesProspectPage", {page: 'forPDV'});
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
