import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

/**
 * Generated class for the PdfviewPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
	name: 'pdfview',
})
export class PdfviewPipe implements PipeTransform {
	/**
	 * Renders a page (PDF) from remote link
	 */
	constructor(private dom: DomSanitizer) {

	}

	transform(value: string, ...args) {
		if (args)
			return this.dom.bypassSecurityTrustResourceUrl(value+'#'+args[0]);
		return this.dom.bypassSecurityTrustResourceUrl(value);
	}
}
