import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from '../../providers/global/global';

/**
 * Generated class for the PerfMigrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-perf-migr',
	templateUrl: 'perf-migr.html',
})
export class PerfMigrPage {
	performs: any = [];
	obj: any = 0;
	real: any = 0;
	montant: any = 0;
	perfglobal: any = 0;
	perf: any = 0;

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
		const url = 'dailyMigrationByShop/';
		let that = this;
		if (!event)
			that._SYGALIN.loadingPresent('Chargement des performances');
		this._SYGALIN.query(url, postData)
			.then(res => {
				console.log(res);
				//that.performs=res;
				that.obj=0;
				that.real=0;
				that.montant=0;
				that.perfglobal=0;
				that.perf=0;
				for (var item in res) {
					that.obj += Number(res[item].obj);
					that.real += Number(res[item].nbr);
					that.montant += Number(res[item].montant);
					that.perfglobal = Number(that.obj) !== 0 ? Math.round((Number(that.real) / Number(that.obj)) * 100) : 0;
					that.perf = Number(res[item].obj) !== 0 ? Math.round((Number(res[item].nbr) / Number(res[item].obj)) * 100) : 0;
					that.performs.push(
						{
							fullDate: item,
							date: res[item].jour,
							objectif: res[item].obj,
							realisation: res[item].nbr,
							montant: res[item].montant,
							performancemigra: that.perf
						}
					);
				}
				if (event) {
					event.complete();
				} else
					that._SYGALIN.loadingDismiss();
				//ctrl.push(PerfrecrutementsPage, { listPerform: res });
			}).catch(error => {
			//console.log(error);
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
