import {Component} from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import {
	NavController,
	NavParams,
	PopoverController,
	ViewController,
	Events,
	AlertController
} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";




@Component({
	selector: 'page-popover',
	templateUrl: 'popover.html',
})
export class PopoverPage {
	stat:any;
	end:any;
	constructor(
		public alertCtrl: AlertController,
		public viewCtrl: ViewController,
		public popoverCtrl: PopoverController,
		public navCtrl: NavController,
		public navParams: NavParams,
		public _SYGALIN: GlobalProvider,
		public _EVENT: Events,
		private appVersion: AppVersion) {
	}

	close() {
		this.viewCtrl.dismiss();
	}

	logout()
	{
		this._EVENT.publish('user:logout');
		this.close();
	}

	async about()
	{
		let version=await this.appVersion.getVersionNumber();
		const alert = this.alertCtrl.create({
			title: 'À propos',
			message: "SYGALIN TVSAT &reg; est un produit de SYGALIN SAS pour la gestion des activités d'un grossite de CANAL+.<br><em>Version " + version +
				"</em><br><em>&copy; SYGALIN S.A.S 2019</em>",
			buttons: ['OK']
		});
		alert.present();
	}


	viewPeriod()
	{
		let alert = this.alertCtrl.create({
			title: 'Période de visu',
			inputs: [
				{
					type: 'date',
					label: 'Début',
					name: 'start',
					value: this._SYGALIN.viewPeriod.start
				},
				{
					type: 'date',
					label: 'Fin',
					name: 'end',
					value: this._SYGALIN.viewPeriod.end
				}
			],
			buttons: [
				{
					text: 'Annuler',
					role: 'cancel',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Ce mois',
					handler: data => {
						console.log('this month');
						let start=this._SYGALIN.momentjs().startOf('month').format('YYYY-MM-DD');
						let end=this._SYGALIN.momentjs().endOf('month').format('YYYY-MM-DD');
						data.start=start;
						data.end=end;
						this._SYGALIN.viewPeriod.start=start;
						this._SYGALIN.viewPeriod.end=end;
					}
				},
				{
					text: 'Définir',
					handler: data => {
						console.log(data.start, data.end);
						this._SYGALIN.viewPeriod.start=data.start;
						this._SYGALIN.viewPeriod.end=data.end;
						this._SYGALIN.presentToast("Changement de période de visu effectué", "success");
					}
				}
			]
		});
		alert.present();
	}

	showAcounts(){
		this._EVENT.publish('user:openActionsheet');
	}

	transtionCGA() {
		this.navCtrl.push("RecapSoldPage");
	}
}
