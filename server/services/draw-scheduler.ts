import cron from 'node-cron';
import { storage } from '../storage';
import logger from '../logger';

export class DrawScheduler {
    private static instance: DrawScheduler;

    private constructor() {
        // Inicializa o cron job para rodar todo dia à meia-noite (00:00)
        cron.schedule('0 0 * * *', () => {
            logger.info('⏰ Executando agendador de sorteios diário (Meia-noite)...');
            this.generateDailyDraws();

            // Também gerar para o dia seguinte
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            this.generateDailyDraws(tomorrow);
        });

        // Também roda a cada hora para garantir (caso o servidor reinicie ou falhe)
        // Verifica apenas o dia atual
        cron.schedule('0 * * * *', () => {
            logger.info('⏰ Verificação horária de sorteios...');
            this.generateDailyDraws();
        });
    }

    public static getInstance(): DrawScheduler {
        if (!DrawScheduler.instance) {
            DrawScheduler.instance = new DrawScheduler();
        }
        return DrawScheduler.instance;
    }

    public async generateDailyDraws(targetDate: Date = new Date()) {
        try {
            // Normalizar a data para evitar problemas de fuso horário nos logs
            const dateStr = targetDate.toLocaleDateString('pt-BR');
            logger.info(`🔄 Verificando sorteios para ${dateStr}...`);

            const templates = await storage.getDrawTemplates();
            const activeTemplates = templates.filter(t => t.active);

            if (activeTemplates.length === 0) {
                logger.info('ℹ️ Nenhum template de sorteio ativo encontrado.');
                return;
            }

            const dayOfWeek = targetDate.getDay(); // 0 = Domingo, 1 = Segunda...

            // Filtrar templates que rodam no dia da semana atual
            const todaysTemplates = activeTemplates.filter(t => t.daysOfWeek.includes(dayOfWeek));

            logger.info(`📅 Encontrados ${todaysTemplates.length} templates para ${dateStr} (Dia da semana: ${dayOfWeek}).`);

            // Obter todos os sorteios para evitar chamadas excessivas ao banco dentro do loop
            // Idealmente, teríamos um método getDrawsByDate(date), mas vamos usar getAllDraws por enquanto
            // e filtrar na memória. Como a lista de sorteios ativos não deve ser gigante, ok para MVP.
            const allDraws = await storage.getAllDraws();

            for (const template of todaysTemplates) {
                // Construir a data do sorteio com o horário do template
                const [hours, minutes] = template.time.split(':').map(Number);
                const drawDate = new Date(targetDate);
                drawDate.setHours(hours, minutes, 0, 0);

                // Verificar se já existe sorteio com este nome e data aproximada (mesmo dia)
                const existingDraw = allDraws.find(d => {
                    const dDate = new Date(d.date);
                    return d.name === template.name &&
                        dDate.getDate() === drawDate.getDate() &&
                        dDate.getMonth() === drawDate.getMonth() &&
                        dDate.getFullYear() === drawDate.getFullYear();
                });

                if (!existingDraw) {
                    logger.info(`➕ Criando sorteio automático: ${template.name} às ${template.time} para ${dateStr}`);
                    await storage.createDraw({
                        name: template.name,
                        time: template.time,
                        date: drawDate
                    });
                } else {
                    // logger.debug(`⏭️ Sorteio já existe: ${template.name} para ${dateStr}`);
                }
            }

            logger.info(`✅ Verificação de sorteios para ${dateStr} concluída.`);

        } catch (error) {
            logger.error('❌ Erro ao gerar sorteios diários:', error);
        }
    }

    // Método para inicializar (pode ser chamado no startup do server)
    public init() {
        logger.info('🚀 Serviço de agendamento de sorteios inicializado.');

        // Rodar imediatamente na inicialização para o dia atual
        this.generateDailyDraws();

        // E para o dia seguinte
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.generateDailyDraws(tomorrow);
    }
}

export const drawScheduler = DrawScheduler.getInstance();
