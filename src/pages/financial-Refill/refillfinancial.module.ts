import {RefillfinancialPage} from './refillfinancial';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';
 
@NgModule({
  declarations: [
    RefillfinancialPage,

  ],
  imports: [
    IonicPageModule.forChild(RefillfinancialPage),
    PipesModule
  ],
  exports: [],
   entryComponents: []

})
export class RefillfinancialPageModule {}
