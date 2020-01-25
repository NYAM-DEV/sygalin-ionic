import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MesMigrationsPage } from './mes-migrations';

@NgModule({
  declarations: [
    MesMigrationsPage,
  ],
  imports: [
    IonicPageModule.forChild(MesMigrationsPage),
  ],
})
export class MesMigrationsPageModule {}
