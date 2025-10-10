-- Criar tabela de pacientes
CREATE TABLE pacientes (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(10),
    complemento VARCHAR(50),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL,
    cep CHAR(8) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso - permitir todas operações (CRUD público)
CREATE POLICY "Permitir visualização de pacientes" 
ON pacientes FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserção de pacientes" 
ON pacientes FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualização de pacientes" 
ON pacientes FOR UPDATE 
USING (true);

CREATE POLICY "Permitir exclusão de pacientes" 
ON pacientes FOR DELETE 
USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_pacientes_updated_at 
BEFORE UPDATE ON pacientes 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();