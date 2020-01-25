import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashingPage } from './cashing';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    CashingPage,
  ],
  imports: [
    IonicPageModule.forChild(CashingPage),
	  PipesModule
  ],
	exports: [
		CashingPage
	],
})
export class CashingPageModule {}
