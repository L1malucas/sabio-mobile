import { ElementRef } from '@angular/core';
export interface Cub3CameraElement extends ElementRef { 
  iniciar(tipo?:string):void;
  fechar():Promise<any>; 
  ngOnDestroy():void;
  alterarCamera(tipo:string):void;

}