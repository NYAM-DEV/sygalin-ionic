import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrestationTechniquePage } from './prestation-technique';

@NgModule({
  declarations: [
    PrestationTechniquePage,
  ],
  imports: [
    IonicPageModule.forChild(PrestationTechniquePage),
  ],
})
export class PrestationTechniquePageModule {}
