import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';
import { CgaPage } from './cga';


@NgModule({
  declarations: [
    CgaPage,
  ],
  imports: [
    IonicPageModule.forChild(CgaPage),
	  PipesModule
  ],
	exports: [
		CgaPage
	],
})
export class CgaPageModule {}
