import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
//import {WeeklyCommissionPage} from "../weekly-commission/weekly-commission";

/**
 * Generated class for the CommissionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-commission',
	templateUrl: 'commission.html',
})
export class CommissionPage {
	data: any;
	month: any;
	remCode: any;

	constructor(public navCtrl: NavController,
		    public navParams: NavParams,
		    public _SYGALIN: GlobalProvider,
		    public _MODAL: ModalController
	) {
	}

	ionViewDidLoad() {
		//console.log('ionViewDidLoad CommissionPage');
		this._SYGALIN.loadingPresent('Chargement des commissions');
		this.commissions();
	}

	commissions(event?: any){
		let link='detailComVdr/'+ this._SYGALIN.getCurUser().shop + '/';
		let postData=new FormData();
		postData.append('values', 'FULL');
		postData.append('shop', this._SYGALIN.getCurUser().shop);
		this._SYGALIN.query(link, postData)
			.then(res=>{
				//console.log(res);
				this.data=Object.values(res.remuneration);
				this.remCode=res.remuCode;
				this.month=this._SYGALIN.momentjs(this.data[0].debut).format('MMMM YYYY');
				console.log(this.data);
				if (event){
					event.complete();
				} else
					this._SYGALIN.loadingDismiss();
			}).catch(error=>{
				console.log(error);
				this._SYGALIN.loadingDismiss();
		});
	}

	doRefresh(event) {
		this.commissions(event);
	}


	weeklyCommission(week) {
		this.navCtrl.push('WeeklyCommissionPage', {week: week});
	}
}
