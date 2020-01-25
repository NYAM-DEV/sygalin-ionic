import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {AccountingAssignmentPage, AccountingModal} from './accounting-assignment';

@NgModule({
  declarations: [
    AccountingAssignmentPage,
	  AccountingModal
  ],
  imports: [
    IonicPageModule.forChild(AccountingAssignmentPage),
  ],
	exports:[
		AccountingModal
	],
	entryComponents:[
		AccountingModal
	]
})
export class AccountingAssignmentPageModule {}
