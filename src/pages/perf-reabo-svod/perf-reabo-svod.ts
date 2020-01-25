import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from '../../providers/global/global';

/**
 * Generated class for the PerfReaboSvodPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-perf-reabo-svod',
	templateUrl: 'perf-reabo-svod.html',
})
export class PerfReaboSvodPage {
	objparc: any = 0;
	objreabo: any = 0;
	realparc: any = 0;
	realreabo: any = 0;
	perf: any = 0;
	perfglobal: any = 0;
	performs: any = [];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public _SYGALIN: GlobalProvider) {
	}

	ionViewDidLoad() {
		this.getPerformances();
	}

	getPerformances(event?: any) {
		let cuser = this._SYGALIN.getCurUser();
		let postData = new FormData();
		postData.append('shop', cuser.shop);
		const url = 'dailyReaboSvodByShop/';
		let that = this;
		if (!event)
			that._SYGALIN.loadingPresent('Chargement des performances');
		this._SYGALIN.query(url, postData)
			.then(result => {
				console.log(result);
				let res = result.data;
				//that.performs=res;*
				that.objparc=0;
				that.objreabo=0;
				that.realparc=0;
				that.realreabo=0;
				that.perfglobal=0;
				for (var item in res) {
					console.log('item', item, 'res', res);
					that.objparc += Number(res[item].parc);
					that.objreabo += Number(res[item].montant_reabo);
					that.realparc += Number(res[item].rParc);
					that.realreabo += Number(res[item].mtn_reabo);
					that.perfglobal =parseInt(that.objreabo)>0? Math.round((parseInt(that.realreabo) / parseInt(that.objreabo)) * 100):0;
					that.perf = Number(res[item].montant_reabo) !== 0 ? Math.round((Number(res[item].mtn_reabo) / Number(res[item].montant_reabo)) * 100) : 0;
					that.performs.push(
						{
							fullDate: item,
							date: res[item].jour,
							objectifParc: res[item].parc,
							objectifreabo: res[item].montant_reabo,
							realisation: res[item].nbr,
							nbrparc: res[item].rParc,
							montant: res[item].mtn_reabo,
							performanceReabo: that.perf
						}
					);
				}
				console.log("Performances:", that.performs);
				if (event) {
					event.complete();
				} else
					that._SYGALIN.loadingDismiss();
			}).catch(error => {
			console.log(error);
			if (event) {
				event.complete();
			} else
				that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast('Erreur interne ou connexion Internet manquante', 'warning');
		});
	}

	doRefresh(event) {
		this.performs=[];
		this.getPerformances(event);
	}
}
