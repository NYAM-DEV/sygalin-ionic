import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {JustifDisbursmentPage, JustifModal} from './justif-disbursment';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    JustifDisbursmentPage,
	  JustifModal
  ],
  imports: [
    IonicPageModule.forChild(JustifDisbursmentPage),
	  PipesModule
  ],
	exports:[
		JustifDisbursmentPage,
		JustifModal
	],
	entryComponents: [JustifModal]
})
export class JustifDisbursmentPageModule {}
