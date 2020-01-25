import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CommissionPage} from './commission';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		CommissionPage,
	],
	imports: [
		IonicPageModule.forChild(CommissionPage),
		PipesModule
	],
	exports: [
		CommissionPage
	],
})
export class HomeTabsPageModule {
}
