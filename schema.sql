-- Armazena as informações de login e perfil dos profissionais (professores, etc.).
CREATE TABLE MOB_LOGIN(
    ID INTEGER NOT NULL,
    IDF_PROFISSIONAL INTEGER PRIMARY KEY, -- Chave primária que identifica unicamente um profissional.
    NME_PROFISSIONAL VARCHAR(100) NOT NULL, -- Nome do profissional.
    ANO_LETIVO INTEGER NOT NULL,
    LOG_LOGIN VARCHAR(11) NOT NULL,
    PERFIL VARCHAR(64) NOT NULL,
    LOG_SENHA VARCHAR(32) NOT NULL,
    LOG_CHAVE VARCHAR(11) NOT NULL,
    IMG_FOTO TEXT
);

-- Registra as escolas atendidas pelo sistema.
CREATE TABLE MOB_ESCOLA (
    IDF_ESCOLA INTEGER PRIMARY KEY, -- Chave primária que identifica unicamente uma escola.
    NME_ESCOLA VARCHAR(100) NOT NULL
);

-- Define as etapas de ensino (séries/anos) disponíveis.
CREATE TABLE MOB_ETAPAS (
    IDF_ETAPA INTEGER PRIMARY KEY, -- Chave primária que identifica uma etapa de ensino.
    DES_ETAPA VARCHAR(100) NOT NULL
);

-- Agrupa alunos em turmas, associadas a uma etapa e turno.
CREATE TABLE MOB_TURMAS (
    IDF_TURMA INTEGER PRIMARY KEY, -- Chave primária que identifica unicamente uma turma.
    NME_TURMA VARCHAR(80) NOT NULL,
    NME_ESCOLA VARCHAR(465) NOT NULL,
    IDF_ETAPA INTEGER NOT NULL, -- Chave estrangeira para a etapa de ensino da turma.
    TURNO VARCHAR(10) NOT NULL,
    FOREIGN KEY (IDF_ETAPA) REFERENCES MOB_ETAPAS(IDF_ETAPA)
);

-- Catálogo de disciplinas (Matemática, Português, etc.).
CREATE TABLE MOB_DISCIPLINAS (
    IDF_DISCIPLINA INTEGER PRIMARY KEY, -- Chave primária que identifica unicamente uma disciplina.
    NME_DISCIPLINA VARCHAR(100) NOT NULL
);

-- Tabela central de alunos, contendo suas informações pessoais.
CREATE TABLE MOB_ALUNOS (
    IDF_ALUNO INTEGER PRIMARY KEY, -- Chave primária que identifica unicamente um aluno.
    IDF_TURMA INTEGER, -- Identificador da turma atual do aluno (pode ser denormalizado).
    NME_ALUNO VARCHAR(100) NOT NULL, -- Nome completo do aluno.
    NME_MAE VARCHAR(100) NOT NULL, -- Nome da mãe do aluno.
    DAT_NASCIMENTO DATE NOT NULL,
    SEXO VARCHAR(1) NOT NULL,
    LOC_DDD VARCHAR(2),
    LOC_TEL1 VARCHAR(9),
    LOC_TEL2 VARCHAR(9),
    IMG_FOTO TEXT
);

-- Tabela de associação que matricula um aluno em uma turma de uma escola para um ano letivo.
CREATE TABLE MOB_TURMAS_ALUNOS (
    IDF_ALUNOESCOLA INTEGER PRIMARY KEY, -- Chave primária que identifica a matrícula de um aluno.
    ANO_LETIVO INTEGER NOT NULL,
    IDF_ESCOLA INTEGER NOT NULL, -- Chave estrangeira para a escola.
    IDF_TURMA INTEGER NOT NULL, -- Chave estrangeira para a turma.
    IDF_ALUNO INTEGER NOT NULL, -- Chave estrangeira para o aluno.
    NRO_CHAMADA INTEGER,
    SIT_ALUNO VARCHAR(15) NOT NULL,
    FOREIGN KEY (IDF_ESCOLA) REFERENCES MOB_ESCOLA(IDF_ESCOLA),
    FOREIGN KEY (IDF_TURMA) REFERENCES MOB_TURMAS(IDF_TURMA),
    FOREIGN KEY (IDF_ALUNO) REFERENCES MOB_ALUNOS(IDF_ALUNO)
);

-- Define uma avaliação (prova, trabalho) para uma turma/disciplina.
CREATE TABLE MOB_AVALIACAO (
    IDF_AVALIACAO INTEGER PRIMARY KEY, -- Chave primária que identifica uma avaliação.
    ANO_LETIVO INTEGER NOT NULL,
    IDF_ETAPA INTEGER NOT NULL, -- Chave estrangeira para a etapa de ensino.
    IDF_TURMA INTEGER NOT NULL, -- Chave estrangeira para a turma.
    IDF_DISCIPLINA INTEGER NOT NULL, -- Chave estrangeira para a disciplina.
    NRO_AVALIACAO INTEGER NOT NULL,
    DES_AVALIACAO VARCHAR(60) NOT NULL,
    DAT_AVALIACAO DATE NOT NULL,
    FOREIGN KEY (IDF_ETAPA) REFERENCES MOB_ETAPAS(IDF_ETAPA),
    FOREIGN KEY (IDF_TURMA) REFERENCES MOB_TURMAS(IDF_TURMA),
    FOREIGN KEY (IDF_DISCIPLINA) REFERENCES MOB_DISCIPLINAS(IDF_DISCIPLINA)
);

