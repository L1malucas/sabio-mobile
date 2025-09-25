import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {StorageUtils} from '@cub3/utils/storage.utils';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'cub3-camera-preview',
  templateUrl: './cub3-camera-preview.component.html',
  styleUrls: ['./cub3-camera-preview.component.scss'],
})
export class Cub3CameraPreviewComponent implements OnInit {

  @Input("capturandoFoto") capturandoFoto:any;
  @Output() respostaFacial:any = new EventEmitter();
  @Output() fecharCamera:any = new EventEmitter();
  @Output() AlterarCamera:any = new EventEmitter();

  private _candidato:any;

  @Input()  set candidato(valor:any) {
    this._candidato = valor; 
  }

  get candidato():any {
    return this._candidato;
  }
	deteccaoRosto:string = "";
	msgDeteccao:string = "";
  cameraAtiva:string = "rear";
  private facingMode:string = 'user';
	private capturarFotoAleatoria:boolean = false;
  constructor( 
  	private platform:Platform,
  	private cub3Svc:Cub3SvcProvider) { 
      this.init();


  }

    async init() {
      const facingMode = StorageUtils.getItem("facingMode");
      
        if(facingMode != null && facingMode != '')
            this.facingMode = facingMode;
        else
            this.facingMode = "user";
    }
  ngOnInit()  {

  }

  ngOnDestroy() {

  }

  public async iniciar(camera:string = 'rear') { 
  	console.log("Iniciando camera");
  	this.cub3Svc.iniciarCamera(camera);
  }

  alterarCamera() { 
    this.AlterarCamera.emit(true);
    // if(StorageUtils.getItem("facingMode") != null && StorageUtils.getItem("facingMode") != '')
    //     this.facingMode = StorageUtils.getItem("facingMode");
    // else
        this.facingMode = "user";
 
    this.facingMode = this.facingMode == 'environment' ? 'user' : 'environment';

    StorageUtils.setItem("facingMode", this.facingMode);
    this.cameraAtiva = this.cameraAtiva == 'rear' ? 'front' : 'rear'; 
  	this.cub3Svc.alterarCamera();
  }

  fechar():Promise<any> {
  	return new Promise((resolve, reject) => {
  		this.cub3Svc.fecharCamera();
	  	this.fecharCamera.emit(true);

	  	setTimeout(() => {
	  		resolve(true);
	  	}, 1500);
  	});
  }

  async validarRostoManual() {
  	const carregar:any = await this.cub3Svc.carregar(1);
	this.cub3Svc.capturarCamera().then((foto?:string) => {
	  // this.picture = 'data:image/jpeg;base64,' + imageData;

          if(!this.candidato){
            console.log("Candidato inválido", this.candidato);
            return;
          }

          if(this.candidato && this.candidato.liberar_facial) {
              this.respostaFacial.emit({res: {}, label: this.candidato.id, img: foto});
              return;
          }
              this.cub3Svc.validarFacial(
                null, 
                this.candidato.foto, 
                foto, 
                this.candidato.id).then((resultado:any) => {
                carregar.dismiss();
                  this.respostaFacial.emit({res: resultado, img: foto, capturarFoto: this.capturarFotoAleatoria});

                  this.deteccaoRosto = 'reconhecido';
                  this.msgDeteccao = "Rosto reconhecido";
                  // this.cub3Svc.carregar(0);
              }, () => { 
                carregar.dismiss();
                  this.deteccaoRosto = 'invalido';
                  this.msgDeteccao = "Rosto não reconhecido";
                  this.cub3Svc.alertaToast("Validação Facial", this.msgDeteccao, 3000, 'bottom');
                  // this.cub3Svc.carregar(0);
              }); 
	}, (err) => {
	  console.log(err);
	});
  }
}
