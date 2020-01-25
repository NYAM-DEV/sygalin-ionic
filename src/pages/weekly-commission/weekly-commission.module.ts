import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {WeeklyCommissionPage} from './weekly-commission';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		WeeklyCommissionPage,
	],
	imports: [
		IonicPageModule.forChild(WeeklyCommissionPage),
		PipesModule
	],
	entryComponents: [
		WeeklyCommissionPage
	]
})
export class WeeklyCommissionPageModule {
}
