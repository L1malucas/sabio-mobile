import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import {
  Animation,
  AnimationController,
  Platform,
  MenuController,
  AlertController,
} from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BarcodeFormat, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import jsQR from 'jsqr';

import { Cub3SvcProvider } from '@cub3/cub3-svc/cub3-svc';
import { Cub3DbProvider } from '@cub3/cub3-db/cub3-db';
import { UsuarioTipo } from '@cub3/classes/usuario_tipo';
import { TIPOS_USUARIO } from '@cub3/base/usuario_tipo';
import { LAYOUT_CORES, NODE_URL, BACKEND_URL, DB_TABLES } from '@cub3/cub3-config';
import { StorageUtils } from '@cub3/utils/storage.utils';


/**
 * Interface representando os dados de login
 */
interface LoginData {
  usuario: string;
  senha: string;
  chave: string;
  ano: number;
  salvar?: boolean;
  chave_acesso?: string;
  ano_letivo?: number;
}

/**
 * Interface representando os campos obrigatórios para validação
 */
interface CampoObrigatorio {
  id: keyof LoginData;
  label: string;
}

/**
 * Interface representando o usuário armazenado
 */
interface UsuarioArmazenado {
  id: number;
  usuario: string;
  usuarioTipo: UsuarioTipo;
  desPerfil?: string;
  chave_acesso?: string;
  ano_letivo?: number;
  senha?: string;
  logado?: number; 
}

/**
 * Interface representando os dados de login enviados para o backend
 */
interface DadosLogin {
  chave_acesso: string;
  ano_letivo: number;
  usuario: string;
  login?: string;
  senha: string;
}

/**
 * Interface representando os dados auxiliares de login
 */
interface AuxLogin {
  cpf: string;
  senha: string;
  tipoAcesso: string;
  app: string;
  ano: number;
  chave: string;
  login: string;
  logado: number; 
}


