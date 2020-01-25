import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CgaprePage } from './cgapre';
import {PipesModule} from "../../pipes/pipes.module";


@NgModule({
  declarations: [
    CgaprePage,
  ],
  imports: [
    IonicPageModule.forChild(CgaprePage),
	  PipesModule
  ],
	exports: [
		CgaprePage
	],
})
export class CgaprePageModule {}
