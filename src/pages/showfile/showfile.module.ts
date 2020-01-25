import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowfilePage } from './showfile';
import {PipesModule} from "../../pipes/pipes.module";


@NgModule({
  declarations: [
    ShowfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ShowfilePage),
	  PipesModule
  ],
	exports: [
		ShowfilePage,
	],
})
export class ShowfilePageModule {}
