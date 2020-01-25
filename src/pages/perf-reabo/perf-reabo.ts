import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from '../../providers/global/global';

/**
 * Generated class for the PerfReaboPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-perf-reabo',
	templateUrl: 'perf-reabo.html',
})
export class PerfReaboPage {
	objparc: any = 0;
	objreabo: any = 0;
	realparc: any = 0;
	realreabo: any = 0;
	perf: any = 0;
	arpu: any = 0;
	arpuGlobal: any = 0;
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
		const url = 'dailyReaboByShop/';
		let that = this;
		if (!event)
			that._SYGALIN.loadingPresent('Chargement des performances');
		this._SYGALIN.query(url, postData)
			.then(res => {
				console.log(res);
				//that.performs=res;
				that.objparc=0;
				that.objreabo=0;
				that.realparc=0;
				that.realreabo=0;
				that.perfglobal=0;
				that.arpu=0;
				that.arpuGlobal=0;
				that.perf=0;
				for (var item in res) {
					that.objparc += Number(res[item].objparc);
					that.objreabo += Number(res[item].objreabo);
					that.realparc += Number(res[item].nbrparc);
					that.realreabo += Number(res[item].montant);
					that.perfglobal = parseInt(that.objreabo)!=0?Math.round((parseInt(that.realreabo) / parseInt(that.objreabo)) * 100):0;
					that.arpu = parseInt(res[item].nbrparc)!=0? Math.round(parseInt(res[item].montant)/parseInt(res[item].nbrparc)):0;
					that.arpuGlobal += that.arpu ;

					that.perf = Number(res[item].objreabo)!=0?Math.round((Number(res[item].montant) / Number(res[item].objreabo)) * 100):0;
					//console.log("Montant: ", res[item].montant, "objreabo: ", Number(res[item].objreabo));
					that.performs.push(
						{
							fullDate: item,
							date: res[item].jour,
							objectifParc: res[item].objparc,
							objectifreabo: res[item].objreabo,
							realisation: res[item].nbr,
							nbrparc: res[item].nbrparc,
							montant: res[item].montant,
							arpu: that.arpu,
							performanceReabo: that.perf
						}
					);
				}
				if (event) {
					event.complete();
				} else
					that._SYGALIN.loadingDismiss();
				//ctrl.push(PerfrecrutementsPage, { listPerform: res });
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
