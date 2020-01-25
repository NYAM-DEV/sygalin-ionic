import {NgModule} from '@angular/core';
import {EvalPipe} from './eval/eval';
import {PdfviewPipe} from './pdfview/pdfview';

// @ts-ignore
@NgModule({
	declarations: [EvalPipe, PdfviewPipe],
	imports: [],
	exports: [EvalPipe, PdfviewPipe]
})
export class PipesModule {
}
