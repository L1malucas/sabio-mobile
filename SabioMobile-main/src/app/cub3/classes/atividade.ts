import * as _ from 'lodash'; 
import {Arquivo} from "./arquivo";
import {Tarefa} from "./tarefa";
import {Quiz} from "./quiz";
import {Turma} from "./turma";

export class Atividade {
	id:number; 
    tarefas: Tarefa[] = [];
    titulo: string;
    disciplina_id: string;
    tipo_atividade: any;
    horario_criacao:Date;
    data_entrega: Date;
    entregas:any[] = [];
    descricao: string;
    arquivos: Arquivo[] = [];
    quizzes:Quiz[] = [];
    chat:any[] = [];
    disciplina:any = {};
    turmas:Turma[] = [];

    constructor(dados?:any) {  
        if(dados) { 
            _.assignIn(this, dados);
        }
    } 
}