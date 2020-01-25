import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsOdmPage } from './details-odm';

@NgModule({
  declarations: [
    DetailsOdmPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsOdmPage),
  ],
})
export class DetailsOdmPageModule {}
