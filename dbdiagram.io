//// ----------------------------------------------------
//// Diagrama do Banco de Dados - Sabio Mobile
//// Organizado por grupos lógicos para melhor visualização
//// ----------------------------------------------------

// --- Grupo 1: Entidades Principais (Pessoas e Estrutura) ---

TABLE MOB_LOGIN {
  ID integer
  IDF_PROFISSIONAL integer [pk, note: '''Chave primária que identifica unicamente um profissional.''']
  NME_PROFISSIONAL varchar(100) [note: '''Nome do profissional.''']
  ANO_LETIVO integer
  LOG_LOGIN varchar(11)
  PERFIL varchar(64)
  LOG_SENHA varchar(32)
  LOG_CHAVE varchar(11)
  IMG_FOTO text
  Note: '''Armazena as informações de login e perfil dos profissionais (professores, etc.).'''
}

TABLE MOB_ALUNOS {
  IDF_ALUNO integer [pk, note: '''Chave primária que identifica unicamente um aluno.''']
  IDF_TURMA integer [note: '''Identificador da turma atual do aluno (pode ser denormalizado).''']
  NME_ALUNO varchar(100) [note: '''Nome completo do aluno.''']
  NME_MAE varchar(100) [note: '''Nome da mãe do aluno.''']
  DAT_NASCIMENTO date
  SEXO varchar(1)
  LOC_DDD varchar(2)
  LOC_TEL1 varchar(9)
  LOC_TEL2 varchar(9)
  IMG_FOTO text
  Note: '''Tabela central de alunos, contendo suas informações pessoais.'''
}

TABLE MOB_ESCOLA {
  IDF_ESCOLA integer [pk, note: '''Chave primária que identifica unicamente uma escola.''']
  NME_ESCOLA varchar(100)
  Note: '''Registra as escolas atendidas pelo sistema.'''
}

TABLE MOB_ETAPAS {
  IDF_ETAPA integer [pk, note: '''Chave primária que identifica uma etapa de ensino (ex: Ensino Fundamental).''']
  DES_ETAPA varchar(100)
  Note: '''Define as etapas de ensino (séries/anos) disponíveis.'''
}

TABLE MOB_TURMAS {
  IDF_TURMA integer [pk, note: '''Chave primária que identifica unicamente uma turma.''']
  NME_TURMA varchar(80)
  NME_ESCOLA varchar(465)
  IDF_ETAPA integer [note: '''Chave estrangeira para a etapa de ensino da turma.''']
  TURNO varchar(10)
  Note: '''Agrupa alunos em turmas, associadas a uma etapa e turno.'''
}

TABLE MOB_DISCIPLINAS {
  IDF_DISCIPLINA integer [pk, note: '''Chave primária que identifica unicamente uma disciplina.''']
  NME_DISCIPLINA varchar(100)
  Note: '''Catálogo de disciplinas (Matemática, Português, etc.).'''
}


// --- Grupo 2: Tabelas de Junção (Relacionamentos) ---

TABLE MOB_PROF_ESCOLA {
  ANO_LETIVO integer [pk]
  IDF_ESCOLA integer [pk, note: '''Parte da chave primária composta, FK para MOB_ESCOLA.''']
  IDF_PROFISSIONAL integer [pk, note: '''Parte da chave primária composta, FK para MOB_LOGIN.''']
  Note: '''Associa um profissional a uma ou mais escolas por ano letivo.'''
}

TABLE MOB_PROF_TURMAS {
  ANO_LETIVO integer [pk]
  IDF_TURMA integer [pk, note: '''Parte da chave primária composta, FK para MOB_TURMAS.''']
  IDF_PROFISSIONAL integer [pk, note: '''Parte da chave primária composta, FK para MOB_LOGIN.''']
  Note: '''Associa um profissional a uma ou mais turmas por ano letivo.'''
}

TABLE MOB_PROF_DISCIPLINAS {
  ANO_LETIVO integer [pk]
  IDF_TURMA integer [pk]
  IDF_DISCIPLINA integer [pk, note: '''Parte da chave primária composta, FK para MOB_DISCIPLINAS.''']
  IDF_PROFISSIONAL integer [pk, note: '''Parte da chave primária composta, FK para MOB_LOGIN.''']
  Note: '''Define qual profissional leciona qual disciplina para uma turma específica.'''
}

TABLE MOB_TURMAS_ALUNOS {
  IDF_ALUNOESCOLA integer [pk, note: '''Chave primária que identifica a matrícula de um aluno em uma turma/escola.''']
  ANO_LETIVO integer
  IDF_ESCOLA integer [note: '''Chave estrangeira para a escola.''']
  IDF_TURMA integer [note: '''Chave estrangeira para a turma.''']
  IDF_ALUNO integer [note: '''Chave estrangeira para o aluno.''']
  NRO_CHAMADA integer
  SIT_ALUNO varchar(15)
  Note: '''Tabela de associação que matricula um aluno em uma turma de uma escola para um ano letivo.'''
}


