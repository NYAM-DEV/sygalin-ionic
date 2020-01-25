import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AcountingDetailsPage } from './acounting-details';

@NgModule({
  declarations: [
    AcountingDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(AcountingDetailsPage),
  ],
})
export class AcountingDetailsPageModule {}
