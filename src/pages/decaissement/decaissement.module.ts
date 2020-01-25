import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {DecaissementPage, DisbursmentModal,ValidDisbursmentModal} from './decaissement';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    DecaissementPage,
	  DisbursmentModal,
	  ValidDisbursmentModal
  ],
  imports: [
    IonicPageModule.forChild(DecaissementPage),
	  PipesModule
  ],
	exports:[
		DecaissementPage,
		DisbursmentModal,
		ValidDisbursmentModal
	],
	entryComponents:[DisbursmentModal,ValidDisbursmentModal],
})
export class DecaissementPageModule {}
