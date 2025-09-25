import { Component, OnInit } from '@angular/core';
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {StorageUtils} from '@cub3/utils/storage.utils';
import {Atividade, Tarefa, Arquivo, Turma, Quiz} from "@cub3/classes";

import {Router, ActivatedRoute} from "@angular/router";
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import {Location} from "@angular/common";
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Plugins } from '@capacitor/core'; 
const { FileSelect } = Plugins;  
import { Platform } from '@ionic/angular';
import * as moment from "moment";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: 'app-academico-atividade-novo',
  templateUrl: './academico-atividade-novo.page.html',
  styleUrls: ['./academico-atividade-novo.page.scss'],
})
export class AcademicoAtividadeNovoPage implements OnInit {

  dados:Atividade = new Atividade();
  turmaAtiva:any = {
    NME_TURMA: ''
  };
  turma:any;
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
    turmas:any[] = [];

  abaAtiva:any = "informacoes";
    // editorOptions = {
    //   anchor_bottom:                false, 
    //   anchor_top:                   false,
    //   autoresize_bottom_margin:     10,
    //   autoresize_min_height:        40,
    //   branding:                     false, 
    //   language:                     'en', 
    //   inline:                       true,
    //   fixed_toolbar_container:      ".tiny-mce-toolbar",
    //   menubar:                      false, 
    //   statusbar:                    false, 
    //   default_link_target:          '_blank', 
    //   link_assume_external_targets: true, 
    //   placeholder: 'Digite a descrição...',
    //   target_list:                  false, 
    //   link_title:                   false,
    //   theme: 'silver',
    // mobile: {
    //   theme: 'mobile',
    //   plugins: [ 'autosave', 'lists', 'autolink' ]
    // },
    //   base_url: '/assets/tinymce',
    //   plugins:                      'autoresize link lists',
    //   toolbar:                      'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist indent outdent | link unlink'
    // };
  constructor(
    private cub3Svc:Cub3SvcProvider,
    private platform:Platform,
    private location:Location,
    private cub3Db:Cub3DbProvider,
    public cdr: ChangeDetectorRef,
    private selector:WheelSelector,
    private route:ActivatedRoute,
    private router:Router
    ) { }
  async ionViewWillEnter() {
      for (var i = 0; i <= 120; i++) {
        if(i % 10 == 0)
          this.jsonData.duracao.push({'description':i+" minutos" });
    }

      this.data = StorageUtils.getItem("data");

      this.getDisciplinas();
      this.getQuizzes();
      this.route.url.subscribe(async () => {  
        if(this.route.snapshot.params.id && this.route.snapshot.params.id != 'undefined' ) {
          this.dados.id = this.route.snapshot.params.id;
            this.init();
        }
        else
        this.turmas = await this.cub3Svc.getTurmas();
      });
  }
  listarTurmas(escolas) {
	let turmas = [];
  
	escolas.forEach(escola => {
	  escola.turmas.forEach(turma => {
		turmas.push(turma);
	  });
	});
  
	return turmas;
  }
  async getDisciplinas() {
	// let turmas = this.data.MOB_TURMAS;
	// let disciplinas = this.data.MOB_DISCIPLINAS;
	// let profDisciplinas = this.data.MOB_PROF_DISCIPLINAS;
  
	// let turmaAtiva = turmas.find(turma => turma.IDF_TURMA == this.turmaAtiva.IDF_TURMA);
  
	// if (!turmaAtiva) return;
  
	// let result = profDisciplinas
	//   .filter(profDisciplina => profDisciplina.IDF_TURMA == turmaAtiva.IDF_TURMA)
	//   .map(profDisciplina => {
	// 	let disciplina = disciplinas.find(disciplina => disciplina.IDF_DISCIPLINA == profDisciplina.IDF_DISCIPLINA);
  
	// 	// Check if IDF_DISCIPLINA exists before adding the discipline to the array
	// 	return (disciplina && disciplina.IDF_DISCIPLINA) ? disciplina : null;
	//   })
	//   .filter(disciplina => disciplina !== null); // Remove null values from the array
  
	// this.data.MOB_DISCIPLINAS = result;
  }
  selecionarTurma(evt:any, turma:Turma) {

  }
  async init() { 
    const carregar:any = await this.cub3Svc.carregar(1);
    this.carregando = true;
    this.turmas = await this.cub3Svc.getTurmas();
    console.log("Turmas", this.turmas);
    this.cub3Svc.getNode("atividades/visualizar?id="+this.dados.id).then((res:any) => {
      carregar.dismiss();
      if(res && res.dados){
        this.dados = new Atividade(res.dados);
        console.log("Atividade", this.dados);

        if(this.dados.quizzes && this.dados.quizzes.length > 0) {
          for(let quiz of this.dados.quizzes) {
            for(let quiz2 of this.quizes){ 
              if(quiz.quiz_id == quiz2.id)
                quiz2.selecionado = true;
            }
          }
        }
        if(this.dados.turmas && this.dados.turmas.length > 0) {
          for(let turma of this.dados.turmas) {
            for(let turma2 of this.turmas){ 
              if(turma.turma_id == turma2.id)
                turma2.selecionado = true;
            }
          }
        }
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
  getQuizzes() {
    // this.cub3Svc.getNode("quiz/listar").then((res:any) => {
    //   if(res && res.dados)
    //     this.quizes = res.dados;
    // }, () => {

    // });
  }
  ngOnInit() {
  }

    uploadFile(arquivo:any) {
        const data = arquivo.target.files[0]; 
        let formData = new FormData();
        formData.append( "arquivo", data, (data.name).replace(/[^a-z0-9]/gi, '_')); 

        this.uploadArquivo(formData, this.addArquivo(data.name));
    }
    addArquivo(nome:string) {
      const id = Date.now() + ( (Math.random()*100000).toFixed());
        this.arquivos.push(new Arquivo({arquivo:nome, id: id, enviado: 0}));

        return id;
    }
    
    public async uploadArquivo(formData:any, id?:any) {  
      console.log("Enviando arquivo", this.arquivos);
      
      try {
          const res = await this.cub3Svc.postFormData("uploadArquivo", formData);
          console.log("Retorno arquivo", res);
  
          // Verifica se o arquivo já existe no array
          let arquivoExistente = this.arquivos.find(arquivo => arquivo.id == id);
  
          if (arquivoExistente) {
              // Se o arquivo existir, atualiza o id
              arquivoExistente.id = res.dados.id;
          } else {
              // Se o arquivo não existir, adiciona um novo arquivo ao array
              this.arquivos.push(res.dados);
          }
      } catch(err) {
          console.error("Erro ao enviar", err);
      }
  }
    delArquivo(arquivo:any) {
      this.arquivos.splice(this.arquivos.indexOf(arquivo), 1);
    }
    async submit() {
      let camposObrigatorios:any[] = [
        {id:'titulo','label': 'Título da atividade'}, 
        // {id:'disciplina_id', 'label': 'Disciplina'}, 
        // {id:'tipo_atividade', 'label': 'Tipo da atividade'}
      ];
      let erros:any = [],
        i:number = 0;

      for(let item of camposObrigatorios) {
        if(!this.dados[item.id] || this.dados[item.id] == ''){
          erros.push(item.label);
        }
        i++;
      }

      if(erros.length > 0){
        let aux:any = erros.join(", ");
        this.cub3Svc.alerta("Ops!","Campo(s) obrigatório(s): <b>"+aux+"</b>");
        return;
      }
      else {

        let flag:boolean = false;
        for(let quiz of this.quizes) {
          flag = false;
          for(let quiz2 of this.dados.quizzes) {
            if(quiz2.quiz_id == quiz.id){
              flag = true;
              quiz2.status = quiz.selecionado ? 'ATIVO' : 'EXCLUIDO';
            }
          }
          if(!flag && quiz.selecionado)
            this.dados.quizzes.push(quiz);
        }

        for(let turma of this.turmas) {
          flag = false;
          for(let turma2 of this.dados.turmas) {
            if(turma2.id == turma.id){
              flag = true;
              turma2.status = turma.selecionado ? 'ATIVO' : 'EXCLUIDO';
            }
          }
          if(!flag && turma.selecionado)
            this.dados.turmas.push(turma);
        }

        this.dados.arquivos = this.arquivos;

      if(!this.dados.id) {
        this.cub3Svc.postNode("atividades/novo", this.dados).then((r: any) => { 
              if (r && r.result) { 
                      this.cub3Svc.alertaToast("Nova atividade", "Atividade criado com sucesso!", "success"); 
                      this.router.navigateByUrl('/app/academico/academico-atividades', {replaceUrl: true});
              } else { 
              this.cub3Svc.alerta("Ops!", "Não foi possível criar a atividade. Por favor, tente novamente ou entre em contato com o suporte técnico.");
              }
          }, (err) => { 
              this.cub3Svc.alerta("Ops!", "Não foi possível criar a atividade. Por favor, tente novamente ou entre em contato com o suporte técnico.");
          });
     }
     else {
        this.cub3Svc.postNode("atividades/atualizar", this.dados).then((r: any) => { 
              if (r && r.result) { 
                      this.cub3Svc.alertaToast("Nova atividade", "Atividade atualizado com sucesso!", "success"); 
                      this.router.navigateByUrl('/app/academico/academico-atividades', {replaceUrl: true});
              } else { 
              this.cub3Svc.alerta("Ops!", "Não foi possível criar a atividade. Por favor, tente novamente ou entre em contato com o suporte técnico.");
              }
          }, (err) => { 
              this.cub3Svc.alerta("Ops!", "Não foi possível criar a atividade. Por favor, tente novamente ou entre em contato com o suporte técnico.");
          });

     }

      }
    }
    async enviarArquivo(uploader:any) {
        if(this.platform.is("android")){
            let selectedFile = await FileSelect.select({multiple_selection: true, ext: ["*"]});
            let formData = new FormData();
            let paths = (selectedFile.files);
            // for (let index = 0; index < paths.length; index++) {
               const file = await fetch(paths[0].path).then((r) => r.blob());
               formData.append("arquivo",file,paths[0].name + paths[0].extension); 
               this.uploadArquivo(formData);
            // }
        }
        else if(this.platform.is("ios")) {
            let selectedFile = await FileSelect.select({multiple_selection: true, ext: ["*"]});
            let formData = new FormData();
            const file = await fetch(selectedFile.paths[0]).then((r) => r.blob());
            formData.append("arquivo", file, selectedFile.original_names[0] + selectedFile.extensions[0]); 
            this.uploadArquivo(formData);
        }
        else {
            uploader.click(); 
        }
    }
    public uploadArquivoTarefa(formData:any, id:any, tarefa:any) {    
        this.cub3Svc.postFormData("uploadArquivo", formData).then((res:any) => {
            console.log("Retorno arquivo", res);
            for(let arquivo of tarefa.arquivos) {
              if(arquivo.id == id)
                arquivo.id = res.dados.id;
            }
        }, (err:any) => {
            console.error("Erro ao enviar", err);
        });
    }
    delArquivoTarefa(tarefa:any, arquivo:any) {
      tarefa.arquivos.splice(tarefa.arquivos.indexOf(arquivo), 1);
    }
    addArquivoTarefa(tarefa:any, nome:string) {
      const id = Date.now() + ( (Math.random()*100000).toFixed());
      if(!tarefa.arquivos)
        tarefa.arquivos = [];

        tarefa.arquivos.push({arquivo:nome, id: id, enviado: 0});

        return id;
    }
    uploadFileTarefa(arquivo:any, tarefa:any) {
        const data = arquivo.target.files[0]; 
        let formData = new FormData();
        formData.append( "arquivo", data, (data.name).replace(/[^a-z0-9]/gi, '_')); 

        this.uploadArquivoTarefa(formData, this.addArquivoTarefa(tarefa, data.name), tarefa);
    }
    async enviarArquivoTarefa(uploader:any, tarefa:any) {
        if(this.platform.is("android")){
            let selectedFile = await FileSelect.select({multiple_selection: true, ext: ["*"]});
            let formData = new FormData();
            let paths = (selectedFile.files); 
               const file = await fetch(paths[0].path).then((r) => r.blob());
               formData.append("arquivo",file,paths[0].name + paths[0].extension); 
               this.uploadArquivoTarefa(formData, this.addArquivoTarefa(tarefa, paths[0].name), tarefa); 
        }
        else if(this.platform.is("ios")) {
            let selectedFile = await FileSelect.select({multiple_selection: true, ext: ["*"]});
            let formData = new FormData();
            const file = await fetch(selectedFile.paths[0]).then((r) => r.blob());
            formData.append("arquivo", file, selectedFile.original_names[0] + selectedFile.extensions[0]); 
            this.uploadArquivoTarefa(formData, this.addArquivoTarefa(tarefa, selectedFile.original_names[0]), tarefa);
        }
        else {
            uploader.click(); 
        }
    }
    addTarefa(slider) {
      this.dados.tarefas.push(new Tarefa({
        titulo: '',
        descricao: '',
        link: '',
        valor: null
      }));
      setTimeout(() => {
        slider.slideTo(this.dados.tarefas.length+1);
      }, 300);
    }
    alterarQuiz(quiz:Quiz) { 
      for(let quiz of this.dados.quizzes) {
        if(quiz.quiz_id == quiz.id)
          quiz.status = 'EXCLUIDO';
      }
    }
    delTarefa(tarefa:any) {
      console.log("Excluindo tarefa", tarefa);
      if(tarefa.id)
          this.dados.tarefas.splice(this.dados.tarefas.indexOf(tarefa), 1);
        else
          this.dados.tarefas[this.dados.tarefas.indexOf(tarefa)].status = 'EXCLUIDO';
    }
    tratarHTML(str:any) {
      return str ? str.replace(/<(?:.|\n)*?>/gm, ' ') : str;
    }
    verificarTipoAtividade():boolean {
      return this.dados.tipo_atividade == 1;
    }

}
