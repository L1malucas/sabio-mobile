import * as _ from 'lodash'; 
import {QuizPergunta} from "./index";

export class Quiz {
    perguntas: QuizPergunta[] = [];
    titulo: string;
    descricao: string;
    quiz_id:number;
    status:string;
    id: number;

    constructor(dados?:any) {  
        if(dados) { 
        	if(dados.perguntas && dados.perguntas.length > 0 ) {
        		let auxPerguntas:QuizPergunta[] = [];
        		for(let pergunta of dados.perguntas) {
        			auxPerguntas.push(new QuizPergunta(pergunta));
        		}
        		dados.perguntas = auxPerguntas;
        	}
            _.assignIn(this, dados);
        }
    } 
}