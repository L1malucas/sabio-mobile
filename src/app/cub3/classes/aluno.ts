import * as _ from 'lodash';
import {IMAGE_DIR, SITE_URL, AVATAR_DIR, BACKEND_URL, AVATAR_ALUNO_DIR} from '@cub3/cub3-config';
import {AlunoAssinatura} from "./aluno_assinatura";

export class Aluno {
	id:number = null;
	nome:string = "";
	nascimento:Date;
	sexo:string = "";
	rg:string = "";
	cpf:string = "";
	documento_tipo:string = "";
	assinatura:any = {};
	documento_numero:string = "";
	documento_orgao:string = "";
	documento_uf:string = "";
	nacionalidade:string = "";
	estado:string = "";
	naturalidade:string = "";
	estado_civil:string = "";
	escolaridade:string = "";
	cnh:string = "";
	observacoes:string = "";
	credencial_detran:string = "";
	tipo:string = "";
	avatar:string = '';
	nome_pai:string = "";
	nome_mae:string = "";
	email:string = "";
	telefone:string = "";
	processo_inicio:Date;
	processo_termino:Date;
	documento_expedicao:Date;
	processo_numero:string = "";
	ladv_numero:string = "";
	ladv_emissao:Date;
	profissao:string = "";
	empresa:string = "";
	cnh_primeira_hab:string = "";
	cnh_vencimento:Date;
	logradouro_complemento:string = "";
	qrCode:string = null;
	renach:string = null;
	aluno_id:number;
	liberar_digital:number;
	horario_registro:any;
    permissoes:any = { 

    }
    foto:string = "";
    foto2:string = "";
    cep:string = "";
	logradouro:string = "";
	bairro:string = "";
	uf:string = "";
	cidade:string = "";
	aula_id:number;
	logradouro_numero:string = ""; 
	assinaturas:AlunoAssinatura[] = [];
	facialAbertura:any;
	facialFechamento:any;
	digitalAbertura:any;
	digitalFechamento:any;
	aluno_biometria_dedo_abertura:any;

    constructor(dados?:any) {  
        if(dados) {

        	if(!dados.foto && dados.foto2)
        		dados.foto = this.foto2;

            _.assignIn(this, dados);
        }
    } 
    getAvatar() {
    	if(this.assinaturas && this.assinaturas.length > 0) {
    		return this.assinaturas[0].getAvatar();
    	}
    	else {
    		if(!this.foto && !this.avatar)
    			return `${IMAGE_DIR}/others/uploads/avatar/padrao.png`;
    		else if(!this.foto && this.avatar)
    			this.foto = this.avatar;
    		else if(!this.foto && !this.avatar && this.foto2)
    			this.foto = this.foto2;
    		
    		if(!this.foto)
    			return `${IMAGE_DIR}/others/uploads/avatar/padrao.png`;

	        if(this.foto.search("base64") != -1)
	            return this.foto;
	        else if(this.foto.search("uploads/") != -1){
	        	this.foto.replace("others/uploads/conteudo/", "");

	            return this.foto ? `${IMAGE_DIR}${this.foto}` : `${IMAGE_DIR}/others/uploads/avatar/padrao.png`;
	        }
	        else if(this.foto.search("://") == -1)
	            return this.foto ? `${AVATAR_ALUNO_DIR}${this.id}/fotos/${this.foto}` : `${IMAGE_DIR}/others/uploads/avatar/padrao.png`;
	        else
	            return this.foto; 
    	}
    }
    getAvatarBruto() {
    	return BACKEND_URL+this.foto;
    }
    getNome() {
        return this.nome;
    }
    getPrimeiroNome() {
    	const aux = this.nome.split(" ");
        return aux[0];
    }
    getPrimeiroUltimoNome() {
    	const aux = this.nome.split(" ");
    	if(aux.length > 1)
        	return aux[0] + ' ' + aux[aux.length-1];
        else
        	return aux[0];
    }
} 