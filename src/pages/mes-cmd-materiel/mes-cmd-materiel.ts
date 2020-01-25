import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {GlobalProvider} from "../../providers/global/global";
import {RDVModal} from "../rdv-prospect/rdv-prospect";
//import {FormControl, FormGroup, Validators} from "@angular/forms";

/**
 * Generated class for the MesCmdMaterielPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-mes-cmd-materiel',
	templateUrl: 'mes-cmd-materiel.html',
	animations: [
		trigger('listItemState', [
			state('in',
				style({
					opacity: 1,
					height: '*',
					minHeight: '*'
				})
			),
			transition('* => void', [
				animate('0.57s ease-out', style({
					opacity: 0,
					height: '1px',
					minHeight: '1px'
				}))
			])
		])
	]
})
export class MesCmdMaterielPage {
	cmds: any;
	page: any;
	constructor(public navCtrl: NavController, public navParams: NavParams, public _SYGALIN: GlobalProvider, public _MODAL: ModalController) {
	}

	ionViewDidLoad() {
		this._SYGALIN.loadingPresent("Chargement de la liste");
		this.cmds=[];
		this.page="forPDV";
		this.mesCmds();
	}

	mesCmds(event?: any) {
		console.log('mesCmds()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('shop', cuser.shop);
		postData.append('role', cuser.role);
		let that = this;
		this._SYGALIN.query('myShopOrders/', postData).then(res => {
			console.log(res);
			that.cmds = res;
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
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}


	doRefresh(event) {
		if (this.page === "forPDV") {
			this.mesCmds(event);
		}
	}

	showDetails(cmd){
		let details = this._MODAL.create(DetailsCmd, {cmd: cmd}, {showBackdrop: true, enableBackdropDismiss: true});
		details.onDidDismiss(data => {
			console.log(data);
		});
		details.present();
	}

}



@Component({
	selector: 'page-details-cmd',
	templateUrl: 'details-cmd.html',
})
export class DetailsCmd {
	cmd: any;
	kcomplets: any;
	access_kit: any;
	access_h_kit: any;
	declarations: any;
	constructor(public _SYGALIN: GlobalProvider, public navParams: NavParams, public _VIEW: ViewController) {
		//console.log('UserId', params.get('userId'));
		this.cmd=this.navParams.get('cmd');
	}

	ngOnInit() {
		this.kcomplets=[];
		this.access_h_kit=[];
		this.access_kit=[];
		this.declarations=[];
	}

	ionViewDidLoad(){
		console.log(this.cmd);
		this._SYGALIN.query('recapitulatoryMateriel/'+this.cmd.id+'/commande_materiel_kit/cmd', null)
			.then(res=>{
				//this.kcomplets=this._SYGALIN.toa;
				console.log('None');
			}).catch(error=>{
				console.log(error);
		});
		this._SYGALIN.query('getAccessoryShopCmd/'+this.cmd.id+'/', null)
			.then(res=>{
				this.access_h_kit=res;
				this.access_kit=res;
			}).catch(error=>{
				console.log(error);
		});
		this.declarations=JSON.parse(this.cmd.declaration);
	}
	async decNom(id){
		var nom= await this._SYGALIN.query('NomMateriel/'+id+'/', null);
		return nom;
	}

	dismiss(){
		this._VIEW.dismiss();
	}
}
