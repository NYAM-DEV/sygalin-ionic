import { MigrPage } from './migr';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';
//import {NgxMaskIonicModule} from 'ngx-mask-ionic'



@NgModule({
	declarations: [
		MigrPage,
	],
	imports: [
		IonicPageModule.forChild(MigrPage),
		PipesModule,
		//NgxMaskIonicModule
	],
	exports: [
		MigrPage
	],
})
export class HomeTabsPageModule {}
