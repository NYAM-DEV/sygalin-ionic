import {ReaboModal, ReaboPage} from './reabo';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';
 
@NgModule({
  declarations: [
    ReaboPage,
	  ReaboModal,
  ],
  imports: [
    IonicPageModule.forChild(ReaboPage),
    PipesModule
  ],
  exports: [ReaboModal],
   entryComponents: [ReaboModal]

})
export class ReaboPageModule {}
