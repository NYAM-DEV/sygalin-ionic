import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";

/**
 * Generated class for the WeeklyCommissionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-weekly-commission',
	templateUrl: 'weekly-commission.html',
})
export class WeeklyCommissionPage {
	week: any;
	pdfLink: string = "https://test-dsi.sygalin.com/api/detailComVdr/";
	view: any;

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				public _SYGALIN: GlobalProvider) {
		this.week = this.navParams.get('week');
		//console.log("Got weekly commission view");
	}

	ionViewDidLoad() {
		this.pdfLink += this._SYGALIN.getCurUser().shop + '/comview/' + this.week;
	}
}
