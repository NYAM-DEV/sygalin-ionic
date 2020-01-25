import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MesOrdresDeMissionsPage } from './mes-ordres-de-missions';

@NgModule({
  declarations: [
    MesOrdresDeMissionsPage,
  ],
  imports: [
    IonicPageModule.forChild(MesOrdresDeMissionsPage),
  ],
})
export class MesOrdresDeMissionsPageModule {}
