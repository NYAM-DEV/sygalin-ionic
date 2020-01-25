import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProspectPage } from './prospect';
import {IonTagsInputModule} from "ionic-tags-input";

@NgModule({
  declarations: [
    ProspectPage,
  ],
  imports: [
    IonicPageModule.forChild(ProspectPage),
    IonTagsInputModule,
  ],
})
export class ProspectPageModule {}
