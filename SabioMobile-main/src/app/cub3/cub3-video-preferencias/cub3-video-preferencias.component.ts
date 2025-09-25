import {
    Component,
    OnInit,
    OnDestroy,
    EventEmitter,
    Input,
    Output,
    ViewChild
} from '@angular/core';
import { Cub3CameraComponent } from '@cub3/cub3-camera/cub3-camera.component';
import { Cub3DeviceSelectComponent } from '@cub3/cub3-device-select/cub3-device-select.component';
import { Cub3DeviceService } from '@cub3/cub3-device/cub3-device.service';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'cub3-video-preferencias',
  templateUrl: './cub3-video-preferencias.component.html',
  styleUrls: ['./cub3-video-preferencias.component.scss']
})
export class Cub3VideoPreferenciasComponent implements OnInit {

    public devices: MediaDeviceInfo[] = [];
    private subscription: Subscription;
    private videoDeviceId: string;

    get hasAudioInputOptions(): boolean {
        return this.devices && this.devices.filter(d => d.kind === 'audioinput').length > 0;
    }
    get hasAudioOutputOptions(): boolean {
        return this.devices && this.devices.filter(d => d.kind === 'audiooutput').length > 0;
    }
    get hasVideoInputOptions(): boolean {
        return this.devices && this.devices.filter(d => d.kind === 'videoinput').length > 0;
    }

    @ViewChild('camera', { static: false }) camera: Cub3CameraComponent;
    @ViewChild('videoSelect', { static: false }) video: Cub3DeviceSelectComponent;

    @Input('isPreviewing') isPreviewing: boolean;
    @Output() settingsChanged = new EventEmitter<MediaDeviceInfo>();

    constructor(
        private readonly deviceService: Cub3DeviceService) { }

    ngOnInit() {
        this.subscription =
            this.deviceService
                .$devicesUpdated
                .pipe(debounceTime(900))
                .subscribe(async deviceListPromise => {
                    this.devices = await deviceListPromise;
                    this.handleDeviceAvailabilityChanges();
                });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    async onSettingsChanged(deviceInfo: MediaDeviceInfo) {
        if (this.isPreviewing) {
            await this.showPreviewCamera();
        } else {
            this.settingsChanged.emit(deviceInfo);
        }
    }

    async showPreviewCamera() {
        this.isPreviewing = true;

        if (this.videoDeviceId !== this.video.selectedId) {
            this.videoDeviceId = this.video.selectedId;
            const videoDevice = this.devices.find(d => d.deviceId === this.video.selectedId);
            await this.camera.initializePreview(videoDevice);
        }
        
        return this.camera.tracks;
    }

    hidePreviewCamera() {
        this.isPreviewing = false;
        this.camera.finalizePreview();
        return this.devices.find(d => d.deviceId === this.video.selectedId);
    }

    private handleDeviceAvailabilityChanges() {
            console.log("Devices", this.devices);
        if (this.devices && this.devices.length && this.video && this.video.selectedId) {
            let videoDevice = this.devices.find(d => d.deviceId === this.video.selectedId);
            if (!videoDevice) {
                videoDevice = this.devices.find(d => d.kind === 'videoinput');
                if (videoDevice) {
                    this.video.selectedId = videoDevice.deviceId;
                    this.onSettingsChanged(videoDevice);
                }
            }
        }
    }
}
