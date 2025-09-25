import { Component, OnInit, Input,  ViewChild, ElementRef, ChangeDetectionStrategy,  ChangeDetectorRef } from '@angular/core';
import { Platform,Animation, AnimationController } from '@ionic/angular';
import {StorageUtils} from "@cub3/utils/storage.utils";
import {Usuario} from "@cub3/classes/usuario";
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Location } from '@angular/common';
import {LAYOUT_CORES}  from "@cub3/cub3-config";
import {Router} from "@angular/router";
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { Cub3SvcProvider } from '@cub3/cub3-svc/cub3-svc';

@Component({
  selector: 'cub3-header',
  templateUrl: './cub3-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./cub3-header.component.scss'],
})
export class Cub3HeaderComponent implements OnInit {

	ionBackButtonIcon:any = "arrow-round-back";
	exibirHeader:boolean = false;
  	animacoesCarregadas:boolean = false;
  	isLeaving:boolean = false;
  	usuario:Usuario = StorageUtils.getAccount();
  	classe:string = "academico";

  	classeAtiva:string;
	@Input() titulo:any;
	@Input() retorno:any;
  @Input() color:any = "white";
  @Input() corTexto:any = "#000000";
	@Input() icone:any = "";
	@Input() mini:any = true;
	@Input() voltar:boolean = false;
	@Input() exibirAvatar:boolean = false;
	@Input() exibirVoltarLabel:boolean = true;
	@Input() exibirNotificacoes:boolean = true;
	@Input() classeF:string = "";
  @Input() exibirDivisor:boolean = true;

	@ViewChild("tituloHeader") tituloHeader:ElementRef;

  constructor(
  	private animationCtrl: AnimationController,
	private cub3Svc:Cub3SvcProvider,
  	private platform:Platform,
  	private statusBar:StatusBar,
  	private cd: ChangeDetectorRef,
    private mobileAccessibility: MobileAccessibility,
  	private router:Router,
  	private location: Location
  	) { 
		this.platform.backButton.subscribeWithPriority(10, () => {
		  this.voltarRota();
		});
  // this.mobileAccessibility.setTextZoom(1000); 
  // this.mobileAccessibility.updateTextZoom(); 
  // this.mobileAccessibility.usePreferredTextZoom(false);


}

async init() {
	this.usuario = StorageUtils.getAccount();
	let tipoSelecionado:any = StorageUtils.getItem("tipoSelecionado");

        if(tipoSelecionado && tipoSelecionado.classe){
          this.classe = tipoSelecionado.classe;
		}

}
  ngOnInit() { 

	this.exibirHeader = true; 
	this.cd.markForCheck();
  	// setTimeout( () => {
  	// 	if(!this.isLeaving && !this.mini){
	//   	let ani:Animation = this.fadeIn(this.tituloHeader, "translateX");
	//   		this.exibirHeader = true; 
	//     	ani.play(); 
  	// 	}
  	// }, 300);

	    this.platform.ready().then(() => {
      		this.init();        
				setTimeout(() => {
					this.cd.markForCheck();
				}, 150);
				
		  	// this.platform.backButton.subscribe(() => {
		  	// 		this.exibirHeader = false;
			// });
		  });

  }
  isCurrentRoute(route: string): boolean {
	console.log("Rota", this.router.url);
	return this.router.url.includes(route);
  }
  async getUsuario() {
  	this.usuario = StorageUtils.getAccount();

  	return this.usuario;
  }
  fadeIn(elm:ElementRef, dir:string = 'translateX', dur:number = 300):Animation { 
	  const animation: Animation = this.animationCtrl.create()
	    .addElement(elm.nativeElement)
	    .duration(dur)  
	    .fromTo('opacity', '0', '1') 
	    .fromTo('transform', dir+'(100%)', dir+'(0)');

	    return animation;
  }
  fadeOut(elm:ElementRef, dir:string = 'translateX', dur:number = 300):Animation {
	  const animation: Animation = this.animationCtrl.create()
	    .addElement(elm.nativeElement)
	    .duration(dur)  
	    .fromTo('opacity', '1', '0') 
	    .fromTo('transform', dir+'(0)', dir+'(100%)');

	    return animation;
  } 
  ionViewDidEnter() {
  	this.isLeaving = false;
  	setTimeout(() => {
  		this.animacoesCarregadas = true;
  	}, 1000);
  }
  ionViewWillLeave() {
  	this.isLeaving = true;
  	this.animacoesCarregadas = false;
  }
  getCorBtn() {
	return this.getClasseF().includes('bgTransparente') ? '#3b3b3b' : '#ffffff !important';
  }
  removerHeader() {
  	setTimeout( () => {
  			this.exibirHeader = false;
  	}, 600);
  }
 voltarRota() {
    this.location.back();
 }
 getClasseF() {
	return this.classeF;
 }
  getClasse() {
    return this.classe;
    let tipoSelecionado:any = StorageUtils.getItem("tipoSelecionado");

    if(tipoSelecionado && tipoSelecionado.classe){
      this.classe = tipoSelecionado.classe;
   

    return "";
    this.platform.ready().then(() => {
  		// this.statusBar.styleDefault();
  		// this.statusBar.backgroundColorByHexString(LAYOUT_CORES[this.classe]);
    });

    }

  }
  abrirMeusDados() {
  	this.router.navigate(["/app/meus-dados"]);
  }
}