// --- Grupo 3: Tabelas Transacionais (Atividades) ---

TABLE MOB_REGISTRO_AULA {
  IDF_AULA integer [pk, note: '''Chave primária que identifica um registro de aula.''']
  DAT_AULA date
  IDF_TURMA integer [note: '''Chave estrangeira para a turma onde a aula foi dada.''']
  IDF_DISCIPLINA integer [note: '''Chave estrangeira para a disciplina da aula.''']
  DES_ASSUNTO varchar(255)
  OBSERVACAO varchar(255)
  HOR_INICIO varchar(5)
  HOR_TERMINO varchar(5)
  SIT_REGISTRO varchar(10)
  IDF_PROFISSIONAL integer [note: '''Chave estrangeira para o profissional que registrou a aula.''']
  IDF_HORARIO integer
  NRO_AVALIACAO integer
  IDF_PLAULA integer
  IDF_CONTEUDO varchar(255)
  Note: '''Registra cada aula lecionada, com conteúdo, data e professor.'''
}

TABLE MOV_REGISTRO_FREQUENCIA {
  IDF_FREQUENCIA integer [pk, note: '''Chave primária do registro de frequência.''']
  IDF_AULA integer [note: '''Chave estrangeira para o registro da aula.''']
  IDF_ALUNO integer [note: '''Chave estrangeira para o aluno.''']
  SIT_ALUNO varchar(10) [note: '''Situação do aluno na aula (Presente, Ausente, etc.).''']
  JUS_FALTA varchar(255)
  OBSERVACAO varchar(255)
  Note: '''Registra a frequência (presença/ausência) de cada aluno em cada aula.'''
}

TABLE MOB_AVALIACAO {
  IDF_AVALIACAO integer [pk, note: '''Chave primária que identifica uma avaliação.''']
  ANO_LETIVO integer
  IDF_ETAPA integer [note: '''Chave estrangeira para a etapa de ensino.''']
  IDF_TURMA integer [note: '''Chave estrangeira para a turma.''']
  IDF_DISCIPLINA integer [note: '''Chave estrangeira para a disciplina.''']
  NRO_AVALIACAO integer
  DES_AVALIACAO varchar(60)
  DAT_AVALIACAO date
  Note: '''Define uma avaliação (prova, trabalho) para uma turma/disciplina.'''
}

TABLE MOB_AVALIACAO_NOTA {
  IDF_AVALIACAO integer [pk, note: '''Parte da PK, FK para a avaliação.''']
  IDF_ALUNOESCOLA integer [pk, note: '''Parte da PK, FK para a matrícula do aluno.''']
  NOTA_AVALIACAO real
  IDF_CONCEITO integer [note: '''Chave estrangeira para o conceito (se aplicável).''']
  IDF_JUSTIFICATIVA integer [note: '''Chave estrangeira para a justificativa (se aplicável).''']
  Note: '''Armazena a nota ou conceito de um aluno em uma avaliação específica.'''
}

TABLE MOB_OCORRENCIA {
  IDF_OCORRENCIA_LOCAL integer [pk, note: '''Chave primária local para o registro de ocorrência.''']
  IDF_OCORRENCIA integer [note: '''Chave estrangeira para o tipo de ocorrência.''']
  DAT_OCORRENCIA date
  IDF_ALUNO integer [note: '''Chave estrangeira para o aluno envolvido.''']
  TXT_OCORRENCIA varchar(255)
  OBSERVACAO varchar(255)
  Note: '''Registra ocorrências disciplinares ou pedagógicas relacionadas a um aluno.'''
}


// --- Grupo 4: Tabelas Auxiliares e de Baixo Relacionamento ---

TABLE MOB_PROF_FRQ {
  IDF_FREQUENCIA integer [pk]
  IDF_ESCOLA integer
  TIP_REGISTRO varchar(10)
  DAT_REGISTRO datetime
  LOC_LATITUDE varchar(20)
  LOC_LONGITUDE varchar(20)
  Note: '''Tabela para registro de frequência do profissional (ponto eletrônico).'''
}

TABLE MOB_OCORRENCIAS {
  IDF_OCORRENCIA integer [pk, note: '''Chave primária para o tipo de ocorrência.''']
  DES_OCORRENCIA varchar(60)
  Note: '''Catálogo de tipos de ocorrência (ex: Atraso, Indisciplina).'''
}

