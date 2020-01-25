import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ShowfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-showfile',
  templateUrl: 'showfile.html',
})
export class ShowfilePage {
	fileLink:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
	  this.fileLink = this.navParams.get('data');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowfilePage');

  }

}
