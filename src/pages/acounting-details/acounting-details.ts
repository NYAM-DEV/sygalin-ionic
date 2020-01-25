import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams,Events} from 'ionic-angular';
import {FormControl, FormGroup, Validators,FormBuilder,FormArray} from "@angular/forms";
import {GlobalProvider} from "../../providers/global/global";


@IonicPage()
@Component({
  selector: 'page-acounting-details',
  templateUrl: 'acounting-details.html',
})
export class AcountingDetailsPage {
	amountCompare:boolean=false;
	request_detail:any;
	planComptable:any;
	boutiques:any;
	departement:any;
	journal:any;
	formgroup: FormGroup;
	ticket:any;
	decaissement:any;
	type:any;

  constructor(public navCtrl: NavController,
			  public _SYGALIN: GlobalProvider,
			  public _ALERT: AlertController,
			  public events: Events,
			  public navParams: NavParams,
			  private _FB: FormBuilder) {
	this.type=this.navParams.get("type");
	this.request_detail=this.navParams.get("req");
	this.planComptable = navParams.get('planComptable');
	this.boutiques = navParams.get('boutiques');
	this.departement = navParams.get('departement');
	this.journal = navParams.get('journal');
	console.log("mes params data", this.request_detail);
	this.formgroup=this._FB.group({
		motivation: [this.request_detail.objet, Validators.required],
		montant: [this.request_detail.montant, Validators.required],
		departement: ['', Validators.required],
		boutique: ['', Validators.required],
		journal: ['', Validators.required],
		debits: this._FB.array([
			this.initDebitFields()
		]),
		credits: this._FB.array([
			this.initCreditFields()
		])
	})
  }

  disbursmentdetailReaffect(){
	  this._SYGALIN.loadingPresent("Chargement ...");
	  let postData = new FormData();
	  let cuser = this._SYGALIN.getCurUser();
	  postData.append('user_id', cuser.id);
	  postData.append('user_role', cuser.role);
	  let that = this;
	  this._SYGALIN.query('disbursementDetailReaffect/'+this.decaissement+"/"+this.ticket, postData).then(res => {
		  that._SYGALIN.loadingDismiss();
		  //that._SYGALIN.presentToast(res.message, res.type, 4000);
		  console.log(res);
		  console.log("res")
	  }).catch(error => {
		  console.log(error);
		  that._SYGALIN.loadingDismiss();
		  that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
	  })
  }


	initDebitFields(): FormGroup {
		return this._FB.group({
			debit: ['', Validators.required],
			montant: ['', Validators.required]
		});
	}
	initCreditFields(): FormGroup {
		return this._FB.group({
			credit: ['', Validators.required],
			montant: ['', Validators.required]
		});
	}
	addNewDebitField(): void {
		const control = <FormArray>this.formgroup.controls.debits;
		control.push(this.initDebitFields());
	}
	addNewCreditField(): void {
		const control = <FormArray>this.formgroup.controls.credits;
		control.push(this.initCreditFields());
	}
	removeDebitField(i: number): void {
		const control = <FormArray>this.formgroup.controls.debits;
		control.removeAt(i);
	}
	removeCreditField(i: number): void {
		const control = <FormArray>this.formgroup.controls.credits;
		control.removeAt(i);
		this.makeComparison(this.formgroup.value);
	}
	manage(val: any): void {
		console.info(val);
	}


  ionViewDidLoad() {
    console.log('ionViewDidLoad AcountingDetailsPage');
  }

	makeComparison( data?:any) {
  		let totalDebit=0;
  		let totalCredit=0;
		data.debits.forEach((debit)=>{
		//console.log("azazaza",debit.montant);
		totalDebit+=Number(debit.montant);
			console.log("total debit" ,totalDebit)
		});
		data.credits.forEach((credit)=>{
			//console.log("dddddddd",credit.montant);
			totalCredit+=Number(credit.montant);
			console.log("total credit" ,totalCredit)
		});
		if (totalCredit==totalDebit){
			this.amountCompare=true
		}else {
			this.amountCompare=false;
		}
	}

	accountingAssignment(data:any,motif:any){
		this._SYGALIN.loadingPresent("Traitement ...");
		console.info(data);
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('motivation',this.formgroup.value.motivation);
		postData.append('montant',this.formgroup.value.montant);
		postData.append('departement',this.formgroup.value.departement);
		postData.append('boutique',this.formgroup.value.boutique);
		postData.append('journal',this.formgroup.value.journal);
		postData.append('motif',motif);

		this.formgroup.value.debits.forEach((debit,index)=>{
			let montant="montantD_"+ index;
			let compte="compteD_"+ index;
			postData.append(montant,debit.montant);
			postData.append(compte,debit.debit);
		});

		this.formgroup.value.credits.forEach((credit,index)=>{
			let montant="montantC_"+ index;
			let compte="compteC_"+ index;
			postData.append(montant,credit.montant);
			postData.append(compte,credit.credit);
		});

		let that = this;
		this._SYGALIN.query('accountingAssignment/'+this.request_detail.id, postData).then(res => {
			that._SYGALIN.loadingDismiss();
			if (res.type=="warning"){
				that._SYGALIN.presentToast(res.message, "warning", 4000);
			} else {
				that._SYGALIN.presentToast(res.message, res.type);
			}

			if (res.type=="success"){
				this.events.publish('detail:disbursment',this.request_detail,true,this.formgroup.value.montant);
				that.navCtrl.pop();
			}
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})

	}

	test(){
		this.formgroup.value.debits.forEach((debit,index)=>{
			console.log(index);
			alert("invalidate request");
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
			message: 'Voulez-vous vraiment ' + msg + ' ce decaissement ? Cette opération est irréversible...',
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
							console.log('test');
							this.presentPrompt(request,"validate")
						} else {
							console.log('test');
							console.log(request);
							this.presentPrompt(request,"reject");
						}
					}
				}
			]
		});
		alert.present();
	}

	presentPrompt(request: any,action?:any) {
		let title="";
		let placeholder="";
		let texOK="";
		if (action=="reject"){
			title="Rejet de demande";
			placeholder="Motif de rejet";
			texOK="Rejeter la demande";
		}else{
			title="Commentaire";
			placeholder=" votre Consigne ici...";
			texOK="OK";
		}
		let alert = this._ALERT.create({
			title: title,
			inputs: [
				{
					name: 'motivation',
					placeholder: placeholder,
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
					text: texOK,
					handler: data => {
						if (action=="reject"){
							this.infirmDisbursementDetail(data.motivation);
						} else{
							this.accountingAssignment(request,data.motivation);
						}
					}
				}
			]
		});
		alert.present();
	}

	infirmDisbursementDetail(motif?:any){
		this._SYGALIN.loadingPresent("Traitement ...");
		console.log("request detail value",this.request_detail);
		let postData = new FormData();
		let cuser = this._SYGALIN.getCurUser();
		postData.append('user_id', cuser.id);
		postData.append('user_role', cuser.role);
		postData.append('motif',motif);
		postData.append('idDT',this.request_detail.id);

		let that = this;
		this._SYGALIN.query('infirmDisbursementDetail/', postData).then(res => {
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast(res.message, res.type, 4000);

			if (res.type=="success"){
				console.log(this.request_detail);
				this.events.publish('detail:disbursment',this.request_detail,false,this.request_detail.montant);
				that.navCtrl.pop();
			}
		}).catch(error => {
			console.log(error);
			that._SYGALIN.loadingDismiss();
			that._SYGALIN.presentToast("Impossible de se connecter au serveur distant. Veuillez vérifier que vous êtes connecté.", "warning", 6000);
		})

	}
}