TABLE MOB_JUSTIFICATIVA {
  IDF_JUSTIFICATIVA integer [pk, note: '''Chave primária para o tipo de justificativa.''']
  DES_JUSTIFICATIVA varchar(60)
  Note: '''Catálogo de justificativas para notas ou faltas.'''
}

TABLE MOB_CONCEITOS {
  IDF_CONCEITO integer [pk, note: '''Chave primária para o tipo de conceito.''']
  DES_CONCEITO varchar(60)
  Note: '''Catálogo de conceitos avaliativos (ex: Ótimo, Bom, Regular).'''
}

TABLE MOB_PROF_HORARIO {
  ANO_LETIVO integer
  IDF_TURMA integer
  IDF_DISCIPLINA integer
  IDF_PROFISSIONAL integer
  DIA_SEMANA varchar(10)
  HOR_AULA varchar(30)
  Note: '''Define o horário de aulas do professor.'''
}


// --- Definição de Relacionamentos (Foreign Keys) ---

// Relações da Estrutura Acadêmica
Ref: MOB_TURMAS.IDF_ETAPA > MOB_ETAPAS.IDF_ETAPA

// Relações de Professor
Ref: MOB_PROF_ESCOLA.IDF_ESCOLA > MOB_ESCOLA.IDF_ESCOLA
Ref: MOB_PROF_ESCOLA.IDF_PROFISSIONAL > MOB_LOGIN.IDF_PROFISSIONAL

Ref: MOB_PROF_TURMAS.IDF_TURMA > MOB_TURMAS.IDF_TURMA
Ref: MOB_PROF_TURMAS.IDF_PROFISSIONAL > MOB_LOGIN.IDF_PROFISSIONAL

Ref: MOB_PROF_DISCIPLINAS.IDF_TURMA > MOB_TURMAS.IDF_TURMA
Ref: MOB_PROF_DISCIPLINAS.IDF_DISCIPLINA > MOB_DISCIPLINAS.IDF_DISCIPLINA
Ref: MOB_PROF_DISCIPLINAS.IDF_PROFISSIONAL > MOB_LOGIN.IDF_PROFISSIONAL

// Relações de Aluno e Turma
Ref: MOB_TURMAS_ALUNOS.IDF_ESCOLA > MOB_ESCOLA.IDF_ESCOLA
Ref: MOB_TURMAS_ALUNOS.IDF_TURMA > MOB_TURMAS.IDF_TURMA
Ref: MOB_TURMAS_ALUNOS.IDF_ALUNO > MOB_ALUNOS.IDF_ALUNO

// Relações de Atividades Transacionais
Ref: MOB_REGISTRO_AULA.IDF_TURMA > MOB_TURMAS.IDF_TURMA
Ref: MOB_REGISTRO_AULA.IDF_DISCIPLINA > MOB_DISCIPLINAS.IDF_DISCIPLINA
Ref: MOB_REGISTRO_AULA.IDF_PROFISSIONAL > MOB_LOGIN.IDF_PROFISSIONAL

Ref: MOV_REGISTRO_FREQUENCIA.IDF_AULA > MOB_REGISTRO_AULA.IDF_AULA
Ref: MOV_REGISTRO_FREQUENCIA.IDF_ALUNO > MOB_ALUNOS.IDF_ALUNO

Ref: MOB_AVALIACAO.IDF_ETAPA > MOB_ETAPAS.IDF_ETAPA
Ref: MOB_AVALIACAO.IDF_TURMA > MOB_TURMAS.IDF_TURMA
Ref: MOB_AVALIACAO.IDF_DISCIPLINA > MOB_DISCIPLINAS.IDF_DISCIPLINA

Ref: MOB_AVALIACAO_NOTA.IDF_AVALIACAO > MOB_AVALIACAO.IDF_AVALIACAO
Ref: MOB_AVALIACAO_NOTA.IDF_ALUNOESCOLA > MOB_TURMAS_ALUNOS.IDF_ALUNOESCOLA
Ref: MOB_AVALIACAO_NOTA.IDF_CONCEITO > MOB_CONCEITOS.IDF_CONCEITO // Relacionamento Adicionado
Ref: MOB_AVALIACAO_NOTA.IDF_JUSTIFICATIVA > MOB_JUSTIFICATIVA.IDF_JUSTIFICATIVA // Relacionamento Adicionado

Ref: MOB_OCORRENCIA.IDF_ALUNO > MOB_ALUNOS.IDF_ALUNO
Ref: MOB_OCORRENCIA.IDF_OCORRENCIA > MOB_OCORRENCIAS.IDF_OCORRENCIA // Relacionamento Adicionado
