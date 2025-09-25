import { ElementRef } from '@angular/core';
export interface Cub3WebcamElement extends ElementRef {
  toggleWebcam(): void;
  iniciarWebcam(tipo?:string):void;
  fechar():void;
  validarFacial(probe:any, id:number):void;
  sucessoBiometria():void;
  ErroBiometria():void;
  BiometriaRecebida():void;
  setValidandoBiometria(flag:boolean):void;
  validarRostoManual():void;
  capturarFoto():void;
  alterarCamera():void;
}