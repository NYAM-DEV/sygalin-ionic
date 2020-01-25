import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {UpgradeModal, UpgradePage} from './upgrade';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    UpgradePage,
	  UpgradeModal
  ],
  imports: [
    IonicPageModule.forChild(UpgradePage),
    PipesModule
  ],
  exports: [
    UpgradePage,
	  UpgradeModal,
  ],
	entryComponents: [UpgradeModal]
})
export class UpgradePageModule {}
