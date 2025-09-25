import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { createLocalTracks, LocalTrack, LocalVideoTrack } from 'twilio-video';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {StorageUtils} from '@cub3/utils/storage.utils';
 
declare var cordova;

    export type Devices = MediaDeviceInfo[];
@Component({
  selector: 'cub3-camera',
  templateUrl: './cub3-camera.component.html',
  styleUrls: ['./cub3-camera.component.scss']
})
export class Cub3CameraComponent implements AfterViewInit {
    @ViewChild('preview', { static: false }) previewElement: ElementRef; 
    @ViewChild('canvas', { static: false }) canvas: ElementRef; 

    @Input('capturandoFoto') capturandoFoto:any = false;
    @Output("rostoDetectado") rostoDetectado  = new EventEmitter<boolean>();
    @Output("permissaoCamera") permissaoCamera  = new EventEmitter<boolean>();

    get tracks(): LocalTrack[] {
        return this.localTracks;
    }
    ngOnDestroy() {

    }

    isInitializing: boolean = true;
    public trocandoCamera:boolean = false;
    private canvasAux:HTMLCanvasElement;
    public videoTrack: LocalVideoTrack;
    private localTracks: LocalTrack[] = [];
    private currDeviceId:string = null;
    private videoIniciado:boolean = false;
    private facingMode:string;

    public permissao:any = "carregando";
    constructor(
        private readonly renderer: Renderer2,
        private cub3Svc:Cub3SvcProvider
        ) { 
        this.atualizarFace();
        this.monitorarPermissoes();
    }

    async ngAfterViewInit() {
        if (this.previewElement && this.previewElement.nativeElement) {
            await this.initializePreview();
        }
    }
   async atualizarFace() {
            const facingMode = StorageUtils.getItem("facingMode");
        if(facingMode != null && facingMode != '')
            this.facingMode = facingMode;
        else
            this.facingMode = "user";
    }
  
    initializePreview(deviceInfo?: any) {
        console.log("Iniciando device", deviceInfo);
this.initializeDevice();
        // if (deviceInfo && deviceInfo.kind) {
        //     this.initializeDevice(deviceInfo.kind, deviceInfo.deviceId);
        // } else {
        //     this.cub3Svc.getDevices().then((devices:any) => { 
        //         let deviceSelecionado:any = null;
        //         for(let item of devices) {
        //             if(!deviceSelecionado && item.kind == 'videoinput') {
        //                 deviceSelecionado = item;
        //             }
        //         }

        //         console.log("Device selecionado", deviceSelecionado);
        //         this.initializeDevice(deviceSelecionado.kind, deviceSelecionado.deviceId);
        //     }, () => {
        //         // this.initializeDevice();
        //     });
            
        // }
    }

    // finalizePreview() {
    //     try {
    //         if (this.videoTrack) {
    //             this.videoTrack.disable();
    //             this.videoTrack.stop();
    //             this.videoTrack.mediaStreamTrack.stop();

    //             this.videoTrack.detach().forEach(element => element.remove());
    //             console.log("Track removida", this.videoTrack);

