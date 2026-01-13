-- Migration: Expandir suporte de 5 para 10 prêmios
-- Data: 2025-12-04
-- Descrição: Adiciona campos para 6º ao 10º prêmio nas extrações

-- Adicionar colunas para IDs dos animais (6º ao 10º prêmio)
ALTER TABLE draws 
ADD COLUMN IF NOT EXISTS result_animal_id_6 INTEGER,
ADD COLUMN IF NOT EXISTS result_animal_id_7 INTEGER,
ADD COLUMN IF NOT EXISTS result_animal_id_8 INTEGER,
ADD COLUMN IF NOT EXISTS result_animal_id_9 INTEGER,
ADD COLUMN IF NOT EXISTS result_animal_id_10 INTEGER;

-- Adicionar colunas para números (milhares) dos 6º ao 10º prêmio
ALTER TABLE draws
ADD COLUMN IF NOT EXISTS result_number_6 TEXT,
ADD COLUMN IF NOT EXISTS result_number_7 TEXT,
ADD COLUMN IF NOT EXISTS result_number_8 TEXT,
ADD COLUMN IF NOT EXISTS result_number_9 TEXT,
ADD COLUMN IF NOT EXISTS result_number_10 TEXT;

-- Comentários nas colunas para documentação
COMMENT ON COLUMN draws.result_animal_id_6 IS 'ID do animal vencedor do 6º prêmio';
COMMENT ON COLUMN draws.result_animal_id_7 IS 'ID do animal vencedor do 7º prêmio';
COMMENT ON COLUMN draws.result_animal_id_8 IS 'ID do animal vencedor do 8º prêmio';
COMMENT ON COLUMN draws.result_animal_id_9 IS 'ID do animal vencedor do 9º prêmio';
COMMENT ON COLUMN draws.result_animal_id_10 IS 'ID do animal vencedor do 10º prêmio';

COMMENT ON COLUMN draws.result_number_6 IS 'Número (milhar) do 6º prêmio';
COMMENT ON COLUMN draws.result_number_7 IS 'Número (milhar) do 7º prêmio';
COMMENT ON COLUMN draws.result_number_8 IS 'Número (milhar) do 8º prêmio';
COMMENT ON COLUMN draws.result_number_9 IS 'Número (milhar) do 9º prêmio';
COMMENT ON COLUMN draws.result_number_10 IS 'Número (milhar) do 10º prêmio';
