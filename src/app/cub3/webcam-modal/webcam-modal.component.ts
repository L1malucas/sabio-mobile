import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, Renderer2, HostListener  } from '@angular/core';
import {Subject, Observable} from 'rxjs'; 
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';  
import {StorageUtils} from '@cub3/utils/storage.utils';
import {Usuario} from '@cub3/classes/usuario'; 
import {Cub3CameraComponent} from "@cub3/cub3-camera/cub3-camera.component";
import {SocketLocal } from '../../app.module';

import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
@Component({
  selector: 'educanet-webcam',
  templateUrl: './webcam-modal.component.html',
  styleUrls: ['./webcam-modal.component.scss']
})
export class WebcamModalComponent implements OnInit {
	private usuario:Usuario = StorageUtils.getAccount();
  @ViewChild('cub3Camera', { static: false }) cub3Camera: Cub3CameraComponent;

	@Input() largura:any = 300;
	@Input() altura:any = 500;
 	@Input() exibirWebcam = false;
 	@Input() detectando:boolean = true;
  @Input() digital:boolean = false;
  @Input() digitalPreview:string = "";

  @Output() respostaFacial:any = new EventEmitter();
  @Output() fecharCamera:any = new EventEmitter();

  private _candidato:any;

  @Input()  set candidato(valor:any) {
    this._candidato = valor; 
  }

  get candidato():any {
    return this._candidato;
  }

 	@ViewChild("canvas", {static:false})  canvas:ElementRef;
  @ViewChild("camera", {static:false}) camera:ElementRef;

	public deteccaoRosto:any;
  public validandoBiometria:boolean = false;
	public reconhecendoRosto:boolean = false;
  public dispositivos:MediaDeviceInfo[] = [];
	private webcamIniciada:boolean = false;
	public msgDeteccao:string = "Rosto não detectado";
  private imagemComparacao:string = "";
  private resultadoDeteccao:any;
  private targetId:number;
  private imagemAux:any = "";
  public exibirSucessoBiometria:boolean = false;
  public exibirResultadoBiometria:boolean = false;
  public biometriaRecebida:boolean = false;
  public erroBiometria:boolean = false;
  private fs:any;
  private app:any;
  public carregandoModels:boolean = true;
  public dispositivosCarregados:boolean = false;
  public cameraSelecionada:any = "";
  private tracks:any;

