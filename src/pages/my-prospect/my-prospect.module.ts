import { NgModule } from '@angular/core';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicPageModule } from 'ionic-angular';
import { MyProspectPage } from './my-prospect';

@NgModule({
  declarations: [
    MyProspectPage,
  ],
  imports: [
    IonicPageModule.forChild(MyProspectPage),
    IonicSelectableModule
  ],
})
export class MyProspectPageModule {}
