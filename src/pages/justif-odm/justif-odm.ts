import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";

/**
 * Generated class for the JustifOdmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-justif-odm',
	templateUrl: 'justif-odm.html',
})
export class JustifOdmPage {

	constructor(public navCtrl: NavController,
		    public navParams: NavParams,
		    public _SYGALIN: GlobalProvider) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad JustifOdmPage');
	}

}
