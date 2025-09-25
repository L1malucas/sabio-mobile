import { Injectable, Renderer2, Inject, RendererFactory2 } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { DOCUMENT } from '@angular/common';
const { CameraPreview } = Plugins;
// import { CameraPreviewOptions } from '@capacitor-community/camera-preview';

export enum CameraServiceOptions {
  CameraPosition = 'position',
  ContainerId = 'parent',
  CameraFront = 'front',
  CameraRear = 'rear',
}

const defaultCaptureConfig = { width: 360, quality: 60 };
 

@Injectable({ providedIn: 'root' })
export class CameraService {
    private bRenderer:Renderer2;
  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document) {
      this.bRenderer = rendererFactory.createRenderer('body', null);

  }
  startPreview(cameraServiceOptions: any) {

    // const cameraPreviewOptions: CameraPreviewOptions = {
    //   [CameraServiceOptions.ContainerId]: 'camera-preview',
    //   toBack: true,
    //   disableExifHeaderStripping:false,
    //   rotateWhenOrientationChanged: false,
    //   position: cameraServiceOptions.position,
    //   height: cameraServiceOptions.height,
    //   width: cameraServiceOptions.width
    // }; 
    //  this.bRenderer.addClass(this.document.documentElement, 'camera-ativa');  
    // CameraPreview.start(cameraPreviewOptions);
  }

  stopPreview() {
    // this.bRenderer.removeClass(this.document.documentElement, 'camera-ativa');  
    // try {
    //   CameraPreview.stop();  
    // }
    // catch(err) {
    //   console.log("Finalizando camera", err);
    // }
    
  }

  async capture(cameraServiceOptions?: any) {
    // const result = await CameraPreview.capture({
    //   ...defaultCaptureConfig,
    //   ...cameraServiceOptions,
    // });
    // return 'data:image/png;base64,' + result.value;
  }
}
