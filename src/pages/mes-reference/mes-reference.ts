import { Component } from '@angular/core';
import {GlobalProvider} from '../../providers/global/global';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {animate, state, style, transition, trigger} from "@angular/animations";



@IonicPage()
@Component({
  selector: 'page-mes-reference',
  templateUrl: 'mes-reference.html',
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
export class MesReferencePage {

  listeref: Array<any>;
	page: string;
	title: string;
	checkedID: Array<any>;
	nom: string;
	uRole: string;
	uId: string;
	boutique: string;
	bType: string;
	user: any;
	orders: any;
	val:any;
	img:any;
	unit:String="XAF";
constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public _SYGALIN: GlobalProvider,
		public _ALERT: AlertController) {
	this.page = this.navParams.get('page');
    }


ionViewDidLoad() {
  console.log('ionViewDidLoad MesReferencePage');
this._SYGALIN.loadingPresent("Chargement de la liste");
  console.log('voici le nom de la page');
  console.log(this.page);
    
  console.log('Page: Liste recharge');

  if (this.page === "myrequests") {
    this.title = "Mes requêttes pour reference";
          this.ListeRefRequest();
  } else if (this.page === "toTreat") {
    this.title = "Mes requêttes à traiter";
  this.ListeRef();
  } else if (this.page === "toTreatmy") {
    this.title = "Mes requêttes à traiter";
    this.ListemyRef();
  }
}
doRefresh(event) {
  if (this.page === "myrequests") {
    this.ListeRefRequest(event);
  } else if (this.page === "toTreat") {
    this.ListeRef(event);
  } else if (this.page === "toTreatmy") {
    this.ListemyRef(event);
  }
}
ListeRef(event?: any) {
  console.log('Liste pour refrence');
  let postData = new FormData();
  let cuser = this._SYGALIN.getCurUser();

    
  postData.append('uId', cuser.id);
  postData.append('Urole', cuser.role);
  postData.append('Tbtq', cuser.shopType);
    
    let that = this;
    //this._SYGALIN.query('listRefRequestToTreat/', postData).then(res => {
    this._SYGALIN.query('myRefRequest/', postData).then(res => {
    that.listeref = res;
    console.log("Liste pour reference");
    console.log(this.listeref);
    
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

ListeRefRequest(event?: any) {
  console.log('Liste pour refrence');
  let postData = new FormData();
  let cuser = this._SYGALIN.getCurUser();

    
  postData.append('uId', cuser.id);
  postData.append('Urole', cuser.role);
  postData.append('Tbtq', cuser.shopType);
    
    let that = this;
    this._SYGALIN.query('listRefRequestToTreat/', postData).then(res => {
    
    that.listeref = res;
    console.log("Liste pour reference");
    console.log(this.listeref);
    
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

ListToTreatRef(event?: any) {
  console.log('ListRechargFin()');
  let postData = new FormData();
  let cuser = this._SYGALIN.getCurUser();

    
    postData.append('uId', cuser.id);
    postData.append('Urole', cuser.role);
          
    let that = this;
    this._SYGALIN.query('validatedRequestFinancier/', postData).then(res => {
      
    that.listeref = res;
    console.log("Liste des references");
    console.log(this.listeref);
        
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

RefToTreat(event?: any) {
  console.log('Traitement');
  let postData = new FormData();
  let cuser = this._SYGALIN.getCurUser();

    
  postData.append('uId', cuser.id);
  postData.append('Urole', cuser.role);
   
    
    let that = this;
    this._SYGALIN.query('answerRefRequest()/', postData).then(res => {
      
    
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

presentConfirm(request: any, type: string) {
  let msg = "", title = "";
  if (type === 'validate') {
    title = "validation";
    msg = 'Veuillez renseiner un commentaire si necessaire';
  } else if(type === 'reject'){
     title = "reject";
    msg = 'voulez-bous rejeter cette reference';
  }
   
  console.log("mon type"+type);

  let alert = this._ALERT.create({
    title: 'Confirmation de ' + title,
    message: msg,
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
            this.presentPrompt(request);
          } else if (type === 'reject'){
            this.presentPromptreject(request);
          }
        }
      }
    ]
  });
  alert.present();
}
presentConfirmVoir(request: any, type: string) {
  let smg="", title = "";
  smg=request.reference
  title = "la référence";
      console.log("request"+request.reference);
  let alert = this._ALERT.create({
    title: 'Confirmation de ' + title,
    message: smg,
    buttons: [
      {
        text: 'Copier la reference',
        handler: () => {
           if (type === 'voir'){
            this.ShowMyRef(request);
          }
        }
      }
    ]
  });
  alert.present();
}

presentPrompt(request: any) {
  let options=null;
  options={
    title: 'Reference et commantaire (Obligatoire)',
    inputs: [
      {
        name: 'reference',
        placeholder: 'Redigez la reference ici...'
      },
      {
        name: 'comment',
        placeholder: 'Redigez votre commentaire ici...'
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
          if (data.reference !== null && data.reference !== undefined && data.reference !== "" && data.comment !== null && data.comment !== undefined && data.comment !== "") {
            this.ValideRef(request, data.reference ,data.comment);
          } else {
            return false;
          }
        }
      }
    ]
  }

  let alert = this._ALERT.create(options);
  alert.present();
}
presentPromptreject(request: any) {
  let options=null;
  options={
    title: 'Motif (Obligatoire)',
    inputs: [
      {
        name: 'motif',
        placeholder: 'Redigez le motif du rejet'
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
          if (data.motif !== null && data.motif !== undefined && data.motif !== "" ) {
            this.rejectRef(request, data.motif);
          } else {
            return false;
          }
        }
      }
    ]
  }

  let alert = this._ALERT.create(options);
  alert.present();
}

ValideRef(request: any, reference: string,commantaire:string) {
  let postData = new FormData();
  let cuser = this._SYGALIN.getCurUser();
  postData.append('uId', cuser.id);
  postData.append('reference', reference);
  postData.append('motif', commantaire);
  postData.append('idTick', request.ticket);
    
  let that = this;
  this._SYGALIN.loadingPresent("Validation de la requette");
  this._SYGALIN.query('answerRefRequest/', postData).then(res => {
    console.log(res);
    let type = "success";
    if (res['type'] === 'error') {
      type = "danger";
    } else if (res['type'] === 'success') {
      that.removeItem(request);
      if (!that.listeref.length) {
        that.ListeRef();
      }
    }
    that._SYGALIN.loadingDismiss();
    that._SYGALIN.presentToast(res['message'], type, 4000);
    //that.listeref=res;
  }).catch(error => {
    console.log(error);
    that._SYGALIN.loadingDismiss();
    that._SYGALIN.presentToast("Une erreur s'est produite. Veuillez réessayer.", "danger", 4000);
  });
}
rejectRef(request: any, motif:any ) {
  let postData = new FormData();
  let cuser = this._SYGALIN.getCurUser();
  postData.append('uId', cuser.id);
  postData.append('motif', motif);
  postData.append('ticket', request.ticket);
  let that = this;
  this._SYGALIN.loadingPresent("Validation de la requette");
  this._SYGALIN.query('rejectRefRequest/', postData).then(res => {
    console.log(res);
    let type = "success";
    if (res['type'] === 'error') {
      type = "danger";
    } else if (res['type'] === 'success') {
      that.removeItem(request);
      if (!that.listeref.length) {
        that.ListeRef();
      }
    }
    that._SYGALIN.loadingDismiss();
    that._SYGALIN.presentToast(res['message'], type, 4000);
    //that.listeref=res;
  }).catch(error => {
    console.log(error);
    that._SYGALIN.loadingDismiss();
    that._SYGALIN.presentToast("Une erreur s'est produite. Veuillez réessayer.", "danger", 4000);
  });
}
removeItem(item) {
  let pos = this.listeref.map(function (e) {
    return e.ticket;
  }).indexOf(item.ticket);
  this.listeref.splice(pos, 1);
}

ShowMyRef(request: any) {
  let postData = new FormData();
  let cuser = this._SYGALIN.getCurUser();
  postData.append('idTick', request.ticket);
  postData.append('uId', this._SYGALIN.user.id);
  let that = this;
  this._SYGALIN.loadingPresent("Validation de la requette");
    this._SYGALIN.query('closeReqRef/', postData).then(res => {
  console.log(res);
    let type = "success";
    if (res['type'] === 'error') {
      type = "danger";
    } else if (res['type'] === 'success') {
      that.removeItem(request);
      if (!that.listeref.length) {
        that.ListToTreatRef();
      }
    }
    that._SYGALIN.loadingDismiss();
    that._SYGALIN.presentToast(res['message'], type, 4000);
    //that.listeref=res;
  }).catch(error => {
    console.log(error);
    that._SYGALIN.loadingDismiss();
    that._SYGALIN.presentToast("Une erreur s'est produite. Veuillez réessayer.", "danger", 4000);
  });
}

	ListemyRef(event?: any) {
		  console.log('Liste pour refrence');
		  let postData = new FormData();
			postData.append('uId', this._SYGALIN.user.id);
			postData.append('Tbtq', this._SYGALIN.user.shopType);
			postData.append('role', this._SYGALIN.user.role);
			postData.append('shop', this._SYGALIN.user.shop);
			let that = this;
			this._SYGALIN.query('myRefRequest/', postData).then(res => {

			that.listeref = res;
			console.log("Liste pour reference");
			console.log(this.listeref);

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
}