-- Catálogo de conceitos avaliativos (ex: Ótimo, Bom, Regular).
CREATE TABLE MOB_CONCEITOS (
    IDF_CONCEITO INTEGER PRIMARY KEY, -- Chave primária para o tipo de conceito.
    DES_CONCEITO VARCHAR(60) NOT NULL
);

-- Catálogo de justificativas para notas ou faltas.
CREATE TABLE MOB_JUSTIFICATIVA (
    IDF_JUSTIFICATIVA INTEGER PRIMARY KEY, -- Chave primária para o tipo de justificativa.
    DES_JUSTIFICATIVA VARCHAR(60) NOT NULL
);

-- Armazena a nota ou conceito de um aluno em uma avaliação específica.
CREATE TABLE MOB_AVALIACAO_NOTA (
    IDF_AVALIACAO INTEGER NOT NULL, -- Parte da PK, FK para a avaliação.
    IDF_ALUNOESCOLA INTEGER NOT NULL, -- Parte da PK, FK para a matrícula do aluno.
    NOTA_AVALIACAO REAL,
    IDF_CONCEITO INTEGER, -- Chave estrangeira para o conceito (se aplicável).
    IDF_JUSTIFICATIVA INTEGER, -- Chave estrangeira para a justificativa (se aplicável).
    PRIMARY KEY (IDF_AVALIACAO, IDF_ALUNOESCOLA),
    FOREIGN KEY (IDF_AVALIACAO) REFERENCES MOB_AVALIACAO(IDF_AVALIACAO),
    FOREIGN KEY (IDF_ALUNOESCOLA) REFERENCES MOB_TURMAS_ALUNOS(IDF_ALUNOESCOLA),
    FOREIGN KEY (IDF_CONCEITO) REFERENCES MOB_CONCEITOS(IDF_CONCEITO),
    FOREIGN KEY (IDF_JUSTIFICATIVA) REFERENCES MOB_JUSTIFICATIVA(IDF_JUSTIFICATIVA)
);

-- Registra cada aula lecionada, com conteúdo, data e professor.
CREATE TABLE MOB_REGISTRO_AULA (
    IDF_AULA INTEGER PRIMARY KEY AUTOINCREMENT, -- Chave primária que identifica um registro de aula.
    DAT_AULA DATE NOT NULL,
    IDF_TURMA INTEGER NOT NULL, -- Chave estrangeira para a turma onde a aula foi dada.
    IDF_DISCIPLINA INTEGER NOT NULL, -- Chave estrangeira para a disciplina da aula.
    DES_ASSUNTO VARCHAR(255),
    OBSERVACAO VARCHAR(255),
    HOR_INICIO VARCHAR(5),
    HOR_TERMINO VARCHAR(5),
    SIT_REGISTRO VARCHAR(10),
    IDF_PROFISSIONAL INTEGER, -- Chave estrangeira para o profissional que registrou a aula.
    IDF_HORARIO INTEGER,
    NRO_AVALIACAO INTEGER,
    IDF_PLAULA INTEGER,
    IDF_CONTEUDO VARCHAR(255),
    FOREIGN KEY (IDF_TURMA) REFERENCES MOB_TURMAS(IDF_TURMA),
    FOREIGN KEY (IDF_DISCIPLINA) REFERENCES MOB_DISCIPLINAS(IDF_DISCIPLINA),
    FOREIGN KEY (IDF_PROFISSIONAL) REFERENCES MOB_LOGIN(IDF_PROFISSIONAL)
);

-- Registra a frequência (presença/ausência) de cada aluno em cada aula.
CREATE TABLE MOV_REGISTRO_FREQUENCIA (
    IDF_FREQUENCIA INTEGER PRIMARY KEY AUTOINCREMENT, -- Chave primária do registro de frequência.
    IDF_AULA INTEGER NOT NULL, -- Chave estrangeira para o registro da aula.
    IDF_ALUNO INTEGER NOT NULL, -- Chave estrangeira para o aluno.
    SIT_ALUNO VARCHAR(10) NOT NULL, -- Situação do aluno na aula (Presente, Ausente, etc.).
    JUS_FALTA VARCHAR(255),
    OBSERVACAO VARCHAR(255),
    FOREIGN KEY (IDF_AULA) REFERENCES MOB_REGISTRO_AULA(IDF_AULA),
    FOREIGN KEY (IDF_ALUNO) REFERENCES MOB_ALUNOS(IDF_ALUNO)
);

