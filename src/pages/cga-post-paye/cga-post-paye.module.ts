import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CgaPostPayePage } from './cga-post-paye';

@NgModule({
  declarations: [
    CgaPostPayePage,
  ],
  imports: [
    IonicPageModule.forChild(CgaPostPayePage),
  ],
})
export class CgaPostPayePageModule {}
