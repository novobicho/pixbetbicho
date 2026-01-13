import { db } from '../db';
import { draws, animals } from '../../shared/schema';
import { eq, and, gte, lt } from 'drizzle-orm';
import { resultScraper } from './result-scraper';
import { storage } from '../storage';

/**
 * Serviço de atualização automática de resultados
 * Busca extrações pendentes e tenta preencher com resultados do site
 */
export class AutoUpdateResultsService {
    /**
     * Atualiza resultados de todas as extrações pendentes de hoje
     */
    async updatePendingDraws(): Promise<void> {
        try {
            console.log('[AutoUpdate] Iniciando atualização de resultados pendentes...');

            // Buscar todas as extrações com status "pending" de hoje
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const pendingDraws = await db
                .select()
                .from(draws)
                .where(
                    and(
                        eq(draws.status, 'pending'),
                        gte(draws.date, today),
                        lt(draws.date, tomorrow)
                    )
                );

            console.log(`[AutoUpdate] Encontradas ${pendingDraws.length} extrações pendentes`);

            // Buscar todos os animais para conversão
            const allAnimals = await db.select().from(animals);

            // Processar cada extração
            for (const draw of pendingDraws) {
                await this.updateDraw(draw, allAnimals);
            }

            console.log('[AutoUpdate] Atualização concluída');
        } catch (error) {
            console.error('[AutoUpdate] Erro ao atualizar resultados:', error);
        }
    }

