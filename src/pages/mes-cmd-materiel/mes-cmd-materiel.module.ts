import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MesCmdMaterielPage } from './mes-cmd-materiel';
import {DetailsCmd} from './mes-cmd-materiel';


@NgModule({
	declarations: [
		MesCmdMaterielPage,
		DetailsCmd,
	],
	imports: [
		IonicPageModule.forChild(MesCmdMaterielPage),
	],
	exports: [DetailsCmd],
	entryComponents: [DetailsCmd]
})
export class MesCmdMaterielPageModule {}
