import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Cub3CameraPreviewComponent } from './cub3-camera-preview.component';

describe('Cub3CameraPreviewComponent', () => {
  let component: Cub3CameraPreviewComponent;
  let fixture: ComponentFixture<Cub3CameraPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Cub3CameraPreviewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Cub3CameraPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
