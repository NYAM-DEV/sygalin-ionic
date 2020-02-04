import { Component } from '@angular/core';
import {GlobalProvider} from '../../providers/global/global';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {animate, state, style, transition, trigger} from "@angular/animations";
import { CurrencyPipe, DeprecatedI18NPipesModule } from '@angular/common';

/**
 * Generated class for the ListReffilfinancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-reffilfinance',
  templateUrl: 'list-reffilfinance.html',
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
export class ListReffilfinancePage {
  	listerecharge: Array<any>;
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
	type_paie:any;
	reqCga:any;
	img:any;
	som2:number;
	unit:String="XAF";
	totalR:number; 
    totalAJ:number;
	totalM:number;
	etat_tick:String;
	
constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public _SYGALIN: GlobalProvider,
		public _ALERT: AlertController) {
	this.page = this.navParams.get('page');
	
	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListReffilfinancePage');
	this._SYGALIN.loadingPresent("Chargement de la liste");
		console.log('voici le nom de la page');
		console.log(this.page);
			
		console.log('Page: Liste recharge');

		if (this.page === "myrequests") {
			this.title = "Mes récharges";
			console.log("myrequests");

		this.ListeRechargeFinanciere();
		} else if (this.page === "myrequestsdfin") {
			this.title = "Mes récharges traité";
		//this.ListRechargFin();
		} else if (this.page === "rejected") {
			//this.title = "Réabonnements rejetés";
			//this.reaboRejected();
		}
  }
  doRefresh(event) {
		if (this.page === "myrequests") {
			this.ListeRechargeFinanciere(event);
		} else if (this.page === "myrequestsdfin") {
		///	this.ListRechargFin(event);
		} else if (this.page === "treated") {
		//	this.reaboTreated(event);
		} else if (this.page === "rejected") {
			//this.reaboRejected(event);
		}
	}

	ListeRechargeFinanciere(event?: any) {
		console.log('ListeRechargeFinanciere()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
	
			postData.append('boutique', cuser.shop);
			postData.append('bType', cuser.shopType);
			postData.append('uId', cuser.id);
			postData.append('Urole', cuser.role);
			postData.append('sector', cuser.sector);
			
			let that = this;
			this._SYGALIN.query('requests/myrequests', postData).then(res => {
				
			that.listerecharge = res;
			console.log("Liste des recharge CGA");
			console.log(this.listerecharge);
			this.solde_valide();
			console.log("Total");
			console.log(this.totalR);
			console.log("Jour");
			console.log(this.totalAJ);
			console.log("Mois");
			console.log(this.totalM);
			console.log(this.som2);
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
			msg = 'valider';
		} else {
			title = "rejet";
			msg = 'rejeter';
		}

		let alert = this._ALERT.create({
			title: 'Confirmation de ' + title,
			message: 'Voulez-vous vraiment ' + msg + ' ce réabonnement? Cette opération est irréversible...',
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
							if(request.carte_abo){
								//this.validateReabo(request);
							}else {
							//	this.presentPrompt(request,"decodeur");
							}

						} else {
							//this.presentPrompt(request);
						}
					}
				}
			]
		});
		alert.present();
	}


	valeur_b(id)
	{
		if(id=="3")
		{
			return "Banque";
		}
		else{
			return "Service mobile";
		}
	}
	valeur_valid(id)
	{
		if(id=="0")
		{
			return "En attente de validation";
		}
		else{
			if(id=="1")
			{
				return	"Demande céditée";
			}
			else
			{
				return "Demande rejetée";
			}
			
		}
	}
	valeur_resp(id)
	{
		if(id=="18")
		{
				return "DIRECTEUR FINANCIER";
		}
		else{
			
				return	"RESPONSABLE DES AA";
			
		}
	}
	valeur_valide(id)
	{
		if(this.valeur_resp(id)=="DIRECTEUR FINANCIER")
		{
				return "0/2";
		}
		else{
			
				return	"1/2";
			
		}
	}
	getUrlFile(fileName){
		console.log('load cga img');
		console.log(fileName);
		this._SYGALIN.loadingPresent("Chargement ...");
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('file', fileName);
		let that = this;
		this._SYGALIN.query('img/', postData).then(res => {
			console.log(res);
			that.img = res.url;
			that.openshowimg();
			that._SYGALIN.loadingDismiss();
		}).catch(error => {
			//console.log(error);
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		});
	}

	openshowimg(){
		this.navCtrl.push('ShowfilePage',{data: this.img})
	}
	

	solde_valide()
	{ 
		
		this.totalAJ =0;
		this.totalM=0;
		this.totalR=0;
		
		for(let r of this.listerecharge)
		{
		
			console.log(r, r.state=="1");
			if(r.state=="1")
			{
				this.totalR += Number.parseInt(r.montant);
				if(this._SYGALIN.momentjs(r.open_date).format("MM")==this._SYGALIN.momentjs().format("MM"))
				{
					this.totalM +=Number.parseInt(r.montant);
					console.log("Mois");
					console.log(this.totalM);
				}
				if(this._SYGALIN.momentjs(r.open_date).format("DD MM YYYY")==this._SYGALIN.momentjs().format("DD MM YYYY"))
				{
					this.totalAJ+=Number.parseInt(r.montant);
					console.log("Jour");
					console.log(this.totalAJ);
				}
			//console.log(som,r.montant,Number.parseInt(r.montant),som+Number.parseInt(r.montant));
			
				
				//return som;
			}
			else
			{
				this.totalR+=0;
			}
		}
	//	return totalR;
	}

	etat_ticket(id)
	{
		if(id=="0")
		{
			return "EN COURS...";
		}
		else		
		{
			if(id=="-1")
			{
				return "REJETÉ";
			}
			else
			{
				if(id=="1")
				{return "TRAITÉ";}
				
			}
			
			
		}
		
		}
		

	action_traitement(id)
	{
		//id=recharge
		//id1=next_role
		//let civil;
		if(id=="1")
		{
			return "Á été traité par :";
		}
		else
		{
			return "En cours de traitement par";
		}

	/*	if(id1="ROLE_CONTROLEUR")
		{
			 civil = "VOTRE";
		}
		else
		{
			civil = "NON DEFINI";
		}

		$civil = "";
        if($req->next_role == ROLE_CONTROLEUR)
        $civil = "VOTRE";
        elseif(empty($req->next_role))
        $civil = "NON DEFINI";
        ?>
		<b class="text-success">
		<?= $civil . ' ' . (isset($roles[$req->next_role]->role)?$roles[$req->next_role]->role:"NON DEFINI") ?></b>*/
	}

	ListRechargFin(event?: any) {
		console.log('ListRechargFin()');
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
	
			
			postData.append('uId', cuser.id);
			postData.append('Urole', cuser.role);
						
			let that = this;
			this._SYGALIN.query('validatedRequestFinancier/', postData).then(res => {
				
			that.listerecharge = res;
			console.log("Liste des recharge CGA");
			console.log(this.listerecharge);
			this.solde_valide();
			console.log("Total");
			console.log(this.totalR);
			console.log("Jour");
			console.log(this.totalAJ);
			console.log("Mois");
			console.log(this.totalM);
			console.log(this.som2);

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


	memo(id)
	{
		if(id=="null")
		{
			return "Non disponible";
		}
		else
		{
			//return " <a target="_blank" href="<?= site_url('memos/consultingMemo/'.$req->mId) ?>">consulter</a><br>";
			return "Non disponible";                                      
		}
		
		/**
		 * if($req->mCode == null){
                                                    ?>
                                                    MÉMO : <span class='bold'>Non disponible</span>
                                                    <?php
                                                }else{
                                                    ?>
                                                    MÉMO N° <?php echo $req->mCode; ?>
                                                    <a target="_blank" href="<?= site_url('memos/consultingMemo/'.$req->mId) ?>">consulter</a><br>
                                                    <?php
		 */
	}

	nom_resp_RAA(id,id1)
	{
		return id + " " + id1

	}
}
