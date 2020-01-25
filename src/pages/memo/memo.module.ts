import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemoPage } from './memo';
import {PipesModule} from "../../pipes/pipes.module";


@NgModule({
  declarations: [
    MemoPage,
  ],
  imports: [
    IonicPageModule.forChild(MemoPage),
	  PipesModule
  ],
	exports: [
		MemoPage
	],
})
export class MemoPageModule {}
