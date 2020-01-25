import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {GlobalProvider} from "../../providers/global/global";


@IonicPage()
@Component({
  selector: 'page-init-cmd-b',
  templateUrl: 'init-cmd-b.html',
})
export class InitCmdBPage {
	today: any;
	formgroup: FormGroup;
	user: any;
	refCmd: any;
	private showTotal: boolean=false;
	private showAccessoire: boolean=false;
	localKits:any;
	selectedKits:any;

  constructor(public navCtrl: NavController,
			  private _FB: FormBuilder,
			  public navParams: NavParams,
			  public _SYGALIN: GlobalProvider) {
	  this.today = new Date().toISOString();
	  this.refCmd="REF00012";
	  this.localKits=this._SYGALIN.kits;
	  this.selectedKits=[];
	  this.formgroup=this._FB.group({
		  today: ['', Validators.required],
		  kit:['',Validators.required]
	  });
	  this.newShopOrder();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InitCmdBPage');
  }



	simuler() {
		this.showTotal=true;
	}

	showAccessoirefn() {
		this.showAccessoire=!this.showAccessoire;
	}
	newShopOrder(){
		this._SYGALIN.loadingPresent("Chargement ...");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		//postData.append('user_id', cuser.id);
		//postData.append('user_role', cuser.role);
		postData.append('shop', cuser.shop);
		let that = this;
		this._SYGALIN.query('newShopOrder/cmdPrepaye/', postData).then(res => {
			that._SYGALIN.loadingDismiss();

			console.log(res);
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})
	}

	addNewKits(event?:any): void {
		let newKit_id=this.formgroup.get('kit').value;
		let newKit:any;
		let test:boolean=false;
		this.localKits.forEach((k)=>{
			if (k.id==newKit_id){
				newKit=k;
			}
		});

		this.selectedKits.some((k)=>{
			if (k.id==newKit.id){
				test=true;
			}
		});
		if (test==false){
			this.selectedKits.push(newKit);
			this.formgroup.addControl("Qte_"+newKit_id,new FormControl('', Validators.required));
		}
		console.log(" add table",this.selectedKits);
	}


	removeKits(i: any): void {
		let controlkey='Qte_'+i;
		let that=this;
		this.formgroup.removeControl(controlkey);
		this.selectedKits.forEach((k,index)=>{
			if(k.id==i){
				//console.log(k.id);
				that.selectedKits.splice(index,1);
			}
		});
		console.log("delete table ",this.selectedKits);
	}
}
