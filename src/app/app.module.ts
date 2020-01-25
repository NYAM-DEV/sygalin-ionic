import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule, Injector} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {NativeStorage} from '@ionic-native/native-storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {SQLite} from '@ionic-native/sqlite';
import {IonicSelectableModule} from 'ionic-selectable';
import {MyApp} from './app.component';

//import {} from '@ionic-native/file-opener';
//import {} from '@ionic-native/file-chooser';

//pages
import {LoginPage} from '../pages/login/login';
import {RefillfinancialPage} from '../pages/financial-Refill/refillfinancial';
import {PopoverPage} from '../pages/popover/popover';
import {GlobalProvider} from '../providers/global/global';
import {SideMenuContentComponent} from '../shared/side-menu-content/side-menu-content.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PipesModule} from "../pipes/pipes.module";
import {WeeklyCommissionPageModule} from "../pages/weekly-commission/weekly-commission.module";
import {RDVModal} from "../pages/rdv-prospect/rdv-prospect";
import {ReaboModal} from "../pages/reabo/reabo";
import {RdvProspectPageModule} from "../pages/rdv-prospect/rdv-prospect.module";
import {HomeTabsPageModule} from "../pages/home/home.module";
import {HttpClientModule} from "@angular/common/http";
import {ReaboPageModule} from "../pages/reabo/reabo.module";
import {UpgradePageModule} from "../pages/upgrade/upgrade.module";
import {MesAidesDsiPageModule} from  "../pages/mes-aides-dsi/mes-aides-dsi.module"
import {UpgradeModal} from "../pages/upgrade/upgrade";
import {AppVersion} from "@ionic-native/app-version";
import { Network } from '@ionic-native/network';
import {NetworkService} from '../providers/network/network';
import {DetailsCmd} from "../pages/mes-cmd-materiel/mes-cmd-materiel";
import {MesCmdMaterielPageModule} from "../pages/mes-cmd-materiel/mes-cmd-materiel.module";
//import {CgaPageModule} from "../pages/cga/cga.module";
import { DocumentViewer } from '@ionic-native/document-viewer';
import {ReqDSIModal} from "../pages/mes-aides-dsi/mes-aides-dsi";
import {DisbursmentModal,ValidDisbursmentModal} from "../pages/decaissement/decaissement";
import {DecaissementPageModule} from "../pages/decaissement/decaissement.module";
import {JustifDisbursmentPageModule} from "../pages/justif-disbursment/justif-disbursment.module";
import {JustifModal} from "../pages/justif-disbursment/justif-disbursment";
import { AccountingAssignmentPageModule } from "../pages/accounting-assignment/accounting-assignment.module";
import { AccountingModal } from  "../pages/accounting-assignment/accounting-assignment";



// @ts-ignore
@NgModule({
	declarations: [
		MyApp,
		LoginPage,
		PopoverPage,
		SideMenuContentComponent
	],
	imports: [
		//HttpModule,
		HttpClientModule,
		BrowserModule,
		BrowserAnimationsModule,
		PipesModule,
		WeeklyCommissionPageModule,
		IonicSelectableModule,
		HomeTabsPageModule,
		RdvProspectPageModule,
		MesAidesDsiPageModule,
		MesCmdMaterielPageModule,
		DecaissementPageModule,
		ReaboPageModule,
		UpgradePageModule,
		JustifDisbursmentPageModule,
		AccountingAssignmentPageModule,
		IonicModule.forRoot(MyApp, {
			backButtonText: "",
			mode: 'ios',
			monthNames: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
		}),
		//NgxMaskIonicModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		LoginPage,
		PopoverPage,
		RDVModal,
		DetailsCmd,
		ReaboModal,
		UpgradeModal,
		ReqDSIModal,
		DisbursmentModal,
		ValidDisbursmentModal,
		JustifModal,
		AccountingModal
	],
	providers: [
		StatusBar,
		SQLite,
		SplashScreen,
		NativeStorage,
		LocalNotifications,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		GlobalProvider,
		NetworkService,
		HttpClientModule,
		AppVersion,
		Network,
		DocumentViewer,
	]
})
export class AppModule {
	static injector: Injector;

	constructor(injector: Injector) {
		AppModule.injector = injector;
	}
}
