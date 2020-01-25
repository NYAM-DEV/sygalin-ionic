import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the EvalPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'eval',
})
export class EvalPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(status: any, ...args: any[]):any {
    var state="";
    console.log(status);
    console.log("parseInt(value)==1", parseInt(status)==1);
    if (parseInt(status)==1)
    {
      console.log("parseInt(value)==1", parseInt(status)==1);
      state="VALIDE";
    }
    
    if (parseInt(status)==0){
      console.log("parseInt(value)==0", parseInt(status)==0);
      state="En ATTENTE";
    }

    if (parseInt(status)==-1){
      console.log("parseInt(value)==-1", parseInt(status)==-1);
      state="REJETTE";
    }

    if (parseInt(status)==2){
      console.log("parseInt(value)==2", parseInt(status)==2);
      state="TRAITE";
    }
    return state;
  }
}
