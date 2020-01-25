import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";

/**
 * Generated class for the DetailsStatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-details-stats',
	templateUrl: 'details-stats.html',
})
export class DetailsStatsPage {
	extraTitle: string=null;
	cb: any;
	sector: any;
	CBS: any=null;
	LCBS: any=null;
	SECS: any=null;
	detType: any;
	secId: any;
	cbId: any;
	apply: boolean=true;
	reply: boolean=true;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public _SYGALIN: GlobalProvider) {
		this.detType=this.navParams.get('type');
		this.secId=this.navParams.get('sec');
		this.cbId=this.navParams.get('cb');
		this.extraTitle=(this.detType=='bysec'?'équipes de VAD':'VAD');
		console.log('CHANGED', this.detType, this.secId, this.cbId, navParams);
	}

	ionViewDidLoad() {
		// this.VADS=this._SYGALIN._GLOBAL_STATS.
		this.CBS=this._SYGALIN.getCBs(null, this.cbId);
		this.SECS=this._SYGALIN.getStatSectors(this.secId);
		if (this.detType=='bysec'){
			this.sector=this.secId;
		}else if (this.detType=='bycb'){
			this.cb=this.cbId;
			this.sector=this.secId;
			this.LCBS=this._SYGALIN.getCBs(this.secId);
		}
	}

	selectChangedSector(event){
		console.log("SECTOR BEFORE", this.apply, this.reply);
		this.LCBS=this._SYGALIN.getCBs(event);
		if (this.apply){
			this.CBS=this._SYGALIN.getCBs(event);
			this.SECS=this._SYGALIN.getStatSectors(event);
			this.reply=false;
			this.apply=true;
			this.cb='0';
		}
		this.apply=true;
		console.log("SECTOR AFTER", this.apply, this.reply);
	}

	selectChangedCB(event){
		//console.log(event);
		console.log("CB BEFORE", this.apply, this.reply);
		this.CBS=this._SYGALIN.getCBs(null, event);
		//console.log('CBS', this.CBS);
		if (event!='0')
		{
			let cb=this.CBS[0];
			this.apply=false;
			this.sector=cb.secteur;
		} else if (this.reply){
			this.apply=false;
			this.sector='0';
		}
		console.log("CB AFTER", this.apply, this.reply);
	}

	doNothing()
	{
		console.log("Nothing here");
	}

	seeDetails(type: string, sector: any,  cb: any=null)
	{
		console.log('sent id', sector, cb);
		this.navCtrl.push('DetailsStatsPage', {type: type, sec: sector, cb: cb});
	}
}