  private tipoCamera:string = 'user';
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  }; 
  private trigger: Subject<void> = new Subject<void>(); 
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  private timer:any;

  private faceMatcher:any;
  private labeledDescriptors:any;
  private canvasAux:HTMLCanvasElement;
  private resizedDetections:any;
  private detections:any;
  private capturarFotoAleatoria:boolean = false;
  public showWebcam = true; 

  constructor(
  	public cub3Svc:Cub3SvcProvider,
    private renderer: Renderer2 
  	) { 
      this.videoOptions = {
    width: {ideal: 1024},
    height: {ideal: 576}
      }; 
 
  }

  @HostListener('unloaded')
  ngOnDestroy() {
     this.stopMediaTracks(this.tracks);
  }

  public setValidandoBiometria(flag:boolean) {
    this.exibirSucessoBiometria = false;
    this.validandoBiometria = flag;
  }
  public ErroBiometria() {
    this.erroBiometria = true;
  }
  private stopMediaTracks(stream) {
    if(stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
    }
  }
  public alterarCamera() {
    this.cub3Camera.alterarCamera();
  }
  // public alterarCamera(evt:any) {
  //   // console.log(evt);
  //   if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {    
  //         if (typeof this.camera.nativeElement.srcObject !== 'undefined') {
  //           this.stopMediaTracks(this.camera.nativeElement.srcObject);
  //         }
  //         const videoConstraints:any = {};
  //         if (this.tipoCamera == 'user') {
  //           videoConstraints.facingMode = 'environment';
  //           this.tipoCamera = 'environment';
  //         } else {
  //           // videoConstraints.deviceId = { exact: this.cameraSelecionada };
  //           // StorageUtils.setItem("cameraSelecionada", this.cameraSelecionada);
  //           videoConstraints.facingMode = 'user';
  //           this.tipoCamera = 'user';
  //         }
  //         const constraints:any = {
  //           video: videoConstraints,
  //           audio: false
  //         };
  //      console.log(constraints);
  //       navigator.mediaDevices.getUserMedia(constraints).then(stream => {   
  //         setTimeout(() => {
  //           if(this.camera){
  //             this.tracks = stream;
  //             this.camera.nativeElement.srcObject =   (this.tracks);
  //             this.camera.nativeElement.play();
  //             this.webcamIniciada = true; 
  //           }
  //         }, 100);
            
  //       });
  //   }

  // }
  public abrirCamera() {
    console.log("Abrindo câmera");

    // WebcamUtil.getAvailableVideoInputs()
    //   .then((mediaDevices: MediaDeviceInfo[]) => {
    //     this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    //     console.log("Cameras disponiveis", mediaDevices);
    //     setTimeout(() => {
    //       this.showWebcam = true;
    //     }, 300);
    //   }, (err:any) => {
    //     console.log("Erro de camera", err);
    //   });

      
      this.dispositivos = [];

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.enumerateDevices().then((dispositivos:MediaDeviceInfo[]) => {
        dispositivos.forEach((dispositivo:MediaDeviceInfo) => {
          if(dispositivo.kind == 'videoinput') {
            this.dispositivos.push(dispositivo);
          }
        }); 
        this.dispositivosCarregados = true;
        // console.log("Câmeras", this.dispositivos);
      });
          const videoConstraints:any = {}; 
            videoConstraints.facingMode = 'user'; 
          const constraints:any = {
            video: videoConstraints,
            audio: false
          };
 
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {   
          setTimeout(() => {
            if(this.camera){
              this.camera.nativeElement.srcObject =   (stream);
              this.camera.nativeElement.play();
              this.webcamIniciada = true; 
            }
          }, 100);
            
        });
    }
  }
 
  // public toggleWebcam(flag?:boolean): void {
  //   this.exibirWebcam = flag ? flag : !this.exibirWebcam;
  //   console.log(this.exibirWebcam);
  // }  
  public async onPlay(ctt:any) {
    // console.log("Iniciando camera", ctt.canvas);
    this.msgDeteccao = "Carregando reconhecimento..."
    // const video:any = ctt.camera.nativeElement;
    // const can:any = ctt.canvas.nativeElement;
    // this.canvasAux = await faceapi.createCanvasFromMedia(ctt.camera.nativeElement);
    // can.append(canvas);
 
  }
  public async validarRostoManual() {
    if(!this.cub3Camera)
      return;

      // this.canvasAux.width = this.camera.nativeElement.videoWidth;
      // this.canvasAux.height = this.camera.nativeElement.videoHeight;
      // let context = this.canvasAux.getContext("2d").drawImage(this.camera.nativeElement, 0, 0); 
    let carregar:any = await this.cub3Svc.carregar(1); 
      this.cub3Camera.capturarSnapshot().then((foto:string) => { 

              if(!this.candidato){
                console.log("Candidato inválido", this.candidato);
                return;
              }

              if(this.candidato && this.candidato.liberar_facial) {
                  this.respostaFacial.emit({res: {}, label: this.candidato.id, img: foto});
                  return;
              }
                  this.cub3Svc.validarFacial(
                    this.cub3Svc.socket, 
                    this.candidato.foto, 
                    foto, 
                    this.candidato.id).then((resultado:any) => {
                    carregar.dismiss();
                    console.log(resultado);
                      this.respostaFacial.emit({res: resultado, img: foto, capturarFoto: this.capturarFotoAleatoria});

                      this.deteccaoRosto = 'reconhecido';
                      this.msgDeteccao = "Rosto reconhecido";
                      // this.cub3Svc.carregar(0);
                  }, () => { 
                    carregar.dismiss();
                      this.deteccaoRosto = 'invalido';
                      this.msgDeteccao = "Rosto não reconhecido";
                      this.cub3Svc.alerta("Validação Facial", this.msgDeteccao);
                      // this.cub3Svc.carregar(0);
                  }); 

          });

  } 
  private compararRostos(resCandidate:any):Promise<any> { 
    return new Promise((resolve, reject) => {
        let resultado:any = this.faceMatcher.findBestMatch(resCandidate[0].descriptor); 
        if(!this.camera){
          console.log("Câmera inválida");
          reject(false);
          return;
        }

        console.log("Resultado", resultado);

        if(resultado.label == this.candidato.id){

          var context = this.canvasAux.getContext("2d").drawImage(this.camera.nativeElement, 0, 0, this.largura, this.altura); 

          this.respostaFacial.emit({res: resultado, img: this.canvasAux.toDataURL("image/png")});

          this.deteccaoRosto = 'reconhecido';
          this.msgDeteccao = "Rosto reconhecido";
          console.log(this.msgDeteccao);
          resolve(true);
        }
        else {
          this.deteccaoRosto = 'invalido';
          this.msgDeteccao = "Rosto não reconhecido";   
          console.log(this.msgDeteccao);
          reject(false);                 
        }

    });
  }

   private CapturarFoto():any {

      this.canvasAux.width = this.camera.nativeElement.videoWidth;
      this.canvasAux.height = this.camera.nativeElement.videoHeight;
      const context = this.canvasAux.getContext("2d").drawImage(this.camera.nativeElement, 0, 0); 
      return this.canvasAux.toDataURL("image/png");

      // this.renderer.setProperty(this.canvas.nativeElement, 'width', this.largura);
      // this.renderer.setProperty(this.canvas.nativeElement, 'height', this.altura);
      // console.log(this.camera.nativeElement);
      // return this.canvas.nativeElement.getContext('2d').drawImage(this.camera.nativeElement, 0, 0).toDataURL();
      // this.triggerSnapshot(); 
      // return this.webcamImage;      
  } 
  async ngAfterViewInit() {
    this.carregandoModels = false;
  }
  public getTitulo():String {
    return this.digital ? 'Validação biométrica' : 'Captura facial';
  }
  public getOrientacoes():String {
    return this.digital ? 'Por gentileza, posicione seu rosto na marcação indicada e o dedo no leitor biométrico, em seguida aguarde o reconhecimento.' : 'Por gentileza, posicione seu rosto na marcação indicada e aguarde o reconhecimento:';
  }
  public cancelarCaptura():void {

  }
  public BiometriaRecebida():void {
    this.biometriaRecebida = true; 
  }
  public sucessoBiometria():void {
    this.exibirSucessoBiometria = true; 
    this.validandoBiometria = false; 
  }
  private iniciarDigital():void {
    this.exibirSucessoBiometria = false;
    this.exibirResultadoBiometria = false;
    this.erroBiometria = false;
    this.biometriaRecebida = false;
    this.digitalPreview = "";
  } 
  ngOnInit(): void { 
  	if(this.exibirWebcam)
  		this.iniciarWebcam();
  } 
 
  // Webcam
  iniciarWebcam(tipo:any = 'user') { 
    this.targetId = null;
    this.reconhecendoRosto = false;
    this.deteccaoRosto = 'pendente';
    this.webcamIniciada = false;
    this.detectando = true;
    this.validandoBiometria = false;
    this.capturarFotoAleatoria = false;

    if(tipo)
      this.tipoCamera = tipo;

    if(this.digital)
      this.iniciarDigital();

    this.abrirCamera(); 
  } 
  capturarFoto() { 
    this.targetId = null;
    this.reconhecendoRosto = false;
    this.deteccaoRosto = 'pendente';
    this.webcamIniciada = false;
    this.detectando = true;
    this.validandoBiometria = false;
    this.capturarFotoAleatoria = true;

    this.abrirCamera(); 
  } 
  public getStatusCamera() {
  	switch (this.deteccaoRosto) {
  		case "detectado":
  			return "assets/images/camera-overlay-detectado.png";  		
  		case "invalido":
  			return "assets/images/camera-overlay-invalido.png";  		
  		case "reconhecido":
  			return "assets/images/camera-overlay-reconhecido.png";  		
  		default:
  			return "assets/images/camera-overlay-pendente.png";  		
  	}
  }
  public fechar() {
  	this.exibirWebcam = false;
    this.reconhecendoRosto = false;
    clearInterval(this.timer);
    this.fecharCamera.emit();
    this.cub3Camera.finalizePreview();
  }


  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;  

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }
}
