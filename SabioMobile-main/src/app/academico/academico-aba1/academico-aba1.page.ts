import { FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Component } from '@angular/core';
import {Usuario, Atividade, Arquivo} from "@cub3/classes";

import {StorageUtils} from "@cub3/utils/storage.utils";
import {Cub3SvcProvider} from "@cub3/cub3-svc/cub3-svc";
import {Cub3DbProvider} from "@cub3/cub3-db/cub3-db";
import {Router} from "@angular/router";
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {NODE_URL} from "@cub3/cub3-config";
import {Platform} from "@ionic/angular";
import { ActionSheetController } from '@ionic/angular';

import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-academico-aba1',
  templateUrl: 'academico-aba1.page.html',
  styleUrls: ['academico-aba1.page.scss']
})
export class AcademicoAba1Page {
	listCardsAdventure:any[] = [{'title': 'adssa'}, {'title': 'adssa'}, {'title': 'adssa'}, {'title': 'adssa'}];
	slideOpts = {
		initialSlide: 1,
		speed: 400,
	  };
	  slideOptsConteudo = {
		slidesPerView: 2.5,
		spaceBetween: 10,
		autoHeight: true

	  }
	usuario:Usuario = StorageUtils.getAccount();
	tituloAba:string;
	  data:any = {
	    'MOB_TURMAS': [],
	    'MOB_PROF_HORARIO': []
	  };
	  carregando:any = {
	  	"aulas": false,
	  	"turmas": false
	  };
	  arquivos:Arquivo[] = [];
	  atividades:Atividade[] = [];
	  avisos:any[] = [];
	  turmas:any[] = [];
	  alunos:any[] = [];
	  aulas:any[] = [];

  constructor(
  	private cub3Db:Cub3DbProvider,
  	private actionSheetController:ActionSheetController,
  	public cub3Svc:Cub3SvcProvider,
  	private platform:Platform,
  	private androidPermissions:AndroidPermissions,
  	private router:Router
  	) {
  	this.tituloAba = `Seja bem-vindo, <br /><b>${this.usuario.getNomeFormatado()}</b>`;
  }

  ionViewWillEnter() {
  	this.init();
  }
async init() { 
	this.usuario = StorageUtils.getAccount();
	console.log("Usuário invalido", this.usuario);

	if(!this.usuario) {
		this.router.navigate(['/login']);
	}
	this.data = StorageUtils.getItem("data");
	this.turmas =  await this.cub3Svc.getTurmas();
	this.alunos = await  this.cub3Svc.listarAlunos(this.turmas);


	this.getAtividades();
	this.getMateriais();

	this.getAvisos();

	  if (this.platform.is('android')) {
	  	const list:any = [
		  this.androidPermissions.PERMISSION.CAMERA,
		  this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
	      this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT,
	      this.androidPermissions.PERMISSION.RECORD_AUDIO,
		  this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
		  this.androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS,
		  this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
		  this.androidPermissions.PERMISSION.FOREGROUND_SERVICE
		];
		 this.androidPermissions.requestPermissions(list);
 
		}

	this.getAulas().then(() => {
		this.carregando.aulas = false;
	}, () => {
		this.carregando.aulas = false;
	});
	this.getTurmas().then(() => {
		console.log("Turmas carregadas");
		this.carregando.turmas = false;
	}, (err) => {
		console.error("Erro ao carregar turmas", err);
		this.carregando.turmas = false;
	});
}
async getTurmas():Promise<any> {
	return new Promise((resolve, reject) => {
		this.data = StorageUtils.getItem("data");
		resolve( true );
	})
	// return new Promise((resolve, reject) => {
	//    this.data.MOB_TURMAS = [];
	//    	const escolas = StorageUtils.getItem("data")['MOB_ESCOLA'];

	//    	if(escolas.length == 0)
	//    		reject(null);

	// 	  this.cub3Db.query(`SELECT * FROM MOB_TURMAS WHERE MOB_TURMAS.IDF_ESCOLA = ${escolas[0].IDF_ESCOLA} GROUP BY MOB_TURMAS.IDF_TURMA  ORDER BY MOB_TURMAS.NME_TURMA ASC`).then((data:any) => {
	// 	    if(data != null && data.rows != null) {
	// 	      for (var i = 0; i < data.rows.length; i++) {
	// 	        this.data.MOB_TURMAS.push(data.rows.item(i));
	// 	      } 
	// 	     resolve(this.data.MOB_TURMAS);
	// 	    }
	// 	    else {
	// 	    	reject(false);
	// 	    }
	// 	  }, (err) => { 
	// 	  	reject(null);
	// 	  });
	// });
}
 getTurmasDados() {
 	return this.data.MOB_TURMAS;	
 }
  async getAtividades() {
  	// const carregar = await this.cub3Svc.carregar(1);
  	this.cub3Svc.getNode("atividades/listar").then((res:any) => {
  		// carregar.dismiss();
  		if(res && res.dados) {
  			this.atividades = res.dados;
  		}
  	}, () => {
  		// carregar.dismiss();
  	})
  }

