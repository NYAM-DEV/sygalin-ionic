import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerfMigrPage } from './perf-migr';

@NgModule({
  declarations: [
    PerfMigrPage,
  ],
  imports: [
    IonicPageModule.forChild(PerfMigrPage),
  ],
})
export class PerfMigrPageModule {}
