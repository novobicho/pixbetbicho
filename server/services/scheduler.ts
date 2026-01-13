import cron from 'node-cron';
import { db } from '../db';
import { draws } from '../../shared/schema';
import { eq, and, gte, lt } from 'drizzle-orm';
import logger from '../logger';

/**
 * Serviço de agendamento para tarefas automáticas
 */
class SchedulerService {
    /**
     * Limpa os resultados dos sorteios do dia anterior
     * Define todos os campos de resultado como null e status como 'pending'
     */
    async clearPreviousDayResults() {
        try {
            logger.info('[SCHEDULER] Iniciando limpeza dos resultados do dia anterior...');

            // Calcular o início e fim do dia anterior
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const endOfYesterday = new Date(today);

            logger.info(`[SCHEDULER] Limpando resultados entre ${yesterday.toISOString()} e ${endOfYesterday.toISOString()}`);

            // Buscar sorteios do dia anterior que têm resultados
            const drawsToClean = await db
                .select()
                .from(draws)
                .where(
                    and(
                        gte(draws.date, yesterday),
                        lt(draws.date, endOfYesterday),
                        eq(draws.status, 'completed')
                    )
                );

            logger.info(`[SCHEDULER] Encontrados ${drawsToClean.length} sorteios para limpar`);

            if (drawsToClean.length === 0) {
                logger.info('[SCHEDULER] Nenhum sorteio para limpar');
                return { success: true, cleaned: 0 };
            }

            // Limpar os resultados de cada sorteio
            for (const draw of drawsToClean) {
                await db
                    .update(draws)
                    .set({
                        status: 'pending',
                        resultAnimalId: null,
                        resultAnimalId2: null,
                        resultAnimalId3: null,
                        resultAnimalId4: null,
                        resultAnimalId5: null,
                        resultAnimalId6: null,
                        resultAnimalId7: null,
                        resultAnimalId8: null,
                        resultAnimalId9: null,
                        resultAnimalId10: null,
                        resultNumber1: null,
                        resultNumber2: null,
                        resultNumber3: null,
                        resultNumber4: null,
                        resultNumber5: null,
                        resultNumber6: null,
                        resultNumber7: null,
                        resultNumber8: null,
                        resultNumber9: null,
                        resultNumber10: null,
                    })
                    .where(eq(draws.id, draw.id));

                logger.info(`[SCHEDULER] ✅ Resultado limpo para: ${draw.name}`);
            }

            logger.info(`[SCHEDULER] ✅ Limpeza concluída: ${drawsToClean.length} sorteios limpos`);

            return {
                success: true,
                cleaned: drawsToClean.length,
                draws: drawsToClean.map(d => ({ id: d.id, name: d.name }))
            };
        } catch (error) {
            logger.error('[SCHEDULER] ❌ Erro ao limpar resultados do dia anterior:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
        }
    }

    /**
     * Inicia os agendamentos
     */
    startScheduledTasks() {
        logger.info('[SCHEDULER] Iniciando tarefas agendadas...');

        // Agendar limpeza diária às 00:00 (meia-noite) no horário do Brasil (UTC-3)
        // Cron: segundo minuto hora dia mês dia-da-semana
        // '0 0 0 * * *' = todo dia às 00:00:00
        cron.schedule('0 0 0 * * *', async () => {
            logger.info('[SCHEDULER] 🕐 Executando limpeza automática às 00:00...');
            await this.clearPreviousDayResults();
        }, {
            timezone: 'America/Sao_Paulo' // Horário de Brasília (UTC-3)
        });

        logger.info('[SCHEDULER] ✅ Tarefa agendada: Limpeza de resultados às 00:00 (horário de Brasília)');
    }
}

export const schedulerService = new SchedulerService();
