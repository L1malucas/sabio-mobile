import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {BACKEND_URL}  from "@cub3/cub3-config";
import {StorageUtils} from '@cub3/utils/storage.utils';
import {Atividade, Tarefa, Arquivo, Quiz, Aluno} from "@cub3/classes";
import {NODE_URL} from '@cub3/cub3-config';
import {Router, ActivatedRoute} from "@angular/router";
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import {Location} from "@angular/common";
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Plugins } from '@capacitor/core'; 
import { ActionSheetController } from '@ionic/angular';
const { FileSelect } = Plugins;  
import { Platform } from '@ionic/angular';
import * as moment from "moment";
import { ChangeDetectorRef } from "@angular/core";
@Component({
  selector: 'app-academico-atividade-visualizar',
  templateUrl: './academico-atividade-visualizar.page.html',
  styleUrls: ['./academico-atividade-visualizar.page.scss'],
})
export class AcademicoAtividadeVisualizarPage implements OnInit {
	@ViewChild('chat') private chat: ElementRef;
	dados:Atividade = new Atividade();
	turmaAtiva:any = {
		NME_TURMA: ''
	};
	turma:any;
  turmas:any[] = [];

	mensagemChat:any = "";
	arquivos:Arquivo[] = [];
	data:any = {MOB_DISCIPLINAS: [], MOB_PLAULA: [], MOB_TURMAS: []};
	usuario:any = StorageUtils.getAccount();

	carregando:boolean = true;
	wizard:number = 1;
	mesesCal:any[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
	diasCal:any[] = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
    jsonData:any = {
	    duracao: [] 
    };
    quizes:any[] = [];

    enviandoMensagem:boolean = false;
	abaAtiva:any = "mensagens";
    editorOptions = {
      anchor_bottom:                false, 
      anchor_top:                   false,
      autoresize_bottom_margin:     10,
      autoresize_min_height:        40,
      branding:                     false, 
      language:                     'en', 
      inline:                       true,
      fixed_toolbar_container:      ".tiny-mce-toolbar",
      menubar:                      false, 
      statusbar:                    false, 
      default_link_target:          '_blank', 
      link_assume_external_targets: true, 
      placeholder: 'Digite a descrição...',
      target_list:                  false, 
      link_title:                   false,
  		theme: 'silver',
	  mobile: {
	    theme: 'mobile',
	    plugins: [ 'autosave', 'lists', 'autolink' ]
	  },
      base_url: '/assets/tinymce',
      plugins:                      'autoresize link lists',
      toolbar:                      'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist indent outdent | link unlink'
    };
  constructor(
  	private cub3Svc:Cub3SvcProvider,
  	private platform:Platform,
  	private location:Location,
  	private cub3Db:Cub3DbProvider,
    private actionSheetController:ActionSheetController,
    public cdr: ChangeDetectorRef,
  	private selector:WheelSelector,
  	private route:ActivatedRoute,
  	private router:Router
  	) { }

  ngOnInit() {
  }

  async init() { 
    const carregar:any = await this.cub3Svc.carregar(1);
    this.carregando = true;

    this.getTurmas();
    this.cub3Svc.getNode("atividades/visualizar?id="+this.dados.id).then((res:any) => {
      carregar.dismiss();
      if(res && res.dados){
        this.dados = new Atividade(res.dados);

        for(let chat of this.dados.chat) {
          if(chat.profissional_cpf == this.usuario.usuario)
            chat.autor = true;
        }
        console.log("Atividade", this.dados);
    	this.getDisciplinas();
      this.getAlunosTurmas();
      }
      setTimeout(() => {
        this.cdr.detectChanges();
        this.carregando = false;
      }, 300);
    }, () => {
      carregar.dismiss();
      this.carregando = false;
      this.location.back();
      this.cub3Svc.alerta("Ops!", "Atividade inválida.");
    });
  }
  getAlunosTurmas() {
    for(let turma of this.dados.turmas) {
      if(turma.status == 'ATIVO') {
        turma.alunos = [];
        this.cub3Svc.getUrl(BACKEND_URL+"homeclass_alunos/EDUCANET_PMBARREIRAS/"+this.usuario.ano_letivo+"/"+turma.turma_id+"/").then((res:any) => {
          if(res){
            for(let aluno of res) {
              turma.alunos.push(new Aluno(aluno));
            }
          }
        }, () => {
        });
      }
    }
  }
  getDisciplinas() {
  	this.carregando = true;
	    this.data.MOB_DISCIPLINAS = [];
		  this.cub3Db.query("SELECT * FROM MOB_DISCIPLINAS INNER JOIN MOB_PROF_DISCIPLINAS ON MOB_PROF_DISCIPLINAS.IDF_DISCIPLINA = MOB_DISCIPLINAS.IDF_DISCIPLINA GROUP BY MOB_PROF_DISCIPLINAS.IDF_DISCIPLINA").then((data:any) => {
		    if(data != undefined) {
		      for (var i = 0; i < data.rows.length; i++) {
		      	const dis = data.rows.item(i);
		        this.data.MOB_DISCIPLINAS.push(dis); 

		        if(this.dados.disciplina_id == dis.IDF_DISCIPLINA)
		        	this.dados.disciplina = dis;
		      } 
		    this.carregando = false;
		    } 
		  }); 
  }

  getTurmas() {
    this.data = StorageUtils.getItem("data");
    for(let item of this.data.MOB_TURMAS) {
      if(!item.NME_ESCOLA) {
        item.NME_ESCOLA = this.data.MOB_ESCOLA[0].NME_ESCOLA;
      }
    }
  }


  ionViewWillEnter() {  	
    this.route.url.subscribe(() => {  
    	if(this.route.snapshot.params.id && this.route.snapshot.params.id != 'undefined' ) {
	    	this.dados.id = this.route.snapshot.params.id;
  			this.init();
	    }
    });
  }
scrollToBottom(): void {
    try {
        this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight ;
    } catch(err) { }                 
}
  enviarMensagem(chat:any) {
    const msg = this.mensagemChat;

  	this.dados.chat.push({
  		autor: true,
      nome: this.usuario.getNome(),
  		mensagem: this.mensagemChat,
  		horario: moment()
  	});
  	this.mensagemChat = "";
  	this.scrollToBottom();

      if(this.enviandoMensagem || msg == '')
          return;

      this.enviandoMensagem = true;
      this.cub3Svc.postNode("atividades/chat/novo", {
          atividade_id: this.dados.id,
          tipo: this.usuario.perfil == 'PROFESSOR' ? 'Usuario' : 'Aluno',
          conteudo: msg
      }).then((res:any) => { 
          this.enviandoMensagem = false;
      }, (err:any) => {
          this.enviandoMensagem = false;
      });
  }

    tratarHTML(str:any) {
      return str.replace(/<(?:.|\n)*?>/gm, ' ');
    }
  async selecionarArquivo(arquivo:any) {
    const actionSheet = await this.actionSheetController.create({
      header: `Arquivo: ${arquivo.titulo}`,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Deletar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Compartilhar',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Baixar',
        icon: 'download',
        handler: () => { 
          this.cub3Svc.download(NODE_URL + "arquivo?url=" + arquivo.src)
            .subscribe(blob => {
              const a = document.createElement('a');
              const tipo = arquivo.mimeType.split("/");
              const objectUrl = URL.createObjectURL(blob);
              a.href = objectUrl;
              a.download = arquivo.arquivo+'.'+tipo[1];
              a.click();
              URL.revokeObjectURL(objectUrl);
            }) 
        }
      }, {
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
}
