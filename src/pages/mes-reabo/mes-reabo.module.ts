import { MesReaboPage } from './mes-reabo';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';
 
@NgModule({
  declarations: [
    MesReaboPage,
  ],
  imports: [
    IonicPageModule.forChild(MesReaboPage),
    PipesModule
  ],
  exports: [
    MesReaboPage
  ],
})
export class HomeTabsPageModule {}