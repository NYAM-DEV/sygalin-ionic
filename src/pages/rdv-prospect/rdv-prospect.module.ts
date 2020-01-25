import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {RdvProspectPage} from './rdv-prospect';
import {RDVModal} from './rdv-prospect';


@NgModule({
	declarations: [
		RdvProspectPage,
		RDVModal,
	],
	imports: [
		IonicPageModule.forChild(RdvProspectPage),
	],
	exports: [RDVModal],
	entryComponents: [RDVModal]
})
export class RdvProspectPageModule {
}
