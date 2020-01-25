import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReqDsiPage } from './req-dsi';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ReqDsiPage,
  ],
  imports: [
    IonicPageModule.forChild(ReqDsiPage),
	  PipesModule
  ],
	exports: [
		ReqDsiPage
	],
})
export class ReqDsiPageModule {}
