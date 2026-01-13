import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import http from 'http';
import { isProduction, isReplit, isLocalDev } from "./db";
import logger from "./logger";
import { requestLogger } from "./middleware/request-logger";

// ---- INICIALIZAÇÃO DO SERVIDOR EXPRESS ----
logger.info('======== INICIALIZAÇÃO DO SERVIDOR ========');
logger.info(`🌐 Ambiente: ${isProduction ? 'PRODUÇÃO' : isReplit ? 'REPLIT' : 'DESENVOLVIMENTO LOCAL'}`);

// Criar aplicação Express
const app = express();

// Configurar CORS com settings adequados
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie", "Cookie"],
  exposedHeaders: ["Set-Cookie"]
}));

// Middleware de logging de requisições
app.use(requestLogger);

// Rota de teste para diagnóstico
import path from "path";
app.get("/teste", (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'server', 'test-page.html'));
});

// Configurações de parsing com limites generosos para uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---- CONFIGURAÇÕES DE PORTA ESPECÍFICAS PARA CADA AMBIENTE ----
// Detecção específica de porta por ambiente
const serverPort = process.env.PORT ? parseInt(process.env.PORT, 10) :
  isReplit ? 5000 :    // Replit usa 5000
    isProduction ? 8080 : // Produção usa 8080
      3000;                // Dev local usa 3000

logger.info(`🔌 Porta configurada para ${serverPort}`);

// Criar e iniciar o servidor HTTP imediatamente (requisito para Replit)
const server = http.createServer(app);

// Inicialização imediata da porta - não espera por banco de dados
server.listen(serverPort, "0.0.0.0", () => {
  logger.info(`✅ Servidor aberto na porta ${serverPort}`);

  // Iniciar restante da aplicação de forma assíncrona
  startMainServer(server).catch(err => {
    logger.error('❌ Erro grave na inicialização principal:', err);
  });
});

// ---- INICIALIZAÇÃO DA APLICAÇÃO PRINCIPAL ----
async function startMainServer(server: http.Server) {
  // Middleware global de tratamento de erros
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    logger.error("❌ Erro na aplicação:", err);
  });

  // IMPORTANTE: Registrar rotas da API ANTES do frontend
  // para garantir que as rotas da API tenham precedência
  try {
    // Registrar todas as rotas sem esperar confirmação do banco
    await registerRoutes(app);
    logger.info("✅ API inicializada com sucesso");

    // Inicializar agendador de sorteios
    try {
      const { drawScheduler } = await import("./services/draw-scheduler");
      drawScheduler.init();
    } catch (err) {
      logger.error("❌ Erro ao inicializar agendador de sorteios:", err);
    }

    // Inicializar agendador de atualização automática de resultados
    try {
      const cron = await import("node-cron");
      const { autoUpdateService } = await import("./services/auto-update-results");

      // Executar a cada 30 minutos durante horário de extrações (9h às 23h)
      cron.default.schedule('*/30 9-23 * * *', async () => {
        logger.info('[Cron] Executando atualização automática de resultados...');
        await autoUpdateService.updatePendingDraws();
      });

      logger.info("✅ Agendador de resultados automáticos inicializado (a cada 30min, 9h-23h)");
    } catch (err) {
      logger.error("❌ Erro ao inicializar agendador de resultados:", err);
    }

    // Inicializar agendador de limpeza de resultados do dia anterior
    try {
      const { schedulerService } = await import("./services/scheduler");
      schedulerService.startScheduledTasks();
      logger.info("✅ Agendador de limpeza de resultados inicializado (diariamente às 00h)");
    } catch (err) {
      logger.error("❌ Erro ao inicializar agendador de limpeza:", err);
    }
  } catch (error) {
    logger.error("❌ Erro crítico na inicialização das rotas:", error);
  }

  // Configurar ambiente frontend (Vite para dev, estatico para prod)
  // APÓS registrar as rotas da API
  try {
    if (app.get("env") === "development") {
      logger.info("⚙️ Configurando Vite para ambiente de desenvolvimento...");
      await setupVite(app, server);
    } else {
      logger.info("⚙️ Configurando arquivos estáticos para ambiente de produção...");
      serveStatic(app);
    }
  } catch (error) {
    logger.error("❌ Erro ao configurar frontend:", error);
  }

  logger.info("🚀 Servidor completamente inicializado");
  logger.info("======== SERVIDOR PRONTO ========");

  // Não é mais necessário testar o banco de dados aqui, já foi testado no módulo db.ts
}
