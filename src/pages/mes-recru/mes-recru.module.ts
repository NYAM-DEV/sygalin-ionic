import { MesRecruPage } from './mes-recru';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';
 
@NgModule({
  declarations: [
    MesRecruPage,
  ],
  imports: [
    IonicPageModule.forChild(MesRecruPage),
    PipesModule
  ],
  exports: [
    MesRecruPage
  ],
})
export class HomeTabsPageModule {}