import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {MesAidesDsiPage, ReqDSIModal} from './mes-aides-dsi';
import {PipesModule} from "../../pipes/pipes.module";
import {ReaboModal} from "../reabo/reabo";



@NgModule({
  declarations: [
    MesAidesDsiPage,
	  ReqDSIModal,
  ],
  imports: [
    IonicPageModule.forChild(MesAidesDsiPage),
	  PipesModule
  ],
	exports: [
		MesAidesDsiPage,
		ReqDSIModal,
	],
	entryComponents: [ReqDSIModal],

})
export class MesAidesDsiPageModule {}
