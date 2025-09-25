import * as _ from 'lodash'; 
import {Aluno} from "./index";

export class Turma {
    alunos: Aluno[] = [];
    titulo: string;
    turma_id: string;
    atividade_id:number;
    status:string;
    id: number;

    constructor(dados?:any) {  
        if(dados) { 
        	if(dados.alunos && dados.alunos.length > 0 ) {
        		let auxAlunos:Aluno[] = [];
        		for(let aluno of dados.alunos) {
        			auxAlunos.push(new Aluno(aluno));
        		}
        		dados.alunos = auxAlunos;
        	}
            _.assignIn(this, dados);
        }
    } 
}