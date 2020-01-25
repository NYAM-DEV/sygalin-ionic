import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinancialPage } from './financial';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    FinancialPage,
  ],
  imports: [
    IonicPageModule.forChild(FinancialPage),
	  PipesModule
  ],
	exports: [
		FinancialPage
	],
})
export class FinancialPageModule {}
