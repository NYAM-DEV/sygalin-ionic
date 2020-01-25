import { Component } from '@angular/core';
import {GlobalProvider} from '../../providers/global/global';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';

/**
 * Generated class for the ListReffilfinancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-reffilfinance',
  templateUrl: 'list-reffilfinance.html',
})
export class ListReffilfinancePage {
  reabos: Array<any>;
	page: string;
	title: string;
	checkedID: Array<any>;
  constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
				public _SYGALIN: GlobalProvider,
				public _ALERT: AlertController) {
          this.page = this.navParams.get('page');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListReffilfinancePage');
    this._SYGALIN.loadingPresent("Chargement de la liste");

		//this.checkedID=[];
		console.log('Page: recrutements');
		if (this.page === "forPDV") {
			this.title = "Mes réabonnements";
		//	this.mesReabos();
		} else if (this.page === "toTreat") {
			this.title = "Réabonnements à traiter";
		//	this.reaboToTreat();
		} else if (this.page === "treated") {
			this.title = "Réabonnements traités";
		//	this.reaboTreated();
		} else if (this.page === "rejected") {
			this.title = "Réabonnements rejetés";
			//this.reaboRejected();
		}
  }
  doRefresh(event) {
		if (this.page === "forPDV") {
			//this.mesReabos(event);
		} else if (this.page === "toTreat") {
			//this.reaboToTreat(event);
		} else if (this.page === "treated") {
		//	this.reaboTreated(event);
		} else if (this.page === "rejected") {
			//this.reaboRejected(event);
		}
	}

}