/**
 * Componente de Login
 * 
 * Responsável por gerenciar a autenticação de usuários no aplicativo.
 * Inclui funcionalidades de login manual e via QR Code, além de
 * gerenciamento de permissões e inicialização do banco de dados.
 * 
 * @autor Gustavo Aguiar - gustavo@cub3.com.br
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage implements OnInit, OnDestroy {
  // Objeto de login contendo os campos necessários
  public login: LoginData = {
    usuario: '',
    senha: '',
    chave: '',
    ano: new Date().getFullYear(),
    salvar: false,
  };

  // Listas para exercícios e chaves de acesso
  public exercicio: number[] = [];
  public chaves: any[] = [];

  // Estados de conexão e visibilidade do formulário de login
  public conectado: boolean = true;
  public exibirLogin: boolean = false;
  public exibirFormLogin: boolean = false;

  // Tipos de usuário disponíveis para login
  public tipoLogins: UsuarioTipo[] = TIPOS_USUARIO;

  // Usuário atualmente armazenado
  public usuario: UsuarioArmazenado | null = StorageUtils.getAccount();

  // Tipo de login selecionado
  public tipoSelecionado: UsuarioTipo | null = {
    id: null,
    label: '',
    classe: '',
    idSistema: '',
    idLogin: ''
  };

  // Referências aos elementos do DOM para animações
  @ViewChild('modalLogin', { static: false }) modalLogin!: ElementRef;
  @ViewChild('inicio', { static: false }) inicio!: ElementRef;
  @ViewChild('footer', { static: false }) footer!: ElementRef;
  @ViewChild('conteudo', { static: false }) conteudo!: ElementRef;

  // Subscripções para gerenciar eventos
  private backButtonSub: any;

  constructor(
    private animationCtrl: AnimationController,
    private menuCtrl: MenuController,
    private cub3Db: Cub3DbProvider,
    private androidPermissions: AndroidPermissions,
    private router: Router,
    private statusBar: StatusBar,
    private platform: Platform,
    private alertCtrl: AlertController,
    private changeDetector: ChangeDetectorRef,
    public cub3Svc: Cub3SvcProvider
  ) {
    // Gerencia o botão de voltar no Android
    this.backButtonSub = this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.tipoSelecionado) this.limparForm();
    });
  }

  /**
   * Ciclo de vida: Inicialização do componente
   */
  ngOnInit(): void { 
  }

  /**
   * Ciclo de vida: Quando a visão entra
   */
  ionViewDidEnter(): void {
    this.menuCtrl.enable(false); // Desativa o menu lateral

    if (this.platform.is('android')) {
      this.platform.ready().then(() => {
        this.requestAndroidPermissions();
      });
    }
  }

  /**
   * Ciclo de vida: Antes da visão entrar
   */
  ionViewWillEnter(): void {
    this.usuario = StorageUtils.getAccount();

    setTimeout(() => {
      this.verificarUsuario();
    }, 500);
  }

  /**
   * Ciclo de vida: Quando o componente é destruído
   */
  ngOnDestroy(): void {
    if (this.backButtonSub) {
      this.backButtonSub.unsubscribe();
    }
  }

  /**
   * Solicita as permissões necessárias no Android
   */
  private async requestAndroidPermissions(): Promise<void> {
    const permisssoes = [
      this.androidPermissions.PERMISSION.CAMERA,
      this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT,
      this.androidPermissions.PERMISSION.RECORD_AUDIO,
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
      this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
      this.androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS,
      this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
      this.androidPermissions.PERMISSION.FOREGROUND_SERVICE,
    ];

    try {
      const resultado = await this.androidPermissions.requestPermissions(permisssoes);
      console.log('Permissões solicitadas:', resultado);
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
    }
  }

  /**
   * Verifica o estado do usuário e redireciona conforme necessário
   */
  private async verificarUsuario(): Promise<void> {
    console.log('Verificando usuário:', this.usuario);

    if (
      !this.usuario ||
      !this.usuario?.id ||
      !this.usuario?.usuarioTipo ||
      !this.usuario?.usuarioTipo?.id
    ) {
      this.init();
    } else {
      console.log('Verificando conexão:', window.navigator.onLine);
      if (!window.navigator.onLine) {
        this.redirecionarUsuario();
      } else {
        await this.verificarSessao();
      }
    }
  }

  /**
   * Inicializa o estado do componente
   */
  private init(): void {
    this.getChavesAcesso();
    this.getExercicio();
    this.configurarStatusBar();

    setTimeout(() => {
      this.exibirLogin = true;
      const loginArmazenado = StorageUtils.getItem('login');

      if (loginArmazenado) {
        this.login = loginArmazenado;
      }

      this.changeDetector.markForCheck();
    }, 900);
  }

  /**
   * Configura a aparência da StatusBar
   */
  private configurarStatusBar(): void {
    this.statusBar.overlaysWebView(false);
    this.statusBar.styleDefault();
    this.statusBar.backgroundColorByHexString('#ffffff');
  }

  /**
   * Verifica a sessão do usuário com o backend
   */
  private async verificarSessao(): Promise<void> {
    console.log('Verificando sessão');
    try {
      const verificarSessao = await this.cub3Svc.getNode('verificarSessao');
      console.log('Sessão:', verificarSessao.result);

      if (verificarSessao?.result) {
        this.redirecionarUsuario();
      } else {
        this.init();
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      this.init();
    }
  }

  /**
   * Redireciona o usuário para a página inicial conforme o tipo de usuário
   */
  private redirecionarUsuario(): void {
    console.log('Usuário:', this.usuario?.usuarioTipo);
    const perfil = this.usuario?.usuarioTipo?.id || 'academico';
    const url = `/app/home/${perfil}`;
    console.log('URL de redirecionamento:', url);
    this.router.navigate([url]);
    this.menuCtrl.enable(true);
  }

  /**
   * Realiza o login do usuário
   */
  public async realizarLogin(): Promise<void> {
    StorageUtils.logout();

    const camposObrigatorios: CampoObrigatorio[] = [
      { id: 'usuario', label: 'Usuário' },
      { id: 'senha', label: 'Senha' },
    ];

    const erros = this.validarCampos(camposObrigatorios);

    if (erros.length > 0) {
      const campos = erros.join(', ');
      await this.presentAlert('Ops!', `Campo(s) obrigatório(s): <b>${campos}</b>`);
      this.changeDetector.markForCheck();
      return;
    }

    if (this.login.salvar) {
      StorageUtils.setItem('login', this.login);
    } else {
      StorageUtils.removeItem('login');
    }

    this.iniciarProcessoLogin();
  }

  /**
   * Valida os campos obrigatórios do formulário
   * @param campos Lista de campos obrigatórios
   * @returns Lista de campos que não foram preenchidos
   */
  private validarCampos(campos: CampoObrigatorio[]): string[] {
    return campos.filter((campo:any) => !this.login[campo.id]?.trim()).map(campo => campo.label);
  }

  /**
   * Inicia o processo de login, incluindo a inicialização do banco de dados
   */
  private async iniciarProcessoLogin(): Promise<void> {
    try {
      const carregar = await this.cub3Svc.carregar(1);
      this.iniciarDb().then(() => {
        this.postLogin();
        carregar.dismiss();
      });
    } catch (error) {
      console.error('Erro ao iniciar processo de login:', error);
      this.cub3Svc.alerta(
        'Ocorreu um problema',
        'Não foi possível realizar o login. Por favor, tente novamente ou entre em contato com o suporte técnico.'
      );
    }
  }

  /**
   * Inicializa o banco de dados
   */
  private async iniciarDb(): Promise<void> {
    try {
      await this.cub3Db.iniciar();
    } catch (error) {
      console.error('DB não iniciada:', error);
    }
    finally {
      this.postLogin();
    }
  }

  /**
   * Limpa o formulário de login e restaura a interface inicial
   */
  public limparForm(): void {
    this.fadeOut(this.modalLogin, 'translateX')?.play();
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#FFFFFF');
    });

    if (this.footer) this.fadeOut(this.footer)?.play();

    setTimeout(() => {
      this.tipoSelecionado = null;
      this.fadeIn(this.inicio)?.play();
      this.changeDetector.markForCheck();
    }, 300);
  }

  /**
   * Atualiza o tipo de usuário selecionado e a aparência da interface
   */
  public atualizarTipo(): void {
    setTimeout(() => {
      if (this.tipoSelecionado) {
        this.statusBar.backgroundColorByHexString(LAYOUT_CORES[this.tipoSelecionado.classe]);
        this.changeDetector.markForCheck();
      }
    }, 300);
  }

  /**
   * Seleciona o tipo de login escolhido pelo usuário
   * @param item Tipo de usuário selecionado
   */
  public selecionarTipo(item: UsuarioTipo): void {
    StorageUtils.setItem('tipoSelecionado', item);
    this.exibirFormLogin = false;
    const animacaoEntrada = this.fadeIn(this.modalLogin, 'translateX');

    this.fadeOut(this.inicio)?.play();
    this.changeDetector.markForCheck();

    setTimeout(() => {
      this.tipoSelecionado = item;
      this.changeDetector.markForCheck();
      animacaoEntrada?.play();

      setTimeout(() => {
        this.statusBar.backgroundColorByHexString(LAYOUT_CORES[item.classe]);
        if (this.footer) this.fadeIn(this.footer)?.play();
        this.changeDetector.markForCheck();
      }, 300);
    }, 300);
  }

  /**
   * Cria uma animação de fade in para um elemento
   * @param elm Elemento a ser animado
   * @param dir Direção da animação
   * @param dur Duração da animação em milissegundos
   * @returns Instância de Animation ou null
   */
  private fadeIn(elm: ElementRef, dir: string = 'translateX', dur: number = 300): Animation | null {
    if (elm) {
      return this.animationCtrl
        .create()
        .addElement(elm.nativeElement)
        .duration(dur)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', `${dir}(100%)`, `${dir}(0)`);
    }
    return null;
  }

  /**
   * Cria uma animação de fade out para um elemento
   * @param elm Elemento a ser animado
   * @param dir Direção da animação
   * @param dur Duração da animação em milissegundos
   * @returns Instância de Animation ou null
   */
  private fadeOut(elm: ElementRef, dir: string = 'translateX', dur: number = 300): Animation | null {
    if (elm) {
      return this.animationCtrl
        .create()
        .addElement(elm.nativeElement)
        .duration(dur)
        .fromTo('opacity', '1', '0')
        .fromTo('transform', `${dir}(0)`, `${dir}(100%)`);
    }
    return null;
  }

  /**
   * Obtém os anos de exercício para seleção
   */
  public getExercicio(): void {
    const anoAtual = new Date().getFullYear();
    this.exercicio = Array.from({ length: 5 }, (_, i) => anoAtual - i);
    this.changeDetector.markForCheck();
  }

  /**
   * Busca todas as chaves de acesso disponíveis
   */
  private async getChavesAcesso(): Promise<void> {
    const carregar = await this.cub3Svc.carregar(1);
    try {
      const data = await this.cub3Svc.get('login/chaves-acesso/');
      if (data) this.chaves = data.dados || [];
    } catch (error) {
      console.error('Erro ao obter chaves de acesso:', error);
    } finally {
      carregar.dismiss();
    }
  }

  /**
   * Executa o processo de login após a inicialização
   */
  private async postLogin(): Promise<void> {
    const chaveComPrefixo = this.formatarChaveAcesso(this.login.chave);
    const dados: DadosLogin = {
      chave_acesso: chaveComPrefixo.toUpperCase(),
      ano_letivo: this.login.ano || new Date().getFullYear(),
      usuario: this.login.usuario,
      senha: this.login.senha,
    };

    if (!this.tipoSelecionado || !this.tipoSelecionado.idLogin) {
      await this.presentAlert('Ops!', 'Por gentileza, selecione o tipo de acesso.');
      return;
    }

    if (this.conectado) {
      await this.realizarLoginOnline(dados);
    } else {
      await this.realizarLoginOffline(dados);
    }
  }

  /**
   * Formata a chave de acesso adicionando o prefixo se necessário
   * @param chave Chave de acesso fornecida pelo usuário
   * @returns Chave de acesso formatada
   */
  private formatarChaveAcesso(chave: string): string {
    return chave.startsWith('EDUCANET_') ? chave : `EDUCANET_${chave}`;
  }

  /**
   * Realiza o login quando há conexão com a internet
   * @param dados Dados de login
   */
  private async realizarLoginOnline(dados: DadosLogin): Promise<void> {
    const carregar = await this.cub3Svc.carregar(1);

    if (!dados.usuario || !dados.senha || !dados.ano_letivo || !dados.chave_acesso) {
      console.log('Dados de login incompletos');
      carregar.dismiss();
      return;
    }

    const auxLogin: AuxLogin = {
      cpf: dados.usuario,
      senha: dados.senha,
      tipoAcesso: this.tipoSelecionado!.idLogin,
      app: 'educanet',
      ano: dados.ano_letivo,
      chave: dados.chave_acesso,
      login: dados.usuario,
      logado: 1,
    };

    try {
      const res = await this.cub3Svc.login(auxLogin);
      await this.processarRespostaLogin(res, dados, carregar);
    } catch (error) {
      console.error('Erro de login:', error);
      carregar.dismiss();
      await this.presentAlert(
        'Ocorreu um problema',
        'Por gentileza, verifique o login e senha informados. Caso o erro persista, entre em contato com a secretaria escolar.'
      );
    }
  }

  /**
   * Processa a resposta recebida após a tentativa de login
   * @param res Resposta do serviço de login
   * @param dados Dados de login utilizados
   * @param carregar Elemento de carregamento para ser descartado após o processamento
   */
  private async processarRespostaLogin(res: any, dados: DadosLogin, carregar: any): Promise<void> {
    if (res.dados && res.result) {
      const usuario = res.dados.usuario;
      usuario.desPerfil = usuario.desPerfil?.trim() || usuario.desPerfil;
      usuario.chave_acesso = dados.chave_acesso;
      usuario.ano_letivo = dados.ano_letivo;
      usuario.senha = dados.senha;

      StorageUtils.setAccount(usuario);
      StorageUtils.setToken(res.dados.token);
      StorageUtils.setItem('chave', dados.chave_acesso);

      this.changeDetector.markForCheck();
      await this.initEscolas();

      const desPerfil = usuario.desPerfil?.trim() || '';

      console.log("Verificando tipo", this.tipoSelecionado);
      if (this.tipoSelecionado?.label && desPerfil !== this.tipoSelecionado?.idSistema && desPerfil !== 'PRIV_ADMIN') {
        await this.presentAlert('Ops!', `Você não tem permissão para entrar como ${this.tipoSelecionado?.label || ''}.`);
        carregar.dismiss();
        return;
      }

      await this.redirecionarAposLogin(desPerfil, res, carregar);
    } else {
      carregar.dismiss();
      this.changeDetector.markForCheck();
      console.error('Erro de login:', res);
      await this.presentAlert(
        'Ocorreu um problema',
        'Por gentileza, verifique o login e senha informados. Caso o erro persista, entre em contato com a secretaria escolar.'
      );
    }
  }

  /**
   * Redireciona o usuário para a página apropriada após o login
   * @param desPerfil Perfil de acesso do usuário
   * @param res Resposta do serviço de login
   * @param carregar Elemento de carregamento para ser descartado após o redirecionamento
   */
  private async redirecionarAposLogin(desPerfil: string, res: any, carregar: any): Promise<void> {
    switch (desPerfil) {
      case 'PRIV_ADMIN':
      case 'GESTOR':
      case 'PROFESSOR':
        await this.processarPerfilAdminProfessor(res, carregar);
        break;
      case 'ALUNO':
      case 'RESPONSAVEL':
        await this.processarPerfilAlunoResponsavel(res, carregar);
        break;
      case 'MOTORISTA':
        await this.processarPerfilMotorista(res, carregar);
        break;
      default:
        carregar.dismiss();
        await this.presentAlert('Erro', 'Perfil de usuário desconhecido.');
        break;
    }
  }

  /**
   * Processa o login para perfis administrativos e professores
   * @param res Resposta do serviço de login
   * @param carregar Elemento de carregamento para ser descartado após o processamento
   */
  private async processarPerfilAdminProfessor(res: any, carregar: any): Promise<void> {
    res.dados.usuario.usuarioTipo = new UsuarioTipo(this.tipoSelecionado!);
    StorageUtils.setAccount(res.dados.usuario);

    const existingData = StorageUtils.getItem('data');

    if (existingData?.MOB_REGISTRO_AULA) {
      res.dados.MOB_REGISTRO_AULA = existingData.MOB_REGISTRO_AULA;
    }
    if (existingData?.MOV_REGISTRO_FREQUENCIA) {
      res.dados.MOV_REGISTRO_FREQUENCIA = existingData.MOV_REGISTRO_FREQUENCIA;
    }

    StorageUtils.setItem('data', res.dados);

    // Redireciona após um breve delay para garantir a atualização do estado
    setTimeout(() => {
      StorageUtils.setItem('tipoSelecionado', this.tipoSelecionado);
      this.menuCtrl.enable(true);
      this.router.navigate(['/app/home/academico']);
      this.limparForm();
      carregar.dismiss();
    }, 1000);
  }

  /**
   * Processa o login para perfis de alunos e responsáveis
   * @param res Resposta do serviço de login
   * @param carregar Elemento de carregamento para ser descartado após o processamento
   */
  private async processarPerfilAlunoResponsavel(res: any, carregar: any): Promise<void> {
    res.dados.usuario.usuarioTipo = new UsuarioTipo(this.tipoSelecionado!);
    res.dados.usuario.desPerfil = res.dados.usuario.desPerfil?.trim() || 'ALUNO';
    res.dados.usuario.perfil = 'ALUNO';
    StorageUtils.setAccount(res.dados.usuario);
    StorageUtils.setItem('data', res.dados);

    // Redireciona após um breve delay para garantir a atualização do estado
    setTimeout(() => {
      StorageUtils.setItem('tipoSelecionado', this.tipoSelecionado);
      this.router.navigate(['/app/home/aluno']);
      this.menuCtrl.enable(true);
      this.limparForm();
      carregar.dismiss();
    }, 2000);
  }

  /**
   * Processa o login para perfis de motorista
   * @param res Resposta do serviço de login
   * @param carregar Elemento de carregamento para ser descartado após o processamento
   */
  private async processarPerfilMotorista(res: any, carregar: any): Promise<void> {
    res.dados.usuario.usuarioTipo = new UsuarioTipo(this.tipoSelecionado!);
    StorageUtils.setAccount(res.dados.usuario);
    StorageUtils.setItem('data', res.dados);

    setTimeout(() => {
      StorageUtils.setItem('tipoSelecionado', this.tipoSelecionado);
      this.menuCtrl.enable(true);
      this.router.navigate(['/app/home/motorista']);
      this.limparForm();
      carregar.dismiss();
    }, 100);
  }

  /**
   * Realiza o login quando não há conexão com a internet
   * @param dados Dados de login
   */
  private async realizarLoginOffline(dados: DadosLogin): Promise<void> {
    const usuarioArmazenado = StorageUtils.getAccount();

    if (usuarioArmazenado && dados.login === usuarioArmazenado.usuario && dados.senha === usuarioArmazenado.senha) {
      usuarioArmazenado.logado = 1;
      StorageUtils.setAccount(usuarioArmazenado);
      StorageUtils.setItem('tipoSelecionado', this.tipoSelecionado);

      const perfil = this.tipoSelecionado?.id || 'professor';
      this.router.navigate([`/app/home/${perfil}`]);
      this.menuCtrl.enable(true);
      this.limparForm();
    } else {
      await this.presentAlert('Ocorreu um problema', 'Usuário ou senha inválidos.');
    }
  }

  /**
   * Inicializa as escolas após o login
   */
  private async initEscolas(): Promise<void> {
    try {
      const dados = await this.cub3Svc.getNode('educanet/profissional/mobile');
      const escolas = dados?.dados || {};
      StorageUtils.setItem('escolas', escolas);
    } catch (error) {
      console.error('Erro ao inicializar escolas:', error);
    }
  }

  /**
   * Reseta o formulário de login
   */
  public resetarForm(): void {
    this.login = {
      usuario: '',
      senha: '',
      chave: '',
      ano: new Date().getFullYear(),
      salvar: false,
    };
    this.tipoSelecionado = null;
  }

  /**
   * Popula o banco de dados com os dados fornecidos
   * @param data Dados para popular o banco
   * @returns Número de tabelas processadas
   */
  public popularDb(data: any): number {
    let nProcessamento = 0;

    DB_TABLES.forEach(tabela => {
      if (data[tabela]) {
        data[tabela].forEach((item: any) => {
          this.cub3Db.add(tabela, item);
        });
      }
      nProcessamento++;
    });

    return nProcessamento;
  }

  /**
   * Seleciona o método de login (Manual ou QR Code)
   * @param tipo Tipo de login selecionado
   */
  public selecionarLogin(tipo: string): void {
    switch (tipo) {
      case 'MANUAL':
        this.exibirFormLogin = true;
        this.changeDetector.markForCheck();
        break;
      case 'QRCODE':
        this.loginQrCode();
        break;
      default:
        this.presentAlert('Erro', 'Método de login desconhecido.');
        break;
    }
  }

  /**
   * Processa os dados do QR Code lido
   * @param qrCode Dados do QR Code
   */
  private processarQrCode(qrCode: string): void {
    let dados: Partial<LoginData> = {};

    try {
      dados = JSON.parse(qrCode);
    } catch {
      dados = { chave_acesso: qrCode };
    }

    this.login = {
      usuario: dados.usuario || '',
      senha: dados.senha || '',
      chave: dados.chave_acesso || '',
      ano: dados.ano_letivo || new Date().getFullYear(),
      salvar: false,
    };
    this.postLogin();
  }

  /**
   * Solicita as permissões necessárias para o scanner de QR Code
   * @returns Promessa que resolve para true se as permissões forem concedidas
   */
  private async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  /**
   * Inicia o processo de login via QR Code
   */
  public async loginQrCode(): Promise<void> {
    try {
      const granted = await this.requestPermissions();
      if (!granted) {
        await this.presentAlert(
          'Ocorreu um problema',
          'Não foi possível iniciar a leitura do QR Code. Por gentileza, verifique as permissões de acesso.'
        );
        return;
      }

      const { barcodes } = await BarcodeScanner.scan({
        formats: [BarcodeFormat.QrCode],
      });

      if (barcodes.length > 0) {
        console.log('Códigos lidos:', barcodes);
        this.processarQrCode(barcodes[0].displayValue);
      } else {
        throw new Error('Nenhum QR Code encontrado.');
      }
    } catch (e) {
      console.error('Erro ao escanear QR Code:', e);
      await this.tratarErroScanQrCode();
    }
  }

  /**
   * Trata erros ocorridos durante o scan do QR Code, tentando a leitura via imagem
   */
  private async tratarErroScanQrCode(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        saveToGallery: false,
        promptLabelHeader: 'Selecione de onde deseja ler o QR Code:',
        promptLabelCancel: 'Cancelar',
        promptLabelPhoto: 'Da galeria de imagens',
        promptLabelPicture: 'Tirar uma foto'
      });

      if (!image.dataUrl) {
        throw new Error('Não foi possível obter os dados da imagem.');
      }

      const img = await this.carregarImagem(image.dataUrl);
      const code = this.lerQrCodeDaImagem(img);

      if (code) {
        console.log('Código lido da imagem:', code.data);
        this.processarQrCode(code.data);
      } else {
        await this.presentAlert(
          'QR Code não encontrado',
          'Não foi possível ler o QR Code na imagem fornecida.'
        );
      }
    } catch (imageError) {
      console.error('Erro ao ler QR Code da imagem:', imageError);
      await this.presentAlert(
        'Ocorreu um problema',
        'Não foi possível ler o QR Code a partir da imagem.'
      );
    }
  }

  /**
   * Carrega uma imagem a partir de uma Data URL
   * @param dataUrl Data URL da imagem
   * @returns Promessa que resolve para um elemento HTMLImageElement carregado
   */
  private carregarImagem(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => resolve(img);
      img.onerror = err => reject(err);
    });
  }

  /**
   * Lê um QR Code a partir de um elemento de imagem
   * @param img Elemento HTMLImageElement
   * @returns Objeto do QR Code lido ou null
   */
  private lerQrCodeDaImagem(img: HTMLImageElement): any {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Não foi possível obter o contexto do canvas.');
    }

    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    return jsQR(imageData.data, imageData.width, imageData.height);
  }

  /**
   * Apresenta um alerta modal
   * @param titulo Título do alerta
   * @param mensagem Mensagem do alerta
   */
  private async presentAlert(titulo: string, mensagem: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