-- Catálogo de tipos de ocorrência (ex: Atraso, Indisciplina).
CREATE TABLE MOB_OCORRENCIAS (
    IDF_OCORRENCIA INTEGER PRIMARY KEY, -- Chave primária para o tipo de ocorrência.
    DES_OCORRENCIA VARCHAR(60) NOT NULL
);

-- Registra ocorrências disciplinares ou pedagógicas relacionadas a um aluno.
CREATE TABLE MOB_OCORRENCIA (
    IDF_OCORRENCIA_LOCAL INTEGER PRIMARY KEY AUTOINCREMENT, -- Chave primária local para o registro de ocorrência.
    IDF_OCORRENCIA INTEGER, -- Chave estrangeira para o tipo de ocorrência.
    DAT_OCORRENCIA DATE NOT NULL,
    IDF_ALUNO INTEGER NOT NULL, -- Chave estrangeira para o aluno envolvido.
    TXT_OCORRENCIA VARCHAR(255) NOT NULL,
    OBSERVACAO VARCHAR(255),
    FOREIGN KEY (IDF_ALUNO) REFERENCES MOB_ALUNOS(IDF_ALUNO),
    FOREIGN KEY (IDF_OCORRENCIA) REFERENCES MOB_OCORRENCIAS(IDF_OCORRENCIA)
);

-- Associa um profissional a uma ou mais escolas por ano letivo.
CREATE TABLE MOB_PROF_ESCOLA (
    ANO_LETIVO INTEGER NOT NULL,
    IDF_ESCOLA INTEGER NOT NULL, -- Parte da chave primária composta, FK para MOB_ESCOLA.
    IDF_PROFISSIONAL INTEGER NOT NULL, -- Parte da chave primária composta, FK para MOB_LOGIN.
    PRIMARY KEY (ANO_LETIVO, IDF_ESCOLA, IDF_PROFISSIONAL),
    FOREIGN KEY (IDF_ESCOLA) REFERENCES MOB_ESCOLA(IDF_ESCOLA),
    FOREIGN KEY (IDF_PROFISSIONAL) REFERENCES MOB_LOGIN(IDF_PROFISSIONAL)
);

-- Associa um profissional a uma ou mais turmas por ano letivo.
CREATE TABLE MOB_PROF_TURMAS (
    ANO_LETIVO INTEGER NOT NULL,
    IDF_TURMA INTEGER NOT NULL, -- Parte da chave primária composta, FK para MOB_TURMAS.
    IDF_PROFISSIONAL INTEGER NOT NULL, -- Parte da chave primária composta, FK para MOB_LOGIN.
    PRIMARY KEY (ANO_LETIVO, IDF_TURMA, IDF_PROFISSIONAL),
    FOREIGN KEY (IDF_TURMA) REFERENCES MOB_TURMAS(IDF_TURMA),
    FOREIGN KEY (IDF_PROFISSIONAL) REFERENCES MOB_LOGIN(IDF_PROFISSIONAL)
);

-- Define qual profissional leciona qual disciplina para uma turma específica.
CREATE TABLE MOB_PROF_DISCIPLINAS (
    ANO_LETIVO INTEGER NOT NULL,
    IDF_TURMA INTEGER NOT NULL,
    IDF_DISCIPLINA INTEGER NOT NULL, -- Parte da chave primária composta, FK para MOB_DISCIPLINAS.
    IDF_PROFISSIONAL INTEGER NOT NULL, -- Parte da chave primária composta, FK para MOB_LOGIN.
    PRIMARY KEY (ANO_LETIVO, IDF_TURMA, IDF_DISCIPLINA, IDF_PROFISSIONAL),
    FOREIGN KEY (IDF_TURMA) REFERENCES MOB_TURMAS(IDF_TURMA),
    FOREIGN KEY (IDF_DISCIPLINA) REFERENCES MOB_DISCIPLINAS(IDF_DISCIPLINA),
    FOREIGN KEY (IDF_PROFISSIONAL) REFERENCES MOB_LOGIN(IDF_PROFISSIONAL)
);

-- Define o horário de aulas do professor.
CREATE TABLE MOB_PROF_HORARIO (
    ANO_LETIVO INTEGER NOT NULL,
    IDF_TURMA INTEGER NOT NULL,
    IDF_DISCIPLINA INTEGER NOT NULL,
    IDF_PROFISSIONAL INTEGER NOT NULL,
    DIA_SEMANA VARCHAR(10) NOT NULL,
    HOR_AULA VARCHAR(30)
);

-- Tabela para registro de frequência do profissional (ponto eletrônico).
CREATE TABLE MOB_PROF_FRQ (
    IDF_FREQUENCIA INTEGER PRIMARY KEY AUTOINCREMENT,
    IDF_ESCOLA INTEGER,
    TIP_REGISTRO VARCHAR(10) NOT NULL,
    DAT_REGISTRO DATETIME NOT NULL,
    LOC_LATITUDE VARCHAR(20),
    LOC_LONGITUDE VARCHAR(20)
);