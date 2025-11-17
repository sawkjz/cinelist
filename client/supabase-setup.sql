-- =====================================================
-- SCRIPT DE CONFIGURAÇÃO DO SUPABASE
-- Execute este SQL no SQL Editor do Supabase Dashboard
-- =====================================================

-- 1. Criar tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar Row Level Security (RLS) na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- 4. Criar políticas de acesso (RLS Policies)
CREATE POLICY "Usuários podem ver seus próprios perfis"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seus próprios perfis"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 5. Remover função e trigger antigos se existirem
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 6. Criar função para criar perfil automaticamente quando um novo usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$;

-- 7. Criar trigger para executar a função automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

SELECT 
  'Tabela profiles' as objeto,
  CASE WHEN EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles'
  ) THEN '✓ Criada' ELSE '✗ Não encontrada' END as status

UNION ALL

SELECT 
  'RLS habilitado' as objeto,
  CASE WHEN EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles'
    AND rowsecurity = true
  ) THEN '✓ Habilitado' ELSE '✗ Desabilitado' END as status

UNION ALL

SELECT 
  'Políticas RLS' as objeto,
  COUNT(*)::text || ' políticas criadas' as status
FROM pg_policies 
WHERE tablename = 'profiles'

UNION ALL

SELECT 
  'Trigger criado' as objeto,
  CASE WHEN EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN '✓ Criado' ELSE '✗ Não encontrado' END as status;
