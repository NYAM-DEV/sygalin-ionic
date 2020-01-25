import { RecruPage } from './recru';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
 
@NgModule({
  declarations: [
    RecruPage,
  ],
  imports: [
    IonicPageModule.forChild(RecruPage),
  ],
  exports: [
    RecruPage
  ]
})
export class HomeTabsPageModule {}