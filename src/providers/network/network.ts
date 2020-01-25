import {
	Injectable
} from '@angular/core';
import {
	Network
} from '@ionic-native/network';

import {
	Platform
} from 'ionic-angular';

import {
	Observable
} from 'rxjs';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';
import {
	mapTo
} from 'rxjs/operators';

@Injectable()
export class NetworkService {

	private online$: Observable < boolean > = null;

	constructor(private network: Network, private platform: Platform) {
		this.online$ = Observable.create(observer => {
			observer.next(true);
		}).pipe(mapTo(true));

		if (this.platform.is('cordova')) {
			// on Device
			console.log('FROM CORDOVA');
			this.online$ = merge(
				this.network.onConnect().pipe(mapTo(true)),
				this.network.onDisconnect().pipe(mapTo(false)));
		} else {
			// on Browser
			console.log('FROM BROWSER');
			console.log('NAVIGATOR:', navigator.onLine);
			this.online$ = merge( of (navigator.onLine),
				fromEvent(window, 'online').pipe(mapTo(true)),
				fromEvent(window, 'offline').pipe(mapTo(false))
			);
		}
	}

	public getNetworkType(): string {
		return this.network.type
	}

	public getNetworkStatus(): Observable < boolean > {
		return this.online$;
	}

}
