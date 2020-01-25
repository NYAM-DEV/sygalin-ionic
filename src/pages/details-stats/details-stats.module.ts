import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsStatsPage } from './details-stats';

@NgModule({
  declarations: [
    DetailsStatsPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsStatsPage),
  ],
})
export class DetailsStatsPageModule {}