    //             this.videoTrack = null;
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }
    
    public finalizePreview():Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.localTracks.forEach((videoTrack:any) => {
                    // videoTrack.disable();
                    videoTrack.stop();
                    videoTrack.mediaStreamTrack.stop();

                    videoTrack.detach().forEach(element => element.remove());
                    console.log("Track removida", videoTrack);

                    videoTrack = null;
                });
                if (this.videoTrack) {
                    this.videoTrack.disable();
                    this.videoTrack.stop();
                    this.videoTrack.mediaStreamTrack.stop();

                    this.videoTrack.detach().forEach(element => element.remove());
                    console.log("Track removida", this.videoTrack);

                    this.videoTrack = null;
                }
                this.videoIniciado = false;
                setTimeout(() => {
                    resolve(true);
                }, 3500);
            } catch (e) {
                console.error(e);
                reject(false);
            }

        });
    }
    public async capturarSnapshot():Promise<any> { 
        return new Promise((resolve, reject) => {
            try {
                const videoElement = this.previewElement.nativeElement.children[0]; 

                      let width = this.videoTrack.dimensions.width;
                      let height = this.videoTrack.dimensions.height;
                      const maxHeight = 480;
                      const maxWidth = 480;

                      if (width > height) {
                        if (width > maxWidth) {
                          height = Math.round((height *= maxWidth / width));
                          width = maxWidth;
                        }
                      } else {
                        if (height > maxHeight) {
                          width = Math.round((width *= maxHeight / height));
                          height = maxHeight;
                        }
                      }
                  this.renderer.setProperty(this.canvas.nativeElement, 'width', width);
                  this.renderer.setProperty(this.canvas.nativeElement, 'height', height);

                  const context = this.canvas.nativeElement.getContext('2d').drawImage(videoElement, 0, 0, width, height); 
                resolve(this.canvas.nativeElement.toDataURL("image/png", 0.6));
            }
            catch(err){
                reject(err);
            }
        });
    }    

    public async alterarCamera(facingMode?:string) {  
            // console.log("Device atual", this.currDeviceId);
            // console.log( "Tracks", this.localTracks);
            // console.log("Video track", this.videoTrack);
            // if(this.trocandoCamera)
            //     return;
 
            //     this.finalizePreview().then(() => {
            //         this.facingMode = this.facingMode == 'environment' ? 'user' : 'environment';
            //         StorageUtils.setItem("facingMode", this.facingMode);

            //         this.trocandoCamera = false;
            //         this.initializePreview();
            //     });
                //     this.videoTrack.stop();
                // this.videoTrack.mediaStreamTrack.stop();
                // this.videoTrack.restart({ facingMode: 'environment' });

            // this.cub3Svc.getDevices().then((devices:any) => {
            //     let cameras:any = [];
            //     for(let item of devices) {
            //         if(item.deviceId != this.currDeviceId && item.kind == 'videoinput')
            //             cameras.push(item);
            //     }

            //     this.currDeviceId = cameras[0].deviceId;
            //     console.log("Câmeras", cameras);
            //     this.videoTrack.restart({ deviceId: this.currDeviceId });
            // }, () => {

            // });
    }
    private limparRenderer():Promise<any> { 
        const childElements = this.previewElement.nativeElement.children;
        return new Promise((resolve, reject) => {
            for (let child of childElements) {
              this.renderer.removeChild(this.previewElement.nativeElement, child);
            }
            resolve(true);
        });
    }
    private async initializeDevice(kind?: any, deviceId?: string) {
        try {
            console.log("Iniciando "+kind+" / deviceId "+deviceId);
            // this.isInitializing = true; 
            // this.finalizePreview();
 
            // this.initializeTracks(kind ? kind : null, deviceId ? deviceId : null).then((localTracks:LocalTrack[]) => {
            //     this.localTracks = localTracks; 
            //     this.currDeviceId = deviceId;  
                     
            //     console.log("Local tracks",  this.localTracks);
            //     this.videoTrack = this.localTracks.find(t => t.kind === 'video') as LocalVideoTrack; 
            //     const videoElement = this.videoTrack.attach();      

            //     // this.alterarCamera();
            //     this.limparRenderer().then(() => {
            //         this.renderer.setStyle(videoElement, 'height', '100%');
            //         // this.renderer.setStyle(videoElement, 'width', '100%');
            //         this.renderer.setStyle(videoElement, 'border-radius', '0px');
            //         this.renderer.appendChild(this.previewElement.nativeElement, videoElement); 
            //         this.permissao = "granted";
            //         this.videoIniciado = true;

            //          console.log("video track", this.videoTrack.mediaStreamTrack);
            //     }, () => {

            //     });
            // }, (err) => {
            //     throw new Error(err);
            // });  
                    this.isInitializing = true; 
                    this.permissao = "granted";
                    this.videoIniciado = true;
        } 
        catch(err) {
            console.log(err); 
            console.log("Tentando novamente");
            // this.alterarCamera(); 
            this.permissao = "denied";
        }
         finally {
          this.permissaoCamera.emit(this.permissao == 'granted' || this.permissao == 'carregando' ? true : false);
             console.log("Câmera", this.isInitializing);
            this.isInitializing = false;
        }
    }
   private monitorarPermissoes() {
       if(!navigator || !navigator.permissions)
           return;
       // if(!navigator || !navigator.permissions){
       //     setInterval(() => {
       //         if(this.isInitializing && !this.trocandoCamera && this.currDeviceId == null){
       //             console.log("Tentando iniciar a câmera");
       //              this.finalizePreview().then(() => {
       //                  this.initializePreview();
       //              });
       //         }
       //     }, 3000);
       //     return;
       // }

    navigator.permissions.query(
        { name: 'camera' }
        // { name: 'microphone' } 
    ).then((permissionStatus) => {
      this.permissao = permissionStatus.state;

        permissionStatus.onchange = () => {
          console.log("Permissão alterada", this.permissao);
          this.permissaoCamera.emit(this.permissao == 'granted' ? true : false);

            this.finalizePreview().then(() => {
                this.initializePreview();
            });
        }

    })
  }
    public solicitarPermissao() {
            this.initializePreview();
       if(!navigator || !navigator.permissions)
           return;

         navigator.permissions.query({name: 'camera'})
             .then((permissionObj) => {
              console.log(permissionObj.state);
             })
             .catch((error) => {
              console.log('Got error :', error);
             });
         navigator.permissions.query({name: 'microphone'})
             .then((permissionObj) => {
              console.log(permissionObj.state);
             })
             .catch((error) => {
              console.log('Got error :', error);
             });
    }

    private initializeTracks(kind?: MediaDeviceKind, deviceId?: string):Promise<any> {
        return new Promise((resolve, reject) => {
            if(this.videoIniciado)
                reject(false);

            this.atualizarFace();

            if (kind) {
            console.log("Iniciando track", kind);
            console.log(deviceId);
            
                switch (kind) {
                    case 'audioinput':
                        return createLocalTracks({ audio: { deviceId }, video: true });
                    case 'videoinput':
                        console.log("Iniciando track de vídeo", deviceId);
                        createLocalTracks({ audio: true, video: { facingMode: this.facingMode } }).then((localTracks:LocalTrack[]) => {
                            resolve(localTracks);
                        }, (err) => {
                            reject(err);
                        });
                }
            }

            createLocalTracks({ audio: true, video: {facingMode: this.facingMode } }).then((localTracks:LocalTrack[]) => {
                resolve(localTracks);
            }, (err) => {
                reject(err);
            });
        });
    }
}