import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReqgrossistePage } from './reqgrossiste';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ReqgrossistePage,
  ],
  imports: [
    IonicPageModule.forChild(ReqgrossistePage),
    PipesModule
  ],
  exports: [
    ReqgrossistePage
  ],
})
export class HomeTabsPageModule {}