  async selecionarArquivo(arquivo:any) {
	console.log("Arquivo", arquivo);
    const actionSheet = await this.actionSheetController.create({
      header: `Arquivo: ${arquivo.arquivo}`,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Deletar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, 
	//   {
    //     text: 'Compartilhar',
    //     icon: 'share',
    //     handler: () => {
    //       console.log('Share clicked');
    //     }
    //   }, 
	{
		text: 'Baixar',
		icon: 'download',
		handler: () => {
		  const url = NODE_URL + "arquivo?url=" + encodeURIComponent(arquivo.src);
		  console.log("Url arquivo", url);
	  
		  this.cub3Svc.download(url)
			.subscribe(blob => {
			  const a = document.createElement('a');
			  const objectUrl = URL.createObjectURL(blob);
			  a.href = objectUrl;
			  a.download = arquivo.arquivo;
			  
			//   // Ionic's way to handle file download on mobile device
			//   if (this.platform.is('cordova')) {
			// 	const fileTransfer: FileTransferObject = this.fileTransfer.create();
			// 	const filePath = this.file.dataDirectory + arquivo.arquivo;
	  
			// 	fileTransfer.download(url, filePath)
			// 	  .then((entry) => {
			// 		console.log('Download complete: ' + entry.toURL());
			// 		// Optionally, you can open the downloaded file
			// 	  }, (error) => {
			// 		// Handle error
			// 	  });
			//   } else {
			// 	// Fallback for web browsers
			// 	a.click();
			//   }
	  
			//   URL.revokeObjectURL(objectUrl);
			});
		}
	  },
	  {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
  }
  async getAvisos() {
  	// const carregar = await this.cub3Svc.carregar(1);
  	this.cub3Svc.getNode("educanet/profissional/avisos").then((res:any) => {
  		// carregar.dismiss();
  		if(res && res.dados) {
  			this.avisos = res.dados;
  		}
  	}, () => {
  		// carregar.dismiss();
  	})
  }
  async getMateriais() {
  	// const carregar = await this.cub3Svc.carregar(1);
  	this.cub3Svc.getNode("arquivos/listar?limiteInicial=0&limiteFinal=5").then((res:any) => {
  		// carregar.dismiss();
  		if(res && res.dados) {
  			this.arquivos = res.dados;
  		}
  	}, () => {
  		// carregar.dismiss();
  	})
  }
  abrirArquivo(arquivo:Arquivo) {
    this.cub3Svc.download(NODE_URL + "arquivo?url=" + arquivo.arquivo)
      .subscribe(blob => {
        const a = document.createElement('a');
        const tipo = arquivo.arquivo_tipo.split("/");
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = arquivo.arquivo_nome+'.'+tipo[1];
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
  }
getAulas():Promise<any> {
	return new Promise((resolve, reject) => {
		resolve(true);
	});
	// return new Promise((resolve, reject) => {
	// 	  this.data.MOB_PROF_HORARIO = [];
	// 	  this.cub3Db.query("SELECT * FROM MOB_PROF_HORARIO INNER JOIN MOB_TURMAS ON MOB_PROF_HORARIO.IDF_TURMA = MOB_TURMAS.IDF_TURMA GROUP BY MOB_TURMAS.IDF_TURMA ORDER BY MOB_TURMAS.NME_TURMA ASC").then((data:any) => {
	// 	    if(data != null && data.rows != null) {
	// 	      for (var i = 0; i < data.rows.length; i++) {
	// 	        this.data.MOB_PROF_HORARIO.push(data.rows.item(i)); 
	// 	      } 
	// 	      console.log(this.data);
	// 	      resolve(this.data.MOB_PROF_HORARIO);
	// 	  }
	// 	  else {
	// 	  	reject(false);
	// 	  }
	// 	}, () => {
	// 	  	reject(null);
	// 	});
	// });
}
	abrirRegistro() {
		this.router.navigate(["/app/meus-dados/meus-dados-registro-jornada-novo"]);
	}  
}