    /**
     * Atualiza uma extração específica
     */
    private async updateDraw(draw: any, allAnimals: any[]): Promise<void> {
        try {
            console.log(`[AutoUpdate] Processando extração: ${draw.name} (ID: ${draw.id})`);

            // Buscar resultado no site usando o nome da extração e data
            const drawDate = new Date(draw.date);
            const result = await resultScraper.fetchResult(draw.name, drawDate);

            if (!result) {
                console.warn(`[AutoUpdate] ⚠️ Resultado não encontrado para: ${draw.name}`);

                // Se a extração estava como 'completed', reverter para 'pending'
                if (draw.status === 'completed') {
                    console.log(`[AutoUpdate] 🔄 Revertendo extração para 'pending' (resultado não disponível)`);
                    await db
                        .update(draws)
                        .set({
                            status: 'pending',
                            // Limpar resultados antigos
                            resultAnimalId: null,
                            resultNumber1: null,
                            resultAnimalId2: null,
                            resultNumber2: null,
                            resultAnimalId3: null,
                            resultNumber3: null,
                            resultAnimalId4: null,
                            resultNumber4: null,
                            resultAnimalId5: null,
                            resultNumber5: null,
                            resultAnimalId6: null,
                            resultNumber6: null,
                            resultAnimalId7: null,
                            resultNumber7: null,
                            resultAnimalId8: null,
                            resultNumber8: null,
                            resultAnimalId9: null,
                            resultNumber9: null,
                            resultAnimalId10: null,
                            resultNumber10: null,
                        })
                        .where(eq(draws.id, draw.id));
                    console.log(`[AutoUpdate] ✅ Extração ${draw.name} revertida para 'pending'`);
                }
                return;
            }

            if (result.prizes.length === 0) {
                console.warn(`[AutoUpdate] Nenhum prêmio encontrado para: ${draw.name}`);
                return;
            }

            console.log(`[AutoUpdate] ✅ Resultado obtido do scraper:`);
            console.log(`[AutoUpdate]    - Nome: ${result.drawName}`);
            console.log(`[AutoUpdate]    - Horário: ${result.drawTime}`);
            console.log(`[AutoUpdate]    - Total de prêmios: ${result.prizes.length}`);
            result.prizes.forEach(p => {
                console.log(`[AutoUpdate]    - ${p.position}º: Milhar=${p.number}, Grupo=${p.group}, Bicho=${p.animal}`);
            });

            // Preparar dados para atualização
            const updateData: any = {
                status: 'completed',
            };

            // Processar cada prêmio (1 a 10)
            for (const prize of result.prizes) {
                const { position, number } = prize;

                // Converter número em animal
                const animalGroup = resultScraper.getAnimalFromNumber(number);
                const animal = allAnimals.find(a => a.group === animalGroup);

                if (!animal) {
                    console.warn(`[AutoUpdate] Animal não encontrado para grupo ${animalGroup} (número: ${number})`);
                    continue;
                }

                console.log(`[AutoUpdate] 📝 Processando ${position}º prêmio: Milhar=${number}, Grupo=${animalGroup}, Animal=${animal.name} (ID: ${animal.id})`);

                // Atualizar campos correspondentes à posição
                switch (position) {
                    case 1:
                        updateData.resultAnimalId = animal.id;
                        updateData.resultNumber1 = number;
                        break;
                    case 2:
                        updateData.resultAnimalId2 = animal.id;
                        updateData.resultNumber2 = number;
                        break;
                    case 3:
                        updateData.resultAnimalId3 = animal.id;
                        updateData.resultNumber3 = number;
                        break;
                    case 4:
                        updateData.resultAnimalId4 = animal.id;
                        updateData.resultNumber4 = number;
                        break;
                    case 5:
                        updateData.resultAnimalId5 = animal.id;
                        updateData.resultNumber5 = number;
                        break;
                    case 6:
                        updateData.resultAnimalId6 = animal.id;
                        updateData.resultNumber6 = number;
                        break;
                    case 7:
                        updateData.resultAnimalId7 = animal.id;
                        updateData.resultNumber7 = number;
                        break;
                    case 8:
                        updateData.resultAnimalId8 = animal.id;
                        updateData.resultNumber8 = number;
                        break;
                    case 9:
                        updateData.resultAnimalId9 = animal.id;
                        updateData.resultNumber9 = number;
                        break;
                    case 10:
                        updateData.resultAnimalId10 = animal.id;
                        updateData.resultNumber10 = number;
                        break;
                }
            }

            // Validar que temos pelo menos o 1º prêmio
            if (!updateData.resultAnimalId) {
                console.error(`[AutoUpdate] ❌ Erro: 1º prêmio não encontrado para ${draw.name}`);
                console.error(`[AutoUpdate] updateData:`, JSON.stringify(updateData, null, 2));
                return;
            }

            // Log dos dados que serão enviados
            console.log(`[AutoUpdate] 📊 Dados a serem salvos:`);
            console.log(`[AutoUpdate]   1º: Animal ${updateData.resultAnimalId}, Número ${updateData.resultNumber1}`);
            console.log(`[AutoUpdate]   2º: Animal ${updateData.resultAnimalId2 || 'N/A'}, Número ${updateData.resultNumber2 || 'N/A'}`);
            console.log(`[AutoUpdate]   3º: Animal ${updateData.resultAnimalId3 || 'N/A'}, Número ${updateData.resultNumber3 || 'N/A'}`);
            console.log(`[AutoUpdate]   4º: Animal ${updateData.resultAnimalId4 || 'N/A'}, Número ${updateData.resultNumber4 || 'N/A'}`);
            console.log(`[AutoUpdate]   5º: Animal ${updateData.resultAnimalId5 || 'N/A'}, Número ${updateData.resultNumber5 || 'N/A'}`);

            // Usar storage.updateDrawResult para processar apostas automaticamente
            console.log(`[AutoUpdate] 🎯 Chamando storage.updateDrawResult para processar apostas...`);

            try {
                await storage.updateDrawResult(
                    draw.id,
                    updateData.resultAnimalId,
                    updateData.resultAnimalId2,
                    updateData.resultAnimalId3,
                    updateData.resultAnimalId4,
                    updateData.resultAnimalId5,
                    updateData.resultAnimalId6,
                    updateData.resultAnimalId7,
                    updateData.resultAnimalId8,
                    updateData.resultAnimalId9,
                    updateData.resultAnimalId10,
                    updateData.resultNumber1,
                    updateData.resultNumber2,
                    updateData.resultNumber3,
                    updateData.resultNumber4,
                    updateData.resultNumber5,
                    updateData.resultNumber6,
                    updateData.resultNumber7,
                    updateData.resultNumber8,
                    updateData.resultNumber9,
                    updateData.resultNumber10
                );
                console.log(`[AutoUpdate] ✅ Extração ${draw.name} atualizada com ${result.prizes.length} prêmios e apostas processadas`);
            } catch (error) {
                console.error(`[AutoUpdate] ❌ Erro ao chamar updateDrawResult:`, error);
                throw error;
            }
        } catch (error) {
            console.error(`[AutoUpdate] Erro ao processar extração ${draw.name}:`, error);
        }
    }

    /**
     * Atualiza uma extração específica manualmente (por ID)
     */
    async updateDrawById(drawId: number): Promise<boolean> {
        try {
            const draw = await db
                .select()
                .from(draws)
                .where(eq(draws.id, drawId))
                .limit(1);

            if (draw.length === 0) {
                console.error(`[AutoUpdate] Extração não encontrada: ID ${drawId}`);
                return false;
            }

            const allAnimals = await db.select().from(animals);
            await this.updateDraw(draw[0], allAnimals);
            return true;
        } catch (error) {
            console.error(`[AutoUpdate] Erro ao atualizar extração ${drawId}:`, error);
            return false;
        }
    }
}

// Exportar instância singleton
export const autoUpdateService = new AutoUpdateResultsService();
