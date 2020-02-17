import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, TabHighlight, TabButton} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {animate, state, style, transition, trigger} from "@angular/animations";

@IonicPage()
@Component({
  selector: 'page-mes-reqgrossiste',
  templateUrl: 'mes-reqgrossiste.html',
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
export class MesReqgrossistePage {
  reqs: Array<any>;
  page: string;
  title: string;
  

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _SYGALIN: GlobalProvider,
              public _ALERT: AlertController) {
    this.page = this.navParams.get('page');
  }

  ionViewDidLoad() {
    this._SYGALIN.loadingPresent("Chargement de la liste");
    //console.log('Page: recrutements');
    console.log("voivi ma page"+this.page)
    if (this.page === "forPDV") {
      this.title = "Mes Requettes";
      this.mesReq();
    } else if (this.page === "toTreat") {
      this.title = "Requettes à traiter";
      console.log("to trait")
      this.reqToTreat();
    } else if (this.page === "treated") {
      this.title = "Requettes traités";
      this.reqTreated();
    } else if (this.page === "rejected") {
      this.title = "Requettes rejetés";
      this.reqRejected();
    }
  }
  mesReq(event?: any){
    //console.log("mesReq");
    let postData = new FormData();
    let cuser = this._SYGALIN.getCurUser();
    postData.append('shop', cuser.shop);
    postData.append('roleId', cuser.role);
    let that = this;
    this._SYGALIN.query('typingErrorRequestList/', postData).then(res => {
      //console.log(res);
      that.reqs = res;
      if (event)
      {
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

  reqToTreat(event?: any){
    console.log("reqToTreat");
    let postData = new FormData();
    let cuser = this._SYGALIN.getCurUser();
    postData.append('shop', cuser.shop);
    postData.append('roleId', cuser.role);
    postData.append('uId', cuser.id);
    let that = this;
    this._SYGALIN.query('typingErrorRequestList/', postData).then(res => {
     
     // console.log(res);
      that.reqs = res;
      if (event)
      {
        event.complete();
      } else
        that._SYGALIN.loadingDismiss();
    }).catch(error => {
      //console.log(error);
      if (event) {
        event.complete();
      } else
        that._SYGALIN.loadingDismiss();
      that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
    });
  }
  reqTreated(event?: any){
    console.log("reqTreated");
  }
  reqRejected(event?: any){
    console.log("reqRejected");
  }
  validateReq(request: any){
        
		this._SYGALIN.loadingPresent("Enregistrement...");
		let postData = new FormData();
		var ctrlN = this.navCtrl;
     

			postData.append('uId', this._SYGALIN.user.id);
			postData.append('sector', this._SYGALIN.user.sector);
			postData.append('roleId', this._SYGALIN.user.role);
			postData.append('shop', this._SYGALIN.user.shop);
			postData.append('bType', this._SYGALIN.user.shopType);
      postData.append('cuser', this._SYGALIN.user.cuser);
      postData.append('type', request.type);
      postData.append('id', request.id);
     
      let that = this;
			this._SYGALIN.query("confirmReq/", postData).then(res => {
        console.log("resources"+res);
        let type = "success";
        console.log(res['type']);
        if (res['type'] === 'error') {
          type = "danger";
        }
         else if (res['type'] === 'success') {
          that.removeItem(request);
          if (!that.reqs.length) {
            this.reqToTreat();
          }
        }
        that._SYGALIN.loadingDismiss();
        that._SYGALIN.presentToast(res['message'], type, 4000);
        
      }).catch(error => {
        console.log(error);
        this._SYGALIN.loadingDismiss();
        this._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
      })
  }
  rejectReq(request: any, motivation: string){
    console.log('rejectReq');
  }

  doRefresh(event) {
    if (this.page === "forPDV") {
      this.mesReq(event);
    } else if (this.page === "toTreat") {
      this.reqToTreat(event);
    } else if (this.page === "treated") {
      this.reqTreated(event);
    } else if (this.page === "rejected") {
      this.reqRejected(event);
    }
  }
  presentConfirm(request: any, type: string) {
    let msg = "", title = "";
    if (type === 'validate') {
      title = "validation";
      msg = 'valider';
    } else {
      title = "rejet";
      msg = 'rejeter';
    }

    let alert = this._ALERT.create({
      title: 'Confirmation de ' + title,
      message: 'Voulez-vous vraiment ' + msg + ' ce recrutement? Cette opération est irréversible...',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          handler: () => {
            console.log('Opération annulée');
          }
        },
        {
          text: 'Oui',
          handler: () => {
            if (type === 'validate') {
              this.validateReq(request);
            } else {
              this.presentPrompt(request);
            }
          }
        }
      ]
    });
    alert.present();
  }
  presentPrompt(request: any) {
    let alert = this._ALERT.create({
      title: 'Motif de rejet (Obligatoire)',
      inputs: [
        {
          name: 'motivation',
          placeholder: 'Redigez votre motif ici...'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: data => {
            console.log('Opération annulée');
          }
        },
        {
          text: 'OK',
          handler: data => {
            if (data.motivation !== null && data.motivation !== undefined && data.motivation !== "") {
              this.rejectReq(request, data.motivation);
            } else {
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }
  
  removeItem(item) {
		let pos = this.reqs.map(function (e) {
			return e.ticket;
		}).indexOf(item.ticket);
		this.reqs.splice(pos, 1);
	}
}
