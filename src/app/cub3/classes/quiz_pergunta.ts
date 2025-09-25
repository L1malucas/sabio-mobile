import * as _ from 'lodash'; 
import {QuizPerguntaOpcao} from "./index";

export class QuizPergunta {
    titulo: string;
    descricao: string;
    opcoes: QuizPerguntaOpcao[] = [];
    tipo_pergunta: number;
    opcao_correta: any;
    status:string;
    id: number;

    constructor(dados?:any) {  
        if(dados) { 
            _.assignIn(this, dados);
        }
    } 
}