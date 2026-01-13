-- Script SQL para verificar e corrigir apostas
-- Execute este script no seu banco de dados PostgreSQL

-- 1. Verificar quantas apostas estão pendentes
SELECT 
    COUNT(*) as total_apostas_pendentes,
    COUNT(DISTINCT draw_id) as extrações_com_apostas
FROM bets 
WHERE status = 'pending';

-- 2. Verificar quantas extrações têm resultados
SELECT 
    COUNT(*) as extrações_com_resultados
FROM draws 
WHERE status = 'completed' AND result_animal_id IS NOT NULL;

-- 3. Ver apostas pendentes com suas extrações
SELECT 
    b.id as aposta_id,
    b.draw_id,
    b.status as aposta_status,
    b.amount,
    d.name as extração_nome,
    d.status as extração_status,
    d.result_animal_id as tem_resultado
FROM bets b
LEFT JOIN draws d ON b.draw_id = d.id
WHERE b.status = 'pending'
ORDER BY b.id DESC
LIMIT 20;

-- 4. CORREÇÃO: Atualizar apostas manualmente (EXEMPLO)
-- Substitua os valores conforme necessário
-- 
-- UPDATE bets 
-- SET status = 'lost', win_amount = 0
-- WHERE draw_id IN (
--     SELECT id FROM draws WHERE status = 'completed' AND result_animal_id IS NOT NULL
-- ) AND status = 'pending';
