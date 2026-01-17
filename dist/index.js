var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc3) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc3 = __getOwnPropDesc(from, key)) || desc3.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  BetTypeEnum: () => BetTypeEnum,
  BonusStatusEnum: () => BonusStatusEnum,
  BonusTypeEnum: () => BonusTypeEnum,
  DrawStatusEnum: () => DrawStatusEnum,
  PaymentGatewayTypeEnum: () => PaymentGatewayTypeEnum,
  PremioTypeEnum: () => PremioTypeEnum,
  TransactionTypeEnum: () => TransactionTypeEnum,
  WithdrawalStatusEnum: () => WithdrawalStatusEnum,
  animals: () => animals,
  betFormSchema: () => betFormSchema,
  betTypes: () => betTypes,
  bets: () => bets,
  bonusStatuses: () => bonusStatuses,
  bonusTypes: () => bonusTypes,
  drawStatuses: () => drawStatuses,
  drawTemplates: () => drawTemplates,
  draws: () => draws,
  gameModes: () => gameModes,
  insertAnimalSchema: () => insertAnimalSchema,
  insertBetSchema: () => insertBetSchema,
  insertDrawSchema: () => insertDrawSchema,
  insertDrawTemplateSchema: () => insertDrawTemplateSchema,
  insertGameModeSchema: () => insertGameModeSchema,
  insertPaymentGatewaySchema: () => insertPaymentGatewaySchema,
  insertPaymentTransactionSchema: () => insertPaymentTransactionSchema,
  insertPromotionalBannerSchema: () => insertPromotionalBannerSchema,
  insertTransactionSchema: () => insertTransactionSchema,
  insertUserBonusSchema: () => insertUserBonusSchema,
  insertUserSchema: () => insertUserSchema,
  insertWithdrawalSchema: () => insertWithdrawalSchema,
  paymentGatewayTypes: () => paymentGatewayTypes,
  paymentGateways: () => paymentGateways,
  paymentTransactions: () => paymentTransactions,
  premioTypes: () => premioTypes,
  promotionalBanners: () => promotionalBanners2,
  systemSettings: () => systemSettings,
  transactionTypes: () => transactionTypes,
  transactions: () => transactions,
  userBonuses: () => userBonuses,
  users: () => users,
  withdrawalStatuses: () => withdrawalStatuses,
  withdrawals: () => withdrawals
});
import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users, insertUserSchema, animals, insertAnimalSchema, drawStatuses, DrawStatusEnum, premioTypes, PremioTypeEnum, betTypes, BetTypeEnum, drawTemplates, insertDrawTemplateSchema, draws, insertDrawSchema, bets, insertBetSchema, gameModes, insertGameModeSchema, betFormSchema, systemSettings, paymentGatewayTypes, PaymentGatewayTypeEnum, paymentGateways, insertPaymentGatewaySchema, paymentTransactions, insertPaymentTransactionSchema, withdrawalStatuses, WithdrawalStatusEnum, withdrawals, insertWithdrawalSchema, transactionTypes, TransactionTypeEnum, transactions, insertTransactionSchema, bonusTypes, BonusTypeEnum, bonusStatuses, BonusStatusEnum, userBonuses, insertUserBonusSchema, promotionalBanners2, insertPromotionalBannerSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      username: text("username").notNull().unique(),
      password: text("password").notNull(),
      email: text("email"),
      name: text("name"),
      // Removido: cpf: text("cpf").unique(),
      balance: real("balance").default(0).notNull(),
      isAdmin: boolean("is_admin").default(false).notNull(),
      blocked: boolean("blocked").default(false).notNull(),
      blockReason: text("block_reason"),
      // Removido: defaultPixKey: text("default_pix_key"),
      // Removido: defaultPixKeyType: text("default_pix_key_type"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertUserSchema = createInsertSchema(users).omit({
      id: true,
      isAdmin: true,
      createdAt: true,
      balance: true,
      blocked: true,
      blockReason: true
    });
    animals = pgTable("animals", {
      id: serial("id").primaryKey(),
      group: integer("group").notNull(),
      name: text("name").notNull(),
      numbers: text("numbers").array().notNull()
    });
    insertAnimalSchema = createInsertSchema(animals).omit({
      id: true
    });
    drawStatuses = ["pending", "completed"];
    DrawStatusEnum = z.enum(drawStatuses);
    premioTypes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "1-5", "1-10"];
    PremioTypeEnum = z.enum(premioTypes);
    betTypes = [
      "group",
      // Grupo (animal)
      "duque_grupo",
      // Duque de Grupo (2 animais)
      "terno_grupo",
      // Terno de Grupo (3 animais)
      "quadra_duque",
      // Quadra de Duque (4 animais)
      "quina_grupo",
      // Quina de Grupo (5 animais)
      "dozen",
      // Dezena (2 números)
      "duque_dezena",
      // Duque de Dezena (2 dezenas)
      "terno_dezena",
      // Terno de Dezena (3 dezenas)
      "hundred",
      // Centena (3 números)
      "thousand",
      // Milhar (4 números)
      "passe_ida",
      // Passe IDA (2 animais)
      "passe_ida_volta"
      // Passe IDA X VOLTA (2 animais)
    ];
    BetTypeEnum = z.enum(betTypes);
    drawTemplates = pgTable("draw_templates", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      time: text("time").notNull(),
      daysOfWeek: integer("days_of_week").array().notNull(),
      // 0=Domingo, 1=Segunda, etc.
      active: boolean("active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertDrawTemplateSchema = createInsertSchema(drawTemplates).omit({
      id: true,
      createdAt: true
    });
    draws = pgTable("draws", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      time: text("time").notNull(),
      date: timestamp("date").notNull(),
      status: text("status").default("pending").notNull(),
      // Suporte para 10 prêmios (10 animais diferentes)
      resultAnimalId: integer("result_animal_id"),
      // Primeiro prêmio (mantido para compatibilidade)
      resultAnimalId2: integer("result_animal_id_2"),
      // Segundo prêmio
      resultAnimalId3: integer("result_animal_id_3"),
      // Terceiro prêmio
      resultAnimalId4: integer("result_animal_id_4"),
      // Quarto prêmio
      resultAnimalId5: integer("result_animal_id_5"),
      // Quinto prêmio
      resultAnimalId6: integer("result_animal_id_6"),
      // Sexto prêmio
      resultAnimalId7: integer("result_animal_id_7"),
      // Sétimo prêmio
      resultAnimalId8: integer("result_animal_id_8"),
      // Oitavo prêmio
      resultAnimalId9: integer("result_animal_id_9"),
      // Nono prêmio
      resultAnimalId10: integer("result_animal_id_10"),
      // Décimo prêmio
      // Adicionando suporte para números de milhar em cada prêmio
      resultNumber1: text("result_number_1"),
      // Número para o primeiro prêmio (milhar)
      resultNumber2: text("result_number_2"),
      // Número para o segundo prêmio (milhar)
      resultNumber3: text("result_number_3"),
      // Número para o terceiro prêmio (milhar)
      resultNumber4: text("result_number_4"),
      // Número para o quarto prêmio (milhar)
      resultNumber5: text("result_number_5"),
      // Número para o quinto prêmio (milhar)
      resultNumber6: text("result_number_6"),
      // Número para o sexto prêmio (milhar)
      resultNumber7: text("result_number_7"),
      // Número para o sétimo prêmio (milhar)
      resultNumber8: text("result_number_8"),
      // Número para o oitavo prêmio (milhar)
      resultNumber9: text("result_number_9"),
      // Número para o nono prêmio (milhar)
      resultNumber10: text("result_number_10"),
      // Número para o décimo prêmio (milhar)
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertDrawSchema = createInsertSchema(draws).extend({
      // Aceitar tanto string quanto Date para o campo date
      date: z.union([z.string(), z.date()])
    }).omit({
      id: true,
      status: true,
      resultAnimalId: true,
      resultAnimalId2: true,
      resultAnimalId3: true,
      resultAnimalId4: true,
      resultAnimalId5: true,
      resultNumber1: true,
      resultNumber2: true,
      resultNumber3: true,
      resultNumber4: true,
      resultNumber5: true,
      createdAt: true
    });
    bets = pgTable("bets", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      animalId: integer("animal_id"),
      // Principal animal para grupo
      animalId2: integer("animal_id_2"),
      // Para duque, terno, etc.
      animalId3: integer("animal_id_3"),
      // Para terno, quina, etc.
      animalId4: integer("animal_id_4"),
      // Para quadra, quina
      animalId5: integer("animal_id_5"),
      // Para quina
      amount: real("amount").notNull(),
      // Armazenamos diretamente como valor real (ex: 1.50)
      type: text("type").notNull(),
      // Tipo da aposta (grupo, dezena, etc.)
      createdAt: timestamp("created_at").defaultNow().notNull(),
      drawId: integer("draw_id").notNull(),
      status: text("status").default("pending").notNull(),
      winAmount: real("win_amount"),
      gameModeId: integer("game_mode_id"),
      potentialWinAmount: real("potential_win_amount"),
      betNumbers: text("bet_numbers").array(),
      // Para armazenar múltiplos números (dezenas, centenas, etc.)
      premioType: text("premio_type").default("1"),
      // Tipo de prêmio (1, 2, 3, 4, 5, ou 1-5)
      useBonusBalance: boolean("use_bonus_balance").default(false)
      // Indica se a aposta deve usar saldo de bônus
    });
    insertBetSchema = createInsertSchema(bets).omit({
      id: true,
      createdAt: true,
      status: true,
      winAmount: true
    });
    gameModes = pgTable("game_modes", {
      id: serial("id").primaryKey(),
      name: text("name").notNull().unique(),
      description: text("description"),
      odds: integer("odds").notNull(),
      // Stored in cents (e.g., 8000.00 = 800000)
      active: boolean("active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertGameModeSchema = createInsertSchema(gameModes).omit({
      id: true,
      createdAt: true
    });
    betFormSchema = z.object({
      drawId: z.number().positive("Selecione um sorteio v\xE1lido"),
      gameModeId: z.number().positive("Selecione uma modalidade de jogo"),
      useBonusBalance: z.boolean().optional().default(false),
      // Usar saldo de bônus
      amount: z.union([
        z.number().positive("Valor deve ser positivo").refine(
          (val) => {
            const minBetAmountFromSettings = 0.1;
            return val >= minBetAmountFromSettings;
          },
          {
            message: "Valor abaixo do m\xEDnimo permitido"
          }
        ),
        z.string().transform((val) => {
          const cleanVal = val.replace(/\s+/g, "").replace(/R\$/g, "").replace(/\./g, "").replace(",", ".");
          return Number(cleanVal);
        })
      ]),
      type: z.enum(betTypes),
      // Campos opcionais dependendo do tipo de aposta
      animalId: z.number().optional(),
      animalId2: z.number().optional(),
      animalId3: z.number().optional(),
      animalId4: z.number().optional(),
      animalId5: z.number().optional(),
      // Suporte para apostas numéricas
      betNumber: z.string().optional(),
      // Campo para compatibilidade com formulários
      betNumbers: z.array(z.string()).optional(),
      // Campo para o banco de dados
      numbers: z.string().optional(),
      // Campo de compatibilidade para envios via POST simples
      premioType: z.enum(premioTypes).default("1"),
      potentialWinAmount: z.number().optional()
    });
    systemSettings = pgTable("system_settings", {
      id: serial("id").primaryKey(),
      maxBetAmount: real("max_bet_amount").notNull().default(1e4),
      maxPayout: real("max_payout").notNull().default(1e6),
      minBetAmount: real("min_bet_amount").notNull().default(50),
      defaultBetAmount: real("default_bet_amount").notNull().default(200),
      mainColor: text("main_color").notNull().default("#035faf"),
      secondaryColor: text("secondary_color").notNull().default("#b0d525"),
      accentColor: text("accent_color").notNull().default("#b0d524"),
      allowUserRegistration: boolean("allow_user_registration").notNull().default(true),
      allowDeposits: boolean("allow_deposits").notNull().default(true),
      allowWithdrawals: boolean("allow_withdrawals").notNull().default(true),
      maintenanceMode: boolean("maintenance_mode").notNull().default(false),
      autoApproveWithdrawals: boolean("auto_approve_withdrawals").notNull().default(true),
      autoApproveWithdrawalLimit: real("auto_approve_withdrawal_limit").notNull().default(30),
      siteName: text("site_name").notNull().default("Jogo do Bicho"),
      siteDescription: text("site_description").notNull().default("A melhor plataforma de apostas online"),
      logoUrl: text("logo_url").notNull().default("/img/logo.png"),
      faviconUrl: text("favicon_url").notNull().default("/img/favicon.png"),
      // Configurações de bônus de cadastro
      signupBonusEnabled: boolean("signup_bonus_enabled").default(false).notNull(),
      signupBonusAmount: real("signup_bonus_amount").default(10).notNull(),
      signupBonusRollover: real("signup_bonus_rollover").default(3).notNull(),
      signupBonusExpiration: integer("signup_bonus_expiration").default(7).notNull(),
      // Configurações de bônus de primeiro depósito
      firstDepositBonusEnabled: boolean("first_deposit_bonus_enabled").default(false).notNull(),
      firstDepositBonusAmount: real("first_deposit_bonus_amount").default(100).notNull(),
      firstDepositBonusRollover: real("first_deposit_bonus_rollover").default(3).notNull(),
      firstDepositBonusExpiration: integer("first_deposit_bonus_expiration").default(7).notNull(),
      firstDepositBonusPercentage: real("first_deposit_bonus_percentage").default(100).notNull(),
      firstDepositBonusMaxAmount: real("first_deposit_bonus_max_amount").default(200).notNull(),
      // Configurações de banners
      promotionalBannersEnabled: boolean("promotional_banners_enabled").default(false).notNull(),
      bannerDesktopUrl: text("banner_desktop_url").default("/img/banner-desktop.jpg"),
      bannerMobileUrl: text("banner_mobile_url").default("/img/banner-mobile.jpg"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    paymentGatewayTypes = ["pushinpay", "mercadopago", "pagseguro", "paypal", "ezzebank"];
    PaymentGatewayTypeEnum = z.enum(paymentGatewayTypes);
    paymentGateways = pgTable("payment_gateways", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      type: text("type").notNull(),
      isActive: boolean("is_active").default(false).notNull(),
      apiKey: text("api_key"),
      secretKey: text("secret_key"),
      sandbox: boolean("sandbox").default(true).notNull(),
      config: jsonb("config"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertPaymentGatewaySchema = createInsertSchema(paymentGateways).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    paymentTransactions = pgTable("payment_transactions", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      gatewayId: integer("gateway_id").notNull(),
      amount: real("amount").notNull(),
      status: text("status").default("pending").notNull(),
      type: text("type").default("deposit").notNull(),
      // Novo campo para identificar se é depósito ou saque
      externalId: text("external_id"),
      externalUrl: text("external_url"),
      gatewayResponse: jsonb("gateway_response"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      gatewayResponse: true
    });
    withdrawalStatuses = ["pending", "processing", "approved", "rejected"];
    WithdrawalStatusEnum = z.enum(withdrawalStatuses);
    withdrawals = pgTable("withdrawals", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      amount: real("amount").notNull(),
      status: text("status", { enum: withdrawalStatuses }).default("pending").notNull(),
      pixKey: text("pix_key").notNull(),
      pixKeyType: text("pix_key_type").notNull(),
      accountInfo: text("account_info"),
      // Informações genéricas da conta para saque
      requestedAt: timestamp("requested_at").defaultNow().notNull(),
      processedAt: timestamp("processed_at"),
      processedBy: integer("processed_by"),
      rejectionReason: text("rejection_reason"),
      notes: text("notes")
    });
    insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
      id: true,
      status: true,
      requestedAt: true,
      processedAt: true,
      processedBy: true,
      rejectionReason: true,
      notes: true
    });
    transactionTypes = ["deposit", "withdrawal", "bet", "win", "bonus"];
    TransactionTypeEnum = z.enum(transactionTypes);
    transactions = pgTable("transactions", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull(),
      type: text("type", { enum: transactionTypes }).notNull(),
      amount: real("amount").notNull(),
      description: text("description"),
      relatedId: integer("related_id"),
      // ID do pagamento, saque ou aposta relacionado
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertTransactionSchema = createInsertSchema(transactions).omit({
      id: true,
      createdAt: true
    });
    bonusTypes = ["signup", "first_deposit", "promotional"];
    BonusTypeEnum = z.enum(bonusTypes);
    bonusStatuses = ["active", "completed", "expired"];
    BonusStatusEnum = z.enum(bonusStatuses);
    userBonuses = pgTable("user_bonuses", {
      id: serial("id").primaryKey(),
      userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      type: text("type", { enum: bonusTypes }).notNull(),
      amount: real("amount").notNull(),
      remainingAmount: real("remaining_amount").notNull(),
      rolloverAmount: real("rollover_amount").notNull(),
      // Valor total que precisa ser apostado para liberar o bônus
      rolledAmount: real("rolled_amount").default(0).notNull(),
      // Valor já apostado
      status: text("status", { enum: bonusStatuses }).default("active").notNull(),
      expiresAt: timestamp("expires_at"),
      // Data de expiração do bônus
      completedAt: timestamp("completed_at"),
      // Data em que o bônus foi completado
      createdAt: timestamp("created_at").defaultNow().notNull(),
      relatedTransactionId: integer("related_transaction_id")
      // ID da transação relacionada (para o bônus de primeiro depósito)
    });
    insertUserBonusSchema = createInsertSchema(userBonuses).omit({
      id: true,
      completedAt: true,
      createdAt: true
    });
    promotionalBanners2 = pgTable("promotional_banners", {
      id: serial("id").primaryKey(),
      title: text("title").notNull(),
      description: text("description"),
      imageUrl: text("image_url").notNull(),
      linkUrl: text("link_url"),
      startDate: timestamp("start_date").defaultNow().notNull(),
      endDate: timestamp("end_date"),
      isLoginBanner: boolean("is_login_banner").default(false).notNull(),
      isEnabled: boolean("is_enabled").default(true).notNull(),
      displayOrder: integer("display_order").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertPromotionalBannerSchema = createInsertSchema(promotionalBanners2).omit({
      id: true,
      createdAt: true
    });
  }
});

// server/db.ts
import ws from "ws";
import pg from "pg";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
function initializeConnection() {
  try {
    if (isReplit) {
      console.log("\u{1F527} REPLIT: Usando driver Neon com WebSocket");
      neonConfig.webSocketConstructor = ws;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      pool = new NeonPool({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
        max: 3,
        // Conexões limitadas no Replit
        connectionTimeoutMillis: 1e4,
        idleTimeoutMillis: 3e4
      });
      console.log("\u{1F504} Criando inst\xE2ncia Drizzle com driver Neon...");
      db = drizzleNeon(pool, { schema: schema_exports });
      console.log("\u2705 Driver Neon inicializado com sucesso para Replit");
    } else if (isProduction) {
      console.log("\u{1F527} PRODU\xC7\xC3O: Usando driver PostgreSQL padr\xE3o");
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
          checkServerIdentity: () => void 0
          // Ignora verificações de identidade do servidor
        },
        max: 15,
        // Mais conexões para produção
        connectionTimeoutMillis: 5e3,
        idleTimeoutMillis: 3e4,
        statement_timeout: 3e4,
        query_timeout: 3e4,
        application_name: "jogo-do-bicho-production"
      });
      console.log("\u{1F504} Criando inst\xE2ncia Drizzle com driver PostgreSQL...");
      db = drizzlePg(pool, { schema: schema_exports });
      console.log("\u2705 Driver PostgreSQL inicializado com sucesso para produ\xE7\xE3o");
    } else {
      console.log("\u{1F527} DEV LOCAL: Tentando driver PostgreSQL");
      const isLocalDatabase = process.env.DATABASE_URL?.includes("localhost") || process.env.DATABASE_URL?.includes("@db:");
      pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: isLocalDatabase ? false : { rejectUnauthorized: false },
        max: 5,
        connectionTimeoutMillis: 5e3,
        idleTimeoutMillis: 3e4
      });
      console.log("\u{1F504} Criando inst\xE2ncia Drizzle com driver PostgreSQL...");
      db = drizzlePg(pool, { schema: schema_exports });
      console.log("\u2705 Driver PostgreSQL inicializado com sucesso para desenvolvimento local");
    }
    pool.on("error", (err) => {
      console.error("\u26A0\uFE0F Erro na conex\xE3o com o pool:", err.message);
    });
    return { pool, db };
  } catch (error) {
    console.error("\u{1F525} ERRO FATAL na inicializa\xE7\xE3o do banco:", error);
    console.warn("\u26A0\uFE0F Usando implementa\xE7\xE3o minimalista de emerg\xEAncia. A funcionalidade ser\xE1 limitada.");
    const minimalPool = {
      query: async () => {
        console.warn("\u{1F6A8} Tentativa de acesso ao banco com conex\xE3o falha");
        return { rows: [] };
      },
      on: () => {
      },
      connect: async () => {
        throw new Error("Conex\xE3o com banco indispon\xEDvel");
      }
    };
    const minimalDb = {
      select: () => ({ from: () => ({ where: () => [] }) }),
      insert: () => ({ values: () => ({ returning: () => [] }) }),
      update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) }),
      delete: () => ({ where: () => ({ returning: () => [] }) }),
      execute: async () => []
    };
    return {
      pool: minimalPool,
      db: minimalDb
    };
  }
}
var isProduction, isReplit, pool, db, initializedPool, initializedDb;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    isProduction = process.env.NODE_ENV === "production";
    isReplit = process.env.REPL_ID !== void 0;
    if (!process.env.DATABASE_URL) {
      throw new Error("\u{1F6A8} ERRO CR\xCDTICO: DATABASE_URL n\xE3o est\xE1 configurado! A aplica\xE7\xE3o n\xE3o funcionar\xE1 corretamente.");
    }
    console.log("======== INICIALIZA\xC7\xC3O DO BANCO DE DADOS ========");
    console.log(`\u{1F30E} Ambiente: ${isProduction ? "PRODU\xC7\xC3O" : isReplit ? "REPLIT" : "DESENVOLVIMENTO LOCAL"}`);
    console.log(`\u{1F50C} URL do banco: ${process.env.DATABASE_URL.substring(0, 20)}...`);
    ({ pool: initializedPool, db: initializedDb } = initializeConnection());
    pool = initializedPool;
    db = initializedDb;
    setTimeout(async () => {
      try {
        console.log("\u{1F50D} Verificando conex\xE3o com banco de dados...");
        const result = await pool.query("SELECT NOW() as time");
        if (result && result.rows && result.rows[0]) {
          console.log(`\u2705 Banco de dados conectado e operacional \xE0s ${result.rows[0].time}`);
          console.log("======== BANCO DE DADOS INICIALIZADO ========");
        } else {
          console.error("\u26A0\uFE0F Conex\xE3o estabelecida, mas resposta inv\xE1lida:", result);
        }
      } catch (err) {
        console.error("\u274C Erro na verifica\xE7\xE3o final de conex\xE3o:", err.message);
        console.error("\u26A0\uFE0F A aplica\xE7\xE3o continuar\xE1, mas funcionalidades de banco de dados podem falhar");
      }
    }, 1e3);
  }
});

// server/logger.ts
import winston from "winston";
import path from "path";
var combine, timestamp2, printf, colorize, errors, logFormat, logger, logger_default;
var init_logger = __esm({
  "server/logger.ts"() {
    "use strict";
    ({ combine, timestamp: timestamp2, printf, colorize, errors } = winston.format);
    logFormat = printf(({ level, message, timestamp: timestamp3, stack, ...metadata }) => {
      let msg = `${timestamp3} [${level}]: ${message}`;
      if (stack) {
        msg += `
${stack}`;
      }
      if (Object.keys(metadata).length > 0) {
        msg += `
${JSON.stringify(metadata, null, 2)}`;
      }
      return msg;
    });
    logger = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: combine(
        errors({ stack: true }),
        timestamp2({ format: "YYYY-MM-DD HH:mm:ss" })
      ),
      transports: [
        // Console (desenvolvimento)
        new winston.transports.Console({
          format: combine(
            colorize(),
            logFormat
          )
        }),
        // Arquivo de erros
        new winston.transports.File({
          filename: path.join(process.cwd(), "logs", "error.log"),
          level: "error",
          format: combine(
            winston.format.json()
          ),
          maxsize: 5242880,
          // 5MB
          maxFiles: 5
        }),
        // Arquivo combinado (todos os logs)
        new winston.transports.File({
          filename: path.join(process.cwd(), "logs", "combined.log"),
          format: combine(
            winston.format.json()
          ),
          maxsize: 5242880,
          // 5MB
          maxFiles: 5
        })
      ]
    });
    if (process.env.NODE_ENV === "production") {
      logger.remove(logger.transports[0]);
    }
    logger_default = logger;
  }
});

// server/middleware/validate.ts
import { ZodError } from "zod";
function validate(schema) {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors2 = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message
        }));
        logger_default.warn("Validation error", {
          path: req.path,
          errors: errors2
        });
        return res.status(400).json({
          message: "Dados inv\xE1lidos",
          errors: errors2
        });
      }
      logger_default.error("Unexpected validation error", { error });
      return res.status(500).json({
        message: "Erro interno do servidor"
      });
    }
  };
}
var init_validate = __esm({
  "server/middleware/validate.ts"() {
    "use strict";
    init_logger();
  }
});

// server/validators/user.validators.ts
import { z as z3 } from "zod";
var registerUserValidator, loginValidator, updateProfileValidator, blockUserValidator;
var init_user_validators = __esm({
  "server/validators/user.validators.ts"() {
    "use strict";
    registerUserValidator = z3.object({
      username: z3.string().min(3, "Username deve ter no m\xEDnimo 3 caracteres").max(50, "Username deve ter no m\xE1ximo 50 caracteres").regex(/^[a-zA-Z0-9_]+$/, "Username deve conter apenas letras, n\xFAmeros e underscore"),
      password: z3.string().min(6, "Senha deve ter no m\xEDnimo 6 caracteres").max(100, "Senha muito longa"),
      email: z3.string().email("Email inv\xE1lido").optional(),
      name: z3.string().min(1, "Nome \xE9 obrigat\xF3rio").max(100).optional()
    });
    loginValidator = z3.object({
      username: z3.string().min(1, "Username \xE9 obrigat\xF3rio"),
      password: z3.string().min(1, "Senha \xE9 obrigat\xF3ria")
    });
    updateProfileValidator = z3.object({
      name: z3.string().min(1).max(100).optional(),
      email: z3.string().email().optional()
    });
    blockUserValidator = z3.object({
      blocked: z3.boolean(),
      blockReason: z3.string().optional()
    });
  }
});

// server/auth.ts
var auth_exports = {};
__export(auth_exports, {
  comparePasswords: () => comparePasswords,
  hashPassword: () => hashPassword,
  setupAuth: () => setupAuth
});
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  if (!stored.includes(".")) {
    return supplied === stored;
  }
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const isProduction2 = process.env.NODE_ENV === "production";
  console.log(`Configurando autentica\xE7\xE3o no ambiente: ${isProduction2 ? "PRODU\xC7\xC3O" : "DESENVOLVIMENTO"}`);
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "bichomania-session-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1e3,
      // 24 hours
      sameSite: isProduction2 ? "none" : "lax",
      // Em produção, usar 'none' para permitir cross-site cookies
      httpOnly: true,
      secure: isProduction2,
      // Em produção, apenas HTTPS
      path: "/",
      domain: isProduction2 ? void 0 : void 0
      // Deixamos undefined para usar o domínio atual
    }
  };
  console.log(`Configura\xE7\xE3o de cookies: ${JSON.stringify(sessionSettings.cookie)}`);
  console.log(`SESSION_SECRET configurado: ${process.env.SESSION_SECRET ? "Sim" : "N\xE3o"}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || "n\xE3o definido"}`);
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !await comparePasswords(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
  app2.post("/api/register", validate(registerUserValidator), async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Usu\xE1rio j\xE1 existe");
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      try {
        const systemSettings2 = await storage.getSystemSettings();
        if (systemSettings2?.signupBonusEnabled) {
          logger_default.info(`[B\xF4nus] Detectado b\xF4nus de cadastro ativado para o novo usu\xE1rio ${user.id} (${user.username})`);
          const hasSignupBonus = await storage.hasUserReceivedSignupBonus(user.id);
          if (!hasSignupBonus) {
            const bonusAmount = systemSettings2.signupBonusAmount || 0;
            if (bonusAmount > 0) {
              const rolloverAmount = bonusAmount * (systemSettings2.signupBonusRollover || 3);
              const expirationDays = systemSettings2.signupBonusExpiration || 7;
              const expirationDate = /* @__PURE__ */ new Date();
              expirationDate.setDate(expirationDate.getDate() + expirationDays);
              const userBonus = await storage.createUserBonus({
                userId: user.id,
                type: "signup",
                amount: bonusAmount,
                remainingAmount: bonusAmount,
                rolloverAmount,
                status: "active",
                expiresAt: expirationDate
              });
              logger_default.info(`[B\xF4nus] B\xF4nus de cadastro aplicado com sucesso: R$ ${bonusAmount.toFixed(2)}`);
              logger_default.info(`[B\xF4nus] Detalhes: Rollover R$ ${rolloverAmount.toFixed(2)}, Expira em ${expirationDays} dias`);
            } else {
              logger_default.warn(`[B\xF4nus] B\xF4nus de cadastro est\xE1 ativado mas o valor \xE9 zero ou inv\xE1lido: ${bonusAmount}`);
            }
          } else {
            logger_default.info(`[B\xF4nus] Usu\xE1rio ${user.id} j\xE1 recebeu b\xF4nus de cadastro anteriormente`);
          }
        } else {
          logger_default.info("[B\xF4nus] B\xF4nus de cadastro est\xE1 desativado nas configura\xE7\xF5es do sistema");
        }
      } catch (bonusError) {
        logger_default.error("[B\xF4nus] Erro ao aplicar b\xF4nus de cadastro:", bonusError);
      }
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", validate(loginValidator), async (req, res, next) => {
    try {
      const settings = await storage.getSystemSettings();
      const isMaintenanceMode = settings?.maintenanceMode || false;
      if (isMaintenanceMode) {
        const user = await storage.getUserByUsername(req.body.username);
        if (!user) {
          return res.status(401).json({
            message: "Usu\xE1rio n\xE3o encontrado. O sistema est\xE1 em manuten\xE7\xE3o e s\xF3 aceita login de administradores."
          });
        }
        if (!user.isAdmin) {
          return res.status(403).json({
            message: "Sistema em manuten\xE7\xE3o. Apenas administradores podem acessar o sistema neste momento."
          });
        }
      }
      passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({ message: "Usu\xE1rio ou senha incorretos" });
        }
        req.login(user, (err2) => {
          if (err2) return next(err2);
          const { password, ...userWithoutPassword } = user;
          res.status(200).json(userWithoutPassword);
        });
      })(req, res, next);
    } catch (error) {
      logger_default.error("Erro durante autentica\xE7\xE3o:", error);
      res.status(500).json({ message: "Erro interno durante autentica\xE7\xE3o" });
    }
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
  app2.put("/api/user/pix-key", (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.sendStatus(401);
      }
      const userId = req.user.id;
      const { pixKey, pixKeyType } = req.body;
      if (!pixKey || !pixKeyType) {
        return res.status(400).json({ message: "Chave PIX e tipo s\xE3o obrigat\xF3rios" });
      }
      if (pixKeyType !== "email") {
        return res.status(400).json({ message: "Tipo de chave PIX inv\xE1lido. Apenas email \xE9 suportado no momento." });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(pixKey)) {
        return res.status(400).json({ message: "Formato de email inv\xE1lido" });
      }
      storage.updateUser(userId, {
        email: pixKey
      }).then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
        }
        const { password, ...userWithoutPassword } = updatedUser;
        res.json({ message: "Chave PIX atualizada com sucesso", user: userWithoutPassword });
      }).catch((error) => {
        console.error("Erro ao atualizar chave PIX:", error);
        res.status(500).json({ message: "Erro ao atualizar chave PIX" });
      });
    } catch (error) {
      console.error("Erro ao processar atualiza\xE7\xE3o de chave PIX:", error);
      res.status(500).json({ message: "Erro ao processar solicita\xE7\xE3o" });
    }
  });
}
var scryptAsync;
var init_auth = __esm({
  "server/auth.ts"() {
    "use strict";
    init_storage();
    init_logger();
    init_validate();
    init_user_validators();
    scryptAsync = promisify(scrypt);
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  DatabaseStorage: () => DatabaseStorage,
  storage: () => storage
});
import session2 from "express-session";
import { eq, and, lt, gte, lte, desc, asc, sql, count, inArray } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";
var MemoryStore, PostgresSessionStore, DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    init_schema();
    MemoryStore = createMemoryStore(session2);
    PostgresSessionStore = connectPg(session2);
    DatabaseStorage = class {
      sessionStore;
      constructor() {
        this.sessionStore = new PostgresSessionStore({
          pool,
          createTableIfMissing: true
        });
        setTimeout(() => {
          this.initializeData().catch(
            (err) => console.error("Erro na inicializa\xE7\xE3o ass\xEDncrona de dados:", err)
          );
        }, 0);
      }
      // Draw Templates Implementation
      async createDrawTemplate(template) {
        const [newTemplate] = await db.insert(drawTemplates).values(template).returning();
        return newTemplate;
      }
      async getDrawTemplates() {
        return await db.select().from(drawTemplates).orderBy(drawTemplates.id);
      }
      async updateDrawTemplate(id, template) {
        const [updated] = await db.update(drawTemplates).set(template).where(eq(drawTemplates.id, id)).returning();
        return updated;
      }
      async deleteDrawTemplate(id) {
        await db.delete(drawTemplates).where(eq(drawTemplates.id, id));
      }
      async migrateIntegerToRealColumns() {
        try {
          console.log("Migrando colunas de INTEGER para REAL...");
          const tableExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'bets'
        );
      `);
          if (tableExists.rows[0].exists) {
            console.log("A tabela bets existe, verificando tipo das colunas...");
            const checkAmountType = await pool.query(`
          SELECT data_type FROM information_schema.columns 
          WHERE table_name = 'bets' AND column_name = 'amount';
        `);
            if (checkAmountType.rows.length > 0 && checkAmountType.rows[0].data_type === "integer") {
              console.log("Migrando coluna amount de INTEGER para REAL...");
              await pool.query(`ALTER TABLE bets ALTER COLUMN amount TYPE REAL USING amount::REAL;`);
              console.log("Coluna amount migrada com sucesso!");
            }
            const checkWinAmountType = await pool.query(`
          SELECT data_type FROM information_schema.columns 
          WHERE table_name = 'bets' AND column_name = 'win_amount';
        `);
            if (checkWinAmountType.rows.length > 0 && checkWinAmountType.rows[0].data_type === "integer") {
              console.log("Migrando coluna win_amount de INTEGER para REAL...");
              await pool.query(`ALTER TABLE bets ALTER COLUMN win_amount TYPE REAL USING win_amount::REAL;`);
              console.log("Coluna win_amount migrada com sucesso!");
            }
            const checkPotentialWinType = await pool.query(`
          SELECT data_type FROM information_schema.columns 
          WHERE table_name = 'bets' AND column_name = 'potential_win_amount';
        `);
            if (checkPotentialWinType.rows.length > 0 && checkPotentialWinType.rows[0].data_type === "integer") {
              console.log("Migrando coluna potential_win_amount de INTEGER para REAL...");
              await pool.query(`ALTER TABLE bets ALTER COLUMN potential_win_amount TYPE REAL USING potential_win_amount::REAL;`);
              console.log("Coluna potential_win_amount migrada com sucesso!");
            }
          }
          const checkUsersTableForCpf = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);
          if (checkUsersTableForCpf.rows[0].exists) {
            console.log("A tabela users existe, verificando coluna cpf...");
            const checkCpfColumn = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name = 'cpf'
          );
        `);
            if (!checkCpfColumn.rows[0].exists) {
              console.log("Adicionando coluna cpf \xE0 tabela users...");
              await pool.query(`
            ALTER TABLE users 
            ADD COLUMN cpf TEXT UNIQUE
          `);
              console.log("Coluna cpf adicionada com sucesso!");
            } else {
              console.log("Coluna cpf j\xE1 existe na tabela users.");
            }
          }
          const paymentsTableExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'payment_transactions'
        );
      `);
          if (paymentsTableExists.rows[0].exists) {
            console.log("A tabela payment_transactions existe, verificando coluna type...");
            const checkTypeColumn = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'payment_transactions' 
            AND column_name = 'type'
          );
        `);
            if (!checkTypeColumn.rows[0].exists) {
              console.log("Adicionando coluna type \xE0 tabela payment_transactions...");
              await pool.query(`
            ALTER TABLE payment_transactions 
            ADD COLUMN type TEXT NOT NULL DEFAULT 'deposit'
          `);
              console.log("Coluna type adicionada com sucesso!");
            } else {
              console.log("Coluna type j\xE1 existe na tabela payment_transactions.");
            }
          }
          const settingsTableExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'system_settings'
        );
      `);
          if (settingsTableExists.rows[0].exists) {
            console.log("A tabela system_settings existe, verificando tipo das colunas...");
            const checkMaxBetType = await pool.query(`
          SELECT data_type FROM information_schema.columns 
          WHERE table_name = 'system_settings' AND column_name = 'max_bet_amount';
        `);
            if (checkMaxBetType.rows.length > 0 && checkMaxBetType.rows[0].data_type === "integer") {
              console.log("Migrando coluna max_bet_amount de INTEGER para REAL...");
              await pool.query(`ALTER TABLE system_settings ALTER COLUMN max_bet_amount TYPE REAL USING max_bet_amount::REAL;`);
              console.log("Coluna max_bet_amount migrada com sucesso!");
            }
            const checkMaxPayoutType = await pool.query(`
          SELECT data_type FROM information_schema.columns 
          WHERE table_name = 'system_settings' AND column_name = 'max_payout';
        `);
            if (checkMaxPayoutType.rows.length > 0 && checkMaxPayoutType.rows[0].data_type === "integer") {
              console.log("Migrando coluna max_payout de INTEGER para REAL...");
              await pool.query(`ALTER TABLE system_settings ALTER COLUMN max_payout TYPE REAL USING max_payout::REAL;`);
              console.log("Coluna max_payout migrada com sucesso!");
            }
            const checkMinBetType = await pool.query(`
          SELECT data_type FROM information_schema.columns 
          WHERE table_name = 'system_settings' AND column_name = 'min_bet_amount';
        `);
            if (checkMinBetType.rows.length > 0 && checkMinBetType.rows[0].data_type === "integer") {
              console.log("Migrando coluna min_bet_amount de INTEGER para REAL...");
              await pool.query(`ALTER TABLE system_settings ALTER COLUMN min_bet_amount TYPE REAL USING min_bet_amount::REAL/100;`);
              console.log("Coluna min_bet_amount migrada com sucesso!");
            }
            const checkDefaultBetType = await pool.query(`
          SELECT data_type FROM information_schema.columns 
          WHERE table_name = 'system_settings' AND column_name = 'default_bet_amount';
        `);
            if (checkDefaultBetType.rows.length > 0 && checkDefaultBetType.rows[0].data_type === "integer") {
              console.log("Migrando coluna default_bet_amount de INTEGER para REAL...");
              await pool.query(`ALTER TABLE system_settings ALTER COLUMN default_bet_amount TYPE REAL USING default_bet_amount::REAL/100;`);
              console.log("Coluna default_bet_amount migrada com sucesso!");
            }
          }
          const userBalanceTableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);
          if (userBalanceTableCheck.rows[0].exists) {
            console.log("A tabela users existe, verificando tipo da coluna balance...");
            const checkBalanceType = await pool.query(`
          SELECT data_type FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'balance';
        `);
            if (checkBalanceType.rows.length > 0 && checkBalanceType.rows[0].data_type === "integer") {
              console.log("Migrando coluna balance de INTEGER para REAL...");
              await pool.query(`ALTER TABLE users ALTER COLUMN balance TYPE REAL USING balance::REAL;`);
              console.log("Coluna balance migrada com sucesso!");
            }
          }
          console.log("Migra\xE7\xE3o de colunas conclu\xEDda com sucesso!");
        } catch (error) {
          console.error("Erro ao migrar colunas INTEGER para REAL:", error);
        }
      }
      async initializeData() {
        try {
          const isProduction2 = process.env.NODE_ENV === "production";
          console.log(`Iniciando banco de dados no modo: ${isProduction2 ? "PRODU\xC7\xC3O" : "DESENVOLVIMENTO"}`);
          await this.createTables();
          await this.migrateIntegerToRealColumns();
          if (isProduction2) {
            const userCount = await db.select({ count: count() }).from(users);
            const isEmpty = userCount[0].count === 0;
            if (isEmpty) {
              console.log("\u{1F534} BANCO DE DADOS DE PRODU\xC7\xC3O VAZIO! For\xE7ando inicializa\xE7\xE3o completa...");
              console.log("For\xE7ando inicializa\xE7\xE3o dos animais...");
              await this.initializeAnimals();
              console.log("For\xE7ando inicializa\xE7\xE3o do usu\xE1rio admin...");
              const adminExists = await this.getUserByUsername("admin");
              if (!adminExists) {
                const { hashPassword: hashPassword2 } = await Promise.resolve().then(() => (init_auth(), auth_exports));
                const hashedPassword = await hashPassword2("admin");
                console.log("Criando usu\xE1rio admin em PRODU\xC7\xC3O");
                await db.insert(users).values({
                  username: "admin",
                  password: hashedPassword,
                  email: "admin@bichomania.com",
                  name: "Administrator",
                  balance: 0,
                  isAdmin: true,
                  createdAt: /* @__PURE__ */ new Date()
                });
              }
              console.log("For\xE7ando inicializa\xE7\xE3o dos sorteios...");
              await this.initializeDraws();
              console.log("For\xE7ando inicializa\xE7\xE3o das modalidades de jogo...");
              await this.initializeGameModes();
              console.log("For\xE7ando inicializa\xE7\xE3o das configura\xE7\xF5es do sistema...");
              await this.saveSystemSettings({
                maxBetAmount: 1e4,
                maxPayout: 1e6,
                minBetAmount: 5,
                defaultBetAmount: 20,
                mainColor: "#4f46e5",
                secondaryColor: "#6366f1",
                accentColor: "#f97316",
                allowUserRegistration: true,
                allowDeposits: true,
                allowWithdrawals: true,
                maintenanceMode: false,
                autoApproveWithdrawals: true,
                autoApproveWithdrawalLimit: 30
              });
              console.log("\u2705 Inicializa\xE7\xE3o for\xE7ada do banco de dados de PRODU\xC7\xC3O conclu\xEDda!");
            } else {
              console.log("Banco de dados de produ\xE7\xE3o j\xE1 cont\xE9m dados. Iniciando normalmente...");
            }
          }
          const animalCount = await db.select({ count: count() }).from(animals);
          if (animalCount[0].count === 0) {
            console.log("Initializing animals data");
            await this.initializeAnimals();
          } else {
            console.log("Animals data already exists, skipping initialization");
          }
          await this.initializeAdmin();
          const drawCount = await db.select({ count: count() }).from(draws);
          if (drawCount[0].count === 0) {
            console.log("Initializing draws data");
            await this.initializeDraws();
          } else {
            console.log("Draw data already exists, skipping initialization");
          }
          const gameModeCount = await db.select({ count: count() }).from(gameModes);
          if (gameModeCount[0].count === 0) {
            console.log("Initializing game modes data");
            await this.initializeGameModes();
          } else {
            console.log("Game modes already exist, skipping initialization");
          }
          const settingsCountQuery = await pool.query(`SELECT COUNT(*) FROM system_settings`);
          if (parseInt(settingsCountQuery.rows[0].count) === 0) {
            console.log("Initializing system settings");
            await this.saveSystemSettings({
              maxBetAmount: 1e4,
              maxPayout: 1e6,
              minBetAmount: 5,
              // valor em reais (R$ 5,00)
              defaultBetAmount: 20,
              // valor em reais (R$ 20,00)
              mainColor: "#4f46e5",
              // indigo-600
              secondaryColor: "#6366f1",
              // indigo-500
              accentColor: "#f97316",
              // orange-500
              allowUserRegistration: true,
              allowDeposits: true,
              allowWithdrawals: true,
              maintenanceMode: false,
              autoApproveWithdrawals: true,
              autoApproveWithdrawalLimit: 30
            });
          } else {
            await this.updateSystemSettingsTable();
          }
          console.log("Database initialized successfully");
        } catch (error) {
          console.error("Error initializing data:", error);
        }
      }
      async updateSystemSettingsTable() {
        try {
          const checkColumns = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'system_settings' 
        AND column_name IN ('min_bet_amount', 'default_bet_amount', 'allow_bonus_bets')
      `);
          const existingColumns = checkColumns.rows.map((row) => row.column_name);
          const hasMinBetAmount = existingColumns.includes("min_bet_amount");
          const hasDefaultBetAmount = existingColumns.includes("default_bet_amount");
          const hasAllowBonusBets = existingColumns.includes("allow_bonus_bets");
          const columnsToAdd = [];
          if (!hasMinBetAmount) {
            columnsToAdd.push(`ADD COLUMN IF NOT EXISTS min_bet_amount REAL NOT NULL DEFAULT 5.0`);
          }
          if (!hasDefaultBetAmount) {
            columnsToAdd.push(`ADD COLUMN IF NOT EXISTS default_bet_amount REAL NOT NULL DEFAULT 20.0`);
          }
          if (!hasAllowBonusBets) {
            columnsToAdd.push(`ADD COLUMN IF NOT EXISTS allow_bonus_bets BOOLEAN NOT NULL DEFAULT TRUE`);
            console.log("Adicionando coluna allow_bonus_bets \xE0 tabela system_settings");
          }
          if (columnsToAdd.length > 0) {
            console.log("Atualizando tabela system_settings para incluir novos campos...");
            try {
              await pool.query(`
            ALTER TABLE system_settings 
            ${columnsToAdd.join(",")}
          `);
              console.log("Tabela system_settings atualizada com sucesso");
            } catch (error) {
              console.error("Erro ao adicionar colunas:", error);
              await pool.query(`
            -- Dropando tabela existente
            DROP TABLE IF EXISTS system_settings;
            
            -- Recriando com novos campos
            CREATE TABLE system_settings (
              id SERIAL PRIMARY KEY,
              max_bet_amount INTEGER NOT NULL,
              max_payout INTEGER NOT NULL,
              min_bet_amount INTEGER NOT NULL DEFAULT 50,
              default_bet_amount INTEGER NOT NULL DEFAULT 200,
              main_color TEXT NOT NULL,
              secondary_color TEXT NOT NULL,
              accent_color TEXT NOT NULL,
              allow_user_registration BOOLEAN NOT NULL DEFAULT TRUE,
              allow_deposits BOOLEAN NOT NULL DEFAULT TRUE,
              allow_withdrawals BOOLEAN NOT NULL DEFAULT TRUE,
              maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
              allow_bonus_bets BOOLEAN NOT NULL DEFAULT TRUE,
              created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
            );
          `);
              console.log("Tabela system_settings recriada com sucesso");
            }
          } else {
            console.log("Todas as colunas necess\xE1rias j\xE1 existem na tabela system_settings");
          }
          const checkUserColumns = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name IN ('default_pix_key', 'default_pix_key_type')
      `);
          if (checkUserColumns.rows.length < 2) {
            console.log("Atualizando tabela users para incluir campos de chave PIX padr\xE3o...");
            await pool.query(`
          ALTER TABLE users
          ADD COLUMN IF NOT EXISTS default_pix_key TEXT,
          ADD COLUMN IF NOT EXISTS default_pix_key_type TEXT
        `);
            console.log("Colunas de chave PIX padr\xE3o adicionadas com sucesso \xE0 tabela users");
          } else {
            console.log("Colunas default_pix_key e default_pix_key_type j\xE1 existem na tabela users");
          }
        } catch (error) {
          console.error("Erro ao verificar/atualizar tabela system_settings:", error);
        }
      }
      async initializeGameModes() {
        const gameModeData = [
          { name: "Milhar", description: "Jogo na milhar (4 n\xFAmeros)", odds: 8e5, active: true },
          { name: "Centena", description: "Jogo na centena (3 n\xFAmeros)", odds: 8e4, active: true },
          { name: "Grupo", description: "Jogo no grupo", odds: 2100, active: true },
          { name: "Dezena", description: "Jogo na dezena (2 n\xFAmeros)", odds: 8400, active: true },
          { name: "Duque de Grupo", description: "Jogo em 2 grupos", odds: 2e3, active: true },
          { name: "Duque de Dezena", description: "Jogo em 2 dezenas", odds: 3e4, active: true },
          { name: "Quadra de Duque", description: "Jogo em 4 grupos em dupla", odds: 1e5, active: true },
          { name: "Terno de Grupo", description: "Jogo em 3 grupos", odds: 15e3, active: true },
          { name: "Terno de Dezena", description: "Jogo em 3 dezenas", odds: 6e5, active: true },
          { name: "Quina de Grupo", description: "Jogo em 5 grupos", odds: 5e5, active: true },
          { name: "Passe IDA", description: "Passe simples", odds: 9e3, active: true },
          { name: "Passe IDAxVOLTA", description: "Passe duplo", odds: 4500, active: true }
        ];
        for (const gameMode of gameModeData) {
          await db.insert(gameModes).values({
            ...gameMode,
            createdAt: /* @__PURE__ */ new Date()
          });
        }
        console.log("Game modes initialized successfully");
      }
      async dropTables() {
        try {
          await pool.query(`
        DROP TABLE IF EXISTS bets CASCADE;
        DROP TABLE IF EXISTS draws CASCADE;
        DROP TABLE IF EXISTS animals CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
        DROP TABLE IF EXISTS game_modes CASCADE;
      `);
          console.log("Tables dropped successfully");
        } catch (error) {
          console.error(`Error dropping tables: ${error}`);
          throw error;
        }
      }
      async createUserBonus(bonus) {
        const [newBonus] = await db.insert(userBonuses).values(bonus).returning();
        return newBonus;
      }
      async getUserBonus(bonusId) {
        const [bonus] = await db.select().from(userBonuses).where(eq(userBonuses.id, bonusId));
        return bonus;
      }
      async getUserBonuses(userId) {
        return await db.select().from(userBonuses).where(eq(userBonuses.userId, userId));
      }
      async getActiveBonuses(userId) {
        return await db.select().from(userBonuses).where(and(eq(userBonuses.userId, userId), eq(userBonuses.status, "active")));
      }
      async getExpiredBonuses() {
        return await db.select().from(userBonuses).where(and(eq(userBonuses.status, "active"), lt(userBonuses.expiresAt, /* @__PURE__ */ new Date())));
      }
      async updateBonusProgress(bonusId, newProgress) {
        const [updatedBonus] = await db.update(userBonuses).set({ rolledAmount: newProgress }).where(eq(userBonuses.id, bonusId)).returning();
        return updatedBonus;
      }
      async completeBonus(bonusId) {
        const [updatedBonus] = await db.update(userBonuses).set({ status: "completed" }).where(eq(userBonuses.id, bonusId)).returning();
        return updatedBonus;
      }
      async expireBonus(bonusId) {
        const [updatedBonus] = await db.update(userBonuses).set({ status: "expired" }).where(eq(userBonuses.id, bonusId)).returning();
        return updatedBonus;
      }
      async createTables() {
        try {
          await db.execute(sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          email TEXT,
          name TEXT,
          balance REAL NOT NULL DEFAULT 0.0,
          is_admin BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS animals (
          id SERIAL PRIMARY KEY,
          "group" INTEGER NOT NULL,
          name TEXT NOT NULL,
          numbers TEXT[] NOT NULL,
          UNIQUE("group")
        );
        
        CREATE TABLE IF NOT EXISTS draws (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          time TEXT NOT NULL,
          date TIMESTAMP WITH TIME ZONE NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          result_animal_id INTEGER,
          result_animal_id_2 INTEGER,
          result_animal_id_3 INTEGER,
          result_animal_id_4 INTEGER,
          result_animal_id_5 INTEGER,
          result_number_1 TEXT,
          result_number_2 TEXT,
          result_number_3 TEXT,
          result_number_4 TEXT,
          result_number_5 TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS game_modes (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          odds INTEGER NOT NULL,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS bets (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          animal_id INTEGER,
          animal_id_2 INTEGER,
          animal_id_3 INTEGER,
          animal_id_4 INTEGER,
          animal_id_5 INTEGER,
          amount REAL NOT NULL,
          type TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          draw_id INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          win_amount REAL,
          game_mode_id INTEGER,
          potential_win_amount REAL,
          bet_numbers TEXT[],
          premio_type TEXT DEFAULT '1',
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (animal_id) REFERENCES animals(id),
          FOREIGN KEY (animal_id_2) REFERENCES animals(id),
          FOREIGN KEY (animal_id_3) REFERENCES animals(id),
          FOREIGN KEY (animal_id_4) REFERENCES animals(id),
          FOREIGN KEY (animal_id_5) REFERENCES animals(id),
          FOREIGN KEY (draw_id) REFERENCES draws(id),
          FOREIGN KEY (game_mode_id) REFERENCES game_modes(id)
        );
        
        CREATE TABLE IF NOT EXISTS system_settings (
          id SERIAL PRIMARY KEY,
          max_bet_amount REAL NOT NULL,
          max_payout REAL NOT NULL,
          min_bet_amount REAL NOT NULL DEFAULT 5.0,
          default_bet_amount REAL NOT NULL DEFAULT 20.0,
          main_color TEXT NOT NULL,
          secondary_color TEXT NOT NULL,
          accent_color TEXT NOT NULL,
          allow_user_registration BOOLEAN NOT NULL DEFAULT TRUE,
          allow_deposits BOOLEAN NOT NULL DEFAULT TRUE,
          allow_withdrawals BOOLEAN NOT NULL DEFAULT TRUE,
          maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS payment_gateways (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT false,
          api_key TEXT,
          secret_key TEXT,
          sandbox BOOLEAN NOT NULL DEFAULT true,
          config JSONB,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS payment_transactions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          gateway_id INTEGER NOT NULL,
          amount REAL NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          external_id TEXT,
          external_url TEXT,
          gateway_response JSONB,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (gateway_id) REFERENCES payment_gateways(id)
        );
      `);
          console.log("Tables created successfully");
        } catch (error) {
          console.error("Error creating tables:", error);
          throw error;
        }
      }
      async initializeAnimals() {
        const animalData = [
          { group: 1, name: "Avestruz", numbers: ["01", "02", "03", "04"] },
          { group: 2, name: "\xC1guia", numbers: ["05", "06", "07", "08"] },
          { group: 3, name: "Burro", numbers: ["09", "10", "11", "12"] },
          { group: 4, name: "Borboleta", numbers: ["13", "14", "15", "16"] },
          { group: 5, name: "Cachorro", numbers: ["17", "18", "19", "20"] },
          { group: 6, name: "Cabra", numbers: ["21", "22", "23", "24"] },
          { group: 7, name: "Carneiro", numbers: ["25", "26", "27", "28"] },
          { group: 8, name: "Camelo", numbers: ["29", "30", "31", "32"] },
          { group: 9, name: "Cobra", numbers: ["33", "34", "35", "36"] },
          { group: 10, name: "Coelho", numbers: ["37", "38", "39", "40"] },
          { group: 11, name: "Cavalo", numbers: ["41", "42", "43", "44"] },
          { group: 12, name: "Elefante", numbers: ["45", "46", "47", "48"] },
          { group: 13, name: "Galo", numbers: ["49", "50", "51", "52"] },
          { group: 14, name: "Gato", numbers: ["53", "54", "55", "56"] },
          { group: 15, name: "Jacar\xE9", numbers: ["57", "58", "59", "60"] },
          { group: 16, name: "Le\xE3o", numbers: ["61", "62", "63", "64"] },
          { group: 17, name: "Macaco", numbers: ["65", "66", "67", "68"] },
          { group: 18, name: "Porco", numbers: ["69", "70", "71", "72"] },
          { group: 19, name: "Pav\xE3o", numbers: ["73", "74", "75", "76"] },
          { group: 20, name: "Peru", numbers: ["77", "78", "79", "80"] },
          { group: 21, name: "Touro", numbers: ["81", "82", "83", "84"] },
          { group: 22, name: "Tigre", numbers: ["85", "86", "87", "88"] },
          { group: 23, name: "Urso", numbers: ["89", "90", "91", "92"] },
          { group: 24, name: "Veado", numbers: ["93", "94", "95", "96"] },
          { group: 25, name: "Vaca", numbers: ["97", "98", "99", "00"] }
        ];
        for (const animal of animalData) {
          await this.createAnimal(animal);
        }
      }
      async initializeAdmin() {
        try {
          const adminExists = await this.getUserByUsername("admin");
          if (!adminExists) {
            const { hashPassword: hashPassword2 } = await Promise.resolve().then(() => (init_auth(), auth_exports));
            const hashedPassword = await hashPassword2("admin");
            console.log("Criando usu\xE1rio admin com senha hashada");
            await db.insert(users).values({
              username: "admin",
              password: hashedPassword,
              // Senha hashada apropriadamente
              email: "admin@bichomania.com",
              name: "Administrator",
              balance: 0,
              isAdmin: true,
              createdAt: /* @__PURE__ */ new Date()
            });
            console.log("Usu\xE1rio admin criado com sucesso");
          } else {
            console.log("Usu\xE1rio admin j\xE1 existe, n\xE3o \xE9 necess\xE1rio criar");
          }
        } catch (error) {
          console.error("Erro ao inicializar admin:", error);
        }
      }
      // Método para criar sorteios para os próximos dias
      async createFutureDraws(numberOfDays = 3) {
        const times = ["14:00", "16:00", "18:00", "20:00"];
        const names = ["Federal", "PTM", "Coruja", "Noturno"];
        const today = /* @__PURE__ */ new Date();
        console.log(`Criando sorteios para os pr\xF3ximos ${numberOfDays} dias a partir de ${today.toISOString()}`);
        for (let i = 0; i < times.length; i++) {
          const drawDate = new Date(today);
          drawDate.setHours(parseInt(times[i].split(":")[0]), parseInt(times[i].split(":")[1]), 0, 0);
          if (drawDate > today) {
            const existingDraws = await db.select().from(draws).where(
              and(
                eq(draws.time, times[i]),
                eq(draws.date, drawDate)
              )
            );
            if (existingDraws.length === 0) {
              console.log(`Criando sorteio para hoje: ${names[i]} \xE0s ${times[i]} em ${drawDate.toISOString()}`);
              try {
                const draw = await this.createDraw({
                  name: names[i],
                  time: times[i],
                  date: drawDate
                });
                console.log(`Sorteio criado com sucesso: ${draw.id}`);
              } catch (error) {
                console.error(`Falha ao criar sorteio ${names[i]}:`, error);
              }
            } else {
              console.log(`Sorteio para hoje ${names[i]} \xE0s ${times[i]} j\xE1 existe.`);
            }
          }
        }
        for (let day = 1; day < numberOfDays; day++) {
          const nextDay = new Date(today);
          nextDay.setDate(nextDay.getDate() + day);
          for (let i = 0; i < times.length; i++) {
            const drawDate = new Date(nextDay);
            drawDate.setHours(parseInt(times[i].split(":")[0]), parseInt(times[i].split(":")[1]), 0, 0);
            const existingDraws = await db.select().from(draws).where(
              and(
                eq(draws.time, times[i]),
                // Comparar apenas a data (sem a hora)
                and(
                  gte(draws.date, new Date(drawDate.getFullYear(), drawDate.getMonth(), drawDate.getDate(), 0, 0, 0)),
                  lt(draws.date, new Date(drawDate.getFullYear(), drawDate.getMonth(), drawDate.getDate() + 1, 0, 0, 0))
                )
              )
            );
            if (existingDraws.length === 0) {
              console.log(`Criando sorteio para futuro: ${names[i]} \xE0s ${times[i]} em ${drawDate.toISOString()}`);
              try {
                const draw = await this.createDraw({
                  name: names[i],
                  time: times[i],
                  date: drawDate
                });
                console.log(`Sorteio futuro criado com sucesso: ${draw.id}`);
              } catch (error) {
                console.error(`Falha ao criar sorteio futuro ${names[i]}:`, error);
              }
            } else {
              console.log(`Sorteio para ${drawDate.toDateString()} \xE0s ${times[i]} j\xE1 existe.`);
            }
          }
        }
      }
      async initializeDraws() {
        const times = ["14:00", "16:00", "18:00", "20:00"];
        const names = ["Federal", "PTM", "Coruja", "Noturno"];
        const today = /* @__PURE__ */ new Date();
        console.log("Initializing draws for dates:", today);
        for (let i = 0; i < times.length; i++) {
          const drawDate = new Date(today);
          drawDate.setHours(parseInt(times[i].split(":")[0]), parseInt(times[i].split(":")[1]), 0, 0);
          if (drawDate < today) {
            drawDate.setDate(drawDate.getDate() + 1);
          }
          console.log(`Creating draw: ${names[i]} at ${times[i]} on ${drawDate.toISOString()}`);
          try {
            const draw = await this.createDraw({
              name: names[i],
              time: times[i],
              date: drawDate
            });
            console.log(`Draw created successfully: ${draw.id}`);
          } catch (error) {
            console.error(`Failed to create draw ${names[i]}:`, error);
          }
        }
        for (let day = 1; day <= 2; day++) {
          const nextDay = new Date(today);
          nextDay.setDate(nextDay.getDate() + day);
          for (let i = 0; i < times.length; i++) {
            const drawDate = new Date(nextDay);
            drawDate.setHours(parseInt(times[i].split(":")[0]), parseInt(times[i].split(":")[1]), 0, 0);
            console.log(`Creating draw for future day: ${names[i]} at ${times[i]} on ${drawDate.toISOString()}`);
            try {
              const draw = await this.createDraw({
                name: names[i],
                time: times[i],
                date: drawDate
              });
              console.log(`Future draw created successfully: ${draw.id}`);
            } catch (error) {
              console.error(`Failed to create future draw ${names[i]}:`, error);
            }
          }
        }
      }
      // User Management
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
      }
      async getUserByUsername(username) {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        return user;
      }
      async createUser(insertUser) {
        const [user] = await db.insert(users).values({
          ...insertUser,
          balance: 0,
          isAdmin: false,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return user;
      }
      async updateUserBalance(userId, amount) {
        console.log(`UPDATING BALANCE: User ID ${userId}, Amount: ${amount}`);
        try {
          const currentUser = await this.getUser(userId);
          if (!currentUser) {
            console.error(`BALANCE UPDATE FAILED: User ID ${userId} not found`);
            return void 0;
          }
          console.log(`BALANCE BEFORE: User ID ${userId}, Current balance: ${currentUser.balance}`);
          const [user] = await db.update(users).set({
            balance: sql`${users.balance} + ${amount}`
          }).where(eq(users.id, userId)).returning();
          if (!user) {
            console.error(`BALANCE UPDATE FAILED: Update operation returned no user`);
            return void 0;
          }
          console.log(`BALANCE UPDATED: User ID ${userId}, New balance: ${user.balance}, Added: ${amount}`);
          return user;
        } catch (error) {
          console.error(`BALANCE UPDATE ERROR: ${error}`);
          return void 0;
        }
      }
      /**
       * Atualiza o saldo de bônus de um usuário criando ou atualizando um registro de bônus
       * Esta é a principal função para gerenciar o saldo de bônus dos usuários
       */
      async updateUserBonusBalance(userId, amount) {
        try {
          console.log(`======== INICIO PROCESSAMENTO DE B\xD4NUS ========`);
          console.log(`UPDATING BONUS BALANCE: User ID ${userId}, Amount: ${amount}`);
          if (!userId || amount <= 0) {
            console.error(`ERRO: Tentativa de atualizar b\xF4nus com dados inv\xE1lidos - ID ${userId}, Valor ${amount}`);
            throw new Error(`Dados de b\xF4nus inv\xE1lidos: userId=${userId}, amount=${amount}`);
          }
          console.log(`[1] Verificando b\xF4nus existentes para usu\xE1rio ${userId}`);
          const existingBonus = await db.select().from(userBonuses).where(
            and(
              eq(userBonuses.userId, userId),
              eq(userBonuses.type, "first_deposit"),
              eq(userBonuses.status, "active")
            )
          );
          console.log(`[2] Resultado da busca por b\xF4nus: ${existingBonus.length} b\xF4nus encontrados`);
          console.log(`[3] Obtendo configura\xE7\xF5es do sistema para rollover e expira\xE7\xE3o`);
          const systemSettings2 = await this.getSystemSettings();
          const rolloverMultiplier = systemSettings2?.firstDepositBonusRollover || 2;
          const expirationDays = systemSettings2?.firstDepositBonusExpiration || 7;
          console.log(`[4] Configura\xE7\xF5es: Rollover ${rolloverMultiplier}x, Expira\xE7\xE3o ${expirationDays} dias`);
          const expiresAt = /* @__PURE__ */ new Date();
          expiresAt.setDate(expiresAt.getDate() + expirationDays);
          if (existingBonus.length > 0) {
            const bonus = existingBonus[0];
            console.log(`[5A] BONUS EXISTENTE: User ID ${userId}, ID ${bonus.id}, Current amount: ${bonus.remainingAmount}`);
            const newAmount = parseFloat((bonus.amount + amount).toFixed(2));
            const newRemainingAmount = parseFloat((bonus.remainingAmount + amount).toFixed(2));
            const additionalRollover = parseFloat((amount * rolloverMultiplier).toFixed(2));
            const newRolloverAmount = parseFloat((bonus.rolloverAmount + additionalRollover).toFixed(2));
            console.log(`[6A] Atualizando b\xF4nus: Valor anterior ${bonus.amount} + Novo ${amount} = ${newAmount}`);
            console.log(`[7A] Dispon\xEDvel: ${bonus.remainingAmount} + ${amount} = ${newRemainingAmount}`);
            console.log(`[8A] Rollover: ${bonus.rolloverAmount} + ${additionalRollover} = ${newRolloverAmount}`);
            const result = await db.update(userBonuses).set({
              amount: newAmount,
              remainingAmount: newRemainingAmount,
              rolloverAmount: newRolloverAmount,
              expiresAt,
              status: "active"
              // Garantir que o status continua ativo
            }).where(eq(userBonuses.id, bonus.id)).returning();
            console.log(`[9A] Resultado da atualiza\xE7\xE3o:`, result.length > 0 ? "Sucesso" : "Falha");
            console.log(`[10A] BONUS ATUALIZADO: User ID ${userId}, Adicionado: ${amount}, Novo total: ${newRemainingAmount}`);
          } else {
            console.log(`[5B] Nenhum b\xF4nus existente. Criando novo b\xF4nus para usu\xE1rio ${userId}`);
            const rolloverAmount = parseFloat((amount * rolloverMultiplier).toFixed(2));
            console.log(`[6B] Valores do novo b\xF4nus: Valor ${amount}, Rollover ${rolloverAmount}`);
            const result = await db.insert(userBonuses).values({
              userId,
              type: "first_deposit",
              amount,
              remainingAmount: amount,
              rolloverAmount,
              rolledAmount: 0,
              status: "active",
              expiresAt
            }).returning();
            console.log(`[7B] Resultado da inser\xE7\xE3o:`, result.length > 0 ? "Sucesso" : "Falha");
            if (result.length > 0) {
              console.log(`[8B] Novo b\xF4nus criado com ID ${result[0].id}`);
            }
            console.log(`[9B] NOVO B\xD4NUS CRIADO: User ID ${userId}, Amount: ${amount}, Rollover: ${rolloverAmount}`);
          }
          const currentBonus = await this.getUserBonusBalance(userId);
          console.log(`[10] SALDO DE B\xD4NUS ATUAL: User ID ${userId}, Saldo: ${currentBonus}`);
          console.log(`======== FIM PROCESSAMENTO DE B\xD4NUS ========`);
        } catch (error) {
          console.error(`======== ERRO NO PROCESSAMENTO DE B\xD4NUS ========`);
          console.error(`BONUS UPDATE ERROR: ${error}`);
          console.error(`Stack trace:`, error.stack);
          console.error(`======== FIM DO ERRO ========`);
          throw error;
        }
      }
      async incrementUserBalance(userId, amount) {
        return this.updateUserBalance(userId, amount);
      }
      async updateUser(userId, userData) {
        try {
          const { id, createdAt, ...allowedFields } = userData;
          if (allowedFields.password === "") {
            delete allowedFields.password;
          }
          if (allowedFields.password) {
            const { hashPassword: hashPassword2 } = await Promise.resolve().then(() => (init_auth(), auth_exports));
            allowedFields.password = await hashPassword2(allowedFields.password);
            console.log(`Senha atualizada para usu\xE1rio ${userId} e devidamente hashada`);
          }
          const [user] = await db.update(users).set(allowedFields).where(eq(users.id, userId)).returning();
          return user;
        } catch (error) {
          console.error(`Erro ao atualizar usu\xE1rio ${userId}:`, error);
          return void 0;
        }
      }
      async deleteUser(userId) {
        await db.delete(users).where(eq(users.id, userId));
      }
      async getAllUsers() {
        return await db.select().from(users);
      }
      // Animal Management
      async getAnimal(id) {
        const [animal] = await db.select().from(animals).where(eq(animals.id, id));
        return animal;
      }
      async getAnimalByGroup(group) {
        const [animal] = await db.select().from(animals).where(eq(animals.group, group));
        return animal;
      }
      async getAllAnimals() {
        return await db.select().from(animals).orderBy(animals.group);
      }
      async createAnimal(insertAnimal) {
        const [animal] = await db.insert(animals).values(insertAnimal).returning();
        return animal;
      }
      // Bet Management
      async getBet(id) {
        const [bet] = await db.select().from(bets).where(eq(bets.id, id));
        return bet;
      }
      async updateBet(betId, betData) {
        console.log(`Updating bet ${betId} with data:`, betData);
        const { id, createdAt, ...allowedFields } = betData;
        const [bet] = await db.update(bets).set(allowedFields).where(eq(bets.id, betId)).returning();
        return bet;
      }
      async createBet(insertBet) {
        const betValues = {
          userId: insertBet.userId,
          animalId: insertBet.animalId || null,
          amount: insertBet.amount,
          type: insertBet.type,
          drawId: insertBet.drawId,
          status: "pending",
          createdAt: /* @__PURE__ */ new Date(),
          winAmount: null
        };
        if (insertBet.animalId2 !== void 0) {
          betValues.animalId2 = insertBet.animalId2;
        }
        if (insertBet.animalId3 !== void 0) {
          betValues.animalId3 = insertBet.animalId3;
        }
        if (insertBet.animalId4 !== void 0) {
          betValues.animalId4 = insertBet.animalId4;
        }
        if (insertBet.animalId5 !== void 0) {
          betValues.animalId5 = insertBet.animalId5;
        }
        if (insertBet.betNumbers !== void 0) {
          betValues.betNumbers = insertBet.betNumbers;
        }
        if (insertBet.premioType !== void 0) {
          betValues.premioType = insertBet.premioType;
        }
        if (insertBet.gameModeId !== void 0) {
          betValues.gameModeId = insertBet.gameModeId;
        }
        if (insertBet.potentialWinAmount !== void 0) {
          betValues.potentialWinAmount = insertBet.potentialWinAmount;
        }
        console.log("Creating bet with values:", betValues);
        const [bet] = await db.insert(bets).values(betValues).returning();
        return bet;
      }
      /**
       * Recupera as apostas de um usuário com múltiplas camadas de verificação de segurança
       * para prevenir vazamento de dados entre usuários (versão reotimizada para performance)
       */
      async getBetsByUserId(userId) {
        try {
          if (!userId || userId <= 0) {
            console.error(`SEGURAN\xC7A: Tentativa de acesso com ID de usu\xE1rio inv\xE1lido (${userId})`);
            return [];
          }
          const userExists = await this.getUser(userId);
          if (!userExists) {
            console.error(`SEGURAN\xC7A: Tentativa de buscar apostas para usu\xE1rio inexistente ID=${userId}`);
            return [];
          }
          console.log(`Fetching bets for user ID: ${userId}`);
          const userBets = await db.select().from(bets).where(eq(bets.userId, userId)).orderBy(desc(bets.createdAt));
          console.log(`Query returned ${userBets.length} bets for user ID: ${userId} directly from database`);
          const verifiedUserBets = userBets.filter((bet) => bet.userId === userId);
          if (verifiedUserBets.length !== userBets.length) {
            console.error(`ALERTA CR\xCDTICO: Consulta de apostas para usu\xE1rio ${userId} retornou ${userBets.length - verifiedUserBets.length} apostas de outros usu\xE1rios!`);
          }
          if (verifiedUserBets.length === 0) {
            return [];
          }
          const drawIds = [];
          const animalIds = [];
          const gameModeIds = [];
          verifiedUserBets.forEach((bet) => {
            if (bet.drawId) drawIds.push(bet.drawId);
            if (bet.animalId) animalIds.push(bet.animalId);
            if (bet.animalId2) animalIds.push(bet.animalId2);
            if (bet.animalId3) animalIds.push(bet.animalId3);
            if (bet.animalId4) animalIds.push(bet.animalId4);
            if (bet.animalId5) animalIds.push(bet.animalId5);
            if (bet.gameModeId) gameModeIds.push(bet.gameModeId);
          });
          const uniqueDrawIds = drawIds.filter((id, index) => drawIds.indexOf(id) === index);
          const uniqueAnimalIds = animalIds.filter((id, index) => animalIds.indexOf(id) === index);
          const uniqueGameModeIds = gameModeIds.filter((id, index) => gameModeIds.indexOf(id) === index);
          let drawsData = [];
          if (uniqueDrawIds.length > 0) {
            try {
              drawsData = await db.select().from(draws).where(inArray(draws.id, uniqueDrawIds));
              console.log(`Fetch Draw Successful - Draws IDs: ${uniqueDrawIds.join(",")}`);
            } catch (error) {
              console.error("Error fetching draws:", error);
              drawsData = [];
            }
          }
          let animalsData = [];
          if (uniqueAnimalIds.length > 0) {
            try {
              animalsData = await db.select().from(animals).where(inArray(animals.id, uniqueAnimalIds));
              console.log(`Fetch Animals Successful - Animal IDs: ${uniqueAnimalIds.join(",")}`);
            } catch (error) {
              console.error("Error fetching animals:", error);
              animalsData = [];
            }
          }
          let gameModesData = [];
          if (uniqueGameModeIds.length > 0) {
            try {
              gameModesData = await db.select().from(gameModes).where(inArray(gameModes.id, uniqueGameModeIds));
              console.log(`Fetch GameModes Successful - GameMode IDs: ${uniqueGameModeIds.join(",")}`);
            } catch (error) {
              console.error("Error fetching game modes:", error);
              gameModesData = [];
            }
          }
          const drawMap = new Map(drawsData.map((draw) => [draw.id, draw]));
          const animalMap = new Map(animalsData.map((animal) => [animal.id, animal]));
          const gameModeMap = new Map(gameModesData.map((gameMode) => [gameMode.id, gameMode]));
          const betsWithDetails = verifiedUserBets.map((bet) => {
            const betWithDetails = {
              ...bet,
              draw: drawMap.get(bet.drawId)
            };
            if (bet.animalId && animalMap.has(bet.animalId)) {
              betWithDetails.animal = animalMap.get(bet.animalId);
            }
            if (bet.animalId2 && animalMap.has(bet.animalId2)) {
              betWithDetails.animal2 = animalMap.get(bet.animalId2);
            }
            if (bet.animalId3 && animalMap.has(bet.animalId3)) {
              betWithDetails.animal3 = animalMap.get(bet.animalId3);
            }
            if (bet.animalId4 && animalMap.has(bet.animalId4)) {
              betWithDetails.animal4 = animalMap.get(bet.animalId4);
            }
            if (bet.animalId5 && animalMap.has(bet.animalId5)) {
              betWithDetails.animal5 = animalMap.get(bet.animalId5);
            }
            if (bet.gameModeId && gameModeMap.has(bet.gameModeId)) {
              betWithDetails.gameMode = gameModeMap.get(bet.gameModeId);
            }
            return betWithDetails;
          });
          const validBets = betsWithDetails.filter((bet) => bet.draw !== void 0);
          console.log(`Enriched and returning ${validBets.length} valid bets for user ID: ${userId}`);
          return validBets;
        } catch (error) {
          console.error(`ERRO CR\xCDTICO em getBetsByUserId para usu\xE1rio ${userId}:`, error);
          return [];
        }
      }
      async getBetsByDrawId(drawId) {
        try {
          console.log(`Fetching bets for draw ID: ${drawId}`);
          const drawBets = await db.select().from(bets).where(eq(bets.drawId, drawId));
          console.log(`Found ${drawBets.length} bets for draw ID: ${drawId}`);
          if (drawBets.length > 0) {
            console.log(`Bet details for draw ID ${drawId}:`, JSON.stringify(drawBets));
          } else {
            console.log(`No bets found for draw ID ${drawId}`);
          }
          return drawBets;
        } catch (err) {
          console.error("Error getting bets by draw ID:", err);
          return [];
        }
      }
      async updateBetStatus(betId, status, winAmount) {
        console.log(`UPDATING BET STATUS: Bet ID ${betId}, New status: ${status}, Win amount: ${winAmount || "N/A"}`);
        try {
          const currentBets = await db.select().from(bets).where(eq(bets.id, betId));
          if (currentBets.length === 0) {
            console.error(`BET STATUS UPDATE FAILED: Bet ID ${betId} not found`);
            return void 0;
          }
          const currentBet = currentBets[0];
          console.log(`BET BEFORE UPDATE: Bet ID ${betId}, Current status: ${currentBet.status}, Current win amount: ${currentBet.winAmount || "N/A"}`);
          const updateData = { status };
          if (winAmount !== void 0) {
            updateData.winAmount = winAmount;
          }
          const [bet] = await db.update(bets).set(updateData).where(eq(bets.id, betId)).returning();
          if (!bet) {
            console.error(`BET STATUS UPDATE FAILED: Update operation returned no bet`);
            return void 0;
          }
          console.log(`BET UPDATED SUCCESSFULLY: Bet ID ${betId}, New status: ${bet.status}, New win amount: ${bet.winAmount || "N/A"}`);
          return bet;
        } catch (error) {
          console.error(`BET STATUS UPDATE ERROR: ${error}`);
          return void 0;
        }
      }
      async getAllBets() {
        try {
          console.log("Fetching all bets with details");
          console.log("\u26A0\uFE0F ATEN\xC7\xC3O: Recuperando TODAS as apostas. Esta opera\xE7\xE3o \xE9 restrita para administradores.");
          const { bets: bets2 } = await this.getPaginatedBets({
            page: 1,
            pageSize: 1e3,
            // Valor grande para manter compatibilidade com código existente
            sortOrder: "desc"
          });
          console.log(`Found ${bets2.length} bets total`);
          return bets2;
        } catch (err) {
          console.error("Error getting all bets:", err);
          return [];
        }
      }
      async getPaginatedBets(options) {
        try {
          console.log(`Fetching paginated bets with options:`, options);
          console.log("\u26A0\uFE0F ATEN\xC7\xC3O: Recuperando apostas com pagina\xE7\xE3o. Esta opera\xE7\xE3o \xE9 restrita para administradores.");
          const { page, pageSize, status, search, sortOrder } = options;
          const offset = (page - 1) * pageSize;
          let query = db.select().from(bets);
          let countQuery = db.select({ count: count() }).from(bets);
          if (status) {
            query = query.where(eq(bets.status, status));
            countQuery = countQuery.where(eq(bets.status, status));
          }
          if (search) {
            query = query.where(sql`CAST(id AS TEXT) ILIKE ${"%" + search + "%"}`);
            countQuery = countQuery.where(sql`CAST(id AS TEXT) ILIKE ${"%" + search + "%"}`);
          }
          if (sortOrder === "asc") {
            query = query.orderBy(asc(bets.createdAt));
          } else {
            query = query.orderBy(desc(bets.createdAt));
          }
          query = query.limit(pageSize).offset(offset);
          const betsResult = await query;
          const totalResult = await countQuery;
          const total = totalResult[0]?.count || 0;
          console.log(`Query returned ${betsResult.length} bets for page ${page} (offset: ${offset}, pageSize: ${pageSize})`);
          console.log(`Total bets matching criteria: ${total}`);
          const drawIds = [];
          const animalIds = [];
          const gameModeIds = [];
          betsResult.forEach((bet) => {
            if (bet.drawId) drawIds.push(bet.drawId);
            if (bet.animalId) animalIds.push(bet.animalId);
            if (bet.animalId2) animalIds.push(bet.animalId2);
            if (bet.animalId3) animalIds.push(bet.animalId3);
            if (bet.animalId4) animalIds.push(bet.animalId4);
            if (bet.animalId5) animalIds.push(bet.animalId5);
            if (bet.gameModeId) gameModeIds.push(bet.gameModeId);
          });
          const uniqueDrawIds = drawIds.filter((id, index) => drawIds.indexOf(id) === index);
          const uniqueAnimalIds = animalIds.filter((id, index) => animalIds.indexOf(id) === index);
          const uniqueGameModeIds = gameModeIds.filter((id, index) => gameModeIds.indexOf(id) === index);
          let allDraws = [];
          if (uniqueDrawIds.length > 0) {
            try {
              allDraws = await db.select().from(draws).where(inArray(draws.id, uniqueDrawIds));
              console.log(`Paginated Fetch Draw Successful - Draws IDs: ${uniqueDrawIds.join(",")}`);
            } catch (error) {
              console.error("Paginated Error fetching draws:", error);
              allDraws = [];
            }
          }
          let allAnimals = [];
          if (uniqueAnimalIds.length > 0) {
            try {
              allAnimals = await db.select().from(animals).where(inArray(animals.id, uniqueAnimalIds));
              console.log(`Paginated Fetch Animals Successful - Animal IDs: ${uniqueAnimalIds.join(",")}`);
            } catch (error) {
              console.error("Paginated Error fetching animals:", error);
              allAnimals = [];
            }
          }
          let allGameModes = [];
          if (uniqueGameModeIds.length > 0) {
            try {
              allGameModes = await db.select().from(gameModes).where(inArray(gameModes.id, uniqueGameModeIds));
              console.log(`Paginated Fetch GameModes Successful - GameMode IDs: ${uniqueGameModeIds.join(",")}`);
            } catch (error) {
              console.error("Paginated Error fetching game modes:", error);
              allGameModes = [];
            }
          }
          const drawMap = new Map(allDraws.map((draw) => [draw.id, draw]));
          const animalMap = new Map(allAnimals.map((animal) => [animal.id, animal]));
          const gameModeMap = new Map(allGameModes.map((gameMode) => [gameMode.id, gameMode]));
          const betsWithDetails = betsResult.filter((bet) => drawMap.has(bet.drawId)).map((bet) => {
            const gameMode = bet.gameModeId && gameModeMap.has(bet.gameModeId) ? gameModeMap.get(bet.gameModeId) : void 0;
            let potentialWinAmount = void 0;
            if (gameMode && gameMode.odds > 0) {
              potentialWinAmount = Number(bet.amount) * gameMode.odds;
            }
            const betWithDetails = {
              ...bet,
              draw: drawMap.get(bet.drawId),
              potentialWinAmount
            };
            if (bet.animalId && animalMap.has(bet.animalId)) {
              betWithDetails.animal = animalMap.get(bet.animalId);
            }
            if (bet.animalId2 && animalMap.has(bet.animalId2)) {
              betWithDetails.animal2 = animalMap.get(bet.animalId2);
            }
            if (bet.animalId3 && animalMap.has(bet.animalId3)) {
              betWithDetails.animal3 = animalMap.get(bet.animalId3);
            }
            if (bet.animalId4 && animalMap.has(bet.animalId4)) {
              betWithDetails.animal4 = animalMap.get(bet.animalId4);
            }
            if (bet.animalId5 && animalMap.has(bet.animalId5)) {
              betWithDetails.animal5 = animalMap.get(bet.animalId5);
            }
            if (gameMode) {
              betWithDetails.gameMode = gameMode;
            }
            return betWithDetails;
          });
          return {
            bets: betsWithDetails,
            total: Number(total)
          };
        } catch (err) {
          console.error("Error getting paginated bets:", err);
          return {
            bets: [],
            total: 0
          };
        }
      }
      // Draw Management
      async createDraw(insertDraw) {
        const [draw] = await db.insert(draws).values({
          ...insertDraw,
          status: "pending",
          resultAnimalId: null,
          resultAnimalId2: null,
          resultAnimalId3: null,
          resultAnimalId4: null,
          resultAnimalId5: null,
          resultNumber1: null,
          resultNumber2: null,
          resultNumber3: null,
          resultNumber4: null,
          resultNumber5: null,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return draw;
      }
      async getDraw(id) {
        const [draw] = await db.select().from(draws).where(eq(draws.id, id));
        return draw;
      }
      async getUpcomingDraws() {
        const now = /* @__PURE__ */ new Date();
        const brtOffset = 3 * 60 * 60 * 1e3;
        const brtNow = new Date(now.getTime() - brtOffset);
        const bufferTime = 10 * 60 * 1e3;
        const cutoffTime = new Date(brtNow.getTime() + bufferTime);
        const startOfToday = new Date(brtNow);
        startOfToday.setHours(0, 0, 0, 0);
        const endOfTomorrow = new Date(brtNow);
        endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
        endOfTomorrow.setHours(23, 59, 59, 999);
        console.log(`[getUpcomingDraws] Time Check:`);
        console.log(`  Server Time (UTC): ${now.toISOString()}`);
        console.log(`  BRT Time: ${brtNow.toISOString()}`);
        console.log(`  Cutoff Time (+10min): ${cutoffTime.toISOString()}`);
        const potentialDraws = await db.select().from(draws).where(
          and(
            eq(draws.status, "pending"),
            gte(draws.date, startOfToday),
            lte(draws.date, endOfTomorrow)
          )
        ).orderBy(asc(draws.date), asc(draws.time));
        const upcomingDraws = potentialDraws.filter((draw) => {
          try {
            const [hours, minutes] = draw.time.split(":").map(Number);
            const drawDateTime = new Date(draw.date);
            drawDateTime.setHours(hours, minutes, 0, 0);
            const isUpcoming = drawDateTime > cutoffTime;
            if (!isUpcoming) {
              console.log(`[getUpcomingDraws] Filtrando sorteio passado: ${draw.name} (${draw.time}) - Data: ${drawDateTime.toISOString()} <= Cutoff: ${cutoffTime.toISOString()}`);
            }
            return isUpcoming;
          } catch (e) {
            console.error(`[getUpcomingDraws] Erro ao processar data do sorteio ${draw.id}:`, e);
            return false;
          }
        });
        const drawsWithPrefix = upcomingDraws.map((draw) => {
          const drawDate = new Date(draw.date);
          const drawDateStr = drawDate.toLocaleDateString("pt-BR");
          const todayDateStr = brtNow.toLocaleDateString("pt-BR");
          const tomorrow = new Date(brtNow);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowDateStr = tomorrow.toLocaleDateString("pt-BR");
          let prefix = "";
          if (drawDateStr === todayDateStr) {
            prefix = "(Hoje) ";
          } else if (drawDateStr === tomorrowDateStr) {
            prefix = "(Amanh\xE3) ";
          }
          return {
            ...draw,
            name: prefix + draw.name
          };
        });
        return drawsWithPrefix;
      }
      async getCompletedDraws(date) {
        const conditions = [eq(draws.status, "completed")];
        if (date) {
          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);
          conditions.push(and(gte(draws.date, startOfDay), lte(draws.date, endOfDay)));
        }
        const completedDraws = await db.select().from(draws).where(and(...conditions)).orderBy(desc(draws.date), desc(draws.time));
        return completedDraws;
      }
      async getRecentDraws(limit = 10) {
        return await db.select().from(draws).where(eq(draws.status, "completed")).orderBy(desc(draws.date), desc(draws.time)).limit(limit);
      }
      /**
       * Busca todas as apostas de um sorteio específico
       */
      async getBetsByDrawId(drawId) {
        console.log(`Buscando apostas para o sorteio ID: ${drawId}`);
        const drawBets = await db.select().from(bets).where(eq(bets.drawId, drawId));
        console.log(`Encontradas ${drawBets.length} apostas para o sorteio ID: ${drawId}`);
        return drawBets;
      }
      /**
       * Atualiza o status de uma aposta
       */
      async updateBetStatus(betId, status, winAmount) {
        console.log(`Atualizando aposta ${betId} para status: ${status}, winAmount: ${winAmount || 0}`);
        await db.update(bets).set({
          status,
          winAmount: winAmount || 0
        }).where(eq(bets.id, betId));
        console.log(`Aposta ${betId} atualizada com sucesso`);
      }
      /**
       * Atualiza o saldo de um usuário (adiciona valor)
       */
      async updateUserBalance(userId, amount) {
        console.log(`Atualizando saldo do usu\xE1rio ${userId}, adicionando: ${amount}`);
        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!user) {
          console.error(`Usu\xE1rio ${userId} n\xE3o encontrado`);
          return;
        }
        const newBalance = user.balance + amount;
        await db.update(users).set({ balance: newBalance }).where(eq(users.id, userId));
        console.log(`Saldo do usu\xE1rio ${userId} atualizado: ${user.balance} \u2192 ${newBalance}`);
      }
      /**
       * Busca um game mode por ID
       */
      async getGameMode(gameModeId) {
        const [gameMode] = await db.select().from(gameModes).where(eq(gameModes.id, gameModeId)).limit(1);
        return gameMode;
      }
      async updateDrawResult(drawId, resultAnimalId, resultAnimalId2, resultAnimalId3, resultAnimalId4, resultAnimalId5, resultAnimalId6, resultAnimalId7, resultAnimalId8, resultAnimalId9, resultAnimalId10, resultNumber1, resultNumber2, resultNumber3, resultNumber4, resultNumber5, resultNumber6, resultNumber7, resultNumber8, resultNumber9, resultNumber10) {
        console.log(`Updating draw result for draw ID: ${drawId}, winner animals: 
      1\xBA pr\xEAmio: ${resultAnimalId}, n\xFAmero: ${resultNumber1 || "n\xE3o definido"}
      2\xBA pr\xEAmio: ${resultAnimalId2 || "n\xE3o definido"}, n\xFAmero: ${resultNumber2 || "n\xE3o definido"}
      3\xBA pr\xEAmio: ${resultAnimalId3 || "n\xE3o definido"}, n\xFAmero: ${resultNumber3 || "n\xE3o definido"}
      4\xBA pr\xEAmio: ${resultAnimalId4 || "n\xE3o definido"}, n\xFAmero: ${resultNumber4 || "n\xE3o definido"}
      5\xBA pr\xEAmio: ${resultAnimalId5 || "n\xE3o definido"}, n\xFAmero: ${resultNumber5 || "n\xE3o definido"}
      6\xBA pr\xEAmio: ${resultAnimalId6 || "n\xE3o definido"}, n\xFAmero: ${resultNumber6 || "n\xE3o definido"}
      7\xBA pr\xEAmio: ${resultAnimalId7 || "n\xE3o definido"}, n\xFAmero: ${resultNumber7 || "n\xE3o definido"}
      8\xBA pr\xEAmio: ${resultAnimalId8 || "n\xE3o definido"}, n\xFAmero: ${resultNumber8 || "n\xE3o definido"}
      9\xBA pr\xEAmio: ${resultAnimalId9 || "n\xE3o definido"}, n\xFAmero: ${resultNumber9 || "n\xE3o definido"}
      10\xBA pr\xEAmio: ${resultAnimalId10 || "n\xE3o definido"}, n\xFAmero: ${resultNumber10 || "n\xE3o definido"}
    `);
        const [draw] = await db.update(draws).set({
          status: "completed",
          resultAnimalId,
          resultAnimalId2: resultAnimalId2 || null,
          resultAnimalId3: resultAnimalId3 || null,
          resultAnimalId4: resultAnimalId4 || null,
          resultAnimalId5: resultAnimalId5 || null,
          resultAnimalId6: resultAnimalId6 || null,
          resultAnimalId7: resultAnimalId7 || null,
          resultAnimalId8: resultAnimalId8 || null,
          resultAnimalId9: resultAnimalId9 || null,
          resultAnimalId10: resultAnimalId10 || null,
          resultNumber1: resultNumber1 || null,
          resultNumber2: resultNumber2 || null,
          resultNumber3: resultNumber3 || null,
          resultNumber4: resultNumber4 || null,
          resultNumber5: resultNumber5 || null,
          resultNumber6: resultNumber6 || null,
          resultNumber7: resultNumber7 || null,
          resultNumber8: resultNumber8 || null,
          resultNumber9: resultNumber9 || null,
          resultNumber10: resultNumber10 || null
        }).where(eq(draws.id, drawId)).returning();
        if (!draw) {
          console.error(`Draw not found for ID: ${drawId}`);
          return void 0;
        }
        console.log(`Draw updated successfully: ${JSON.stringify(draw)}`);
        console.log(`
${"=".repeat(60)}`);
        console.log(`\u{1F3AF} INICIANDO PROCESSAMENTO DE APOSTAS`);
        console.log(`   Draw ID: ${drawId}`);
        console.log(`   Draw Name: ${draw.name}`);
        console.log(`   1\xBA Pr\xEAmio: Animal ID ${resultAnimalId}, N\xFAmero ${resultNumber1}`);
        console.log(`${"=".repeat(60)}
`);
        console.log(`\u{1F4CA} Buscando apostas para o sorteio ID: ${drawId}...`);
        const drawBets = await this.getBetsByDrawId(drawId);
        console.log(`\u2705 Encontradas ${drawBets.length} apostas para processar
`);
        if (drawBets.length === 0) {
          console.log(`\u26A0\uFE0F  ATEN\xC7\xC3O: Nenhuma aposta encontrada para este sorteio!`);
          console.log(`${"=".repeat(60)}
`);
          return draw;
        }
        for (const bet of drawBets) {
          console.log(`Processing bet ID: ${bet.id}, user ID: ${bet.userId}, type: ${bet.type}, pr\xEAmio: ${bet.premioType}`);
          let isWinner = false;
          let appliedMultiplier = 1;
          let gameMode;
          if (bet.gameModeId) {
            gameMode = await this.getGameMode(bet.gameModeId);
          }
          const premioType = bet.premioType || "1";
          if (premioType === "1-5") {
            appliedMultiplier = 0.2;
            console.log(`Aposta em todos os pr\xEAmios (1-5), multiplicador ajustado para ${appliedMultiplier}`);
          } else if (premioType === "1-10") {
            appliedMultiplier = 0.1;
            console.log(`Aposta em todos os pr\xEAmios (1-10), multiplicador ajustado para ${appliedMultiplier}`);
          }
          switch (bet.type) {
            case "group":
              if (premioType === "1" && bet.animalId === resultAnimalId || premioType === "2" && bet.animalId === resultAnimalId2 || premioType === "3" && bet.animalId === resultAnimalId3 || premioType === "4" && bet.animalId === resultAnimalId4 || premioType === "5" && bet.animalId === resultAnimalId5 || premioType === "6" && bet.animalId === resultAnimalId6 || premioType === "7" && bet.animalId === resultAnimalId7 || premioType === "8" && bet.animalId === resultAnimalId8 || premioType === "9" && bet.animalId === resultAnimalId9 || premioType === "10" && bet.animalId === resultAnimalId10 || premioType === "1-5" && (bet.animalId === resultAnimalId || bet.animalId === resultAnimalId2 || bet.animalId === resultAnimalId3 || bet.animalId === resultAnimalId4 || bet.animalId === resultAnimalId5) || premioType === "1-10" && (bet.animalId === resultAnimalId || bet.animalId === resultAnimalId2 || bet.animalId === resultAnimalId3 || bet.animalId === resultAnimalId4 || bet.animalId === resultAnimalId5 || bet.animalId === resultAnimalId6 || bet.animalId === resultAnimalId7 || bet.animalId === resultAnimalId8 || bet.animalId === resultAnimalId9 || bet.animalId === resultAnimalId10)) {
                isWinner = true;
              }
              break;
            case "duque_grupo":
              if (bet.animalId && bet.animalId2) {
                if (premioType === "1" && (bet.animalId === resultAnimalId && bet.animalId2 === resultAnimalId || bet.animalId2 === resultAnimalId && bet.animalId === resultAnimalId)) {
                  isWinner = true;
                  console.log(`Duque de Grupo ganhou no 1\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                } else if (premioType === "2" && resultAnimalId2 && (bet.animalId === resultAnimalId2 && bet.animalId2 === resultAnimalId2 || bet.animalId2 === resultAnimalId2 && bet.animalId === resultAnimalId2)) {
                  isWinner = true;
                  console.log(`Duque de Grupo ganhou no 2\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                } else if (premioType === "3" && resultAnimalId3 && (bet.animalId === resultAnimalId3 && bet.animalId2 === resultAnimalId3 || bet.animalId2 === resultAnimalId3 && bet.animalId === resultAnimalId3)) {
                  isWinner = true;
                  console.log(`Duque de Grupo ganhou no 3\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                } else if (premioType === "4" && resultAnimalId4 && (bet.animalId === resultAnimalId4 && bet.animalId2 === resultAnimalId4 || bet.animalId2 === resultAnimalId4 && bet.animalId === resultAnimalId4)) {
                  isWinner = true;
                  console.log(`Duque de Grupo ganhou no 4\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                } else if (premioType === "5" && resultAnimalId5 && (bet.animalId === resultAnimalId5 && bet.animalId2 === resultAnimalId5 || bet.animalId2 === resultAnimalId5 && bet.animalId === resultAnimalId5)) {
                  isWinner = true;
                  console.log(`Duque de Grupo ganhou no 5\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                } else if (premioType === "1-5") {
                  let win = false;
                  if (bet.animalId === resultAnimalId && bet.animalId2 === resultAnimalId || bet.animalId2 === resultAnimalId && bet.animalId === resultAnimalId) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 1\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  if (resultAnimalId2 && (bet.animalId === resultAnimalId2 && bet.animalId2 === resultAnimalId2 || bet.animalId2 === resultAnimalId2 && bet.animalId === resultAnimalId2)) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 2\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  if (resultAnimalId3 && (bet.animalId === resultAnimalId3 && bet.animalId2 === resultAnimalId3 || bet.animalId2 === resultAnimalId3 && bet.animalId === resultAnimalId3)) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 3\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  if (resultAnimalId4 && (bet.animalId === resultAnimalId4 && bet.animalId2 === resultAnimalId4 || bet.animalId2 === resultAnimalId4 && bet.animalId === resultAnimalId4)) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 4\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  if (resultAnimalId5 && (bet.animalId === resultAnimalId5 && bet.animalId2 === resultAnimalId5 || bet.animalId2 === resultAnimalId5 && bet.animalId === resultAnimalId5)) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 5\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  isWinner = win;
                } else if (premioType === "1-10") {
                  let win = false;
                  if (bet.animalId === resultAnimalId && bet.animalId2 === resultAnimalId || bet.animalId2 === resultAnimalId && bet.animalId === resultAnimalId) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 1\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  if (resultAnimalId2 && (bet.animalId === resultAnimalId2 && bet.animalId2 === resultAnimalId2 || bet.animalId2 === resultAnimalId2 && bet.animalId === resultAnimalId2)) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 2\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  if (resultAnimalId3 && (bet.animalId === resultAnimalId3 && bet.animalId2 === resultAnimalId3 || bet.animalId2 === resultAnimalId3 && bet.animalId === resultAnimalId3)) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 3\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  if (resultAnimalId4 && (bet.animalId === resultAnimalId4 && bet.animalId2 === resultAnimalId4 || bet.animalId2 === resultAnimalId4 && bet.animalId === resultAnimalId4)) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 4\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  if (resultAnimalId5 && (bet.animalId === resultAnimalId5 && bet.animalId2 === resultAnimalId5 || bet.animalId2 === resultAnimalId5 && bet.animalId === resultAnimalId5)) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 5\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  if (resultAnimalId6 && (bet.animalId === resultAnimalId6 && bet.animalId2 === resultAnimalId6 || bet.animalId2 === resultAnimalId6 && bet.animalId === resultAnimalId6)) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 6\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  if (resultAnimalId7 && (bet.animalId === resultAnimalId7 && bet.animalId2 === resultAnimalId7 || bet.animalId2 === resultAnimalId7 && bet.animalId === resultAnimalId7)) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 7\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  if (resultAnimalId8 && (bet.animalId === resultAnimalId8 && bet.animalId2 === resultAnimalId8 || bet.animalId2 === resultAnimalId8 && bet.animalId === resultAnimalId8)) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 8\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  if (resultAnimalId9 && (bet.animalId === resultAnimalId9 && bet.animalId2 === resultAnimalId9 || bet.animalId2 === resultAnimalId9 && bet.animalId === resultAnimalId9)) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 9\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  if (resultAnimalId10 && (bet.animalId === resultAnimalId10 && bet.animalId2 === resultAnimalId10 || bet.animalId2 === resultAnimalId10 && bet.animalId === resultAnimalId10)) {
                    win = true;
                    console.log(`Duque de Grupo ganhou no 10\xB0 pr\xEAmio: ${bet.animalId} e ${bet.animalId2}`);
                  }
                  isWinner = win;
                }
              }
              break;
            // Verificações para todas as modalidades de apostas
            case "duque_dezena":
              if (bet.betNumbers && bet.betNumbers.length >= 2) {
                const betDezena1 = bet.betNumbers[0];
                const betDezena2 = bet.betNumbers[1];
                const getDezenaFromMilhar = (milhar) => {
                  if (milhar && milhar.length >= 2) {
                    return milhar.slice(-2);
                  }
                  return "";
                };
                const prizeResults = {};
                if (resultNumber1) {
                  prizeResults["1"] = getDezenaFromMilhar(resultNumber1);
                } else if (resultAnimalId) {
                  const animal = await this.getAnimal(resultAnimalId);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["1"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber2) {
                  prizeResults["2"] = getDezenaFromMilhar(resultNumber2);
                } else if (resultAnimalId2) {
                  const animal = await this.getAnimal(resultAnimalId2);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["2"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber3) {
                  prizeResults["3"] = getDezenaFromMilhar(resultNumber3);
                } else if (resultAnimalId3) {
                  const animal = await this.getAnimal(resultAnimalId3);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["3"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber4) {
                  prizeResults["4"] = getDezenaFromMilhar(resultNumber4);
                } else if (resultAnimalId4) {
                  const animal = await this.getAnimal(resultAnimalId4);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["4"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber5) {
                  prizeResults["5"] = getDezenaFromMilhar(resultNumber5);
                } else if (resultAnimalId5) {
                  const animal = await this.getAnimal(resultAnimalId5);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["5"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber6) {
                  prizeResults["6"] = getDezenaFromMilhar(resultNumber6);
                } else if (resultAnimalId6) {
                  const animal = await this.getAnimal(resultAnimalId6);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["6"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber7) {
                  prizeResults["7"] = getDezenaFromMilhar(resultNumber7);
                } else if (resultAnimalId7) {
                  const animal = await this.getAnimal(resultAnimalId7);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["7"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber8) {
                  prizeResults["8"] = getDezenaFromMilhar(resultNumber8);
                } else if (resultAnimalId8) {
                  const animal = await this.getAnimal(resultAnimalId8);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["8"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber9) {
                  prizeResults["9"] = getDezenaFromMilhar(resultNumber9);
                } else if (resultAnimalId9) {
                  const animal = await this.getAnimal(resultAnimalId9);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["9"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber10) {
                  prizeResults["10"] = getDezenaFromMilhar(resultNumber10);
                } else if (resultAnimalId10) {
                  const animal = await this.getAnimal(resultAnimalId10);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["10"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                const checkDuque = (prize) => {
                  return prizeResults[prize] === betDezena1 && prizeResults[prize] === betDezena2 || prizeResults[prize] === betDezena1 && prizeResults[prize] === betDezena2;
                };
                if (premioType === "1" && checkDuque("1")) {
                  isWinner = true;
                } else if (premioType === "2" && checkDuque("2")) {
                  isWinner = true;
                } else if (premioType === "3" && checkDuque("3")) {
                  isWinner = true;
                } else if (premioType === "4" && checkDuque("4")) {
                  isWinner = true;
                } else if (premioType === "5" && checkDuque("5")) {
                  isWinner = true;
                } else if (premioType === "6" && checkDuque("6")) {
                  isWinner = true;
                } else if (premioType === "7" && checkDuque("7")) {
                  isWinner = true;
                } else if (premioType === "8" && checkDuque("8")) {
                  isWinner = true;
                } else if (premioType === "9" && checkDuque("9")) {
                  isWinner = true;
                } else if (premioType === "10" && checkDuque("10")) {
                  isWinner = true;
                } else if (premioType === "1-5") {
                  const winners = ["1", "2", "3", "4", "5"].filter((prize) => checkDuque(prize));
                  if (winners.length > 0) {
                    isWinner = true;
                  }
                } else if (premioType === "1-10") {
                  const winners = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].filter((prize) => checkDuque(prize));
                  if (winners.length > 0) {
                    isWinner = true;
                  }
                }
              }
              break;
            case "terno_dezena":
              if (bet.betNumbers && bet.betNumbers.length >= 3) {
                const betDezenas = bet.betNumbers.slice(0, 3);
                const getDezenaFromMilhar = (milhar) => {
                  if (milhar && milhar.length >= 2) {
                    return milhar.slice(-2);
                  }
                  return "";
                };
                const prizeResults = {};
                if (resultNumber1) {
                  prizeResults["1"] = getDezenaFromMilhar(resultNumber1);
                } else if (resultAnimalId) {
                  const animal = await this.getAnimal(resultAnimalId);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["1"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber2) {
                  prizeResults["2"] = getDezenaFromMilhar(resultNumber2);
                } else if (resultAnimalId2) {
                  const animal = await this.getAnimal(resultAnimalId2);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["2"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber3) {
                  prizeResults["3"] = getDezenaFromMilhar(resultNumber3);
                } else if (resultAnimalId3) {
                  const animal = await this.getAnimal(resultAnimalId3);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["3"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber4) {
                  prizeResults["4"] = getDezenaFromMilhar(resultNumber4);
                } else if (resultAnimalId4) {
                  const animal = await this.getAnimal(resultAnimalId4);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["4"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber5) {
                  prizeResults["5"] = getDezenaFromMilhar(resultNumber5);
                } else if (resultAnimalId5) {
                  const animal = await this.getAnimal(resultAnimalId5);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["5"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber6) {
                  prizeResults["6"] = getDezenaFromMilhar(resultNumber6);
                } else if (resultAnimalId6) {
                  const animal = await this.getAnimal(resultAnimalId6);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["6"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber7) {
                  prizeResults["7"] = getDezenaFromMilhar(resultNumber7);
                } else if (resultAnimalId7) {
                  const animal = await this.getAnimal(resultAnimalId7);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["7"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber8) {
                  prizeResults["8"] = getDezenaFromMilhar(resultNumber8);
                } else if (resultAnimalId8) {
                  const animal = await this.getAnimal(resultAnimalId8);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["8"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber9) {
                  prizeResults["9"] = getDezenaFromMilhar(resultNumber9);
                } else if (resultAnimalId9) {
                  const animal = await this.getAnimal(resultAnimalId9);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["9"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                if (resultNumber10) {
                  prizeResults["10"] = getDezenaFromMilhar(resultNumber10);
                } else if (resultAnimalId10) {
                  const animal = await this.getAnimal(resultAnimalId10);
                  if (animal && animal.numbers && animal.numbers.length > 0) {
                    prizeResults["10"] = getDezenaFromMilhar(animal.numbers[0]);
                  }
                }
                const checkTernoDezena = (prize) => {
                  if (!prizeResults[prize]) return false;
                  return betDezenas.includes(prizeResults[prize]);
                };
                if (premioType === "1" && checkTernoDezena("1")) {
                  isWinner = true;
                } else if (premioType === "2" && checkTernoDezena("2")) {
                  isWinner = true;
                } else if (premioType === "3" && checkTernoDezena("3")) {
                  isWinner = true;
                } else if (premioType === "4" && checkTernoDezena("4")) {
                  isWinner = true;
                } else if (premioType === "5" && checkTernoDezena("5")) {
                  isWinner = true;
                } else if (premioType === "6" && checkTernoDezena("6")) {
                  isWinner = true;
                } else if (premioType === "7" && checkTernoDezena("7")) {
                  isWinner = true;
                } else if (premioType === "8" && checkTernoDezena("8")) {
                  isWinner = true;
                } else if (premioType === "9" && checkTernoDezena("9")) {
                  isWinner = true;
                } else if (premioType === "10" && checkTernoDezena("10")) {
                  isWinner = true;
                } else if (premioType === "1-5") {
                  const winners = ["1", "2", "3", "4", "5"].filter((prize) => checkTernoDezena(prize));
                  if (winners.length > 0) {
                    isWinner = true;
                  }
                } else if (premioType === "1-10") {
                  const winners = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].filter((prize) => checkTernoDezena(prize));
                  if (winners.length > 0) {
                    isWinner = true;
                  }
                }
              }
              break;
            case "dozen":
              if (bet.betNumbers && bet.betNumbers.length > 0) {
                let betNumber = bet.betNumbers[0];
                if (betNumber.length > 2) {
                  console.log(`Convertendo n\xFAmero ${betNumber} para formato de dezena (2 d\xEDgitos)`);
                  betNumber = betNumber.slice(-2);
                }
                console.log(`Processando aposta de DEZENA: ${betNumber}`);
                const getDezenaFromMilhar = (milhar) => {
                  const milharCompleta = milhar.padStart(4, "0");
                  return milharCompleta.substring(2, 4);
                };
                const prizeResults = {};
                if (resultNumber1) {
                  const resultNum = resultNumber1.padStart(4, "0");
                  const dezena = getDezenaFromMilhar(resultNum);
                  console.log(`Resultado 1\xB0 pr\xEAmio (Milhar): ${resultNum}, dezena: ${dezena}`);
                  if (dezena === betNumber) {
                    prizeResults["1"] = dezena;
                    console.log(`Corresponde! Aposta ${betNumber} = dezena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber2) {
                  const resultNum = resultNumber2.padStart(4, "0");
                  const dezena = getDezenaFromMilhar(resultNum);
                  console.log(`Resultado 2\xB0 pr\xEAmio (Milhar): ${resultNum}, dezena: ${dezena}`);
                  if (dezena === betNumber) {
                    prizeResults["2"] = dezena;
                    console.log(`Corresponde! Aposta ${betNumber} = dezena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber3) {
                  const resultNum = resultNumber3.padStart(4, "0");
                  const dezena = getDezenaFromMilhar(resultNum);
                  console.log(`Resultado 3\xB0 pr\xEAmio (Milhar): ${resultNum}, dezena: ${dezena}`);
                  if (dezena === betNumber) {
                    prizeResults["3"] = dezena;
                    console.log(`Corresponde! Aposta ${betNumber} = dezena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber4) {
                  const resultNum = resultNumber4.padStart(4, "0");
                  const dezena = getDezenaFromMilhar(resultNum);
                  console.log(`Resultado 4\xB0 pr\xEAmio (Milhar): ${resultNum}, dezena: ${dezena}`);
                  if (dezena === betNumber) {
                    prizeResults["4"] = dezena;
                    console.log(`Corresponde! Aposta ${betNumber} = dezena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber5) {
                  const resultNum = resultNumber5.padStart(4, "0");
                  const dezena = getDezenaFromMilhar(resultNum);
                  console.log(`Resultado 5\xB0 pr\xEAmio (Milhar): ${resultNum}, dezena: ${dezena}`);
                  if (dezena === betNumber) {
                    prizeResults["5"] = dezena;
                    console.log(`Corresponde! Aposta ${betNumber} = dezena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber6) {
                  const resultNum = resultNumber6.padStart(4, "0");
                  const dezena = getDezenaFromMilhar(resultNum);
                  console.log(`Resultado 6\xB0 pr\xEAmio (Milhar): ${resultNum}, dezena: ${dezena}`);
                  if (dezena === betNumber) {
                    prizeResults["6"] = dezena;
                    console.log(`Corresponde! Aposta ${betNumber} = dezena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber7) {
                  const resultNum = resultNumber7.padStart(4, "0");
                  const dezena = getDezenaFromMilhar(resultNum);
                  console.log(`Resultado 7\xB0 pr\xEAmio (Milhar): ${resultNum}, dezena: ${dezena}`);
                  if (dezena === betNumber) {
                    prizeResults["7"] = dezena;
                    console.log(`Corresponde! Aposta ${betNumber} = dezena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber8) {
                  const resultNum = resultNumber8.padStart(4, "0");
                  const dezena = getDezenaFromMilhar(resultNum);
                  console.log(`Resultado 8\xB0 pr\xEAmio (Milhar): ${resultNum}, dezena: ${dezena}`);
                  if (dezena === betNumber) {
                    prizeResults["8"] = dezena;
                    console.log(`Corresponde! Aposta ${betNumber} = dezena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber9) {
                  const resultNum = resultNumber9.padStart(4, "0");
                  const dezena = getDezenaFromMilhar(resultNum);
                  console.log(`Resultado 9\xB0 pr\xEAmio (Milhar): ${resultNum}, dezena: ${dezena}`);
                  if (dezena === betNumber) {
                    prizeResults["9"] = dezena;
                    console.log(`Corresponde! Aposta ${betNumber} = dezena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber10) {
                  const resultNum = resultNumber10.padStart(4, "0");
                  const dezena = getDezenaFromMilhar(resultNum);
                  console.log(`Resultado 10\xB0 pr\xEAmio (Milhar): ${resultNum}, dezena: ${dezena}`);
                  if (dezena === betNumber) {
                    prizeResults["10"] = dezena;
                    console.log(`Corresponde! Aposta ${betNumber} = dezena do resultado ${resultNum}`);
                  }
                }
                if (!resultNumber1 && resultAnimalId) {
                  const animal1 = await this.getAnimal(resultAnimalId);
                  if (animal1 && animal1.numbers) {
                    console.log(`Animal 1\xB0 pr\xEAmio: ${animal1.name}, n\xFAmeros: ${animal1.numbers.join(", ")}`);
                    for (const numeroOriginal of animal1.numbers) {
                      const numero = numeroOriginal.length < 2 ? "0".repeat(2 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      console.log(`- Verificando n\xFAmero ${numero} do animal (formato para dezena)`);
                      const dezena = getDezenaFromMilhar(numero);
                      console.log(`  - Dezena extra\xEDda: ${dezena}`);
                      if (dezena === "00" && betNumber === "00") {
                        prizeResults["1"] = "00";
                        console.log(`  - Corresponde! Aposta ${betNumber} combina com '00' do animal`);
                        break;
                      }
                      if (dezena === betNumber) {
                        prizeResults["1"] = dezena;
                        console.log(`  - Corresponde! N\xFAmero ${betNumber} encontrado no animal do 1\xB0 pr\xEAmio: ${animal1.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId2) {
                  const animal2 = await this.getAnimal(resultAnimalId2);
                  if (animal2 && animal2.numbers) {
                    console.log(`Animal 2\xB0 pr\xEAmio: ${animal2.name}, n\xFAmeros: ${animal2.numbers.join(", ")}`);
                    for (const numeroOriginal of animal2.numbers) {
                      const numero = numeroOriginal.length < 2 ? "0".repeat(2 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      console.log(`- Verificando n\xFAmero ${numero} do animal (formato para dezena)`);
                      const dezena = getDezenaFromMilhar(numero);
                      console.log(`  - Dezena extra\xEDda: ${dezena}`);
                      if (dezena === "00" && betNumber === "00") {
                        prizeResults["2"] = "00";
                        console.log(`  - Corresponde! Aposta ${betNumber} combina com '00' do animal`);
                        break;
                      }
                      if (dezena === betNumber) {
                        prizeResults["2"] = dezena;
                        console.log(`  - Corresponde! N\xFAmero ${betNumber} encontrado no animal do 2\xB0 pr\xEAmio: ${animal2.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId3) {
                  const animal3 = await this.getAnimal(resultAnimalId3);
                  if (animal3 && animal3.numbers) {
                    console.log(`Animal 3\xB0 pr\xEAmio: ${animal3.name}, n\xFAmeros: ${animal3.numbers.join(", ")}`);
                    for (const numeroOriginal of animal3.numbers) {
                      const numero = numeroOriginal.length < 2 ? "0".repeat(2 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      console.log(`- Verificando n\xFAmero ${numero} do animal (formato para dezena)`);
                      const dezena = getDezenaFromMilhar(numero);
                      console.log(`  - Dezena extra\xEDda: ${dezena}`);
                      if (dezena === "00" && betNumber === "00") {
                        prizeResults["3"] = "00";
                        console.log(`  - Corresponde! Aposta ${betNumber} combina com '00' do animal`);
                        break;
                      }
                      if (dezena === betNumber) {
                        prizeResults["3"] = dezena;
                        console.log(`  - Corresponde! N\xFAmero ${betNumber} encontrado no animal do 3\xB0 pr\xEAmio: ${animal3.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId4) {
                  const animal4 = await this.getAnimal(resultAnimalId4);
                  if (animal4 && animal4.numbers) {
                    console.log(`Animal 4\xB0 pr\xEAmio: ${animal4.name}, n\xFAmeros: ${animal4.numbers.join(", ")}`);
                    for (const numeroOriginal of animal4.numbers) {
                      const numero = numeroOriginal.length < 2 ? "0".repeat(2 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      console.log(`- Verificando n\xFAmero ${numero} do animal (formato para dezena)`);
                      const dezena = getDezenaFromMilhar(numero);
                      console.log(`  - Dezena extra\xEDda: ${dezena}`);
                      if (dezena === "00" && betNumber === "00") {
                        prizeResults["4"] = "00";
                        console.log(`  - Corresponde! Aposta ${betNumber} combina com '00' do animal`);
                        break;
                      }
                      if (dezena === betNumber) {
                        prizeResults["4"] = dezena;
                        console.log(`  - Corresponde! N\xFAmero ${betNumber} encontrado no animal do 4\xB0 pr\xEAmio: ${animal4.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId5) {
                  const animal5 = await this.getAnimal(resultAnimalId5);
                  if (animal5 && animal5.numbers) {
                    console.log(`Animal 5\xB0 pr\xEAmio: ${animal5.name}, n\xFAmeros: ${animal5.numbers.join(", ")}`);
                    for (const numeroOriginal of animal5.numbers) {
                      const numero = numeroOriginal.length < 2 ? "0".repeat(2 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      console.log(`- Verificando n\xFAmero ${numero} do animal (formato para dezena)`);
                      const dezena = getDezenaFromMilhar(numero);
                      console.log(`  - Dezena extra\xEDda: ${dezena}`);
                      if (dezena === "00" && betNumber === "00") {
                        prizeResults["5"] = "00";
                        console.log(`  - Corresponde! Aposta ${betNumber} combina com '00' do animal`);
                        break;
                      }
                      if (dezena === betNumber) {
                        prizeResults["5"] = dezena;
                        console.log(`  - Corresponde! N\xFAmero ${betNumber} encontrado no animal do 5\xB0 pr\xEAmio: ${animal5.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId6) {
                  const animal = await this.getAnimal(resultAnimalId6);
                  if (animal && animal.numbers) {
                    for (const numeroOriginal of animal.numbers) {
                      const numero = numeroOriginal.length < 2 ? "0".repeat(2 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      const dezena = getDezenaFromMilhar(numero);
                      if (dezena === "00" && betNumber === "00") {
                        prizeResults["6"] = "00";
                        break;
                      }
                      if (dezena === betNumber) {
                        prizeResults["6"] = dezena;
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId7) {
                  const animal = await this.getAnimal(resultAnimalId7);
                  if (animal && animal.numbers) {
                    for (const numeroOriginal of animal.numbers) {
                      const numero = numeroOriginal.length < 2 ? "0".repeat(2 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      const dezena = getDezenaFromMilhar(numero);
                      if (dezena === "00" && betNumber === "00") {
                        prizeResults["7"] = "00";
                        break;
                      }
                      if (dezena === betNumber) {
                        prizeResults["7"] = dezena;
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId8) {
                  const animal = await this.getAnimal(resultAnimalId8);
                  if (animal && animal.numbers) {
                    for (const numeroOriginal of animal.numbers) {
                      const numero = numeroOriginal.length < 2 ? "0".repeat(2 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      const dezena = getDezenaFromMilhar(numero);
                      if (dezena === "00" && betNumber === "00") {
                        prizeResults["8"] = "00";
                        break;
                      }
                      if (dezena === betNumber) {
                        prizeResults["8"] = dezena;
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId9) {
                  const animal = await this.getAnimal(resultAnimalId9);
                  if (animal && animal.numbers) {
                    for (const numeroOriginal of animal.numbers) {
                      const numero = numeroOriginal.length < 2 ? "0".repeat(2 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      const dezena = getDezenaFromMilhar(numero);
                      if (dezena === "00" && betNumber === "00") {
                        prizeResults["9"] = "00";
                        break;
                      }
                      if (dezena === betNumber) {
                        prizeResults["9"] = dezena;
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId10) {
                  const animal = await this.getAnimal(resultAnimalId10);
                  if (animal && animal.numbers) {
                    for (const numeroOriginal of animal.numbers) {
                      const numero = numeroOriginal.length < 2 ? "0".repeat(2 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      const dezena = getDezenaFromMilhar(numero);
                      if (dezena === "00" && betNumber === "00") {
                        prizeResults["10"] = "00";
                        break;
                      }
                      if (dezena === betNumber) {
                        prizeResults["10"] = dezena;
                        break;
                      }
                    }
                  }
                }
                if (premioType === "1" && prizeResults["1"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de dezena ${betNumber} ganhou no 1\xB0 pr\xEAmio`);
                } else if (premioType === "2" && prizeResults["2"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de dezena ${betNumber} ganhou no 2\xB0 pr\xEAmio`);
                } else if (premioType === "3" && prizeResults["3"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de dezena ${betNumber} ganhou no 3\xB0 pr\xEAmio`);
                } else if (premioType === "4" && prizeResults["4"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de dezena ${betNumber} ganhou no 4\xB0 pr\xEAmio`);
                } else if (premioType === "5" && prizeResults["5"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de dezena ${betNumber} ganhou no 5\xB0 pr\xEAmio`);
                } else if (premioType === "6" && prizeResults["6"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de dezena ${betNumber} ganhou no 6\xB0 pr\xEAmio`);
                } else if (premioType === "7" && prizeResults["7"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de dezena ${betNumber} ganhou no 7\xB0 pr\xEAmio`);
                } else if (premioType === "8" && prizeResults["8"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de dezena ${betNumber} ganhou no 8\xB0 pr\xEAmio`);
                } else if (premioType === "9" && prizeResults["9"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de dezena ${betNumber} ganhou no 9\xB0 pr\xEAmio`);
                } else if (premioType === "10" && prizeResults["10"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de dezena ${betNumber} ganhou no 10\xB0 pr\xEAmio`);
                } else if (premioType === "1-5") {
                  const winners = Object.keys(prizeResults).filter((key) => prizeResults[key] === betNumber);
                  if (winners.length > 0) {
                    isWinner = true;
                    console.log(`Aposta de dezena ${betNumber} ganhou nos pr\xEAmios: ${winners.join(", ")}`);
                  }
                } else if (premioType === "1-10") {
                  const winners = Object.keys(prizeResults).filter((key) => prizeResults[key] === betNumber);
                  if (winners.length > 0) {
                    isWinner = true;
                    console.log(`Aposta de dezena ${betNumber} ganhou nos pr\xEAmios: ${winners.join(", ")}`);
                  }
                }
              }
              break;
            case "hundred":
              if (bet.betNumbers && bet.betNumbers.length > 0) {
                let betNumber = bet.betNumbers[0];
                if (betNumber.length > 3) {
                  console.log(`Convertendo n\xFAmero ${betNumber} para formato de centena (3 d\xEDgitos)`);
                  betNumber = betNumber.slice(-3);
                }
                console.log(`Processando aposta de CENTENA: ${betNumber}`);
                const getCentenaFromMilhar = (milhar) => {
                  const milharCompleta = milhar.padStart(4, "0");
                  return milharCompleta.substring(1, 4);
                };
                const prizeResults = {};
                if (resultNumber1) {
                  const resultNum = resultNumber1.padStart(4, "0");
                  const centena = getCentenaFromMilhar(resultNum);
                  console.log(`Resultado 1\xB0 pr\xEAmio (Milhar): ${resultNum}, centena: ${centena}`);
                  if (centena === betNumber) {
                    prizeResults["1"] = centena;
                    console.log(`Corresponde! Aposta ${betNumber} = centena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber2) {
                  const resultNum = resultNumber2.padStart(4, "0");
                  const centena = getCentenaFromMilhar(resultNum);
                  console.log(`Resultado 2\xB0 pr\xEAmio (Milhar): ${resultNum}, centena: ${centena}`);
                  if (centena === betNumber) {
                    prizeResults["2"] = centena;
                    console.log(`Corresponde! Aposta ${betNumber} = centena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber3) {
                  const resultNum = resultNumber3.padStart(4, "0");
                  const centena = getCentenaFromMilhar(resultNum);
                  console.log(`Resultado 3\xB0 pr\xEAmio (Milhar): ${resultNum}, centena: ${centena}`);
                  if (centena === betNumber) {
                    prizeResults["3"] = centena;
                    console.log(`Corresponde! Aposta ${betNumber} = centena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber4) {
                  const resultNum = resultNumber4.padStart(4, "0");
                  const centena = getCentenaFromMilhar(resultNum);
                  console.log(`Resultado 4\xB0 pr\xEAmio (Milhar): ${resultNum}, centena: ${centena}`);
                  if (centena === betNumber) {
                    prizeResults["4"] = centena;
                    console.log(`Corresponde! Aposta ${betNumber} = centena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber5) {
                  const resultNum = resultNumber5.padStart(4, "0");
                  const centena = getCentenaFromMilhar(resultNum);
                  console.log(`Resultado 5\xB0 pr\xEAmio (Milhar): ${resultNum}, centena: ${centena}`);
                  if (centena === betNumber) {
                    prizeResults["5"] = centena;
                    console.log(`Corresponde! Aposta ${betNumber} = centena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber6) {
                  const resultNum = resultNumber6.padStart(4, "0");
                  const centena = getCentenaFromMilhar(resultNum);
                  console.log(`Resultado 6\xB0 pr\xEAmio (Milhar): ${resultNum}, centena: ${centena}`);
                  if (centena === betNumber) {
                    prizeResults["6"] = centena;
                    console.log(`Corresponde! Aposta ${betNumber} = centena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber7) {
                  const resultNum = resultNumber7.padStart(4, "0");
                  const centena = getCentenaFromMilhar(resultNum);
                  console.log(`Resultado 7\xB0 pr\xEAmio (Milhar): ${resultNum}, centena: ${centena}`);
                  if (centena === betNumber) {
                    prizeResults["7"] = centena;
                    console.log(`Corresponde! Aposta ${betNumber} = centena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber8) {
                  const resultNum = resultNumber8.padStart(4, "0");
                  const centena = getCentenaFromMilhar(resultNum);
                  console.log(`Resultado 8\xB0 pr\xEAmio (Milhar): ${resultNum}, centena: ${centena}`);
                  if (centena === betNumber) {
                    prizeResults["8"] = centena;
                    console.log(`Corresponde! Aposta ${betNumber} = centena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber9) {
                  const resultNum = resultNumber9.padStart(4, "0");
                  const centena = getCentenaFromMilhar(resultNum);
                  console.log(`Resultado 9\xB0 pr\xEAmio (Milhar): ${resultNum}, centena: ${centena}`);
                  if (centena === betNumber) {
                    prizeResults["9"] = centena;
                    console.log(`Corresponde! Aposta ${betNumber} = centena do resultado ${resultNum}`);
                  }
                }
                if (resultNumber10) {
                  const resultNum = resultNumber10.padStart(4, "0");
                  const centena = getCentenaFromMilhar(resultNum);
                  console.log(`Resultado 10\xB0 pr\xEAmio (Milhar): ${resultNum}, centena: ${centena}`);
                  if (centena === betNumber) {
                    prizeResults["10"] = centena;
                    console.log(`Corresponde! Aposta ${betNumber} = centena do resultado ${resultNum}`);
                  }
                }
                if (!resultNumber1 && resultAnimalId) {
                  const animal1 = await this.getAnimal(resultAnimalId);
                  if (animal1 && animal1.numbers) {
                    console.log(`Animal 1\xB0 pr\xEAmio: ${animal1.name}, n\xFAmeros: ${animal1.numbers.join(", ")}`);
                    for (const numeroOriginal of animal1.numbers) {
                      const numero = numeroOriginal.length < 3 ? "0".repeat(3 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      console.log(`- Verificando n\xFAmero ${numero} do animal (formato para centena)`);
                      const centena = getCentenaFromMilhar(numero);
                      console.log(`  - Centena extra\xEDda: ${centena}`);
                      if (numeroOriginal === "00" && betNumber === "100") {
                        prizeResults["1"] = "100";
                        console.log(`  - Corresponde especial! Aposta ${betNumber} combina com '00' do animal`);
                        break;
                      }
                      if (centena === betNumber) {
                        prizeResults["1"] = centena;
                        console.log(`  - Corresponde! N\xFAmero ${betNumber} encontrado no animal do 1\xB0 pr\xEAmio: ${animal1.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId2) {
                  const animal2 = await this.getAnimal(resultAnimalId2);
                  if (animal2 && animal2.numbers) {
                    console.log(`Animal 2\xB0 pr\xEAmio: ${animal2.name}, n\xFAmeros: ${animal2.numbers.join(", ")}`);
                    for (const numeroOriginal of animal2.numbers) {
                      const numero = numeroOriginal.length < 3 ? "0".repeat(3 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      console.log(`- Verificando n\xFAmero ${numero} do animal (formato para centena)`);
                      const centena = getCentenaFromMilhar(numero);
                      console.log(`  - Centena extra\xEDda: ${centena}`);
                      if (numeroOriginal === "00" && betNumber === "100") {
                        prizeResults["2"] = "100";
                        console.log(`  - Corresponde especial! Aposta ${betNumber} combina com '00' do animal`);
                        break;
                      }
                      if (centena === betNumber) {
                        prizeResults["2"] = centena;
                        console.log(`  - Corresponde! N\xFAmero ${betNumber} encontrado no animal do 2\xB0 pr\xEAmio: ${animal2.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId3) {
                  const animal3 = await this.getAnimal(resultAnimalId3);
                  if (animal3 && animal3.numbers) {
                    console.log(`Animal 3\xB0 pr\xEAmio: ${animal3.name}, n\xFAmeros: ${animal3.numbers.join(", ")}`);
                    for (const numeroOriginal of animal3.numbers) {
                      const numero = numeroOriginal.length < 3 ? "0".repeat(3 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      console.log(`- Verificando n\xFAmero ${numero} do animal (formato para centena)`);
                      const centena = getCentenaFromMilhar(numero);
                      console.log(`  - Centena extra\xEDda: ${centena}`);
                      if (numeroOriginal === "00" && betNumber === "100") {
                        prizeResults["3"] = "100";
                        console.log(`  - Corresponde especial! Aposta ${betNumber} combina com '00' do animal`);
                        break;
                      }
                      if (centena === betNumber) {
                        prizeResults["3"] = centena;
                        console.log(`  - Corresponde! N\xFAmero ${betNumber} encontrado no animal do 3\xB0 pr\xEAmio: ${animal3.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId4) {
                  const animal4 = await this.getAnimal(resultAnimalId4);
                  if (animal4 && animal4.numbers) {
                    console.log(`Animal 4\xB0 pr\xEAmio: ${animal4.name}, n\xFAmeros: ${animal4.numbers.join(", ")}`);
                    for (const numeroOriginal of animal4.numbers) {
                      const numero = numeroOriginal.length < 3 ? "0".repeat(3 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      console.log(`- Verificando n\xFAmero ${numero} do animal (formato para centena)`);
                      const centena = getCentenaFromMilhar(numero);
                      console.log(`  - Centena extra\xEDda: ${centena}`);
                      if (numeroOriginal === "00" && betNumber === "100") {
                        prizeResults["4"] = "100";
                        console.log(`  - Corresponde especial! Aposta ${betNumber} combina com '00' do animal`);
                        break;
                      }
                      if (centena === betNumber) {
                        prizeResults["4"] = centena;
                        console.log(`  - Corresponde! N\xFAmero ${betNumber} encontrado no animal do 4\xB0 pr\xEAmio: ${animal4.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId5) {
                  const animal5 = await this.getAnimal(resultAnimalId5);
                  if (animal5 && animal5.numbers) {
                    console.log(`Animal 5\xB0 pr\xEAmio: ${animal5.name}, n\xFAmeros: ${animal5.numbers.join(", ")}`);
                    for (const numeroOriginal of animal5.numbers) {
                      const numero = numeroOriginal.length < 3 ? "0".repeat(3 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      console.log(`- Verificando n\xFAmero ${numero} do animal (formato para centena)`);
                      const centena = getCentenaFromMilhar(numero);
                      console.log(`  - Centena extra\xEDda: ${centena}`);
                      if (numeroOriginal === "00" && betNumber === "100") {
                        prizeResults["5"] = "100";
                        console.log(`  - Corresponde especial! Aposta ${betNumber} combina com '00' do animal`);
                        break;
                      }
                      if (centena === betNumber) {
                        prizeResults["5"] = centena;
                        console.log(`  - Corresponde! N\xFAmero ${betNumber} encontrado no animal do 5\xB0 pr\xEAmio: ${animal5.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId6) {
                  const animal = await this.getAnimal(resultAnimalId6);
                  if (animal && animal.numbers) {
                    for (const numeroOriginal of animal.numbers) {
                      const numero = numeroOriginal.length < 3 ? "0".repeat(3 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      const centena = getCentenaFromMilhar(numero);
                      if (numeroOriginal === "00" && betNumber === "100") {
                        prizeResults["6"] = "100";
                        break;
                      }
                      if (centena === betNumber) {
                        prizeResults["6"] = centena;
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId7) {
                  const animal = await this.getAnimal(resultAnimalId7);
                  if (animal && animal.numbers) {
                    for (const numeroOriginal of animal.numbers) {
                      const numero = numeroOriginal.length < 3 ? "0".repeat(3 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      const centena = getCentenaFromMilhar(numero);
                      if (numeroOriginal === "00" && betNumber === "100") {
                        prizeResults["7"] = "100";
                        break;
                      }
                      if (centena === betNumber) {
                        prizeResults["7"] = centena;
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId8) {
                  const animal = await this.getAnimal(resultAnimalId8);
                  if (animal && animal.numbers) {
                    for (const numeroOriginal of animal.numbers) {
                      const numero = numeroOriginal.length < 3 ? "0".repeat(3 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      const centena = getCentenaFromMilhar(numero);
                      if (numeroOriginal === "00" && betNumber === "100") {
                        prizeResults["8"] = "100";
                        break;
                      }
                      if (centena === betNumber) {
                        prizeResults["8"] = centena;
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId9) {
                  const animal = await this.getAnimal(resultAnimalId9);
                  if (animal && animal.numbers) {
                    for (const numeroOriginal of animal.numbers) {
                      const numero = numeroOriginal.length < 3 ? "0".repeat(3 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      const centena = getCentenaFromMilhar(numero);
                      if (numeroOriginal === "00" && betNumber === "100") {
                        prizeResults["9"] = "100";
                        break;
                      }
                      if (centena === betNumber) {
                        prizeResults["9"] = centena;
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId10) {
                  const animal = await this.getAnimal(resultAnimalId10);
                  if (animal && animal.numbers) {
                    for (const numeroOriginal of animal.numbers) {
                      const numero = numeroOriginal.length < 3 ? "0".repeat(3 - numeroOriginal.length) + numeroOriginal : numeroOriginal;
                      const centena = getCentenaFromMilhar(numero);
                      if (numeroOriginal === "00" && betNumber === "100") {
                        prizeResults["10"] = "100";
                        break;
                      }
                      if (centena === betNumber) {
                        prizeResults["10"] = centena;
                        break;
                      }
                    }
                  }
                }
                if (premioType === "1" && prizeResults["1"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de centena ${betNumber} ganhou no 1\xB0 pr\xEAmio`);
                } else if (premioType === "2" && prizeResults["2"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de centena ${betNumber} ganhou no 2\xB0 pr\xEAmio`);
                } else if (premioType === "3" && prizeResults["3"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de centena ${betNumber} ganhou no 3\xB0 pr\xEAmio`);
                } else if (premioType === "4" && prizeResults["4"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de centena ${betNumber} ganhou no 4\xB0 pr\xEAmio`);
                } else if (premioType === "5" && prizeResults["5"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de centena ${betNumber} ganhou no 5\xB0 pr\xEAmio`);
                } else if (premioType === "6" && prizeResults["6"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de centena ${betNumber} ganhou no 6\xB0 pr\xEAmio`);
                } else if (premioType === "7" && prizeResults["7"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de centena ${betNumber} ganhou no 7\xB0 pr\xEAmio`);
                } else if (premioType === "8" && prizeResults["8"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de centena ${betNumber} ganhou no 8\xB0 pr\xEAmio`);
                } else if (premioType === "9" && prizeResults["9"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de centena ${betNumber} ganhou no 9\xB0 pr\xEAmio`);
                } else if (premioType === "10" && prizeResults["10"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de centena ${betNumber} ganhou no 10\xB0 pr\xEAmio`);
                } else if (premioType === "1-5") {
                  const winners = Object.keys(prizeResults).filter((key) => prizeResults[key] === betNumber);
                  if (winners.length > 0) {
                    isWinner = true;
                    console.log(`Aposta de centena ${betNumber} ganhou nos pr\xEAmios: ${winners.join(", ")}`);
                  }
                } else if (premioType === "1-10") {
                  const winners = Object.keys(prizeResults).filter((key) => prizeResults[key] === betNumber);
                  if (winners.length > 0) {
                    isWinner = true;
                    console.log(`Aposta de centena ${betNumber} ganhou nos pr\xEAmios: ${winners.join(", ")}`);
                  }
                }
              }
              break;
            case "thousand":
              if (bet.betNumbers && bet.betNumbers.length > 0) {
                let betNumber = bet.betNumbers[0];
                if (betNumber.length > 4) {
                  console.log(`Ajustando n\xFAmero ${betNumber} para formato de milhar (4 d\xEDgitos)`);
                  betNumber = betNumber.slice(-4);
                }
                console.log(`Processando aposta de MILHAR: ${betNumber}`);
                const prizeResults = {};
                if (resultNumber1) {
                  const resultNum = resultNumber1.padStart(4, "0");
                  console.log(`Resultado 1\xB0 pr\xEAmio (Milhar completa): ${resultNum}`);
                  if (resultNum === betNumber) {
                    prizeResults["1"] = resultNum;
                    console.log(`MILHAR CORRESPONDE! Aposta ${betNumber} = resultado completo ${resultNum}`);
                  }
                }
                if (resultNumber2) {
                  const resultNum = resultNumber2.padStart(4, "0");
                  console.log(`Resultado 2\xB0 pr\xEAmio (Milhar completa): ${resultNum}`);
                  if (resultNum === betNumber) {
                    prizeResults["2"] = resultNum;
                    console.log(`MILHAR CORRESPONDE! Aposta ${betNumber} = resultado completo ${resultNum}`);
                  }
                }
                if (resultNumber3) {
                  const resultNum = resultNumber3.padStart(4, "0");
                  console.log(`Resultado 3\xB0 pr\xEAmio (Milhar completa): ${resultNum}`);
                  if (resultNum === betNumber) {
                    prizeResults["3"] = resultNum;
                    console.log(`MILHAR CORRESPONDE! Aposta ${betNumber} = resultado completo ${resultNum}`);
                  }
                }
                if (resultNumber4) {
                  const resultNum = resultNumber4.padStart(4, "0");
                  console.log(`Resultado 4\xB0 pr\xEAmio (Milhar completa): ${resultNum}`);
                  if (resultNum === betNumber) {
                    prizeResults["4"] = resultNum;
                    console.log(`MILHAR CORRESPONDE! Aposta ${betNumber} = resultado completo ${resultNum}`);
                  }
                }
                if (resultNumber5) {
                  const resultNum = resultNumber5.padStart(4, "0");
                  console.log(`Resultado 5\xB0 pr\xEAmio (Milhar completa): ${resultNum}`);
                  if (resultNum === betNumber) {
                    prizeResults["5"] = resultNum;
                    console.log(`MILHAR CORRESPONDE! Aposta ${betNumber} = resultado completo ${resultNum}`);
                  }
                }
                if (resultNumber6) {
                  const resultNum = resultNumber6.padStart(4, "0");
                  console.log(`Resultado 6\xB0 pr\xEAmio (Milhar completa): ${resultNum}`);
                  if (resultNum === betNumber) {
                    prizeResults["6"] = resultNum;
                    console.log(`MILHAR CORRESPONDE! Aposta ${betNumber} = resultado completo ${resultNum}`);
                  }
                }
                if (resultNumber7) {
                  const resultNum = resultNumber7.padStart(4, "0");
                  console.log(`Resultado 7\xB0 pr\xEAmio (Milhar completa): ${resultNum}`);
                  if (resultNum === betNumber) {
                    prizeResults["7"] = resultNum;
                    console.log(`MILHAR CORRESPONDE! Aposta ${betNumber} = resultado completo ${resultNum}`);
                  }
                }
                if (resultNumber8) {
                  const resultNum = resultNumber8.padStart(4, "0");
                  console.log(`Resultado 8\xB0 pr\xEAmio (Milhar completa): ${resultNum}`);
                  if (resultNum === betNumber) {
                    prizeResults["8"] = resultNum;
                    console.log(`MILHAR CORRESPONDE! Aposta ${betNumber} = resultado completo ${resultNum}`);
                  }
                }
                if (resultNumber9) {
                  const resultNum = resultNumber9.padStart(4, "0");
                  console.log(`Resultado 9\xB0 pr\xEAmio (Milhar completa): ${resultNum}`);
                  if (resultNum === betNumber) {
                    prizeResults["9"] = resultNum;
                    console.log(`MILHAR CORRESPONDE! Aposta ${betNumber} = resultado completo ${resultNum}`);
                  }
                }
                if (resultNumber10) {
                  const resultNum = resultNumber10.padStart(4, "0");
                  console.log(`Resultado 10\xB0 pr\xEAmio (Milhar completa): ${resultNum}`);
                  if (resultNum === betNumber) {
                    prizeResults["10"] = resultNum;
                    console.log(`MILHAR CORRESPONDE! Aposta ${betNumber} = resultado completo ${resultNum}`);
                  }
                }
                if (!resultNumber1 && resultAnimalId) {
                  const animal1 = await this.getAnimal(resultAnimalId);
                  if (animal1 && animal1.numbers) {
                    for (const numero of animal1.numbers) {
                      if (numero === betNumber) {
                        prizeResults["1"] = numero;
                        console.log(`N\xFAmero ${betNumber} encontrado no animal do 1\xB0 pr\xEAmio: ${animal1.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId2) {
                  const animal2 = await this.getAnimal(resultAnimalId2);
                  if (animal2 && animal2.numbers) {
                    for (const numero of animal2.numbers) {
                      if (numero === betNumber) {
                        prizeResults["2"] = numero;
                        console.log(`N\xFAmero ${betNumber} encontrado no animal do 2\xB0 pr\xEAmio: ${animal2.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId3) {
                  const animal3 = await this.getAnimal(resultAnimalId3);
                  if (animal3 && animal3.numbers) {
                    for (const numero of animal3.numbers) {
                      if (numero === betNumber) {
                        prizeResults["3"] = numero;
                        console.log(`N\xFAmero ${betNumber} encontrado no animal do 3\xB0 pr\xEAmio: ${animal3.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId4) {
                  const animal4 = await this.getAnimal(resultAnimalId4);
                  if (animal4 && animal4.numbers) {
                    for (const numero of animal4.numbers) {
                      if (numero === betNumber) {
                        prizeResults["4"] = numero;
                        console.log(`N\xFAmero ${betNumber} encontrado no animal do 4\xB0 pr\xEAmio: ${animal4.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId5) {
                  const animal5 = await this.getAnimal(resultAnimalId5);
                  if (animal5 && animal5.numbers) {
                    for (const numero of animal5.numbers) {
                      if (numero === betNumber) {
                        prizeResults["5"] = numero;
                        console.log(`N\xFAmero ${betNumber} encontrado no animal do 5\xB0 pr\xEAmio: ${animal5.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId6) {
                  const animal = await this.getAnimal(resultAnimalId6);
                  if (animal && animal.numbers) {
                    for (const numero of animal.numbers) {
                      if (numero === betNumber) {
                        prizeResults["6"] = numero;
                        console.log(`N\xFAmero ${betNumber} encontrado no animal do 6\xB0 pr\xEAmio: ${animal.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId7) {
                  const animal = await this.getAnimal(resultAnimalId7);
                  if (animal && animal.numbers) {
                    for (const numero of animal.numbers) {
                      if (numero === betNumber) {
                        prizeResults["7"] = numero;
                        console.log(`N\xFAmero ${betNumber} encontrado no animal do 7\xB0 pr\xEAmio: ${animal.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId8) {
                  const animal = await this.getAnimal(resultAnimalId8);
                  if (animal && animal.numbers) {
                    for (const numero of animal.numbers) {
                      if (numero === betNumber) {
                        prizeResults["8"] = numero;
                        console.log(`N\xFAmero ${betNumber} encontrado no animal do 8\xB0 pr\xEAmio: ${animal.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId9) {
                  const animal = await this.getAnimal(resultAnimalId9);
                  if (animal && animal.numbers) {
                    for (const numero of animal.numbers) {
                      if (numero === betNumber) {
                        prizeResults["9"] = numero;
                        console.log(`N\xFAmero ${betNumber} encontrado no animal do 9\xB0 pr\xEAmio: ${animal.name}`);
                        break;
                      }
                    }
                  }
                }
                if (resultAnimalId10) {
                  const animal = await this.getAnimal(resultAnimalId10);
                  if (animal && animal.numbers) {
                    for (const numero of animal.numbers) {
                      if (numero === betNumber) {
                        prizeResults["10"] = numero;
                        console.log(`N\xFAmero ${betNumber} encontrado no animal do 10\xB0 pr\xEAmio: ${animal.name}`);
                        break;
                      }
                    }
                  }
                }
                if (premioType === "1" && prizeResults["1"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de milhar ${betNumber} ganhou no 1\xB0 pr\xEAmio`);
                } else if (premioType === "2" && prizeResults["2"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de milhar ${betNumber} ganhou no 2\xB0 pr\xEAmio`);
                } else if (premioType === "3" && prizeResults["3"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de milhar ${betNumber} ganhou no 3\xB0 pr\xEAmio`);
                } else if (premioType === "4" && prizeResults["4"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de milhar ${betNumber} ganhou no 4\xB0 pr\xEAmio`);
                } else if (premioType === "5" && prizeResults["5"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de milhar ${betNumber} ganhou no 5\xB0 pr\xEAmio`);
                } else if (premioType === "6" && prizeResults["6"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de milhar ${betNumber} ganhou no 6\xB0 pr\xEAmio`);
                } else if (premioType === "7" && prizeResults["7"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de milhar ${betNumber} ganhou no 7\xB0 pr\xEAmio`);
                } else if (premioType === "8" && prizeResults["8"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de milhar ${betNumber} ganhou no 8\xB0 pr\xEAmio`);
                } else if (premioType === "9" && prizeResults["9"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de milhar ${betNumber} ganhou no 9\xB0 pr\xEAmio`);
                } else if (premioType === "10" && prizeResults["10"] === betNumber) {
                  isWinner = true;
                  console.log(`Aposta de milhar ${betNumber} ganhou no 10\xB0 pr\xEAmio`);
                } else if (premioType === "1-5") {
                  const winners = Object.keys(prizeResults).filter((key) => prizeResults[key] === betNumber);
                  if (winners.length > 0) {
                    isWinner = true;
                    console.log(`Aposta de milhar ${betNumber} ganhou nos pr\xEAmios: ${winners.join(", ")}`);
                  }
                } else if (premioType === "1-10") {
                  const winners = Object.keys(prizeResults).filter((key) => prizeResults[key] === betNumber);
                  if (winners.length > 0) {
                    isWinner = true;
                    console.log(`Aposta de milhar ${betNumber} ganhou nos pr\xEAmios: ${winners.join(", ")}`);
                  }
                }
              }
              break;
            default:
              console.log(`Tipo de aposta n\xE3o reconhecido: ${bet.type}`);
              break;
          }
          if (isWinner) {
            let winAmount;
            if (gameMode && bet.potentialWinAmount) {
              winAmount = Math.floor(bet.potentialWinAmount * appliedMultiplier);
              console.log(`Vencedor usando game mode: ${gameMode.name}, valor base: ${bet.potentialWinAmount}, multiplicador: ${appliedMultiplier}, win amount: ${winAmount}`);
            } else {
              const baseMultiplier = gameMode ? gameMode.odds / 100 : 20;
              winAmount = Math.floor(bet.amount * baseMultiplier * appliedMultiplier);
              console.log(`Vencedor usando c\xE1lculo direto: valor: ${bet.amount}, multiplicador base: ${baseMultiplier}, multiplicador de pr\xEAmio: ${appliedMultiplier}, win amount: ${winAmount}`);
            }
            console.log(`Atualizando aposta ID ${bet.id} para status "won" com pr\xEAmio ${winAmount}`);
            await this.updateBetStatus(bet.id, "won", winAmount);
            console.log(`Atualizando saldo do usu\xE1rio ID ${bet.userId} com +${winAmount}`);
            await this.updateUserBalance(bet.userId, winAmount);
            console.log(`Aposta ID: ${bet.id} processada como vencedora`);
          } else {
            console.log(`Atualizando aposta ID ${bet.id} para status "lost" (perdedora)`);
            await this.updateBetStatus(bet.id, "lost");
            console.log(`Aposta ID: ${bet.id} processada como perdedora`);
          }
        }
        console.log(`Todas as apostas processadas para o sorteio ID: ${drawId}`);
        return draw;
      }
      async updateDraw(drawId, drawData) {
        try {
          console.log(`Updating draw ID ${drawId} with data:`, drawData);
          const drawExists = await this.getDraw(drawId);
          if (!drawExists) {
            console.log(`Draw ID ${drawId} not found`);
            return void 0;
          }
          if (drawExists.status === "completed") {
            console.log(`Updating a completed draw ID ${drawId} - proceeding anyway`);
          }
          let dateToUse = drawExists.date;
          if (drawData.date) {
            try {
              const dateStr = drawData.date;
              if (typeof dateStr === "string") {
                if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                  const dateParts = dateStr.split("-");
                  const year = parseInt(dateParts[0]);
                  const month = parseInt(dateParts[1]) - 1;
                  const day = parseInt(dateParts[2]);
                  const existingDate = new Date(drawExists.date);
                  const hours = existingDate.getHours();
                  const minutes = existingDate.getMinutes();
                  dateToUse = new Date(year, month, day, hours, minutes);
                  console.log("Converted date from string:", dateToUse);
                } else {
                  dateToUse = new Date(drawData.date);
                }
              } else if (drawData.date instanceof Date) {
                dateToUse = drawData.date;
              }
            } catch (e) {
              console.error("Error parsing date:", e);
              throw new Error("Formato de data inv\xE1lido");
            }
          }
          const updatedDraws = await db.update(draws).set({
            name: drawData.name || drawExists.name,
            time: drawData.time || drawExists.time,
            date: dateToUse
          }).where(eq(draws.id, drawId)).returning();
          if (updatedDraws.length === 0) {
            return void 0;
          }
          console.log(`Draw ID ${drawId} updated successfully`);
          return updatedDraws[0];
        } catch (err) {
          console.error(`Error updating draw ID ${drawId}:`, err);
          throw err;
        }
      }
      async deleteDraw(drawId) {
        try {
          console.log(`Attempting to delete draw ID ${drawId}`);
          const drawExists = await this.getDraw(drawId);
          if (!drawExists) {
            console.log(`Draw ID ${drawId} not found`);
            throw new Error("Sorteio n\xE3o encontrado");
          }
          if (drawExists.status === "completed") {
            console.log(`Cannot delete completed draw ID ${drawId}`);
            throw new Error("N\xE3o \xE9 poss\xEDvel excluir sorteios j\xE1 conclu\xEDdos");
          }
          const bets2 = await this.getBetsByDrawId(drawId);
          if (bets2.length > 0) {
            console.log(`Cannot delete draw ID ${drawId} because it has ${bets2.length} associated bets`);
            throw new Error("N\xE3o \xE9 poss\xEDvel excluir sorteios que possuem apostas associadas");
          }
          await db.delete(draws).where(eq(draws.id, drawId));
          console.log(`Draw ID ${drawId} deleted successfully`);
        } catch (err) {
          console.error(`Error deleting draw ID ${drawId}:`, err);
          throw err;
        }
      }
      async getAllDraws() {
        return await db.select().from(draws);
      }
      // Stats
      async getPopularAnimals() {
        const result = await db.select({
          animalId: bets.animalId,
          count: sql`count(*)::int`
        }).from(bets).where(sql`animal_id IS NOT NULL`).groupBy(bets.animalId).orderBy(desc(sql`count(*)`));
        const filteredResult = result.filter((item) => item.animalId !== null).map((item) => ({
          animalId: item.animalId,
          // Forçar tipo como number após filtrar nulos
          count: Number(item.count)
        }));
        return filteredResult;
      }
      // Game Mode Management
      async getGameMode(id) {
        const [gameMode] = await db.select().from(gameModes).where(eq(gameModes.id, id));
        return gameMode;
      }
      async getGameModeByName(name) {
        const [gameMode] = await db.select().from(gameModes).where(eq(gameModes.name, name));
        return gameMode;
      }
      async getAllGameModes() {
        return await db.select().from(gameModes).orderBy(asc(gameModes.name));
      }
      async createGameMode(gameMode) {
        const [newGameMode] = await db.insert(gameModes).values({
          ...gameMode,
          createdAt: /* @__PURE__ */ new Date()
        }).returning();
        return newGameMode;
      }
      async updateGameMode(id, gameModeData) {
        const { id: modeId, createdAt, ...allowedFields } = gameModeData;
        const [gameMode] = await db.update(gameModes).set(allowedFields).where(eq(gameModes.id, id)).returning();
        return gameMode;
      }
      async deleteGameMode(id) {
        await db.delete(gameModes).where(eq(gameModes.id, id));
      }
      // System Settings Management
      async getSystemSettings() {
        try {
          const result = await pool.query(`
        SELECT * FROM system_settings ORDER BY id DESC LIMIT 1
      `);
          if (result.rows.length === 0) {
            return null;
          }
          const row = result.rows[0];
          const availableFields = Object.keys(row);
          console.log("Available fields in system settings:", availableFields);
          const logData = {
            allowUserRegistration: row.allow_user_registration,
            allowDeposits: row.allow_deposits,
            allowWithdrawals: row.allow_withdrawals,
            maintenanceMode: row.maintenance_mode,
            allowWithdrawalsType: typeof row.allow_withdrawals
          };
          if ("auto_approve_withdrawals" in row) {
            logData.autoApproveWithdrawals = row.auto_approve_withdrawals;
          }
          if ("auto_approve_withdrawal_limit" in row) {
            logData.autoApproveWithdrawalLimit = row.auto_approve_withdrawal_limit;
          }
          console.log("System settings from database:", logData);
          const settings = {
            // Valores padrão
            maxBetAmount: 1e3,
            maxPayout: 1e4,
            minBetAmount: 50,
            // 0.50 reais (50 centavos)
            defaultBetAmount: 200,
            // 2.00 reais
            mainColor: "#035faf",
            secondaryColor: "#b0d525",
            accentColor: "#b0d524",
            allowUserRegistration: true,
            allowDeposits: true,
            allowWithdrawals: true,
            maintenanceMode: false,
            autoApproveWithdrawals: true,
            autoApproveWithdrawalLimit: 30,
            siteName: "Jogo do Bicho",
            siteDescription: "A melhor plataforma de apostas online",
            logoUrl: "/img/logo.png",
            faviconUrl: "/img/favicon.png"
          };
          if ("max_bet_amount" in row) settings.maxBetAmount = row.max_bet_amount;
          if ("max_payout" in row) settings.maxPayout = row.max_payout;
          if ("min_bet_amount" in row) settings.minBetAmount = row.min_bet_amount;
          if ("default_bet_amount" in row) settings.defaultBetAmount = row.default_bet_amount;
          if ("main_color" in row) settings.mainColor = row.main_color;
          if ("secondary_color" in row) settings.secondaryColor = row.secondary_color;
          if ("accent_color" in row) settings.accentColor = row.accent_color;
          if ("allow_user_registration" in row) settings.allowUserRegistration = Boolean(row.allow_user_registration);
          if ("allow_deposits" in row) settings.allowDeposits = Boolean(row.allow_deposits);
          if ("allow_withdrawals" in row) settings.allowWithdrawals = Boolean(row.allow_withdrawals);
          if ("maintenance_mode" in row) settings.maintenanceMode = Boolean(row.maintenance_mode);
          if ("auto_approve_withdrawals" in row) {
            settings.autoApproveWithdrawals = Boolean(row.auto_approve_withdrawals);
          }
          if ("auto_approve_withdrawal_limit" in row) {
            settings.autoApproveWithdrawalLimit = parseFloat(row.auto_approve_withdrawal_limit) || 0;
          }
          if ("site_name" in row) settings.siteName = row.site_name;
          if ("site_description" in row) settings.siteDescription = row.site_description;
          if ("logo_url" in row) settings.logoUrl = row.logo_url;
          if ("favicon_url" in row) settings.faviconUrl = row.favicon_url;
          if ("signup_bonus_enabled" in row) settings.signupBonusEnabled = Boolean(row.signup_bonus_enabled);
          if ("signup_bonus_amount" in row) settings.signupBonusAmount = parseFloat(row.signup_bonus_amount) || 0;
          if ("signup_bonus_rollover" in row) settings.signupBonusRollover = parseFloat(row.signup_bonus_rollover) || 1;
          if ("signup_bonus_expiration" in row) settings.signupBonusExpiration = parseInt(row.signup_bonus_expiration) || 7;
          if ("first_deposit_bonus_enabled" in row) settings.firstDepositBonusEnabled = Boolean(row.first_deposit_bonus_enabled);
          if ("first_deposit_bonus_amount" in row) settings.firstDepositBonusAmount = parseFloat(row.first_deposit_bonus_amount) || 0;
          if ("first_deposit_bonus_percentage" in row) settings.firstDepositBonusPercentage = parseFloat(row.first_deposit_bonus_percentage) || 0;
          if ("first_deposit_bonus_max_amount" in row) settings.firstDepositBonusMaxAmount = parseFloat(row.first_deposit_bonus_max_amount) || 0;
          if ("first_deposit_bonus_rollover" in row) settings.firstDepositBonusRollover = parseFloat(row.first_deposit_bonus_rollover) || 1;
          if ("first_deposit_bonus_expiration" in row) settings.firstDepositBonusExpiration = parseInt(row.first_deposit_bonus_expiration) || 7;
          if ("promotional_banners_enabled" in row) settings.promotionalBannersEnabled = Boolean(row.promotional_banners_enabled);
          if ("allow_bonus_bets" in row) settings.allowBonusBets = Boolean(row.allow_bonus_bets);
          console.log("System settings after boolean conversion:", {
            allowUserRegistration: settings.allowUserRegistration,
            allowDeposits: settings.allowDeposits,
            allowWithdrawals: settings.allowWithdrawals,
            maintenanceMode: settings.maintenanceMode,
            allowBonusBets: settings.allowBonusBets
          });
          return settings;
        } catch (error) {
          console.error("Error getting system settings:", error);
          return null;
        }
      }
      async saveSystemSettings(settings) {
        try {
          console.log("Saving system settings:", settings);
          const currentSettings = await this.getSystemSettings();
          const defaultValues = {
            maxBetAmount: 1e4,
            maxPayout: 1e6,
            minBetAmount: 5,
            defaultBetAmount: 20,
            mainColor: "#4f46e5",
            secondaryColor: "#6366f1",
            accentColor: "#f97316",
            allowUserRegistration: true,
            allowDeposits: true,
            allowWithdrawals: true,
            maintenanceMode: false,
            autoApproveWithdrawals: true,
            autoApproveWithdrawalLimit: 30,
            // Valor padrão para permitir apostas com bônus
            allowBonusBets: true,
            // Valores padrão para configurações de bônus
            signupBonusEnabled: false,
            signupBonusAmount: 10,
            signupBonusRollover: 3,
            signupBonusExpiration: 7,
            firstDepositBonusEnabled: false,
            firstDepositBonusAmount: 100,
            firstDepositBonusPercentage: 100,
            firstDepositBonusMaxAmount: 200,
            firstDepositBonusRollover: 3,
            firstDepositBonusExpiration: 7,
            promotionalBannersEnabled: true,
            siteName: "Jogo do Bicho",
            siteDescription: "A melhor plataforma de apostas online",
            logoUrl: "/img/logo.png",
            faviconUrl: "/img/favicon.png",
            allowBonusBets: true
            // Permitir apostas com saldo de bônus
          };
          const baseSettings = currentSettings || defaultValues;
          const settingsWithDefaults = {
            ...baseSettings,
            ...settings,
            // Garantir que valores obrigatórios nunca sejam undefined/null
            maxBetAmount: settings.maxBetAmount !== void 0 ? settings.maxBetAmount : baseSettings.maxBetAmount,
            maxPayout: settings.maxPayout !== void 0 ? settings.maxPayout : baseSettings.maxPayout,
            minBetAmount: settings.minBetAmount !== void 0 ? settings.minBetAmount : baseSettings.minBetAmount,
            defaultBetAmount: settings.defaultBetAmount !== void 0 ? settings.defaultBetAmount : baseSettings.defaultBetAmount,
            mainColor: settings.mainColor || baseSettings.mainColor,
            secondaryColor: settings.secondaryColor || baseSettings.secondaryColor,
            accentColor: settings.accentColor || baseSettings.accentColor,
            // Garantir que campos de bônus de cadastro estejam presentes
            signupBonusEnabled: settings.signupBonusEnabled !== void 0 ? settings.signupBonusEnabled : baseSettings.signupBonusEnabled,
            signupBonusAmount: settings.signupBonusAmount !== void 0 ? settings.signupBonusAmount : baseSettings.signupBonusAmount,
            signupBonusRollover: settings.signupBonusRollover !== void 0 ? settings.signupBonusRollover : baseSettings.signupBonusRollover,
            signupBonusExpiration: settings.signupBonusExpiration !== void 0 ? settings.signupBonusExpiration : baseSettings.signupBonusExpiration,
            // Garantir que campos de bônus de primeiro depósito estejam presentes
            firstDepositBonusEnabled: settings.firstDepositBonusEnabled !== void 0 ? settings.firstDepositBonusEnabled : baseSettings.firstDepositBonusEnabled,
            firstDepositBonusAmount: settings.firstDepositBonusAmount !== void 0 ? settings.firstDepositBonusAmount : baseSettings.firstDepositBonusAmount,
            firstDepositBonusPercentage: settings.firstDepositBonusPercentage !== void 0 ? settings.firstDepositBonusPercentage : baseSettings.firstDepositBonusPercentage,
            firstDepositBonusMaxAmount: settings.firstDepositBonusMaxAmount !== void 0 ? settings.firstDepositBonusMaxAmount : baseSettings.firstDepositBonusMaxAmount,
            firstDepositBonusRollover: settings.firstDepositBonusRollover !== void 0 ? settings.firstDepositBonusRollover : baseSettings.firstDepositBonusRollover,
            firstDepositBonusExpiration: settings.firstDepositBonusExpiration !== void 0 ? settings.firstDepositBonusExpiration : baseSettings.firstDepositBonusExpiration,
            // Outros campos
            promotionalBannersEnabled: settings.promotionalBannersEnabled !== void 0 ? settings.promotionalBannersEnabled : baseSettings.promotionalBannersEnabled,
            // Configuração para permitir apostas com bônus
            allowBonusBets: settings.allowBonusBets !== void 0 ? settings.allowBonusBets : baseSettings.allowBonusBets
          };
          const booleanSettings = {
            ...settingsWithDefaults,
            allowUserRegistration: Boolean(settingsWithDefaults.allowUserRegistration),
            allowDeposits: Boolean(settingsWithDefaults.allowDeposits),
            allowWithdrawals: Boolean(settingsWithDefaults.allowWithdrawals),
            maintenanceMode: Boolean(settingsWithDefaults.maintenanceMode),
            autoApproveWithdrawals: Boolean(settingsWithDefaults.autoApproveWithdrawals),
            autoApproveWithdrawalLimit: Number(settingsWithDefaults.autoApproveWithdrawalLimit) || 0,
            signupBonusEnabled: Boolean(settingsWithDefaults.signupBonusEnabled),
            firstDepositBonusEnabled: Boolean(settingsWithDefaults.firstDepositBonusEnabled),
            promotionalBannersEnabled: Boolean(settingsWithDefaults.promotionalBannersEnabled),
            allowBonusBets: Boolean(settingsWithDefaults.allowBonusBets)
          };
          console.log("Normalized boolean settings:", {
            allowUserRegistration: booleanSettings.allowUserRegistration,
            allowDeposits: booleanSettings.allowDeposits,
            signupBonusEnabled: booleanSettings.signupBonusEnabled,
            firstDepositBonusEnabled: booleanSettings.firstDepositBonusEnabled,
            allowWithdrawals: booleanSettings.allowWithdrawals,
            maintenanceMode: booleanSettings.maintenanceMode,
            autoApproveWithdrawals: booleanSettings.autoApproveWithdrawals,
            autoApproveWithdrawalLimit: booleanSettings.autoApproveWithdrawalLimit,
            allowBonusBets: booleanSettings.allowBonusBets
          });
          const tableInfoQuery = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'system_settings'
      `);
          const existingColumns = tableInfoQuery.rows.map((row2) => row2.column_name);
          console.log("Existing columns in system_settings table:", existingColumns);
          const columns = [];
          const placeholders = [];
          let values = [];
          let paramIndex = 1;
          const addColumn = (dbColumn, settingsKey, value) => {
            if (existingColumns.includes(dbColumn)) {
              columns.push(dbColumn);
              placeholders.push(`$${paramIndex++}`);
              values.push(value);
            } else {
              console.log(`Column '${dbColumn}' does not exist in the database schema, skipping.`);
            }
          };
          addColumn("max_bet_amount", "maxBetAmount", booleanSettings.maxBetAmount);
          addColumn("max_payout", "maxPayout", booleanSettings.maxPayout);
          addColumn("min_bet_amount", "minBetAmount", booleanSettings.minBetAmount || 50);
          addColumn("default_bet_amount", "defaultBetAmount", booleanSettings.defaultBetAmount || 200);
          addColumn("main_color", "mainColor", booleanSettings.mainColor);
          addColumn("secondary_color", "secondaryColor", booleanSettings.secondaryColor);
          addColumn("accent_color", "accentColor", booleanSettings.accentColor);
          addColumn("allow_user_registration", "allowUserRegistration", booleanSettings.allowUserRegistration);
          addColumn("allow_deposits", "allowDeposits", booleanSettings.allowDeposits);
          addColumn("allow_withdrawals", "allowWithdrawals", booleanSettings.allowWithdrawals);
          addColumn("maintenance_mode", "maintenanceMode", booleanSettings.maintenanceMode);
          addColumn("auto_approve_withdrawals", "autoApproveWithdrawals", booleanSettings.autoApproveWithdrawals);
          addColumn("auto_approve_withdrawal_limit", "autoApproveWithdrawalLimit", booleanSettings.autoApproveWithdrawalLimit);
          addColumn("allow_bonus_bets", "allowBonusBets", booleanSettings.allowBonusBets === true);
          addColumn("site_name", "siteName", booleanSettings.siteName || "Jogo do Bicho");
          addColumn("site_description", "siteDescription", booleanSettings.siteDescription || "A melhor plataforma de apostas online");
          addColumn("logo_url", "logoUrl", booleanSettings.logoUrl || "/img/logo.png");
          addColumn("favicon_url", "faviconUrl", booleanSettings.faviconUrl || "/img/favicon.png");
          addColumn("signup_bonus_enabled", "signupBonusEnabled", settings.signupBonusEnabled === true);
          addColumn("signup_bonus_amount", "signupBonusAmount", settings.signupBonusAmount !== void 0 ? Number(settings.signupBonusAmount) : 10);
          addColumn("signup_bonus_rollover", "signupBonusRollover", settings.signupBonusRollover !== void 0 ? Number(settings.signupBonusRollover) : 3);
          addColumn("signup_bonus_expiration", "signupBonusExpiration", settings.signupBonusExpiration !== void 0 ? Number(settings.signupBonusExpiration) : 7);
          addColumn("first_deposit_bonus_enabled", "firstDepositBonusEnabled", settings.firstDepositBonusEnabled === true);
          addColumn("first_deposit_bonus_amount", "firstDepositBonusAmount", settings.firstDepositBonusAmount !== void 0 ? Number(settings.firstDepositBonusAmount) : 100);
          addColumn("first_deposit_bonus_percentage", "firstDepositBonusPercentage", settings.firstDepositBonusPercentage !== void 0 ? Number(settings.firstDepositBonusPercentage) : 100);
          addColumn("first_deposit_bonus_max_amount", "firstDepositBonusMaxAmount", settings.firstDepositBonusMaxAmount !== void 0 ? Number(settings.firstDepositBonusMaxAmount) : 200);
          addColumn("first_deposit_bonus_rollover", "firstDepositBonusRollover", settings.firstDepositBonusRollover !== void 0 ? Number(settings.firstDepositBonusRollover) : 3);
          addColumn("first_deposit_bonus_expiration", "firstDepositBonusExpiration", settings.firstDepositBonusExpiration !== void 0 ? Number(settings.firstDepositBonusExpiration) : 7);
          addColumn("promotional_banners_enabled", "promotionalBannersEnabled", settings.promotionalBannersEnabled === true);
          addColumn("signup_bonus_banner_enabled", "signupBonusBannerEnabled", settings.signupBonusBannerEnabled === true);
          addColumn("first_deposit_bonus_banner_enabled", "firstDepositBonusBannerEnabled", settings.firstDepositBonusBannerEnabled === true);
          addColumn("updated_at", "updatedAt", /* @__PURE__ */ new Date());
          const checkExistingSettings = await pool.query(`
        SELECT COUNT(*) FROM system_settings
      `);
          let query = "";
          if (checkExistingSettings.rows[0].count > 0) {
            const filteredColumns = columns.filter((col) => col !== "updated_at");
            const setClause = filteredColumns.map((col, idx) => `${col} = $${idx + 1}`).join(", ");
            const filteredValues = values.filter((_, idx) => columns[idx] !== "updated_at");
            query = `
          UPDATE system_settings 
          SET ${setClause}, updated_at = NOW()
          WHERE id = (SELECT MAX(id) FROM system_settings)
          RETURNING *
        `;
            values = filteredValues;
          } else {
            query = `
          INSERT INTO system_settings (${columns.join(", ")})
          VALUES (${placeholders.join(", ")})
          RETURNING *
        `;
          }
          console.log("Executing dynamic query:", query);
          console.log("With values:", values);
          const result = await pool.query(query, values);
          const row = result.rows[0];
          console.log("Saved settings in database:", {
            allowUserRegistration: row.allow_user_registration,
            allowDeposits: row.allow_deposits,
            allowWithdrawals: row.allow_withdrawals,
            maintenanceMode: row.maintenance_mode,
            autoApproveWithdrawals: row.auto_approve_withdrawals,
            autoApproveWithdrawalLimit: row.auto_approve_withdrawal_limit,
            // Campos de bônus
            signupBonusEnabled: row.signup_bonus_enabled,
            firstDepositBonusEnabled: row.first_deposit_bonus_enabled
          });
          const returnSettings = {
            maxBetAmount: row.max_bet_amount,
            maxPayout: row.max_payout,
            minBetAmount: row.min_bet_amount || 50,
            defaultBetAmount: row.default_bet_amount || 200,
            mainColor: row.main_color,
            secondaryColor: row.secondary_color,
            accentColor: row.accent_color,
            allowUserRegistration: row.allow_user_registration,
            allowDeposits: row.allow_deposits,
            allowWithdrawals: row.allow_withdrawals,
            maintenanceMode: row.maintenance_mode,
            // Valores padrão para campos que podem não existir
            autoApproveWithdrawals: row.auto_approve_withdrawals !== void 0 ? Boolean(row.auto_approve_withdrawals) : true,
            autoApproveWithdrawalLimit: row.auto_approve_withdrawal_limit !== void 0 ? parseFloat(row.auto_approve_withdrawal_limit) || 0 : 30,
            // Campos para site branding
            siteName: row.site_name || "Jogo do Bicho",
            siteDescription: row.site_description || "A melhor plataforma de apostas online",
            logoUrl: row.logo_url || "/img/logo.png",
            faviconUrl: row.favicon_url || "/img/favicon.png",
            // Campos para bônus de cadastro
            signupBonusEnabled: row.signup_bonus_enabled !== void 0 ? Boolean(row.signup_bonus_enabled) : false,
            signupBonusAmount: row.signup_bonus_amount !== void 0 ? Number(row.signup_bonus_amount) : 10,
            signupBonusRollover: row.signup_bonus_rollover !== void 0 ? Number(row.signup_bonus_rollover) : 3,
            signupBonusExpiration: row.signup_bonus_expiration !== void 0 ? Number(row.signup_bonus_expiration) : 7,
            // Campos para bônus de primeiro depósito
            firstDepositBonusEnabled: row.first_deposit_bonus_enabled !== void 0 ? Boolean(row.first_deposit_bonus_enabled) : false,
            firstDepositBonusAmount: row.first_deposit_bonus_amount !== void 0 ? Number(row.first_deposit_bonus_amount) : 100,
            firstDepositBonusPercentage: row.first_deposit_bonus_percentage !== void 0 ? Number(row.first_deposit_bonus_percentage) : 100,
            firstDepositBonusMaxAmount: row.first_deposit_bonus_max_amount !== void 0 ? Number(row.first_deposit_bonus_max_amount) : 200,
            firstDepositBonusRollover: row.first_deposit_bonus_rollover !== void 0 ? Number(row.first_deposit_bonus_rollover) : 3,
            firstDepositBonusExpiration: row.first_deposit_bonus_expiration !== void 0 ? Number(row.first_deposit_bonus_expiration) : 7,
            // Banners promocionais
            promotionalBannersEnabled: row.promotional_banners_enabled !== void 0 ? Boolean(row.promotional_banners_enabled) : false,
            signupBonusBannerEnabled: row.signup_bonus_banner_enabled !== void 0 ? Boolean(row.signup_bonus_banner_enabled) : false,
            firstDepositBonusBannerEnabled: row.first_deposit_bonus_banner_enabled !== void 0 ? Boolean(row.first_deposit_bonus_banner_enabled) : false
          };
          return returnSettings;
        } catch (error) {
          console.error("Error saving system settings:", error);
          throw error;
        }
      }
      // Implementação dos métodos para gateway de pagamento
      async getAllPaymentGateways() {
        try {
          const result = await db.select().from(paymentGateways);
          return result;
        } catch (error) {
          console.error("Error getting all payment gateways:", error);
          return [];
        }
      }
      async getPaymentGateway(id) {
        try {
          const [gateway] = await db.select().from(paymentGateways).where(eq(paymentGateways.id, id));
          return gateway;
        } catch (error) {
          console.error(`Error getting payment gateway with ID ${id}:`, error);
          return void 0;
        }
      }
      async getPaymentGatewayByType(type) {
        try {
          const [gateway] = await db.select().from(paymentGateways).where(eq(paymentGateways.type, type));
          return gateway;
        } catch (error) {
          console.error(`Error getting payment gateway with type ${type}:`, error);
          return void 0;
        }
      }
      async createPaymentGateway(gateway) {
        try {
          const [createdGateway] = await db.insert(paymentGateways).values({
            ...gateway,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          return createdGateway;
        } catch (error) {
          console.error("Error creating payment gateway:", error);
          throw error;
        }
      }
      async updatePaymentGateway(id, gatewayData) {
        try {
          const [updatedGateway] = await db.update(paymentGateways).set({
            ...gatewayData,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(paymentGateways.id, id)).returning();
          return updatedGateway;
        } catch (error) {
          console.error(`Error updating payment gateway with ID ${id}:`, error);
          return void 0;
        }
      }
      async deletePaymentGateway(id) {
        try {
          await db.delete(paymentGateways).where(eq(paymentGateways.id, id));
        } catch (error) {
          console.error(`Error deleting payment gateway with ID ${id}:`, error);
          throw error;
        }
      }
      // Implementação dos métodos para transações de pagamento
      async createPaymentTransaction(transaction) {
        try {
          const [createdTransaction] = await db.insert(paymentTransactions).values({
            ...transaction,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          return createdTransaction;
        } catch (error) {
          console.error("Error creating payment transaction:", error);
          throw error;
        }
      }
      async getPaymentTransaction(id) {
        try {
          const [transaction] = await db.select().from(paymentTransactions).where(eq(paymentTransactions.id, id));
          return transaction;
        } catch (error) {
          console.error(`Error getting payment transaction with ID ${id}:`, error);
          return void 0;
        }
      }
      /**
       * Recupera as transações de pagamento de um usuário com múltiplas camadas de segurança
       * para garantir isolamento total de dados entre usuários
       */
      async getUserTransactions(userId) {
        try {
          if (!userId || userId <= 0) {
            console.error(`SEGURAN\xC7A: Tentativa de acesso a transa\xE7\xF5es com ID de usu\xE1rio inv\xE1lido (${userId})`);
            return [];
          }
          const userExists = await this.getUser(userId);
          if (!userExists) {
            console.error(`SEGURAN\xC7A: Tentativa de buscar transa\xE7\xF5es para usu\xE1rio inexistente ID=${userId}`);
            return [];
          }
          console.log(`Buscando transa\xE7\xF5es para usu\xE1rio ID: ${userId}`);
          const transactions2 = await db.select().from(paymentTransactions).where(eq(paymentTransactions.userId, userId)).orderBy(desc(paymentTransactions.createdAt));
          console.log(`Query retornou ${transactions2.length} transa\xE7\xF5es para usu\xE1rio ID: ${userId} diretamente do banco`);
          const verifiedTransactions = transactions2.filter((transaction) => {
            const isOwner = transaction.userId === userId;
            if (!isOwner) {
              console.error(`VIOLA\xC7\xC3O DE DADOS: Transa\xE7\xE3o ID=${transaction.id} pertence ao usu\xE1rio ${transaction.userId} mas foi retornada na consulta do usu\xE1rio ${userId}`);
            }
            return isOwner;
          });
          if (verifiedTransactions.length !== transactions2.length) {
            console.error(`ALERTA DE SEGURAN\xC7A CR\xCDTICO: Consulta de transa\xE7\xF5es para usu\xE1rio ${userId} retornou ${transactions2.length - verifiedTransactions.length} transa\xE7\xF5es de outros usu\xE1rios!`);
            const problematicTransactions = transactions2.filter((tx) => tx.userId !== userId);
            console.error(`DETALHES DE VIOLA\xC7\xC3O: ${JSON.stringify(problematicTransactions.map((tx) => ({
              id: tx.id,
              wrongUserId: tx.userId,
              amount: tx.amount,
              status: tx.status,
              // Remova a referência a tx.type que não existe no tipo PaymentTransaction
              createdAt: tx.createdAt
            })))}`);
            console.error(`ALERTA DE SEGURAN\xC7A: Potencial comprometimento de seguran\xE7a detectado ao acessar dados do usu\xE1rio ${userId}`);
          } else {
            console.log(`SEGURAN\xC7A OK: Todas as ${verifiedTransactions.length} transa\xE7\xF5es pertencem exclusivamente ao usu\xE1rio ${userId}`);
          }
          const sanitizedTransactions = verifiedTransactions.map((transaction) => {
            if (transaction.userId !== userId) {
              console.error(`ERRO DE CONSIST\xCANCIA: Transa\xE7\xE3o ${transaction.id} apresentou inconsist\xEAncia de userId ap\xF3s filtro`);
              return null;
            }
            if (transaction.gatewayResponse) {
              if (typeof transaction.gatewayResponse === "string") {
                try {
                  const responseObj = JSON.parse(transaction.gatewayResponse);
                  const {
                    apiKey,
                    token,
                    secret,
                    password,
                    auth,
                    webhook_url,
                    customer_info,
                    customer_data,
                    payer_details,
                    account_info,
                    ...safeData
                  } = responseObj;
                  transaction.gatewayResponse = JSON.stringify(safeData);
                } catch (e) {
                  const responseString = transaction.gatewayResponse;
                  transaction.gatewayResponse = `Resposta original sanitizada (${responseString.length} caracteres)`;
                }
              } else {
                transaction.gatewayResponse = "Dados sanitizados por motivos de seguran\xE7a";
              }
            }
            return transaction;
          }).filter((tx) => tx !== null);
          console.log(`RESPOSTA: Retornando ${sanitizedTransactions.length} transa\xE7\xF5es sanitizadas para usu\xE1rio ${userId}`);
          return sanitizedTransactions;
        } catch (error) {
          console.error(`ERRO CR\xCDTICO: Falha ao buscar transa\xE7\xF5es para usu\xE1rio ${userId}:`, error);
          return [];
        }
      }
      async updateTransactionStatus(id, status, externalId, externalUrl, response) {
        try {
          const updateData = {
            status,
            updatedAt: /* @__PURE__ */ new Date()
          };
          if (externalId) updateData.externalId = externalId;
          if (externalUrl) updateData.externalUrl = externalUrl;
          if (response) updateData.gatewayResponse = response;
          const [updatedTransaction] = await db.update(paymentTransactions).set(updateData).where(eq(paymentTransactions.id, id)).returning();
          return updatedTransaction;
        } catch (error) {
          console.error(`Error updating transaction status with ID ${id}:`, error);
          return void 0;
        }
      }
      // Implementação dos métodos para gerenciamento de saques
      async createWithdrawal(withdrawal) {
        try {
          console.log(`Criando solicita\xE7\xE3o de saque para usu\xE1rio ${withdrawal.userId} no valor de R$ ${withdrawal.amount}`);
          if (withdrawal.amount <= 0) {
            throw new Error("Valor de saque deve ser positivo");
          }
          const user = await this.getUser(withdrawal.userId);
          if (!user) {
            throw new Error("Usu\xE1rio n\xE3o encontrado");
          }
          if (user.balance < withdrawal.amount) {
            throw new Error(`Saldo insuficiente para saque. Saldo atual: R$ ${user.balance.toFixed(2)}`);
          }
          const settings = await this.getSystemSettings();
          if (settings && !settings.allowWithdrawals) {
            throw new Error("Saques est\xE3o temporariamente desativados");
          }
          const [createdWithdrawal] = await db.insert(withdrawals).values({
            userId: withdrawal.userId,
            amount: withdrawal.amount,
            pixKey: withdrawal.pixKey,
            pixKeyType: withdrawal.pixKeyType,
            status: "pending",
            requestedAt: /* @__PURE__ */ new Date()
          }).returning();
          if (settings && settings.autoApproveWithdrawals && withdrawal.amount <= settings.autoApproveWithdrawalLimit) {
            console.log(`Saque ID=${createdWithdrawal.id} de R$ ${withdrawal.amount} ser\xE1 processado automaticamente (abaixo do limite de R$ ${settings.autoApproveWithdrawalLimit})`);
            await this.updateWithdrawalStatus(createdWithdrawal.id, "processing", null, null, "Em processamento via gateway de pagamento PIX");
            const [updatedWithdrawal] = await db.select().from(withdrawals).where(eq(withdrawals.id, createdWithdrawal.id));
            try {
              const gateway = await this.getPaymentGatewayByType("pushinpay");
              if (gateway && gateway.isActive) {
                const paymentTx = await this.createPaymentTransaction({
                  userId: withdrawal.userId,
                  gatewayId: gateway.id,
                  amount: withdrawal.amount,
                  type: "withdrawal",
                  status: "pending",
                  description: `Saque PIX (${withdrawal.pixKeyType}: ${withdrawal.pixKey})`,
                  metadata: {
                    withdrawalId: createdWithdrawal.id
                  }
                });
                console.log(`Registro de transa\xE7\xE3o PIX ${paymentTx.id} criado para saque ${createdWithdrawal.id}`);
                await db.update(withdrawals).set({
                  notes: `Em processamento via gateway ${gateway.name}. ID da transa\xE7\xE3o: ${paymentTx.id}`
                }).where(eq(withdrawals.id, createdWithdrawal.id));
              } else {
                console.warn(`Nenhum gateway de pagamento PIX ativo encontrado para processar saque ${createdWithdrawal.id}`);
              }
            } catch (err) {
              console.error(`Erro ao registrar transa\xE7\xE3o de saque no gateway: ${err}`);
            }
            return updatedWithdrawal;
          } else {
            console.log(`Saque ID=${createdWithdrawal.id} de R$ ${withdrawal.amount} aguardando aprova\xE7\xE3o manual do administrador`);
          }
          return createdWithdrawal;
        } catch (error) {
          console.error("Erro ao criar solicita\xE7\xE3o de saque:", error);
          throw error;
        }
      }
      async getWithdrawal(id) {
        try {
          const withdrawalResult = await db.execute(
            `SELECT w.id, w.user_id as "userId", w.amount, w.status, w.pix_key as "pixKey", 
                w.pix_key_type as "pixKeyType", w.requested_at as "requestedAt", 
                w.processed_at as "processedAt", w.processed_by as "processedBy", 
                w.rejection_reason as "rejectionReason", w.notes,
                u.username, u.email as "userEmail"
         FROM withdrawals w
         LEFT JOIN users u ON w.user_id = u.id
         WHERE w.id = $1`,
            [id]
          );
          if (!withdrawalResult || withdrawalResult.length === 0) {
            return void 0;
          }
          const withdrawal = withdrawalResult[0];
          let adminUsername;
          if (withdrawal.processedBy) {
            const adminQuery = await db.select({ username: users.username }).from(users).where(eq(users.id, withdrawal.processedBy));
            if (adminQuery && adminQuery.length > 0) {
              adminUsername = adminQuery[0].username;
            }
          }
          return {
            ...withdrawal,
            adminUsername
          };
        } catch (error) {
          console.error(`Erro ao buscar saque ID=${id}:`, error);
          return void 0;
        }
      }
      async getUserWithdrawals(userId) {
        try {
          if (!userId || userId <= 0) {
            console.error(`Tentativa de acessar saques com ID de usu\xE1rio inv\xE1lido: ${userId}`);
            return [];
          }
          const withdrawalQuery = await db.execute(
            `SELECT id, user_id, amount, status, pix_key, pix_key_type, 
                requested_at, processed_at, processed_by, rejection_reason, notes 
         FROM withdrawals 
         WHERE user_id = $1 
         ORDER BY requested_at DESC`,
            [userId]
          );
          const result = await Promise.all(withdrawalQuery.map(async (withdrawal) => {
            let adminUsername;
            if (withdrawal.processedBy) {
              const adminQuery = await db.select({ username: users.username }).from(users).where(eq(users.id, withdrawal.processedBy));
              if (adminQuery && adminQuery.length > 0) {
                adminUsername = adminQuery[0].username;
              }
            }
            return {
              ...withdrawal,
              adminUsername
            };
          }));
          return result;
        } catch (error) {
          console.error(`Erro ao buscar saques do usu\xE1rio ${userId}:`, error);
          return [];
        }
      }
      async getAllWithdrawals(status) {
        try {
          let sqlQuery = `
        SELECT w.id, w.user_id as "userId", w.amount, w.status, w.pix_key as "pixKey", 
               w.pix_key_type as "pixKeyType", w.requested_at as "requestedAt", 
               w.processed_at as "processedAt", w.processed_by as "processedBy", 
               w.rejection_reason as "rejectionReason", w.notes,
               u.username, u.email as "userEmail"
        FROM withdrawals w
        LEFT JOIN users u ON w.user_id = u.id
        ${status ? "WHERE w.status = $1" : ""}
        ORDER BY w.requested_at DESC
      `;
          const withdrawalResult = await db.execute(sqlQuery, status ? [status] : []);
          const result = await Promise.all(withdrawalResult.map(async (withdrawal) => {
            let adminUsername;
            if (withdrawal.processedBy) {
              const adminQuery = await db.select({ username: users.username }).from(users).where(eq(users.id, withdrawal.processedBy));
              if (adminQuery && adminQuery.length > 0) {
                adminUsername = adminQuery[0].username;
              }
            }
            return {
              ...withdrawal,
              adminUsername
            };
          }));
          return result;
        } catch (error) {
          console.error("Erro ao buscar todos os saques:", error);
          return [];
        }
      }
      async updateWithdrawalStatus(id, status, processedBy, rejectionReason, notes) {
        try {
          const withdrawal = await this.getWithdrawal(id);
          if (!withdrawal) {
            throw new Error(`Saque ID=${id} n\xE3o encontrado`);
          }
          if (withdrawal.status === "approved" || withdrawal.status === "rejected") {
            throw new Error(`Saque j\xE1 foi ${withdrawal.status === "approved" ? "aprovado" : "rejeitado"} e n\xE3o pode ser modificado`);
          }
          const updateData = {
            status,
            processedAt: /* @__PURE__ */ new Date()
          };
          if (processedBy) updateData.processedBy = processedBy;
          if (rejectionReason) updateData.rejectionReason = rejectionReason;
          if (notes) updateData.notes = notes;
          const [updatedWithdrawal] = await db.update(withdrawals).set(updateData).where(eq(withdrawals.id, id)).returning();
          if (!updatedWithdrawal) {
            throw new Error(`Falha ao atualizar saque ID=${id}`);
          }
          if (status === "approved") {
            console.log(`Saque ID=${id} aprovado, atualizando saldo do usu\xE1rio ${withdrawal.userId}`);
            await this.updateUserBalance(withdrawal.userId, -withdrawal.amount);
            await this.createTransaction({
              userId: withdrawal.userId,
              type: "withdrawal",
              amount: withdrawal.amount,
              description: `Saque aprovado por admin${processedBy ? ` (ID=${processedBy})` : ""}`,
              relatedId: id
            });
          }
          return await this.getWithdrawal(id);
        } catch (error) {
          console.error(`Erro ao atualizar status do saque ID=${id}:`, error);
          throw error;
        }
      }
      // Implementação dos métodos para histórico de transações financeiras
      async createTransaction(transaction) {
        try {
          const [createdTransaction] = await db.insert(transactions).values({
            userId: transaction.userId,
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description || null,
            relatedId: transaction.relatedId || null,
            createdAt: /* @__PURE__ */ new Date()
          }).returning();
          return createdTransaction;
        } catch (error) {
          console.error("Erro ao criar registro de transa\xE7\xE3o:", error);
          throw error;
        }
      }
      async getUserTransactionHistory(userId) {
        try {
          if (!userId || userId <= 0) {
            console.error(`Tentativa de acessar hist\xF3rico de transa\xE7\xF5es com ID de usu\xE1rio inv\xE1lido: ${userId}`);
            return [];
          }
          const result = await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
          return result;
        } catch (error) {
          console.error(`Erro ao buscar hist\xF3rico de transa\xE7\xF5es do usu\xE1rio ${userId}:`, error);
          return [];
        }
      }
      async getAllTransactions(type, startDate, endDate) {
        try {
          let query = db.select({
            transaction: transactions,
            username: users.username
          }).from(transactions).innerJoin(users, eq(transactions.userId, users.id));
          if (type) {
            query = query.where(eq(transactions.type, type));
          }
          if (startDate) {
            query = query.where(
              sql`${transactions.createdAt} >= ${startDate}`
            );
          }
          if (endDate) {
            query = query.where(
              sql`${transactions.createdAt} <= ${endDate}`
            );
          }
          query = query.orderBy(desc(transactions.createdAt));
          const result = await query;
          return result.map((row) => ({
            ...row.transaction,
            username: row.username
          }));
        } catch (error) {
          console.error("Erro ao buscar todas as transa\xE7\xF5es:", error);
          return [];
        }
      }
      // Métodos para gerenciamento de bônus
      async createUserBonus(bonusData) {
        try {
          console.log(`[CRIA\xC7\xC3O DE B\xD4NUS] Iniciando cria\xE7\xE3o de b\xF4nus para usu\xE1rio ${bonusData.userId}, tipo: ${bonusData.type}`);
          if (!bonusData.userId || bonusData.amount <= 0 || !bonusData.type) {
            console.error(`[CRIA\xC7\xC3O DE B\xD4NUS] ERRO: dados inv\xE1lidos para b\xF4nus`, bonusData);
            throw new Error("Dados do b\xF4nus inv\xE1lidos");
          }
          let expiresAt = bonusData.expiresAt;
          if (!expiresAt && bonusData.type === "signup") {
            const settings = await this.getSystemSettings();
            if (settings?.signupBonusExpiration) {
              const expireDays = settings.signupBonusExpiration;
              expiresAt = /* @__PURE__ */ new Date();
              expiresAt.setDate(expiresAt.getDate() + expireDays);
              console.log(`[CRIA\xC7\xC3O DE B\xD4NUS] Configurando expira\xE7\xE3o para b\xF4nus de cadastro: ${expireDays} dias (at\xE9 ${expiresAt})`);
            }
          }
          if (!expiresAt && bonusData.type === "first_deposit") {
            const settings = await this.getSystemSettings();
            if (settings?.firstDepositBonusExpiration) {
              const expireDays = settings.firstDepositBonusExpiration;
              expiresAt = /* @__PURE__ */ new Date();
              expiresAt.setDate(expiresAt.getDate() + expireDays);
              console.log(`[CRIA\xC7\xC3O DE B\xD4NUS] Configurando expira\xE7\xE3o para b\xF4nus de primeiro dep\xF3sito: ${expireDays} dias (at\xE9 ${expiresAt})`);
            }
          }
          console.log(`[CRIA\xC7\xC3O DE B\xD4NUS] Detalhes do b\xF4nus a ser criado:`);
          console.log(`- Usu\xE1rio: ${bonusData.userId}`);
          console.log(`- Tipo: ${bonusData.type}`);
          console.log(`- Valor: R$${bonusData.amount}`);
          console.log(`- Valor dispon\xEDvel: R$${bonusData.remainingAmount || bonusData.amount}`);
          console.log(`- Rollover necess\xE1rio: R$${bonusData.rolloverAmount}`);
          console.log(`- Status: active`);
          console.log(`- Validade: ${expiresAt || "Sem data de expira\xE7\xE3o"}`);
          const [userBonus] = await db.insert(userBonuses).values({
            userId: bonusData.userId,
            type: bonusData.type,
            amount: bonusData.amount,
            remainingAmount: bonusData.remainingAmount || bonusData.amount,
            rolloverAmount: bonusData.rolloverAmount,
            rolledAmount: 0,
            status: "active",
            expiresAt: expiresAt || void 0,
            relatedTransactionId: bonusData.relatedTransactionId,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          console.log(`[CRIA\xC7\xC3O DE B\xD4NUS] B\xF4nus criado com sucesso! ID: ${userBonus.id}`);
          if (userBonus.type !== bonusData.type) {
            console.error(`[CRIA\xC7\xC3O DE B\xD4NUS] ERRO: O tipo do b\xF4nus criado (${userBonus.type}) difere do solicitado (${bonusData.type})`);
          }
          const bonusTypeText = bonusData.type === "signup" ? "cadastro" : bonusData.type === "first_deposit" ? "primeiro dep\xF3sito" : bonusData.type;
          const transaction = await this.createTransaction({
            userId: bonusData.userId,
            type: "deposit",
            amount: bonusData.amount,
            description: `B\xF4nus de ${bonusTypeText}`,
            relatedId: userBonus.id
          });
          console.log(`[CRIA\xC7\xC3O DE B\xD4NUS] Transa\xE7\xE3o criada para o b\xF4nus. ID da transa\xE7\xE3o: ${transaction.id}`);
          const currentBonusBalance = await this.getUserBonusBalance(bonusData.userId);
          console.log(`[CRIA\xC7\xC3O DE B\xD4NUS] Saldo total de b\xF4nus do usu\xE1rio ap\xF3s a cria\xE7\xE3o: R$${currentBonusBalance}`);
          console.log(`[CRIA\xC7\xC3O DE B\xD4NUS] Opera\xE7\xE3o finalizada com sucesso!`);
          return userBonus;
        } catch (error) {
          console.error(`[ERRO NA CRIA\xC7\xC3O DE B\xD4NUS] Erro ao criar b\xF4nus para usu\xE1rio ${bonusData.userId}:`, error);
          console.error(error.stack);
          throw error;
        }
      }
      async getUserBonuses(userId) {
        try {
          console.log(`[B\xD4NUS] Consultando lista de b\xF4nus para usu\xE1rio ${userId}`);
          const bonuses = await db.select().from(userBonuses).where(eq(userBonuses.userId, userId)).orderBy(desc(userBonuses.createdAt));
          console.log(`[B\xD4NUS] Encontrados ${bonuses.length} b\xF4nus para o usu\xE1rio ${userId}`);
          bonuses.forEach((bonus, index) => {
            console.log(`[B\xD4NUS #${index + 1}] ID: ${bonus.id}, Tipo: ${bonus.type}, Valor: ${bonus.amount}, Restante: ${bonus.remainingAmount}, Status: ${bonus.status}, Criado em: ${bonus.createdAt}`);
          });
          return bonuses;
        } catch (error) {
          console.error(`[ERRO B\xD4NUS] Erro ao buscar b\xF4nus do usu\xE1rio ${userId}:`, error);
          console.error(error.stack);
          return [];
        }
      }
      async getUserBonusBalance(userId) {
        try {
          console.log(`[CONSULTA DE SALDO] Verificando saldo de b\xF4nus para usu\xE1rio ${userId}`);
          console.log(`[CONSULTA DE SALDO] Tabela: ${userBonuses.name}, Busca por usu\xE1rio ${userId} e status "active"`);
          const bonuses = await db.select().from(userBonuses).where(and(
            eq(userBonuses.userId, userId),
            eq(userBonuses.status, "active")
          ));
          console.log(`[CONSULTA DE SALDO] Encontrados ${bonuses.length} b\xF4nus ativos para o usu\xE1rio ${userId}`);
          bonuses.forEach((bonus, index) => {
            console.log(`[CONSULTA DE SALDO] B\xF4nus #${index + 1}: ID=${bonus.id}, Tipo=${bonus.type}, Valor Inicial=${bonus.amount}, Dispon\xEDvel=${bonus.remainingAmount}`);
          });
          const totalBonus = bonuses.reduce((total, bonus) => {
            const amountToAdd = bonus.remainingAmount || 0;
            console.log(`[CONSULTA DE SALDO] Adicionando ${amountToAdd} ao total (atual: ${total})`);
            return total + amountToAdd;
          }, 0);
          const formattedTotal = parseFloat(totalBonus.toFixed(2));
          console.log(`[CONSULTA DE SALDO] Resultado final para usu\xE1rio ${userId}: ${formattedTotal}`);
          return formattedTotal;
        } catch (error) {
          console.error(`[ERRO DE SALDO] Erro ao calcular saldo de b\xF4nus do usu\xE1rio ${userId}:`, error);
          console.error(`[ERRO DE SALDO] Stack trace:`, error.stack);
          return 0;
        }
      }
      async getUserActiveBonus(userId) {
        try {
          const [activeBonus] = await db.select().from(userBonuses).where(and(
            eq(userBonuses.userId, userId),
            eq(userBonuses.status, "active")
          )).orderBy(desc(userBonuses.createdAt)).limit(1);
          return activeBonus;
        } catch (error) {
          console.error(`Erro ao buscar b\xF4nus ativo do usu\xE1rio ${userId}:`, error);
          return void 0;
        }
      }
      async deductFromBonusBalance(userId, amount) {
        console.log(`Debitando ${amount} do saldo de b\xF4nus do usu\xE1rio ${userId}`);
        try {
          const activeBonuses = await db.select().from(userBonuses).where(and(
            eq(userBonuses.userId, userId),
            eq(userBonuses.status, "active")
          )).orderBy(asc(userBonuses.expiresAt));
          if (activeBonuses.length === 0) {
            throw new Error(`Usu\xE1rio ${userId} n\xE3o possui b\xF4nus ativos`);
          }
          let remainingAmount = amount;
          const bonusesUsed = [];
          for (const bonus of activeBonuses) {
            if (remainingAmount <= 0) break;
            const bonusRemaining = parseFloat(bonus.remainingAmount.toString());
            if (bonusRemaining <= 0) continue;
            const amountToUse = Math.min(bonusRemaining, remainingAmount);
            const newRemainingAmount = bonusRemaining - amountToUse;
            await db.update(userBonuses).set({
              remainingAmount: newRemainingAmount
            }).where(eq(userBonuses.id, bonus.id));
            if (newRemainingAmount <= 0) {
              await this.completeBonus(bonus.id);
            }
            bonusesUsed.push({
              id: bonus.id,
              amountUsed: amountToUse
            });
            remainingAmount -= amountToUse;
          }
          if (remainingAmount > 0.01) {
            throw new Error(`N\xE3o foi poss\xEDvel debitar o valor total. Valor restante: ${remainingAmount}`);
          }
          return bonusesUsed;
        } catch (error) {
          console.error(`Erro ao debitar saldo de b\xF4nus do usu\xE1rio ${userId}:`, error);
          throw error;
        }
      }
      async updateUserBonusProgress(bonusId, betAmount) {
        try {
          const [bonus] = await db.select().from(userBonuses).where(eq(userBonuses.id, bonusId));
          if (!bonus || bonus.status !== "active") {
            return void 0;
          }
          const newRolledAmount = bonus.rolledAmount + betAmount;
          let status = bonus.status;
          let completedAt = bonus.completedAt;
          if (newRolledAmount >= bonus.rolloverAmount) {
            status = "completed";
            completedAt = /* @__PURE__ */ new Date();
            await this.updateUserBalance(bonus.userId, bonus.remainingAmount);
            await this.createTransaction({
              userId: bonus.userId,
              type: "deposit",
              amount: bonus.remainingAmount,
              description: `Libera\xE7\xE3o de b\xF4nus ap\xF3s cumprir rollover`,
              relatedId: bonus.id
            });
          }
          const [updatedBonus] = await db.update(userBonuses).set({
            rolledAmount: newRolledAmount,
            status,
            completedAt,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(userBonuses.id, bonusId)).returning();
          return updatedBonus;
        } catch (error) {
          console.error(`Erro ao atualizar progresso do b\xF4nus ${bonusId}:`, error);
          return void 0;
        }
      }
      async expireUserBonuses() {
        try {
          const now = /* @__PURE__ */ new Date();
          const expiredBonuses = await db.select().from(userBonuses).where(and(
            eq(userBonuses.status, "active"),
            sql`${userBonuses.expiresAt} < ${now}`
          ));
          if (expiredBonuses.length === 0) {
            return 0;
          }
          const result = await db.update(userBonuses).set({
            status: "expired",
            updatedAt: now
          }).where(and(
            eq(userBonuses.status, "active"),
            sql`${userBonuses.expiresAt} < ${now}`
          ));
          return expiredBonuses.length;
        } catch (error) {
          console.error("Erro ao expirar b\xF4nus vencidos:", error);
          return 0;
        }
      }
      // Métodos para gerenciamento de banners promocionais
      async createPromotionalBanner(bannerData) {
        try {
          const [banner] = await db.insert(promotionalBanners).values({
            ...bannerData,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          return banner;
        } catch (error) {
          console.error("Erro ao criar banner promocional:", error);
          throw error;
        }
      }
      async getPromotionalBanners(enabledOnly = false) {
        try {
          let query = db.select().from(promotionalBanners);
          if (enabledOnly) {
            const now = /* @__PURE__ */ new Date();
            query = query.where(and(
              eq(promotionalBanners.enabled, true),
              or(
                sql`${promotionalBanners.startDate} IS NULL`,
                sql`${promotionalBanners.startDate} <= ${now}`
              ),
              or(
                sql`${promotionalBanners.endDate} IS NULL`,
                sql`${promotionalBanners.endDate} >= ${now}`
              )
            ));
          }
          return await query.orderBy(desc(promotionalBanners.createdAt));
        } catch (error) {
          console.error("Erro ao buscar banners promocionais:", error);
          return [];
        }
      }
      async getLoginBanners() {
        try {
          const now = /* @__PURE__ */ new Date();
          const banners = await db.select().from(promotionalBanners).where(and(
            eq(promotionalBanners.enabled, true),
            eq(promotionalBanners.showOnLogin, true),
            or(
              sql`${promotionalBanners.startDate} IS NULL`,
              sql`${promotionalBanners.startDate} <= ${now}`
            ),
            or(
              sql`${promotionalBanners.endDate} IS NULL`,
              sql`${promotionalBanners.endDate} >= ${now}`
            )
          )).orderBy(desc(promotionalBanners.createdAt));
          return banners;
        } catch (error) {
          console.error("Erro ao buscar banners de login:", error);
          return [];
        }
      }
      async updatePromotionalBanner(id, data) {
        try {
          const [updatedBanner] = await db.update(promotionalBanners).set({
            ...data,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(promotionalBanners.id, id)).returning();
          return updatedBanner;
        } catch (error) {
          console.error(`Erro ao atualizar banner promocional ${id}:`, error);
          return void 0;
        }
      }
      async deletePromotionalBanner(id) {
        try {
          await db.delete(promotionalBanners).where(eq(promotionalBanners.id, id));
          return true;
        } catch (error) {
          console.error(`Erro ao excluir banner promocional ${id}:`, error);
          return false;
        }
      }
      // Verifica se o usuário já recebeu bônus de primeiro depósito
      async hasUserReceivedFirstDepositBonus(userId) {
        try {
          console.log(`[VERIFICA\xC7\xC3O DE B\xD4NUS] Verificando se usu\xE1rio ${userId} j\xE1 recebeu b\xF4nus de primeiro dep\xF3sito`);
          console.log(`[VERIFICA\xC7\xC3O DE B\xD4NUS] Consultando tabela ${userBonuses.name} com filtros: userId=${userId}, type="first_deposit"`);
          const bonuses = await db.select().from(userBonuses).where(and(
            eq(userBonuses.userId, userId),
            eq(userBonuses.type, "first_deposit")
          ));
          const hasBonusRecords = bonuses.length > 0;
          console.log(`[VERIFICA\xC7\xC3O DE B\xD4NUS] Resultado da consulta direta: ${bonuses.length} b\xF4nus encontrados`);
          if (hasBonusRecords) {
            console.log(`[VERIFICA\xC7\xC3O DE B\xD4NUS] Usu\xE1rio ${userId} J\xC1 recebeu b\xF4nus de primeiro dep\xF3sito anteriormente (encontrado na tabela userBonuses).`);
            bonuses.forEach((bonus, index) => {
              console.log(`[VERIFICA\xC7\xC3O DE B\xD4NUS] B\xF4nus #${index + 1}: ID=${bonus.id}, Criado em=${bonus.createdAt}, Status=${bonus.status}, Valor=${bonus.amount}`);
            });
            return true;
          }
          console.log(`[VERIFICA\xC7\xC3O DE B\xD4NUS] Verificando se usu\xE1rio ${userId} possui dep\xF3sitos completos anteriores`);
          const deposits = await db.select().from(paymentTransactions).where(and(
            eq(paymentTransactions.userId, userId),
            eq(paymentTransactions.type, "deposit"),
            eq(paymentTransactions.status, "completed")
          ));
          const hasMultipleDeposits = deposits.length > 1;
          if (hasMultipleDeposits) {
            console.log(`[VERIFICA\xC7\xC3O DE B\xD4NUS] Usu\xE1rio ${userId} J\xC1 possui ${deposits.length} dep\xF3sitos completos, portanto n\xE3o eleg\xEDvel para b\xF4nus de primeiro dep\xF3sito.`);
            deposits.forEach((deposit, index) => {
              console.log(`[VERIFICA\xC7\xC3O DE B\xD4NUS] Dep\xF3sito #${index + 1}: ID=${deposit.id}, Valor=${deposit.amount}, Data=${deposit.createdAt}`);
            });
            return true;
          }
          console.log(`[VERIFICA\xC7\xC3O DE B\xD4NUS] Usu\xE1rio ${userId} NUNCA recebeu b\xF4nus de primeiro dep\xF3sito e este \xE9 seu primeiro dep\xF3sito.`);
          return false;
        } catch (error) {
          console.error(`[ERRO DE VERIFICA\xC7\xC3O] Erro ao verificar se usu\xE1rio ${userId} j\xE1 recebeu b\xF4nus de primeiro dep\xF3sito:`, error);
          console.error(error.stack);
          return false;
        }
      }
      // Implementação para verificar se usuário já recebeu bônus de cadastro
      async hasUserReceivedSignupBonus(userId) {
        try {
          const [bonus] = await db.select().from(userBonuses).where(and(
            eq(userBonuses.userId, userId),
            eq(userBonuses.type, "signup")
          )).limit(1);
          return !!bonus;
        } catch (error) {
          console.error(`Erro ao verificar se usu\xE1rio ${userId} j\xE1 recebeu b\xF4nus de cadastro:`, error);
          return false;
        }
      }
      async getTransactionsSummary(startDate, endDate) {
        try {
          let dateCondition = "";
          const params = [];
          if (startDate) {
            dateCondition += " AND created_at >= $" + (params.length + 1);
            params.push(startDate);
          }
          if (endDate) {
            dateCondition += " AND created_at <= $" + (params.length + 1);
            params.push(endDate);
          }
          const depositsQuery = await pool.query(`
        SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
        FROM transactions
        WHERE type = 'deposit'${dateCondition}
      `, params);
          const withdrawalsQuery = await pool.query(`
        SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
        FROM transactions
        WHERE type = 'withdrawal'${dateCondition}
      `, params);
          const betsQuery = await pool.query(`
        SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
        FROM transactions
        WHERE type = 'bet'${dateCondition}
      `, params);
          const winsQuery = await pool.query(`
        SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
        FROM transactions
        WHERE type = 'win'${dateCondition}
      `, params);
          return {
            deposits: {
              count: parseInt(depositsQuery.rows[0].count),
              total: parseFloat(depositsQuery.rows[0].total)
            },
            withdrawals: {
              count: parseInt(withdrawalsQuery.rows[0].count),
              total: parseFloat(withdrawalsQuery.rows[0].total)
            },
            bets: {
              count: parseInt(betsQuery.rows[0].count),
              total: parseFloat(betsQuery.rows[0].total)
            },
            wins: {
              count: parseInt(winsQuery.rows[0].count),
              total: parseFloat(winsQuery.rows[0].total)
            }
          };
        } catch (error) {
          console.error("Erro ao gerar resumo de transa\xE7\xF5es:", error);
          return {
            deposits: { count: 0, total: 0 },
            withdrawals: { count: 0, total: 0 },
            bets: { count: 0, total: 0 },
            wins: { count: 0, total: 0 }
          };
        }
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/services/draw-scheduler.ts
var draw_scheduler_exports = {};
__export(draw_scheduler_exports, {
  DrawScheduler: () => DrawScheduler,
  drawScheduler: () => drawScheduler
});
import cron from "node-cron";
var DrawScheduler, drawScheduler;
var init_draw_scheduler = __esm({
  "server/services/draw-scheduler.ts"() {
    "use strict";
    init_storage();
    init_logger();
    DrawScheduler = class _DrawScheduler {
      static instance;
      constructor() {
        cron.schedule("0 0 * * *", () => {
          logger_default.info("\u23F0 Executando agendador de sorteios di\xE1rio (Meia-noite)...");
          this.generateDailyDraws();
          const tomorrow = /* @__PURE__ */ new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          this.generateDailyDraws(tomorrow);
        });
        cron.schedule("0 * * * *", () => {
          logger_default.info("\u23F0 Verifica\xE7\xE3o hor\xE1ria de sorteios...");
          this.generateDailyDraws();
        });
      }
      static getInstance() {
        if (!_DrawScheduler.instance) {
          _DrawScheduler.instance = new _DrawScheduler();
        }
        return _DrawScheduler.instance;
      }
      async generateDailyDraws(targetDate = /* @__PURE__ */ new Date()) {
        try {
          const dateStr = targetDate.toLocaleDateString("pt-BR");
          logger_default.info(`\u{1F504} Verificando sorteios para ${dateStr}...`);
          const templates = await storage.getDrawTemplates();
          const activeTemplates = templates.filter((t) => t.active);
          if (activeTemplates.length === 0) {
            logger_default.info("\u2139\uFE0F Nenhum template de sorteio ativo encontrado.");
            return;
          }
          const dayOfWeek = targetDate.getDay();
          const todaysTemplates = activeTemplates.filter((t) => t.daysOfWeek.includes(dayOfWeek));
          logger_default.info(`\u{1F4C5} Encontrados ${todaysTemplates.length} templates para ${dateStr} (Dia da semana: ${dayOfWeek}).`);
          const allDraws = await storage.getAllDraws();
          for (const template of todaysTemplates) {
            const [hours, minutes] = template.time.split(":").map(Number);
            const drawDate = new Date(targetDate);
            drawDate.setHours(hours, minutes, 0, 0);
            const existingDraw = allDraws.find((d) => {
              const dDate = new Date(d.date);
              return d.name === template.name && dDate.getDate() === drawDate.getDate() && dDate.getMonth() === drawDate.getMonth() && dDate.getFullYear() === drawDate.getFullYear();
            });
            if (!existingDraw) {
              logger_default.info(`\u2795 Criando sorteio autom\xE1tico: ${template.name} \xE0s ${template.time} para ${dateStr}`);
              await storage.createDraw({
                name: template.name,
                time: template.time,
                date: drawDate
              });
            } else {
            }
          }
          logger_default.info(`\u2705 Verifica\xE7\xE3o de sorteios para ${dateStr} conclu\xEDda.`);
        } catch (error) {
          logger_default.error("\u274C Erro ao gerar sorteios di\xE1rios:", error);
        }
      }
      // Método para inicializar (pode ser chamado no startup do server)
      init() {
        logger_default.info("\u{1F680} Servi\xE7o de agendamento de sorteios inicializado.");
        this.generateDailyDraws();
        const tomorrow = /* @__PURE__ */ new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.generateDailyDraws(tomorrow);
      }
    };
    drawScheduler = DrawScheduler.getInstance();
  }
});

// server/services/result-scraper.ts
import * as cheerio from "cheerio";
var ResultScraper, resultScraper;
var init_result_scraper = __esm({
  "server/services/result-scraper.ts"() {
    "use strict";
    ResultScraper = class {
      baseUrl = "https://www.resultadofacil.com.br";
      async fetchResult(drawName, drawDate) {
        try {
          if (!drawDate) {
            console.error(`[ResultScraper] \u274C Data do sorteio \xE9 obrigat\xF3ria!`);
            return null;
          }
          const drawInfo = this.parseDrawName(drawName);
          if (!drawInfo) {
            console.error(`[ResultScraper] \u274C N\xE3o foi poss\xEDvel extrair informa\xE7\xF5es do nome: ${drawName}`);
            return null;
          }
          const url = this.buildUrl(drawInfo.state);
          console.log(`[ResultScraper] \u{1F310} Buscando em: ${url}`);
          const response = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
          });
          if (!response.ok) {
            console.error(`[ResultScraper] \u274C Erro HTTP ${response.status}`);
            return null;
          }
          const html = await response.text();
          return this.parseResult(html, drawName, drawInfo.time, drawDate);
        } catch (error) {
          console.error(`[ResultScraper] \u274C Erro:`, error);
          return null;
        }
      }
      parseDrawName(name) {
        const stateMatch = name.match(/\b([A-Z]{2})\b/);
        if (!stateMatch) return null;
        const timeMatch = name.match(/(\d{1,2}):(\d{2})/);
        if (!timeMatch) return null;
        const time = `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;
        const periodMatch = name.match(/\((manhã|tarde|noite|tarde II)\)/i);
        const period = periodMatch ? periodMatch[1].toLowerCase() : "tarde";
        return { state: stateMatch[1], time, period };
      }
      buildUrl(state) {
        return `${this.baseUrl}/resultado-do-jogo-do-bicho/${state.toUpperCase()}`;
      }
      formatDate(date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
      /**
       * Busca pelo H3 que contém o horário e palavras-chave do nome
       * E VALIDA A DATA
       */
      parseResult(html, drawName, targetTime, drawDate) {
        try {
          const $ = cheerio.load(html);
          console.log(`[ResultScraper] \u{1F50D} Procurando: "${drawName}" (${targetTime})`);
          console.log(`[ResultScraper] \u{1F4C5} Data esperada: ${this.formatDate(drawDate)}`);
          const today = /* @__PURE__ */ new Date();
          today.setHours(0, 0, 0, 0);
          const drawDateOnly = new Date(drawDate);
          drawDateOnly.setHours(0, 0, 0, 0);
          const isToday = drawDateOnly.getTime() === today.getTime();
          console.log(`[ResultScraper] \u{1F4C5} Extra\xE7\xE3o \xE9 de hoje? ${isToday ? "SIM" : "N\xC3O"}`);
          let selectedTable = null;
          let selectedTitle = "";
          let bestScore = 0;
          $("h3").each((i, elem) => {
            const $h3 = $(elem);
            const h3Text = $h3.text().trim();
            if (!h3Text.includes(targetTime)) {
              return;
            }
            const $nextP = $h3.next("p");
            const pText = $nextP.text().trim();
            console.log(`[ResultScraper] \u{1F4DD} H3: "${h3Text.substring(0, 50)}..."`);
            console.log(`[ResultScraper]    P: "${pText.substring(0, 50)}..."`);
            const hasDeHoje = pText.includes("de hoje");
            if (isToday && !hasDeHoje) {
              console.log(`[ResultScraper]    \u274C Ignorado: extra\xE7\xE3o \xE9 de HOJE mas resultado n\xE3o tem "de hoje"`);
              return;
            }
            if (!isToday && hasDeHoje) {
              console.log(`[ResultScraper]    \u274C Ignorado: extra\xE7\xE3o \xE9 de OUTRA DATA mas resultado tem "de hoje"`);
              return;
            }
            const score = this.calculateMatchScore(h3Text, drawName);
            console.log(`[ResultScraper]    \u2705 Score: ${score.toFixed(2)} (data v\xE1lida)`);
            if (score > bestScore) {
              const $parent = $h3.parent();
              const $table = $parent.find("table").first();
              if ($table.length > 0) {
                bestScore = score;
                selectedTable = $table;
                selectedTitle = h3Text;
              }
            }
          });
          if (!selectedTable) {
            console.error(`[ResultScraper] \u274C Nenhuma tabela encontrada com data v\xE1lida`);
            return null;
          }
          console.log(`[ResultScraper] \u2705 Selecionado (score: ${bestScore.toFixed(2)}): "${selectedTitle}"`);
          const prizes = this.extractPrizesFromTable(selectedTable, $);
          if (prizes.length === 0) {
            console.error(`[ResultScraper] \u274C Nenhum pr\xEAmio encontrado`);
            return null;
          }
          console.log(`[ResultScraper] \u2705 ${prizes.length} pr\xEAmios: 1\xBA=${prizes[0].number} (${prizes[0].animal})`);
          return {
            drawName,
            drawTime: targetTime,
            date: drawDate,
            prizes
          };
        } catch (error) {
          console.error(`[ResultScraper] \u274C Erro no parsing:`, error);
          return null;
        }
      }
      calculateMatchScore(siteTitle, drawName) {
        const normalizedSite = this.normalizeText(siteTitle);
        const normalizedDraw = this.normalizeText(drawName);
        const keywords = this.extractKeywords(normalizedDraw);
        let matchCount = 0;
        for (const keyword of keywords) {
          if (normalizedSite.includes(keyword)) {
            matchCount++;
          }
        }
        return keywords.length > 0 ? matchCount / keywords.length : 0;
      }
      normalizeText(text2) {
        return text2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
      }
      extractKeywords(normalizedName) {
        const stopwords = ["jogo", "do", "bicho", "de", "da", "o", "a", "e", "resultado"];
        const words = normalizedName.split(/\s+/);
        const keywords = [];
        for (const word of words) {
          if (stopwords.includes(word) || word.length < 2) continue;
          keywords.push(word);
        }
        return keywords;
      }
      extractPrizesFromTable($table, $) {
        const prizes = [];
        const rows = $table.find("tr");
        console.log(`[ResultScraper] \u{1F4CA} Analisando tabela...`);
        rows.each((rowIndex, row) => {
          const $row = $(row);
          const cells = $row.find("td");
          if (cells.length < 3) return;
          const col0 = $(cells[0]).text().trim();
          const col1 = $(cells[1]).text().trim();
          const col2 = $(cells[2]).text().trim();
          const col3 = cells.length > 3 ? $(cells[3]).text().trim() : "";
          const posMatch = col0.match(/^(\d+)[ºª°]?$/);
          if (!posMatch) return;
          const position = parseInt(posMatch[1], 10);
          if (position < 1 || position > 10) return;
          const milharCleaned = col1.replace(/\D/g, "");
          if (!milharCleaned || milharCleaned.length < 2) return;
          const milhar = milharCleaned.slice(-4).padStart(4, "0");
          const grupoMatch = col2.match(/\d+/);
          const grupo = grupoMatch ? parseInt(grupoMatch[0], 10) : this.getAnimalGroupFromNumber(milhar);
          const bicho = col3 || this.getAnimalNameFromGroup(grupo);
          console.log(`[ResultScraper]    ${position}\xBA: ${milhar} (${bicho})`);
          prizes.push({ position, number: milhar, animal: bicho, group: grupo });
        });
        prizes.sort((a, b) => a.position - b.position);
        return prizes;
      }
      getAnimalGroupFromNumber(number) {
        const lastTwo = number.slice(-2);
        const num = parseInt(lastTwo, 10);
        return num === 0 ? 25 : Math.ceil(num / 4);
      }
      getAnimalNameFromGroup(group) {
        const animals2 = {
          1: "Avestruz",
          2: "\xC1guia",
          3: "Burro",
          4: "Borboleta",
          5: "Cachorro",
          6: "Cabra",
          7: "Carneiro",
          8: "Camelo",
          9: "Cobra",
          10: "Coelho",
          11: "Cavalo",
          12: "Elefante",
          13: "Galo",
          14: "Gato",
          15: "Jacar\xE9",
          16: "Le\xE3o",
          17: "Macaco",
          18: "Porco",
          19: "Pav\xE3o",
          20: "Peru",
          21: "Touro",
          22: "Tigre",
          23: "Urso",
          24: "Veado",
          25: "Vaca"
        };
        return animals2[group] || "Desconhecido";
      }
      getAnimalFromNumber(number) {
        return this.getAnimalGroupFromNumber(number);
      }
    };
    resultScraper = new ResultScraper();
  }
});

// server/services/auto-update-results.ts
var auto_update_results_exports = {};
__export(auto_update_results_exports, {
  AutoUpdateResultsService: () => AutoUpdateResultsService,
  autoUpdateService: () => autoUpdateService
});
import { eq as eq2, and as and2 } from "drizzle-orm";
var AutoUpdateResultsService, autoUpdateService;
var init_auto_update_results = __esm({
  "server/services/auto-update-results.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_result_scraper();
    init_storage();
    AutoUpdateResultsService = class {
      /**
       * Atualiza resultados de todas as extrações pendentes de hoje
       */
      async updatePendingDraws() {
        try {
          console.log("[AutoUpdate] Iniciando atualiza\xE7\xE3o de resultados pendentes...");
          const today = /* @__PURE__ */ new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const pendingDraws = await db.select().from(draws).where(
            and2(
              eq2(draws.status, "pending")
              // Data entre hoje 00:00 e amanhã 00:00
            )
          );
          console.log(`[AutoUpdate] Encontradas ${pendingDraws.length} extra\xE7\xF5es pendentes`);
          const allAnimals = await db.select().from(animals);
          for (const draw of pendingDraws) {
            await this.updateDraw(draw, allAnimals);
          }
          console.log("[AutoUpdate] Atualiza\xE7\xE3o conclu\xEDda");
        } catch (error) {
          console.error("[AutoUpdate] Erro ao atualizar resultados:", error);
        }
      }
      /**
       * Atualiza uma extração específica
       */
      async updateDraw(draw, allAnimals) {
        try {
          console.log(`[AutoUpdate] Processando extra\xE7\xE3o: ${draw.name} (ID: ${draw.id})`);
          const drawDate = new Date(draw.date);
          const result = await resultScraper.fetchResult(draw.name, drawDate);
          if (!result) {
            console.warn(`[AutoUpdate] \u26A0\uFE0F Resultado n\xE3o encontrado para: ${draw.name}`);
            if (draw.status === "completed") {
              console.log(`[AutoUpdate] \u{1F504} Revertendo extra\xE7\xE3o para 'pending' (resultado n\xE3o dispon\xEDvel)`);
              await db.update(draws).set({
                status: "pending",
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
                resultNumber10: null
              }).where(eq2(draws.id, draw.id));
              console.log(`[AutoUpdate] \u2705 Extra\xE7\xE3o ${draw.name} revertida para 'pending'`);
            }
            return;
          }
          if (result.prizes.length === 0) {
            console.warn(`[AutoUpdate] Nenhum pr\xEAmio encontrado para: ${draw.name}`);
            return;
          }
          console.log(`[AutoUpdate] \u2705 Resultado obtido do scraper:`);
          console.log(`[AutoUpdate]    - Nome: ${result.drawName}`);
          console.log(`[AutoUpdate]    - Hor\xE1rio: ${result.drawTime}`);
          console.log(`[AutoUpdate]    - Total de pr\xEAmios: ${result.prizes.length}`);
          result.prizes.forEach((p) => {
            console.log(`[AutoUpdate]    - ${p.position}\xBA: Milhar=${p.number}, Grupo=${p.group}, Bicho=${p.animal}`);
          });
          const updateData = {
            status: "completed"
          };
          for (const prize of result.prizes) {
            const { position, number } = prize;
            const animalGroup = resultScraper.getAnimalFromNumber(number);
            const animal = allAnimals.find((a) => a.group === animalGroup);
            if (!animal) {
              console.warn(`[AutoUpdate] Animal n\xE3o encontrado para grupo ${animalGroup} (n\xFAmero: ${number})`);
              continue;
            }
            console.log(`[AutoUpdate] \u{1F4DD} Processando ${position}\xBA pr\xEAmio: Milhar=${number}, Grupo=${animalGroup}, Animal=${animal.name} (ID: ${animal.id})`);
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
          if (!updateData.resultAnimalId) {
            console.error(`[AutoUpdate] \u274C Erro: 1\xBA pr\xEAmio n\xE3o encontrado para ${draw.name}`);
            console.error(`[AutoUpdate] updateData:`, JSON.stringify(updateData, null, 2));
            return;
          }
          console.log(`[AutoUpdate] \u{1F4CA} Dados a serem salvos:`);
          console.log(`[AutoUpdate]   1\xBA: Animal ${updateData.resultAnimalId}, N\xFAmero ${updateData.resultNumber1}`);
          console.log(`[AutoUpdate]   2\xBA: Animal ${updateData.resultAnimalId2 || "N/A"}, N\xFAmero ${updateData.resultNumber2 || "N/A"}`);
          console.log(`[AutoUpdate]   3\xBA: Animal ${updateData.resultAnimalId3 || "N/A"}, N\xFAmero ${updateData.resultNumber3 || "N/A"}`);
          console.log(`[AutoUpdate]   4\xBA: Animal ${updateData.resultAnimalId4 || "N/A"}, N\xFAmero ${updateData.resultNumber4 || "N/A"}`);
          console.log(`[AutoUpdate]   5\xBA: Animal ${updateData.resultAnimalId5 || "N/A"}, N\xFAmero ${updateData.resultNumber5 || "N/A"}`);
          console.log(`[AutoUpdate] \u{1F3AF} Chamando storage.updateDrawResult para processar apostas...`);
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
            console.log(`[AutoUpdate] \u2705 Extra\xE7\xE3o ${draw.name} atualizada com ${result.prizes.length} pr\xEAmios e apostas processadas`);
          } catch (error) {
            console.error(`[AutoUpdate] \u274C Erro ao chamar updateDrawResult:`, error);
            throw error;
          }
        } catch (error) {
          console.error(`[AutoUpdate] Erro ao processar extra\xE7\xE3o ${draw.name}:`, error);
        }
      }
      /**
       * Atualiza uma extração específica manualmente (por ID)
       */
      async updateDrawById(drawId) {
        try {
          const draw = await db.select().from(draws).where(eq2(draws.id, drawId)).limit(1);
          if (draw.length === 0) {
            console.error(`[AutoUpdate] Extra\xE7\xE3o n\xE3o encontrada: ID ${drawId}`);
            return false;
          }
          const allAnimals = await db.select().from(animals);
          await this.updateDraw(draw[0], allAnimals);
          return true;
        } catch (error) {
          console.error(`[AutoUpdate] Erro ao atualizar extra\xE7\xE3o ${drawId}:`, error);
          return false;
        }
      }
    };
    autoUpdateService = new AutoUpdateResultsService();
  }
});

// server/bonus-settings.ts
var bonus_settings_exports = {};
__export(bonus_settings_exports, {
  getBonusSettings: () => getBonusSettings,
  saveBonusSettings: () => saveBonusSettings
});
async function getBonusSettings() {
  const settings = await storage.getSystemSettings();
  const defaultConfig = {
    signupBonus: {
      enabled: false,
      amount: 10,
      rollover: 3,
      expiration: 7
    },
    firstDepositBonus: {
      enabled: false,
      amount: 100,
      percentage: 100,
      maxAmount: 200,
      rollover: 3,
      expiration: 7
    },
    promotionalBanners: {
      enabled: false
    }
  };
  if (!settings) {
    return defaultConfig;
  }
  return {
    signupBonus: {
      enabled: Boolean(settings.signupBonusEnabled),
      amount: Number(settings.signupBonusAmount) || defaultConfig.signupBonus.amount,
      rollover: Number(settings.signupBonusRollover) || defaultConfig.signupBonus.rollover,
      expiration: Number(settings.signupBonusExpiration) || defaultConfig.signupBonus.expiration
    },
    firstDepositBonus: {
      enabled: Boolean(settings.firstDepositBonusEnabled),
      amount: Number(settings.firstDepositBonusAmount) || defaultConfig.firstDepositBonus.amount,
      percentage: Number(settings.firstDepositBonusPercentage) || defaultConfig.firstDepositBonus.percentage,
      maxAmount: Number(settings.firstDepositBonusMaxAmount) || defaultConfig.firstDepositBonus.maxAmount,
      rollover: Number(settings.firstDepositBonusRollover) || defaultConfig.firstDepositBonus.rollover,
      expiration: Number(settings.firstDepositBonusExpiration) || defaultConfig.firstDepositBonus.expiration
    },
    promotionalBanners: {
      enabled: Boolean(settings.promotionalBannersEnabled)
    }
  };
}
async function saveBonusSettings(config) {
  try {
    const currentSettings = await storage.getSystemSettings();
    if (!currentSettings) {
      throw new Error("N\xE3o foi poss\xEDvel obter as configura\xE7\xF5es atuais do sistema");
    }
    const signupBonusEnabled = Boolean(config.signupBonus.enabled);
    const firstDepositBonusEnabled = Boolean(config.firstDepositBonus.enabled);
    const updatedSettings = {
      ...currentSettings,
      // Bônus de cadastro
      signupBonusEnabled,
      signupBonusAmount: Number(config.signupBonus.amount),
      signupBonusRollover: Number(config.signupBonus.rollover),
      signupBonusExpiration: Number(config.signupBonus.expiration),
      // Bônus de primeiro depósito
      firstDepositBonusEnabled,
      firstDepositBonusAmount: Number(config.firstDepositBonus.amount),
      firstDepositBonusPercentage: Number(config.firstDepositBonus.percentage),
      firstDepositBonusMaxAmount: Number(config.firstDepositBonus.maxAmount),
      firstDepositBonusRollover: Number(config.firstDepositBonus.rollover),
      firstDepositBonusExpiration: Number(config.firstDepositBonus.expiration),
      // Banners promocionais
      promotionalBannersEnabled: Boolean(config.promotionalBanners.enabled)
    };
    console.log("Valores sendo salvos para signupBonusEnabled:", signupBonusEnabled);
    console.log("Valores sendo salvos para firstDepositBonusEnabled:", firstDepositBonusEnabled);
    console.log("Salvando configura\xE7\xF5es:", JSON.stringify(updatedSettings));
    await storage.saveSystemSettings(updatedSettings);
    console.log("=== CONFIGURA\xC7\xD5ES DE B\xD4NUS SALVAS COM SUCESSO ===");
    console.log("B\xF4nus de cadastro ativado:", signupBonusEnabled);
    console.log("B\xF4nus de primeiro dep\xF3sito ativado:", firstDepositBonusEnabled);
    return true;
  } catch (error) {
    console.error("Erro ao salvar configura\xE7\xF5es de b\xF4nus:", error);
    return false;
  }
}
var init_bonus_settings = __esm({
  "server/bonus-settings.ts"() {
    "use strict";
    init_storage();
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
init_storage();
init_auth();
init_db();
import { createServer } from "http";

// server/services/ezzebank.ts
import crypto from "crypto";
var EzzebankService = class {
  config;
  constructor(environment = "sandbox", clientId, clientSecret) {
    const isSandbox = environment === "sandbox";
    this.config = {
      clientId: clientId || (isSandbox ? process.env.EZZEBANK_SANDBOX_CLIENT_ID : process.env.EZZEBANK_PROD_CLIENT_ID),
      clientSecret: clientSecret || (isSandbox ? process.env.EZZEBANK_SANDBOX_CLIENT_SECRET : process.env.EZZEBANK_PROD_CLIENT_SECRET),
      baseUrl: isSandbox ? "https://api-staging.ezzebank.com" : "https://api.ezzebank.com",
      environment
    };
    if (!this.config.clientId || !this.config.clientSecret) {
      throw new Error(`EZZEBANK ${environment} credentials not configured`);
    }
    console.log("\u{1F3E6} EZZEBANK: Servi\xE7o configurado:", {
      environment: this.config.environment,
      baseUrl: this.config.baseUrl,
      clientId: this.config.clientId.substring(0, 10) + "...",
      usingCustomCredentials: !!(clientId && clientSecret)
    });
  }
  accessToken = null;
  tokenExpiry = null;
  getBasicAuthToken() {
    const authString = `${this.config.clientId}:${this.config.clientSecret}`;
    return Buffer.from(authString).toString("base64");
  }
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && /* @__PURE__ */ new Date() < this.tokenExpiry) {
      return this.accessToken;
    }
    try {
      console.log("\u{1F511} EZZEBANK: Obtendo novo token de acesso...");
      const basicAuth = this.getBasicAuthToken();
      const response = await fetch(`${this.config.baseUrl}/v2/oauth/token`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          "grant_type": "client_credentials"
        })
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`EZZEBANK Auth Error: ${response.status} ${error}`);
      }
      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = new Date(Date.now() + 29 * 60 * 1e3);
      console.log("\u2705 EZZEBANK: Token de acesso obtido com sucesso!");
      return this.accessToken;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao obter token de acesso:", error);
      throw error;
    }
  }
  async makeRequest(endpoint, method = "GET", body) {
    const accessToken = await this.getAccessToken();
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    };
    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : void 0
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`EZZEBANK API Error: ${response.status} ${error}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`\u{1F525} EZZEBANK: Erro na requisi\xE7\xE3o ${method} ${endpoint}:`, error);
      throw error;
    }
  }
  async createPixPayment(payment) {
    console.log("\u{1F3E6} EZZEBANK: Criando pagamento PIX:", {
      amount: payment.amount,
      description: payment.description,
      externalId: payment.externalId,
      environment: this.config.environment
    });
    const payload = {
      amount: payment.amount,
      description: payment.description,
      external_id: payment.externalId,
      customer: {
        name: payment.customerName,
        email: payment.customerEmail,
        document: payment.customerDocument
      },
      webhook_url: payment.webhookUrl,
      expires_in: 3600
      // 1 hora
    };
    try {
      const response = await this.makeRequest("/pix/payments", "POST", payload);
      console.log("\u2705 EZZEBANK: Pagamento PIX criado com sucesso:", {
        id: response.id,
        status: response.status,
        amount: response.amount
      });
      return {
        id: response.id,
        status: response.status,
        amount: response.amount,
        pixKey: response.pix_key,
        qrCode: response.qr_code,
        qrCodeImage: response.qr_code_image,
        expiresAt: response.expires_at,
        createdAt: response.created_at
      };
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao criar pagamento PIX:", error);
      throw error;
    }
  }
  async createPixWithdrawal(withdrawal) {
    console.log("\u{1F3E6} EZZEBANK: Criando saque PIX:", {
      amount: withdrawal.amount,
      pixKey: withdrawal.pixKey,
      pixKeyType: withdrawal.pixKeyType,
      externalId: withdrawal.externalId,
      environment: this.config.environment
    });
    const payload = {
      amount: withdrawal.amount,
      pix_key: withdrawal.pixKey,
      pix_key_type: withdrawal.pixKeyType,
      recipient: {
        name: withdrawal.recipientName,
        document: withdrawal.recipientDocument
      },
      description: withdrawal.description,
      external_id: withdrawal.externalId,
      webhook_url: withdrawal.webhookUrl
    };
    try {
      const response = await this.makeRequest("/pix/withdrawals", "POST", payload);
      console.log("\u2705 EZZEBANK: Saque PIX criado com sucesso:", {
        id: response.id,
        status: response.status,
        amount: response.amount
      });
      return {
        id: response.id,
        status: response.status,
        amount: response.amount,
        pixKey: response.pix_key,
        recipientName: response.recipient.name,
        createdAt: response.created_at,
        processedAt: response.processed_at
      };
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao criar saque PIX:", error);
      throw error;
    }
  }
  async getPaymentStatus(paymentId) {
    try {
      const response = await this.makeRequest(`/pix/payments/${paymentId}`);
      return {
        id: response.id,
        status: response.status,
        amount: response.amount,
        paidAt: response.paid_at,
        createdAt: response.created_at
      };
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao consultar status do pagamento:", error);
      throw error;
    }
  }
  async getWithdrawalStatus(withdrawalId) {
    try {
      const response = await this.makeRequest(`/pix/withdrawals/${withdrawalId}`);
      return {
        id: response.id,
        status: response.status,
        amount: response.amount,
        processedAt: response.processed_at,
        createdAt: response.created_at
      };
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao consultar status do saque:", error);
      throw error;
    }
  }
  async getBalance() {
    try {
      console.log("\u{1F4B0} EZZEBANK: Consultando saldo da conta...");
      const response = await this.makeRequest("/v2/balance", "GET");
      console.log("\u2705 EZZEBANK: Saldo consultado com sucesso!", {
        balance: response.balance,
        currency: response.currency
      });
      return response;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao consultar saldo:", error);
      throw error;
    }
  }
  async getTransactions(params) {
    try {
      console.log("\u{1F4CA} EZZEBANK: Consultando extrato de transa\xE7\xF5es...", {
        periodo: `${params.initialDate} at\xE9 ${params.finalDate}`,
        tipo: params.type || "Todos",
        pagina: params.page || 1,
        tamanhoPagina: params.pageSize || 30
      });
      const queryParams = new URLSearchParams({
        initialDate: params.initialDate,
        finalDate: params.finalDate,
        page: String(params.page || 1),
        pageSize: String(params.pageSize || 30)
      });
      if (params.type) {
        queryParams.append("type", params.type);
      }
      const response = await this.makeRequest(`/v2/transactions?${queryParams.toString()}`, "GET");
      console.log("\u2705 EZZEBANK: Extrato consultado com sucesso!", {
        totalTransacoes: response.data?.length || 0,
        pagina: response.page,
        totalPaginas: response.totalPages
      });
      return response;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao consultar extrato:", error);
      throw error;
    }
  }
  async createPixQRCode(qrCodeData) {
    try {
      console.log("\u{1F4F1} EZZEBANK: Gerando QRCode PIX de recebimento...", {
        amount: qrCodeData.amount,
        payername: qrCodeData.payername,
        external_id: qrCodeData.external_id,
        environment: this.config.environment
      });
      const payload = {
        amount: qrCodeData.amount,
        payerQuestion: qrCodeData.payerQuestion,
        external_id: qrCodeData.external_id,
        payer: {
          name: qrCodeData.payername,
          document: qrCodeData.payerdocument
        }
      };
      const response = await this.makeRequest("/v2/pix/qrcode", "POST", payload);
      console.log("\u2705 EZZEBANK: QRCode PIX gerado com sucesso!", {
        transactionId: response.transactionId,
        qrCodeGerado: response.qrCode ? "Sim" : "N\xE3o"
      });
      return response;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao gerar QRCode PIX:", error);
      throw error;
    }
  }
  async createPixQRCodeWithDueDate(qrCodeData) {
    try {
      console.log("\u{1F4C5} EZZEBANK: Gerando QRCode PIX com vencimento...", {
        amount: qrCodeData.amount,
        payerName: qrCodeData.payer.name,
        external_id: qrCodeData.external_id,
        dueDate: qrCodeData.calendar?.dueDate,
        environment: this.config.environment
      });
      const payload = {
        amount: qrCodeData.amount,
        payerQuestion: qrCodeData.payerQuestion,
        external_id: qrCodeData.external_id,
        payer: qrCodeData.payer,
        ...qrCodeData.fine && { fine: qrCodeData.fine },
        ...qrCodeData.interest && { interest: qrCodeData.interest },
        ...qrCodeData.abatement && { abatement: qrCodeData.abatement },
        ...qrCodeData.discount && { discount: qrCodeData.discount },
        ...qrCodeData.calendar && { calendar: qrCodeData.calendar },
        ...qrCodeData.additionalInformation && { additionalInformation: qrCodeData.additionalInformation }
      };
      const response = await this.makeRequest("/v2/pix/qrcode/duedate", "POST", payload);
      console.log("\u2705 EZZEBANK: QRCode PIX com vencimento gerado com sucesso!", {
        transactionId: response.transactionId,
        qrCodeGerado: response.qrCode ? "Sim" : "N\xE3o",
        vencimento: qrCodeData.calendar?.dueDate
      });
      return response;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao gerar QRCode PIX com vencimento:", error);
      throw error;
    }
  }
  async listPixQRCodes(params) {
    try {
      console.log("\u{1F4CB} EZZEBANK: Listando QRCodes PIX...", {
        periodo: `${params.initialDate} at\xE9 ${params.finalDate}`,
        status: params.status || "Todos",
        pagina: params.page || 1,
        tamanhoPagina: params.pageSize || 30
      });
      const queryParams = new URLSearchParams({
        initialDate: params.initialDate,
        finalDate: params.finalDate,
        page: String(params.page || 1),
        pageSize: String(params.pageSize || 30)
      });
      if (params.status) {
        queryParams.append("status", params.status);
      }
      if (params.transactionId) {
        queryParams.append("transactionId", params.transactionId);
      }
      if (params.external_id) {
        queryParams.append("external_id", params.external_id);
      }
      const response = await this.makeRequest(`/v2/pix/qrcode/list?${queryParams.toString()}`, "GET");
      console.log("\u2705 EZZEBANK: QRCodes listados com sucesso!", {
        totalQRCodes: response.data?.length || 0,
        pagina: response.page,
        totalPaginas: response.totalPages
      });
      return response;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao listar QRCodes:", error);
      throw error;
    }
  }
  async getPixQRCodeDetail(transactionId) {
    try {
      console.log("\u{1F50D} EZZEBANK: Consultando detalhes do QRCode PIX...", {
        transactionId,
        environment: this.config.environment
      });
      const response = await this.makeRequest(`/v2/pix/qrcode/${transactionId}/detail`, "GET");
      console.log("\u2705 EZZEBANK: Detalhes do QRCode consultados com sucesso!", {
        transactionId,
        status: response.status,
        amount: response.amount
      });
      return response;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao consultar QRCode:", error);
      throw error;
    }
  }
  async reversePixPayment(endToEndId, reverseData) {
    try {
      console.log("\u{1F504} EZZEBANK: Processando devolu\xE7\xE3o PIX...", {
        endToEndId,
        amount: reverseData.amount,
        external_id: reverseData.external_id,
        environment: this.config.environment
      });
      const payload = {
        amount: reverseData.amount,
        external_id: reverseData.external_id,
        description: reverseData.description || "Devolu\xE7\xE3o PIX"
      };
      const response = await this.makeRequest(`/v2/pix/qrcode/${endToEndId}/reverse`, "POST", payload);
      console.log("\u2705 EZZEBANK: Devolu\xE7\xE3o PIX processada com sucesso!", {
        endToEndId,
        amount: reverseData.amount,
        status: response.status
      });
      return response;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao processar devolu\xE7\xE3o PIX:", error);
      throw error;
    }
  }
  async sendPixPayment(paymentData) {
    try {
      console.log("\u{1F4B8} EZZEBANK: Enviando pagamento PIX...", {
        amount: paymentData.amount,
        external_id: paymentData.external_id,
        keyType: paymentData.creditParty.keyType,
        beneficiario: paymentData.creditParty.name,
        environment: this.config.environment
      });
      const payload = {
        amount: paymentData.amount,
        external_id: paymentData.external_id,
        description: paymentData.description || "Pagamento PIX",
        creditParty: {
          keyType: paymentData.creditParty.keyType,
          key: paymentData.creditParty.key,
          name: paymentData.creditParty.name,
          taxId: paymentData.creditParty.taxId
        }
      };
      const response = await this.makeRequest("/v2/pix/payment", "POST", payload);
      console.log("\u2705 EZZEBANK: Pagamento PIX enviado com sucesso!", {
        external_id: paymentData.external_id,
        amount: paymentData.amount,
        status: response.status,
        transactionId: response.transactionId
      });
      return response;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao enviar pagamento PIX:", error);
      throw error;
    }
  }
  async getPixPaymentStatus(transactionId) {
    try {
      console.log("\u{1F50D} EZZEBANK: Consultando status do pagamento PIX...", {
        transactionId,
        environment: this.config.environment
      });
      const response = await this.makeRequest(`/v2/pix/payment/${transactionId}/status`, "GET");
      console.log("\u2705 EZZEBANK: Status do pagamento PIX consultado com sucesso!", {
        transactionId,
        status: response.status,
        amount: response.amount
      });
      return response;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao consultar status do pagamento PIX:", error);
      throw error;
    }
  }
  async getPixPaymentReceipt(transactionId) {
    try {
      console.log("\u{1F4C4} EZZEBANK: Obtendo comprovante do pagamento PIX...", {
        transactionId,
        environment: this.config.environment
      });
      const response = await this.makeRequest(`/v2/pix/payment/${transactionId}/receipt`, "GET");
      console.log("\u2705 EZZEBANK: Comprovante do pagamento PIX obtido com sucesso!", {
        transactionId,
        comprovanteDisponivel: !!response
      });
      return response;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao obter comprovante do pagamento PIX:", error);
      throw error;
    }
  }
  async listPixPayments(params) {
    try {
      console.log("\u{1F4CB} EZZEBANK: Listando transfer\xEAncias PIX...", {
        periodo: `${params.initialDate} at\xE9 ${params.finalDate}`,
        status: params.status || "Todos",
        pagina: params.page || 1,
        tamanhoPagina: params.pageSize || 30
      });
      const queryParams = new URLSearchParams({
        initialDate: params.initialDate,
        finalDate: params.finalDate,
        page: String(params.page || 1),
        pageSize: String(params.pageSize || 30)
      });
      if (params.status) {
        queryParams.append("status", params.status);
      }
      if (params.transactionId) {
        queryParams.append("transactionId", params.transactionId);
      }
      if (params.external_id) {
        queryParams.append("external_id", params.external_id);
      }
      const response = await this.makeRequest(`/v2/pix/payment/list?${queryParams.toString()}`, "GET");
      console.log("\u2705 EZZEBANK: Transfer\xEAncias PIX listadas com sucesso!", {
        totalTransferencias: response.data?.length || 0,
        pagina: response.page,
        totalPaginas: response.totalPages
      });
      return response;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao listar transfer\xEAncias PIX:", error);
      throw error;
    }
  }
  async listPixInfractions(params) {
    try {
      console.log("\u26A0\uFE0F EZZEBANK: Listando infra\xE7\xF5es PIX...", {
        periodo: `${params.dateFrom} at\xE9 ${params.dateTo}`,
        status: params.status || "Todas",
        pagina: params.page || 1
      });
      const queryParams = new URLSearchParams({
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        page: String(params.page || 1)
      });
      if (params.status) {
        queryParams.append("status", params.status);
      }
      if (params.endtoEndId) {
        queryParams.append("endtoEndId", params.endtoEndId);
      }
      if (params.externalId) {
        queryParams.append("externalId", params.externalId);
      }
      const response = await this.makeRequest(`/v2/infractions?${queryParams.toString()}`, "GET");
      console.log("\u2705 EZZEBANK: Infra\xE7\xF5es PIX listadas com sucesso!", {
        totalInfracoes: response.data?.length || 0,
        pagina: response.page,
        totalPaginas: response.totalPages
      });
      return response;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao listar infra\xE7\xF5es PIX:", error);
      throw error;
    }
  }
  async getPixInfraction(infractionId) {
    try {
      console.log("\u{1F50D} EZZEBANK: Consultando infra\xE7\xE3o PIX...", {
        infractionId,
        environment: this.config.environment
      });
      const response = await this.makeRequest(`/v2/infractions/${infractionId}`, "GET");
      console.log("\u2705 EZZEBANK: Infra\xE7\xE3o PIX consultada com sucesso!", {
        infractionId,
        status: response.status,
        type: response.type
      });
      return response;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao consultar infra\xE7\xE3o PIX:", error);
      throw error;
    }
  }
  async defendPixInfraction(infractionId, defenseData) {
    try {
      console.log("\u{1F6E1}\uFE0F EZZEBANK: Defendendo infra\xE7\xE3o PIX...", {
        infractionId,
        defenseLength: defenseData.defense.length,
        filesCount: defenseData.files?.length || 0,
        environment: this.config.environment
      });
      if (defenseData.files && defenseData.files.length > 3) {
        throw new Error("M\xE1ximo de 3 arquivos permitidos para defesa");
      }
      const response = await this.makeRequest(`/v2/infractions/${infractionId}/defense`, "POST", defenseData);
      console.log("\u2705 EZZEBANK: Defesa da infra\xE7\xE3o PIX enviada com sucesso!", {
        infractionId,
        defenseAccepted: !!response.success
      });
      return response;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao defender infra\xE7\xE3o PIX:", error);
      throw error;
    }
  }
  async validateWebhook(payload, verifySignatureHeader) {
    try {
      if (!verifySignatureHeader) {
        console.log("\u26A0\uFE0F EZZEBANK: Header Verify-Signature n\xE3o fornecido");
        return false;
      }
      const elements = verifySignatureHeader.split(",");
      let timestamp3 = "";
      let receivedSignature = "";
      for (const element of elements) {
        const [key, value] = element.split("=");
        if (key === "t") {
          timestamp3 = value;
        } else if (key === "v1") {
          receivedSignature = value;
        }
      }
      if (!timestamp3 || !receivedSignature) {
        console.log("\u274C EZZEBANK: Formato inv\xE1lido do header Verify-Signature");
        return false;
      }
      const payloadString = JSON.stringify(payload);
      const signedPayload = timestamp3 + "t" + payloadString;
      const signatureSecret = process.env.EZZEBANK_WEBHOOK_SECRET || "";
      if (!signatureSecret) {
        console.log("\u274C EZZEBANK: EZZEBANK_WEBHOOK_SECRET n\xE3o configurado");
        return false;
      }
      const computedSignature = crypto.createHmac("sha256", signatureSecret).update(signedPayload).digest("hex");
      const isValid = crypto.timingSafeEqual(
        Buffer.from(receivedSignature, "hex"),
        Buffer.from(computedSignature, "hex")
      );
      if (isValid) {
        console.log("\u2705 EZZEBANK: Webhook validado com sucesso!", {
          timestamp: timestamp3,
          signatureMatch: true
        });
      } else {
        console.log("\u274C EZZEBANK: Assinatura do webhook inv\xE1lida", {
          timestamp: timestamp3,
          received: receivedSignature.substring(0, 10) + "...",
          computed: computedSignature.substring(0, 10) + "..."
        });
      }
      return isValid;
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao validar webhook:", error);
      return false;
    }
  }
};
async function createEzzebankService(gatewayId) {
  if (gatewayId) {
    const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
    const gateway = await storage2.getPaymentGateway(gatewayId);
    if (!gateway || gateway.type !== "ezzebank") {
      throw new Error("Gateway EZZEBANK n\xE3o encontrado");
    }
    const environment = gateway.sandbox ? "sandbox" : "production";
    return new EzzebankService(environment, gateway.apiKey || void 0, gateway.secretKey || void 0);
  } else {
    const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
    const gateways = await storage2.getPaymentGateways();
    const ezzebankGateway = gateways.find((g) => g.type === "ezzebank" && g.isActive);
    if (!ezzebankGateway) {
      throw new Error("Nenhum gateway EZZEBANK ativo encontrado");
    }
    console.log("\u{1F3E6} EZZEBANK: Usando gateway do painel administrativo:", {
      gatewayId: ezzebankGateway.id,
      name: ezzebankGateway.name,
      isSandbox: ezzebankGateway.isSandbox,
      isActive: ezzebankGateway.isActive
    });
    const environment = ezzebankGateway.isSandbox ? "sandbox" : "production";
    return new EzzebankService(environment, ezzebankGateway.apiKey, ezzebankGateway.secretKey);
  }
}

// server/routes.ts
init_schema();
init_logger();
init_validate();
import { z as z6 } from "zod";
import fs from "fs-extra";
import path2 from "path";
import { eq as eq3, desc as desc2, asc as asc2, sql as sql2, and as and3 } from "drizzle-orm";

// server/validators/bet.validators.ts
import { z as z4 } from "zod";
var createBetValidator = z4.object({
  drawId: z4.number().int().positive("ID do sorteio deve ser positivo"),
  gameModeId: z4.number().int().positive("ID do modo de jogo deve ser positivo"),
  amount: z4.number().positive("Valor deve ser positivo").min(0.5, "Valor m\xEDnimo \xE9 R$ 0,50").max(1e5, "Valor m\xE1ximo \xE9 R$ 100.000"),
  type: z4.string().min(1, "Tipo de aposta \xE9 obrigat\xF3rio"),
  animalId: z4.number().int().positive().optional(),
  animalId2: z4.number().int().positive().optional(),
  animalId3: z4.number().int().positive().optional(),
  animalId4: z4.number().int().positive().optional(),
  animalId5: z4.number().int().positive().optional(),
  betNumbers: z4.array(z4.string()).optional(),
  premioType: z4.string().optional(),
  useBonusBalance: z4.boolean().optional(),
  potentialWinAmount: z4.number().optional()
});
var updateBetResultValidator = z4.object({
  status: z4.enum(["pending", "won", "lost"]),
  winAmount: z4.number().nonnegative().optional()
});

// server/validators/payment.validators.ts
import { z as z5 } from "zod";
var createDepositValidator = z5.object({
  amount: z5.number().positive("Valor deve ser positivo").min(1, "Valor m\xEDnimo de dep\xF3sito \xE9 R$ 1,00").max(1e6, "Valor m\xE1ximo de dep\xF3sito \xE9 R$ 1.000.000"),
  gatewayId: z5.number().int().positive("Gateway de pagamento inv\xE1lido")
});
var createWithdrawalValidator = z5.object({
  amount: z5.number().positive("Valor deve ser positivo").min(1, "Valor m\xEDnimo de saque \xE9 R$ 1,00"),
  pixKey: z5.string().min(1, "Chave PIX \xE9 obrigat\xF3ria"),
  pixKeyType: z5.enum(["cpf", "cnpj", "email", "phone", "random"], {
    errorMap: () => ({ message: "Tipo de chave PIX inv\xE1lido" })
  })
});
var processWithdrawalValidator = z5.object({
  status: z5.enum(["approved", "rejected"]),
  rejectionReason: z5.string().optional(),
  notes: z5.string().optional()
});

// server/routes.ts
init_draw_scheduler();
var requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
var requireAdmin = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
async function registerRoutes(app2) {
  try {
    console.log("Verificando se a tabela user_bonuses existe...");
    const checkResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'user_bonuses'
      );
    `);
    const tableExists = checkResult.rows[0].exists;
    if (!tableExists) {
      console.log("Tabela user_bonuses n\xE3o existe. Criando...");
      await pool.query(`
        CREATE TABLE user_bonuses (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          remaining_amount DECIMAL(10, 2) NOT NULL,
          rollover_amount DECIMAL(10, 2) NOT NULL,
          rolled_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'active',
          expires_at TIMESTAMP WITH TIME ZONE,
          completed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          related_transaction_id INTEGER
        );
      `);
      console.log("Tabela user_bonuses criada com sucesso!");
    } else {
      console.log("Tabela user_bonuses j\xE1 existe.");
    }
  } catch (error) {
    console.error("Erro ao verificar/criar tabela user_bonuses:", error);
  }
  app2.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      environment: process.env.NODE_ENV || "unknown",
      server: {
        version: process.version,
        uptime: process.uptime()
      }
    });
  });
  app2.get("/api/debug/bonus-config", async (req, res) => {
    try {
      const [settings] = await db.select().from(systemSettings);
      res.json({
        success: true,
        bonusConfig: {
          firstDepositEnabled: settings?.firstDepositBonusEnabled,
          firstDepositPercentage: settings?.firstDepositBonusPercentage,
          firstDepositMaxAmount: settings?.firstDepositBonusMaxAmount,
          firstDepositRollover: settings?.firstDepositBonusRollover,
          firstDepositExpiration: settings?.firstDepositBonusExpiration,
          registrationBonusEnabled: settings?.signupBonusEnabled,
          registrationBonusAmount: settings?.signupBonusAmount,
          registrationBonusRollover: settings?.signupBonusRollover,
          registrationBonusExpiration: settings?.signupBonusExpiration
        }
      });
    } catch (error) {
      console.error("Erro ao verificar configura\xE7\xF5es de b\xF4nus:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao verificar configura\xE7\xF5es de b\xF4nus",
        error: String(error)
      });
    }
  });
  app2.post("/api/debug/fix-bonus-settings", async (req, res) => {
    try {
      console.log("Iniciando atualiza\xE7\xE3o das configura\xE7\xF5es de b\xF4nus...");
      const updateResult = await pool.query(`
        UPDATE system_settings 
        SET 
          first_deposit_bonus_enabled = TRUE,
          first_deposit_bonus_percentage = 150,
          first_deposit_bonus_max_amount = 300,
          first_deposit_bonus_rollover = 2
        WHERE id = 1
      `);
      console.log("Atualiza\xE7\xE3o SQL executada:", updateResult);
      const { rows } = await pool.query(`
        SELECT 
          first_deposit_bonus_enabled,
          first_deposit_bonus_percentage,
          first_deposit_bonus_max_amount,
          first_deposit_bonus_rollover
        FROM system_settings 
        LIMIT 1
      `);
      const updated = rows[0];
      console.log("Configura\xE7\xF5es atualizadas:", updated);
      res.json({
        success: true,
        message: "Configura\xE7\xF5es de b\xF4nus atualizadas com sucesso",
        config: {
          firstDepositEnabled: updated?.first_deposit_bonus_enabled,
          firstDepositPercentage: updated?.first_deposit_bonus_percentage,
          firstDepositMaxAmount: updated?.first_deposit_bonus_max_amount,
          firstDepositRollover: updated?.first_deposit_bonus_rollover
        }
      });
    } catch (error) {
      console.error("Erro ao atualizar configura\xE7\xF5es de b\xF4nus:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao atualizar configura\xE7\xF5es de b\xF4nus",
        error: String(error)
      });
    }
  });
  app2.get("/api/update-branding-schema", async (req, res) => {
    try {
      console.log("Atualizando esquema do banco de dados para suportar branding...");
      const query = `
        ALTER TABLE system_settings 
        ADD COLUMN IF NOT EXISTS site_name TEXT NOT NULL DEFAULT 'Jogo do Bicho',
        ADD COLUMN IF NOT EXISTS site_description TEXT NOT NULL DEFAULT 'A melhor plataforma de apostas online',
        ADD COLUMN IF NOT EXISTS logo_url TEXT NOT NULL DEFAULT '/img/logo.png',
        ADD COLUMN IF NOT EXISTS favicon_url TEXT NOT NULL DEFAULT '/img/favicon.png';
      `;
      await pool.query(query);
      console.log("\u2705 Esquema atualizado com sucesso!");
      const { rows } = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns 
        WHERE table_name = 'system_settings'
        ORDER BY ordinal_position
      `);
      console.log("Estrutura atual da tabela:");
      rows.forEach((col) => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
      res.json({
        success: true,
        message: "Esquema atualizado com sucesso!",
        columns: rows.map((col) => `${col.column_name} (${col.data_type})`)
      });
    } catch (error) {
      console.error("\u274C ERRO ao atualizar esquema:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao atualizar o esquema do banco de dados",
        error: String(error)
      });
    }
  });
  app2.get("/api/fix-user-columns", async (req, res) => {
    try {
      console.log("\u{1F527} Adicionando colunas blocked e block_reason \xE0 tabela users...");
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS blocked BOOLEAN NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS block_reason TEXT
      `);
      console.log("\u2705 Colunas adicionadas com sucesso!");
      res.json({
        success: true,
        message: "Colunas blocked e block_reason adicionadas com sucesso!"
      });
    } catch (error) {
      console.error("\u274C Erro ao adicionar colunas:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao adicionar colunas",
        error: String(error)
      });
    }
  });
  app2.get("/api/reset-database", async (req, res) => {
    if (process.env.NODE_ENV === "production") {
      console.log("\u{1F504} Iniciando reinicializa\xE7\xE3o do banco de dados de produ\xE7\xE3o...");
      try {
        const tables = [
          "session",
          "transactions",
          "withdrawals",
          "payment_transactions",
          "payment_gateways",
          "bets",
          "draws",
          "game_modes",
          "animals",
          "system_settings",
          "users"
        ];
        for (const table of tables) {
          try {
            await pool.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
            console.log(`\u2705 Tabela ${table} dropada com sucesso`);
          } catch (error) {
            console.error(`\u274C Erro ao dropar tabela ${table}:`, error);
          }
        }
        await pool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT,
            name TEXT,
            balance REAL NOT NULL DEFAULT 0,
            cpf TEXT UNIQUE,
            pix_key TEXT,
            is_admin BOOLEAN NOT NULL DEFAULT false,
            blocked BOOLEAN NOT NULL DEFAULT false,
            block_reason TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `);
        try {
          await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS blocked BOOLEAN NOT NULL DEFAULT false,
            ADD COLUMN IF NOT EXISTS block_reason TEXT
          `);
        } catch (error) {
          console.log("Colunas blocked j\xE1 existem ou erro ao adicionar:", error);
        }
        await pool.query(`
          CREATE TABLE IF NOT EXISTS animals (
            id SERIAL PRIMARY KEY,
            group INTEGER NOT NULL,
            name TEXT NOT NULL,
            numbers TEXT NOT NULL
          )
        `);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS game_modes (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            quotation REAL NOT NULL,
            active BOOLEAN NOT NULL DEFAULT true,
            sort_order INTEGER
          )
        `);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS draws (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            date DATE NOT NULL,
            time TEXT NOT NULL,
            result_animal_id INTEGER,
            result_animal_id2 INTEGER,
            result_animal_id3 INTEGER,
            result_animal_id4 INTEGER,
            result_animal_id5 INTEGER,
            result_number TEXT,
            result_number2 TEXT,
            result_number3 TEXT,
            result_number4 TEXT,
            result_number5 TEXT
          )
        `);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS bets (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            draw_id INTEGER NOT NULL,
            game_mode_id INTEGER NOT NULL,
            animal_id INTEGER,
            animal_id2 INTEGER,
            animal_id3 INTEGER,
            animal_id4 INTEGER,
            animal_id5 INTEGER,
            number TEXT,
            amount REAL NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            status TEXT NOT NULL DEFAULT 'pending',
            win_amount REAL,
            potential_win_amount REAL NOT NULL,
            premio_type TEXT
          )
        `);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS system_settings (
            id INTEGER PRIMARY KEY DEFAULT 1,
            max_bet_amount REAL NOT NULL DEFAULT 10000,
            max_payout REAL NOT NULL DEFAULT 1000000,
            min_bet_amount REAL NOT NULL DEFAULT 5,
            default_bet_amount REAL NOT NULL DEFAULT 20,
            main_color TEXT NOT NULL DEFAULT '#4f46e5',
            secondary_color TEXT NOT NULL DEFAULT '#6366f1',
            accent_color TEXT NOT NULL DEFAULT '#f97316',
            allow_user_registration BOOLEAN NOT NULL DEFAULT true,
            allow_deposits BOOLEAN NOT NULL DEFAULT true,
            allow_withdrawals BOOLEAN NOT NULL DEFAULT true,
            maintenance_mode BOOLEAN NOT NULL DEFAULT false,
            auto_approve_withdrawals BOOLEAN NOT NULL DEFAULT true,
            auto_approve_withdrawal_limit REAL NOT NULL DEFAULT 30,
            site_name TEXT NOT NULL DEFAULT 'Jogo do Bicho',
            site_description TEXT NOT NULL DEFAULT 'A melhor plataforma de apostas online',
            logo_url TEXT NOT NULL DEFAULT '/img/logo.png',
            favicon_url TEXT NOT NULL DEFAULT '/img/favicon.png'
          )
        `);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS payment_gateways (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            config JSONB,
            active BOOLEAN NOT NULL DEFAULT true
          )
        `);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS payment_transactions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            gateway_id INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            type TEXT NOT NULL DEFAULT 'deposit',
            external_id TEXT,
            external_url TEXT,
            response JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS withdrawals (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            pix_key TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            processed_by INTEGER,
            rejection_reason TEXT,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            processed_at TIMESTAMP WITH TIME ZONE
          )
        `);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            type TEXT NOT NULL,
            reference_id INTEGER,
            reference_type TEXT,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS session (
            sid varchar NOT NULL,
            sess json NOT NULL,
            expire timestamp(6) NOT NULL,
            CONSTRAINT session_pkey PRIMARY KEY (sid)
          )
        `);
        await pool.query(`
          INSERT INTO system_settings (
            id, max_bet_amount, max_payout, min_bet_amount, default_bet_amount,
            main_color, secondary_color, accent_color,
            allow_user_registration, allow_deposits, allow_withdrawals,
            maintenance_mode, auto_approve_withdrawals, auto_approve_withdrawal_limit
          ) VALUES (
            1, 10000, 1000000, 5, 20, 
            '#4f46e5', '#6366f1', '#f97316',
            true, true, true, 
            false, true, 30
          )
        `);
        const hashedPassword = await hashPassword("admin");
        await pool.query(`
          INSERT INTO users (username, password, email, name, balance, is_admin, created_at)
          VALUES ('admin', $1, 'admin@bichomania.com', 'Administrator', 0, true, NOW())
        `, [hashedPassword]);
        const animals2 = [
          { group: 1, name: "Avestruz", numbers: "01,02,03,04" },
          { group: 2, name: "\xC1guia", numbers: "05,06,07,08" },
          { group: 3, name: "Burro", numbers: "09,10,11,12" },
          { group: 4, name: "Borboleta", numbers: "13,14,15,16" },
          { group: 5, name: "Cachorro", numbers: "17,18,19,20" },
          { group: 6, name: "Cabra", numbers: "21,22,23,24" },
          { group: 7, name: "Carneiro", numbers: "25,26,27,28" },
          { group: 8, name: "Camelo", numbers: "29,30,31,32" },
          { group: 9, name: "Cobra", numbers: "33,34,35,36" },
          { group: 10, name: "Coelho", numbers: "37,38,39,40" },
          { group: 11, name: "Cavalo", numbers: "41,42,43,44" },
          { group: 12, name: "Elefante", numbers: "45,46,47,48" },
          { group: 13, name: "Galo", numbers: "49,50,51,52" },
          { group: 14, name: "Gato", numbers: "53,54,55,56" },
          { group: 15, name: "Jacar\xE9", numbers: "57,58,59,60" },
          { group: 16, name: "Le\xE3o", numbers: "61,62,63,64" },
          { group: 17, name: "Macaco", numbers: "65,66,67,68" },
          { group: 18, name: "Porco", numbers: "69,70,71,72" },
          { group: 19, name: "Pav\xE3o", numbers: "73,74,75,76" },
          { group: 20, name: "Peru", numbers: "77,78,79,80" },
          { group: 21, name: "Touro", numbers: "81,82,83,84" },
          { group: 22, name: "Tigre", numbers: "85,86,87,88" },
          { group: 23, name: "Urso", numbers: "89,90,91,92" },
          { group: 24, name: "Veado", numbers: "93,94,95,96" },
          { group: 25, name: "Vaca", numbers: "97,98,99,00" }
        ];
        for (const animal of animals2) {
          await pool.query(`
            INSERT INTO animals (group, name, numbers)
            VALUES ($1, $2, $3)
          `, [animal.group, animal.name, animal.numbers]);
        }
        const gameModes2 = [
          {
            id: 1,
            name: "Grupo",
            description: "Jogue no grupo do animal",
            quotation: 18,
            active: true,
            sortOrder: 1
          },
          {
            id: 2,
            name: "Centena",
            description: "Jogue nos tr\xEAs \xFAltimos n\xFAmeros (dezena + unidade)",
            quotation: 900,
            active: true,
            sortOrder: 2
          },
          {
            id: 3,
            name: "Dezena",
            description: "Jogue nos dois \xFAltimos n\xFAmeros (dezena + unidade)",
            quotation: 90,
            active: true,
            sortOrder: 3
          },
          {
            id: 4,
            name: "Milhar",
            description: "Jogue nos quatro n\xFAmeros (milhar completa)",
            quotation: 9e3,
            active: true,
            sortOrder: 4
          }
        ];
        for (const mode of gameModes2) {
          await pool.query(`
            INSERT INTO game_modes (id, name, description, quotation, active, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [mode.id, mode.name, mode.description, mode.quotation, mode.active, mode.sortOrder]);
        }
        const today = /* @__PURE__ */ new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formatDate = (date) => {
          return date.toISOString().split("T")[0];
        };
        const drawTimes = ["10:00", "13:00", "16:00", "19:00", "21:00"];
        for (const time of drawTimes) {
          await pool.query(`
            INSERT INTO draws (name, date, time)
            VALUES ($1, $2, $3)
          `, [`Sorteio ${time}`, formatDate(today), time]);
          await pool.query(`
            INSERT INTO draws (name, date, time)
            VALUES ($1, $2, $3)
          `, [`Sorteio ${time}`, formatDate(tomorrow), time]);
        }
        res.status(200).json({
          status: "success",
          message: "Banco de dados reinicializado com sucesso",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (error) {
        console.error("\u274C Erro durante reinicializa\xE7\xE3o do banco de dados:", error);
        res.status(500).json({
          status: "error",
          message: "Erro durante reinicializa\xE7\xE3o do banco de dados",
          error: error.message || error.toString()
        });
      }
    } else {
      res.status(403).json({
        status: "error",
        message: "Este endpoint s\xF3 est\xE1 dispon\xEDvel em ambiente de produ\xE7\xE3o"
      });
    }
  });
  app2.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });
  setupAuth(app2);
  app2.get("/api/update-bonus-schema", async (req, res) => {
    try {
      console.log("Atualizando esquema do banco de dados para suportar sistema de b\xF4nus...");
      const bonusConfigQuery = `
        CREATE TABLE IF NOT EXISTS bonus_configurations (
          id SERIAL PRIMARY KEY,
          type TEXT NOT NULL,
          enabled BOOLEAN NOT NULL DEFAULT false,
          amount REAL NOT NULL DEFAULT 0,
          rollover_multiplier REAL NOT NULL DEFAULT 3,
          expiration_days INTEGER NOT NULL DEFAULT 7,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;
      await pool.query(bonusConfigQuery);
      const userBonusQuery = `
        CREATE TABLE IF NOT EXISTS user_bonuses (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          type TEXT NOT NULL,
          amount REAL NOT NULL,
          remaining_amount REAL NOT NULL,
          rollover_amount REAL NOT NULL,
          rolled_amount REAL NOT NULL DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'active',
          expires_at TIMESTAMP,
          completed_at TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          related_transaction_id INTEGER
        );
      `;
      await pool.query(userBonusQuery);
      const bannersQuery = `
        CREATE TABLE IF NOT EXISTS promotional_banners (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          image_url TEXT NOT NULL,
          link_url TEXT,
          enabled BOOLEAN NOT NULL DEFAULT false,
          show_on_login BOOLEAN NOT NULL DEFAULT false,
          start_date TIMESTAMP,
          end_date TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;
      await pool.query(bannersQuery);
      const systemSettingsQuery = `
        ALTER TABLE system_settings 
        ADD COLUMN IF NOT EXISTS signup_bonus_enabled BOOLEAN NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS signup_bonus_amount REAL NOT NULL DEFAULT 10,
        ADD COLUMN IF NOT EXISTS signup_bonus_rollover REAL NOT NULL DEFAULT 3,
        ADD COLUMN IF NOT EXISTS signup_bonus_expiration INTEGER NOT NULL DEFAULT 7,
        ADD COLUMN IF NOT EXISTS first_deposit_bonus_enabled BOOLEAN NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS first_deposit_bonus_amount REAL NOT NULL DEFAULT 100,
        ADD COLUMN IF NOT EXISTS first_deposit_bonus_rollover REAL NOT NULL DEFAULT 3,
        ADD COLUMN IF NOT EXISTS first_deposit_bonus_expiration INTEGER NOT NULL DEFAULT 7,
        ADD COLUMN IF NOT EXISTS first_deposit_bonus_percentage REAL NOT NULL DEFAULT 100,
        ADD COLUMN IF NOT EXISTS first_deposit_bonus_max_amount REAL NOT NULL DEFAULT 200,
        ADD COLUMN IF NOT EXISTS promotional_banners_enabled BOOLEAN NOT NULL DEFAULT false;
      `;
      await pool.query(systemSettingsQuery);
      console.log("\u2705 Esquema de b\xF4nus atualizado com sucesso!");
      res.json({
        success: true,
        message: "Esquema de b\xF4nus atualizado com sucesso!"
      });
    } catch (error) {
      console.error("\u274C ERRO ao atualizar esquema de b\xF4nus:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao atualizar o esquema de b\xF4nus",
        error: String(error)
      });
    }
  });
  app2.get("/api/admin/bonus-settings", requireAdmin, async (req, res) => {
    try {
      console.log("Obtendo configura\xE7\xF5es de b\xF4nus do sistema...");
      const result = await pool.query(`
        SELECT 
          signup_bonus_enabled,
          signup_bonus_amount,
          signup_bonus_rollover,
          signup_bonus_expiration,
          first_deposit_bonus_enabled,
          first_deposit_bonus_amount,
          first_deposit_bonus_percentage,
          first_deposit_bonus_max_amount,
          first_deposit_bonus_rollover,
          first_deposit_bonus_expiration,
          promotional_banners_enabled
        FROM system_settings
        WHERE id = (SELECT MAX(id) FROM system_settings)
      `);
      let settings;
      if (result.rows.length > 0) {
        console.log("Configura\xE7\xF5es de b\xF4nus obtidas diretamente do banco de dados.");
        settings = result.rows[0];
      } else {
        console.log("Tentando obter configura\xE7\xF5es via storage.getSystemSettings()...");
        settings = await storage.getSystemSettings();
      }
      const defaultConfig = {
        signupBonus: {
          enabled: false,
          amount: 10,
          rollover: 3,
          expiration: 7
        },
        firstDepositBonus: {
          enabled: false,
          amount: 100,
          percentage: 100,
          maxAmount: 200,
          rollover: 3,
          expiration: 7
        },
        promotionalBanners: {
          enabled: false
        }
      };
      const response = {
        signupBonus: {
          enabled: settings?.signup_bonus_enabled ?? false,
          amount: Number(settings?.signup_bonus_amount ?? defaultConfig.signupBonus.amount),
          rollover: Number(settings?.signup_bonus_rollover ?? defaultConfig.signupBonus.rollover),
          expiration: Number(settings?.signup_bonus_expiration ?? defaultConfig.signupBonus.expiration)
        },
        firstDepositBonus: {
          enabled: settings?.first_deposit_bonus_enabled ?? false,
          amount: Number(settings?.first_deposit_bonus_amount ?? defaultConfig.firstDepositBonus.amount),
          percentage: Number(settings?.first_deposit_bonus_percentage ?? defaultConfig.firstDepositBonus.percentage),
          maxAmount: Number(settings?.first_deposit_bonus_max_amount ?? defaultConfig.firstDepositBonus.maxAmount),
          rollover: Number(settings?.first_deposit_bonus_rollover ?? defaultConfig.firstDepositBonus.rollover),
          expiration: Number(settings?.first_deposit_bonus_expiration ?? defaultConfig.firstDepositBonus.expiration)
        },
        promotionalBanners: {
          enabled: settings?.promotional_banners_enabled ?? false
        }
      };
      console.log("Enviando resposta de configura\xE7\xF5es de b\xF4nus:", JSON.stringify(response));
      res.json(response);
    } catch (error) {
      console.error("Erro ao buscar configura\xE7\xF5es de b\xF4nus:", error);
      res.status(500).json({
        message: "Erro ao buscar configura\xE7\xF5es de b\xF4nus",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/admin/bonus-settings", requireAdmin, async (req, res) => {
    try {
      const updates = req.body;
      console.log("Recebendo atualiza\xE7\xE3o de configura\xE7\xF5es de b\xF4nus:", JSON.stringify(updates));
      const currentSettings = await storage.getSystemSettings();
      if (!currentSettings) {
        return res.status(500).json({
          message: "N\xE3o foi poss\xEDvel obter as configura\xE7\xF5es atuais do sistema"
        });
      }
      const updatedSettings = { ...currentSettings };
      if (updates.signupBonus) {
        updatedSettings.signupBonusEnabled = Boolean(updates.signupBonus.enabled);
        updatedSettings.signupBonusAmount = Number(updates.signupBonus.amount);
        updatedSettings.signupBonusRollover = Number(updates.signupBonus.rollover);
        updatedSettings.signupBonusExpiration = Number(updates.signupBonus.expiration);
      }
      if (updates.firstDepositBonus) {
        updatedSettings.firstDepositBonusEnabled = Boolean(updates.firstDepositBonus.enabled);
        updatedSettings.firstDepositBonusAmount = Number(updates.firstDepositBonus.amount);
        updatedSettings.firstDepositBonusPercentage = Number(updates.firstDepositBonus.percentage);
        updatedSettings.firstDepositBonusMaxAmount = Number(updates.firstDepositBonus.maxAmount);
        updatedSettings.firstDepositBonusRollover = Number(updates.firstDepositBonus.rollover);
        updatedSettings.firstDepositBonusExpiration = Number(updates.firstDepositBonus.expiration);
      }
      if (updates.promotionalBanners) {
        updatedSettings.promotionalBannersEnabled = Boolean(updates.promotionalBanners.enabled);
      }
      console.log("Valores sendo salvos:", JSON.stringify({
        signupBonusEnabled: updatedSettings.signupBonusEnabled,
        firstDepositBonusEnabled: updatedSettings.firstDepositBonusEnabled
      }));
      const result = await pool.query(`
        UPDATE system_settings 
        SET 
          signup_bonus_enabled = $1,
          signup_bonus_amount = $2,
          signup_bonus_rollover = $3,
          signup_bonus_expiration = $4,
          first_deposit_bonus_enabled = $5,
          first_deposit_bonus_amount = $6,
          first_deposit_bonus_percentage = $7,
          first_deposit_bonus_max_amount = $8,
          first_deposit_bonus_rollover = $9,
          first_deposit_bonus_expiration = $10,
          promotional_banners_enabled = $11,
          updated_at = NOW()
        WHERE id = (SELECT MAX(id) FROM system_settings)
        RETURNING *
      `, [
        updatedSettings.signupBonusEnabled,
        updatedSettings.signupBonusAmount,
        updatedSettings.signupBonusRollover,
        updatedSettings.signupBonusExpiration,
        updatedSettings.firstDepositBonusEnabled,
        updatedSettings.firstDepositBonusAmount,
        updatedSettings.firstDepositBonusPercentage,
        updatedSettings.firstDepositBonusMaxAmount,
        updatedSettings.firstDepositBonusRollover,
        updatedSettings.firstDepositBonusExpiration,
        updatedSettings.promotionalBannersEnabled
      ]);
      console.log("Configura\xE7\xF5es atualizadas com sucesso:", result.rowCount);
      res.json({
        success: true,
        message: "Configura\xE7\xF5es de b\xF4nus atualizadas com sucesso"
      });
    } catch (error) {
      console.error("Erro ao atualizar configura\xE7\xF5es de b\xF4nus:", error);
      res.status(500).json({
        message: "Erro ao atualizar configura\xE7\xF5es de b\xF4nus",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/admin/promotional-banners", requireAdmin, async (req, res) => {
    try {
      const banners = await storage.getPromotionalBanners();
      res.json(banners);
    } catch (error) {
      console.error("Erro ao buscar banners promocionais:", error);
      res.status(500).json({ message: "Erro ao buscar banners promocionais" });
    }
  });
  app2.post("/api/admin/promotional-banners", requireAdmin, async (req, res) => {
    try {
      const bannerData = req.body;
      if (!bannerData.title || !bannerData.imageUrl) {
        return res.status(400).json({ message: "T\xEDtulo e URL da imagem s\xE3o obrigat\xF3rios" });
      }
      const banner = await storage.createPromotionalBanner({
        title: bannerData.title,
        imageUrl: bannerData.imageUrl,
        linkUrl: bannerData.linkUrl,
        enabled: bannerData.enabled || false,
        showOnLogin: bannerData.showOnLogin || false,
        startDate: bannerData.startDate ? new Date(bannerData.startDate) : void 0,
        endDate: bannerData.endDate ? new Date(bannerData.endDate) : void 0
      });
      res.status(201).json(banner);
    } catch (error) {
      console.error("Erro ao criar banner promocional:", error);
      res.status(500).json({ message: "Erro ao criar banner promocional" });
    }
  });
  app2.put("/api/admin/promotional-banners/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bannerData = req.body;
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inv\xE1lido" });
      }
      if (!bannerData.title || !bannerData.imageUrl) {
        return res.status(400).json({ message: "T\xEDtulo e URL da imagem s\xE3o obrigat\xF3rios" });
      }
      const updatedBanner = await storage.updatePromotionalBanner(id, {
        title: bannerData.title,
        imageUrl: bannerData.imageUrl,
        linkUrl: bannerData.linkUrl,
        enabled: bannerData.enabled,
        showOnLogin: bannerData.showOnLogin,
        startDate: bannerData.startDate ? new Date(bannerData.startDate) : void 0,
        endDate: bannerData.endDate ? new Date(bannerData.endDate) : void 0
      });
      if (!updatedBanner) {
        return res.status(404).json({ message: "Banner n\xE3o encontrado" });
      }
      res.json(updatedBanner);
    } catch (error) {
      console.error("Erro ao atualizar banner promocional:", error);
      res.status(500).json({ message: "Erro ao atualizar banner promocional" });
    }
  });
  app2.delete("/api/admin/promotional-banners/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inv\xE1lido" });
      }
      const success = await storage.deletePromotionalBanner(id);
      if (!success) {
        return res.status(404).json({ message: "Banner n\xE3o encontrado" });
      }
      res.json({ success: true, message: "Banner exclu\xEDdo com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir banner promocional:", error);
      res.status(500).json({ message: "Erro ao excluir banner promocional" });
    }
  });
  app2.get("/api/promotional-banners", async (req, res) => {
    try {
      const banners = await storage.getPromotionalBanners(true);
      res.json(banners);
    } catch (error) {
      console.error("Erro ao buscar banners promocionais:", error);
      res.status(500).json({ message: "Erro ao buscar banners promocionais" });
    }
  });
  app2.get("/api/login-banners", async (req, res) => {
    try {
      const banners = await storage.getLoginBanners();
      res.json(banners);
    } catch (error) {
      console.error("Erro ao buscar banners de login:", error);
      res.status(500).json({ message: "Erro ao buscar banners de login" });
    }
  });
  const requireOwnership = (resourceType) => {
    return async (req, res, next) => {
      if (!req.isAuthenticated()) {
        console.log(`ACESSO NEGADO: Tentativa de acesso sem autentica\xE7\xE3o a ${resourceType}`);
        return res.status(401).json({ message: "N\xE3o autorizado" });
      }
      const userId = req.user.id;
      const username = req.user.username;
      const resourceId = parseInt(req.params.id);
      if (isNaN(resourceId)) {
        console.log(`ERRO DE VALIDA\xC7\xC3O: ID inv\xE1lido fornecido por ${username} (${userId}) para ${resourceType}`);
        return res.status(400).json({ message: "ID inv\xE1lido" });
      }
      if (req.user.isAdmin) {
        console.log(`ACESSO ADMIN: ${username} (${userId}) acessando ${resourceType} ${resourceId} como administrador`);
        let adminResource;
        try {
          switch (resourceType) {
            case "bet":
              adminResource = await storage.getBet(resourceId);
              break;
            case "transaction":
              adminResource = await storage.getPaymentTransaction(resourceId);
              break;
            default:
              throw new Error(`Tipo de recurso desconhecido: ${resourceType}`);
          }
          if (!adminResource) {
            return res.status(404).json({ message: `${resourceType} n\xE3o encontrado` });
          }
          if (adminResource.userId !== userId) {
            console.log(`AUDITORIA: Admin ${username} (${userId}) acessando ${resourceType} ${resourceId} do usu\xE1rio ${adminResource.userId}`);
          }
          req.resource = adminResource;
          return next();
        } catch (error) {
          console.error(`ERRO: Admin ${username} falhou ao acessar ${resourceType} ${resourceId}`, error);
          return res.status(500).json({ message: "Erro ao buscar recurso" });
        }
      }
      try {
        let resource;
        let ownerUserId;
        switch (resourceType) {
          case "bet":
            const betOwner = await db.select({ userId: bets.userId }).from(bets).where(eq3(bets.id, resourceId)).limit(1);
            if (betOwner.length === 0) {
              console.log(`RECURSO N\xC3O ENCONTRADO: Aposta ${resourceId} n\xE3o existe`);
              return res.status(404).json({ message: "Aposta n\xE3o encontrada" });
            }
            ownerUserId = betOwner[0].userId;
            if (ownerUserId !== userId) {
              console.log(`ACESSO NEGADO: Usu\xE1rio ${username} (${userId}) tentando acessar aposta ${resourceId} do usu\xE1rio ${ownerUserId}`);
              return res.status(403).json({ message: "Acesso negado: esse recurso n\xE3o pertence a voc\xEA" });
            }
            resource = await storage.getBet(resourceId);
            break;
          case "transaction":
            const txOwner = await db.select({ userId: paymentTransactions.userId }).from(paymentTransactions).where(eq3(paymentTransactions.id, resourceId)).limit(1);
            if (txOwner.length === 0) {
              console.log(`RECURSO N\xC3O ENCONTRADO: Transa\xE7\xE3o ${resourceId} n\xE3o existe`);
              return res.status(404).json({ message: "Transa\xE7\xE3o n\xE3o encontrada" });
            }
            ownerUserId = txOwner[0].userId;
            if (ownerUserId !== userId) {
              console.log(`ACESSO NEGADO: Usu\xE1rio ${username} (${userId}) tentando acessar transa\xE7\xE3o ${resourceId} do usu\xE1rio ${ownerUserId}`);
              return res.status(403).json({ message: "Acesso negado: esse recurso n\xE3o pertence a voc\xEA" });
            }
            resource = await storage.getPaymentTransaction(resourceId);
            break;
          default:
            console.error(`ERRO DE CONFIGURA\xC7\xC3O: Tipo de recurso desconhecido: ${resourceType}`);
            throw new Error(`Tipo de recurso desconhecido: ${resourceType}`);
        }
        if (!resource) {
          console.log(`ERRO DE CONSIST\xCANCIA: Recurso ${resourceType} ${resourceId} n\xE3o encontrado ap\xF3s verifica\xE7\xE3o preliminar`);
          return res.status(404).json({ message: `${resourceType} n\xE3o encontrado` });
        }
        if (resource.userId !== userId) {
          console.error(`ALERTA DE SEGURAN\xC7A: Falha na verifica\xE7\xE3o preliminar para ${resourceType} ${resourceId}. 
            Verifica\xE7\xE3o preliminar: pertence a ${ownerUserId}
            Verifica\xE7\xE3o final: pertence a ${resource.userId}
            Usu\xE1rio solicitante: ${userId}`);
          return res.status(403).json({ message: "Acesso negado: inconsist\xEAncia de propriedade" });
        }
        console.log(`ACESSO AUTORIZADO: Usu\xE1rio ${username} (${userId}) acessando seu pr\xF3prio ${resourceType} ${resourceId}`);
        req.resource = resource;
        next();
      } catch (error) {
        console.error(`ERRO NO MIDDLEWARE: Falha na verifica\xE7\xE3o de propriedade para ${resourceType} ${resourceId} solicitado por ${username} (${userId})`, error);
        res.status(500).json({ message: "Erro ao verificar permiss\xF5es" });
      }
    };
  };
  app2.get("/api/animals", async (req, res) => {
    try {
      const animals2 = await storage.getAllAnimals();
      res.json(animals2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching animals" });
    }
  });
  app2.get("/api/draws/upcoming", async (req, res) => {
    try {
      const draws2 = await storage.getUpcomingDraws();
      res.json(draws2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching upcoming draws" });
    }
  });
  app2.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSystemSettings();
      if (settings) {
        const publicSettings = {
          maxBetAmount: settings.maxBetAmount,
          maxPayout: settings.maxPayout,
          mainColor: settings.mainColor,
          secondaryColor: settings.secondaryColor,
          accentColor: settings.accentColor,
          allowUserRegistration: settings.allowUserRegistration,
          allowDeposits: settings.allowDeposits,
          allowWithdrawals: settings.allowWithdrawals,
          maintenanceMode: settings.maintenanceMode,
          // Informações sobre aprovação automática de saques
          autoApproveWithdrawals: settings.autoApproveWithdrawals,
          autoApproveWithdrawalLimit: settings.autoApproveWithdrawalLimit,
          // Informações de branding do site
          siteName: settings.siteName,
          siteDescription: settings.siteDescription,
          logoUrl: settings.logoUrl,
          faviconUrl: settings.faviconUrl,
          // Configurações de bônus
          signupBonusEnabled: settings.signupBonusEnabled || false,
          signupBonusAmount: settings.signupBonusAmount || 0,
          signupBonusRollover: settings.signupBonusRollover || 0,
          signupBonusExpiration: settings.signupBonusExpiration || 0,
          firstDepositBonusEnabled: settings.firstDepositBonusEnabled || false,
          firstDepositBonusAmount: settings.firstDepositBonusAmount || 0,
          firstDepositBonusPercentage: settings.firstDepositBonusPercentage || 0,
          firstDepositBonusMaxAmount: settings.firstDepositBonusMaxAmount || 0,
          firstDepositBonusRollover: settings.firstDepositBonusRollover || 0,
          firstDepositBonusExpiration: settings.firstDepositBonusExpiration || 0,
          promotionalBannersEnabled: settings.promotionalBannersEnabled || false
        };
        res.json(publicSettings);
      } else {
        const defaultSettings = {
          maxBetAmount: 5e3,
          maxPayout: 5e4,
          mainColor: "#4f46e5",
          secondaryColor: "#6366f1",
          accentColor: "#f97316",
          allowUserRegistration: true,
          allowDeposits: true,
          allowWithdrawals: true,
          maintenanceMode: false,
          autoApproveWithdrawals: false,
          autoApproveWithdrawalLimit: 0,
          // Informações de branding padrão
          siteName: "Jogo do Bicho",
          siteDescription: "A melhor plataforma de apostas online",
          logoUrl: "/img/logo.png",
          faviconUrl: "/favicon.ico",
          // Configurações de bônus padrão
          signupBonusEnabled: false,
          signupBonusAmount: 0,
          signupBonusRollover: 0,
          signupBonusExpiration: 0,
          firstDepositBonusEnabled: true,
          // Forçando a habilitação do bônus de primeiro depósito
          firstDepositBonusAmount: 100,
          firstDepositBonusPercentage: 100,
          firstDepositBonusMaxAmount: 200,
          firstDepositBonusRollover: 3,
          firstDepositBonusExpiration: 7,
          promotionalBannersEnabled: false,
          siteName: "Jogo do Bicho",
          siteDescription: "A melhor plataforma de apostas online",
          logoUrl: "/img/logo.png",
          faviconUrl: "/favicon.ico"
        };
        res.json(defaultSettings);
      }
    } catch (error) {
      console.error("Error fetching public system settings:", error);
      res.status(500).json({ message: "Error fetching system settings" });
    }
  });
  app2.get("/api/draw-templates", requireAuth, async (req, res) => {
    if (!req.user?.isAdmin) return res.sendStatus(403);
    const templates = await storage.getDrawTemplates();
    res.json(templates);
  });
  app2.post("/api/draw-templates", requireAuth, async (req, res) => {
    if (!req.user?.isAdmin) return res.sendStatus(403);
    const { name, time, daysOfWeek } = req.body;
    if (!name || !time || !daysOfWeek || !Array.isArray(daysOfWeek)) {
      return res.status(400).json({ message: "Dados inv\xE1lidos" });
    }
    try {
      const template = await storage.createDrawTemplate(req.body);
      drawScheduler.generateDailyDraws();
      res.status(201).json(template);
    } catch (error) {
      logger_default.error("Erro ao criar template:", error);
      res.status(500).json({ message: "Erro ao criar template" });
    }
  });
  app2.put("/api/draw-templates/:id", requireAuth, async (req, res) => {
    if (!req.user?.isAdmin) return res.sendStatus(403);
    const id = parseInt(req.params.id);
    try {
      const updated = await storage.updateDrawTemplate(id, req.body);
      if (!updated) return res.status(404).json({ message: "Template n\xE3o encontrado" });
      drawScheduler.generateDailyDraws();
      res.json(updated);
    } catch (error) {
      logger_default.error("Erro ao atualizar template:", error);
      res.status(500).json({ message: "Erro ao atualizar template" });
    }
  });
  app2.delete("/api/draw-templates/:id", requireAuth, async (req, res) => {
    if (!req.user?.isAdmin) return res.sendStatus(403);
    const id = parseInt(req.params.id);
    try {
      await storage.deleteDrawTemplate(id);
      res.sendStatus(204);
    } catch (error) {
      logger_default.error("Erro ao deletar template:", error);
      res.status(500).json({ message: "Erro ao deletar template" });
    }
  });
  app2.get("/api/draws/results", async (req, res) => {
    try {
      const dateParam = req.query.date;
      let date;
      if (dateParam) {
        date = new Date(dateParam);
        if (isNaN(date.getTime())) {
          return res.status(400).json({ message: "Invalid date format" });
        }
      } else {
        date = /* @__PURE__ */ new Date();
      }
      const results = await storage.getCompletedDraws(date);
      res.json(results);
    } catch (error) {
      console.error("Error fetching draw results:", error);
      res.status(500).json({ message: "Error fetching draw results" });
    }
  });
  app2.get("/api/draws/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const results = await storage.getRecentDraws(limit);
      res.json(results);
    } catch (error) {
      console.error("Error fetching recent draws:", error);
      res.status(500).json({ message: "Error fetching recent draws" });
    }
  });
  app2.get("/api/draws", requireAuth, async (req, res) => {
    try {
      const draws2 = await storage.getAllDraws();
      res.json(draws2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching draws" });
    }
  });
  app2.post("/api/draws", requireAdmin, async (req, res) => {
    try {
      console.log("Dados recebidos para cria\xE7\xE3o de sorteio:", req.body);
      const validatedData = insertDrawSchema.parse(req.body);
      let formattedData = {
        ...validatedData,
        date: typeof validatedData.date === "string" ? new Date(validatedData.date) : validatedData.date
      };
      console.log("Dados formatados para cria\xE7\xE3o de sorteio:", formattedData);
      const draw = await storage.createDraw(formattedData);
      console.log("Sorteio criado com sucesso:", draw);
      res.status(201).json(draw);
    } catch (error) {
      console.error("Erro ao criar sorteio:", error);
      if (error instanceof z6.ZodError) {
        console.error("Erros de valida\xE7\xE3o:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ message: "Invalid draw data", errors: error.errors });
      }
      res.status(500).json({
        message: "Error creating draw",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.put("/api/draws/:id", requireAdmin, async (req, res) => {
    try {
      const drawId = parseInt(req.params.id);
      console.log("Dados recebidos para atualiza\xE7\xE3o de sorteio:", req.body);
      let drawData = req.body;
      if (drawData.date && typeof drawData.date === "string") {
        drawData = {
          ...drawData,
          date: new Date(drawData.date)
        };
      }
      console.log("Dados formatados para atualiza\xE7\xE3o de sorteio:", drawData);
      const hasResults = drawData.resultAnimalId || drawData.resultAnimalId2 || drawData.resultAnimalId3 || drawData.resultAnimalId4 || drawData.resultAnimalId5 || drawData.resultAnimalId6 || drawData.resultAnimalId7 || drawData.resultAnimalId8 || drawData.resultAnimalId9 || drawData.resultAnimalId10;
      let updatedDraw;
      if (hasResults && drawData.resultAnimalId) {
        console.log("\u{1F3AF} Detectado adi\xE7\xE3o de resultados - processando apostas...");
        updatedDraw = await storage.updateDrawResult(
          drawId,
          drawData.resultAnimalId,
          drawData.resultAnimalId2,
          drawData.resultAnimalId3,
          drawData.resultAnimalId4,
          drawData.resultAnimalId5,
          drawData.resultAnimalId6,
          drawData.resultAnimalId7,
          drawData.resultAnimalId8,
          drawData.resultAnimalId9,
          drawData.resultAnimalId10,
          drawData.resultNumber1,
          drawData.resultNumber2,
          drawData.resultNumber3,
          drawData.resultNumber4,
          drawData.resultNumber5,
          drawData.resultNumber6,
          drawData.resultNumber7,
          drawData.resultNumber8,
          drawData.resultNumber9,
          drawData.resultNumber10
        );
        console.log("\u2705 Apostas processadas com sucesso!");
      } else {
        updatedDraw = await storage.updateDraw(drawId, drawData);
      }
      if (!updatedDraw) {
        return res.status(404).json({ message: "Sorteio n\xE3o encontrado" });
      }
      console.log("Sorteio atualizado com sucesso:", updatedDraw);
      res.json(updatedDraw);
    } catch (error) {
      console.error("Error updating draw:", error);
      res.status(500).json({
        message: "Erro ao atualizar sorteio",
        error: String(error)
      });
    }
  });
  app2.delete("/api/draws/:id", requireAdmin, async (req, res) => {
    try {
      const drawId = parseInt(req.params.id);
      await storage.deleteDraw(drawId);
      res.status(200).json({ message: "Sorteio exclu\xEDdo com sucesso" });
    } catch (error) {
      console.error("Error deleting draw:", error);
      res.status(500).json({
        message: "Erro ao excluir sorteio",
        error: String(error)
      });
    }
  });
  app2.put("/api/draws/:id/result", requireAdmin, async (req, res) => {
    try {
      const drawId = Number(req.params.id);
      const {
        animalId,
        // 1º prêmio (obrigatório) 
        animalId2,
        // 2º prêmio (opcional)
        animalId3,
        // 3º prêmio (opcional)
        animalId4,
        // 4º prêmio (opcional)
        animalId5,
        // 5º prêmio (opcional)
        animalId6,
        // 6º prêmio (opcional)
        animalId7,
        // 7º prêmio (opcional)
        animalId8,
        // 8º prêmio (opcional)
        animalId9,
        // 9º prêmio (opcional)
        animalId10,
        // 10º prêmio (opcional)
        resultNumber1,
        // Número do 1º prêmio (obrigatório para Milhar/Centena/Dezena)
        resultNumber2,
        // Número do 2º prêmio (opcional)
        resultNumber3,
        // Número do 3º prêmio (opcional)
        resultNumber4,
        // Número do 4º prêmio (opcional)
        resultNumber5,
        // Número do 5º prêmio (opcional)
        resultNumber6,
        // Número do 6º prêmio (opcional)
        resultNumber7,
        // Número do 7º prêmio (opcional)
        resultNumber8,
        // Número do 8º prêmio (opcional)
        resultNumber9,
        // Número do 9º prêmio (opcional)
        resultNumber10
        // Número do 10º prêmio (opcional)
      } = req.body;
      console.log(`Processing draw result: Draw ID: ${drawId}
        1\xBA pr\xEAmio: Animal ${animalId}, N\xFAmero ${resultNumber1 || "n\xE3o definido"}
        2\xBA pr\xEAmio: Animal ${animalId2 || "n\xE3o definido"}, N\xFAmero ${resultNumber2 || "n\xE3o definido"}
        3\xBA pr\xEAmio: Animal ${animalId3 || "n\xE3o definido"}, N\xFAmero ${resultNumber3 || "n\xE3o definido"}
        4\xBA pr\xEAmio: Animal ${animalId4 || "n\xE3o definido"}, N\xFAmero ${resultNumber4 || "n\xE3o definido"}
        5\xBA pr\xEAmio: Animal ${animalId5 || "n\xE3o definido"}, N\xFAmero ${resultNumber5 || "n\xE3o definido"}
        6\xBA pr\xEAmio: Animal ${animalId6 || "n\xE3o definido"}, N\xFAmero ${resultNumber6 || "n\xE3o definido"}
        7\xBA pr\xEAmio: Animal ${animalId7 || "n\xE3o definido"}, N\xFAmero ${resultNumber7 || "n\xE3o definido"}
        8\xBA pr\xEAmio: Animal ${animalId8 || "n\xE3o definido"}, N\xFAmero ${resultNumber8 || "n\xE3o definido"}
        9\xBA pr\xEAmio: Animal ${animalId9 || "n\xE3o definido"}, N\xFAmero ${resultNumber9 || "n\xE3o definido"}
        10\xBA pr\xEAmio: Animal ${animalId10 || "n\xE3o definido"}, N\xFAmero ${resultNumber10 || "n\xE3o definido"}
      `);
      if (!animalId || typeof animalId !== "number") {
        console.error(`Invalid animal ID for 1st prize: ${animalId}`);
        return res.status(400).json({ message: "ID de animal inv\xE1lido para o 1\xBA pr\xEAmio" });
      }
      if (!resultNumber1) {
        console.error(`Missing number for 1st prize`);
        return res.status(400).json({ message: "N\xFAmero para o 1\xBA pr\xEAmio \xE9 obrigat\xF3rio" });
      }
      const draw = await storage.getDraw(drawId);
      if (!draw) {
        console.error(`Draw not found: ${drawId}`);
        return res.status(404).json({ message: "Sorteio n\xE3o encontrado" });
      }
      const animalIds = [animalId];
      if (animalId2) animalIds.push(animalId2);
      if (animalId3) animalIds.push(animalId3);
      if (animalId4) animalIds.push(animalId4);
      if (animalId5) animalIds.push(animalId5);
      if (animalId6) animalIds.push(animalId6);
      if (animalId7) animalIds.push(animalId7);
      if (animalId8) animalIds.push(animalId8);
      if (animalId9) animalIds.push(animalId9);
      if (animalId10) animalIds.push(animalId10);
      for (const id of animalIds) {
        const animal = await storage.getAnimal(id);
        if (!animal) {
          console.error(`Animal not found: ${id}`);
          return res.status(404).json({ message: `Animal com ID ${id} n\xE3o encontrado` });
        }
      }
      const formattedNumber1 = resultNumber1.padStart(4, "0");
      const formattedNumber2 = resultNumber2 ? resultNumber2.padStart(4, "0") : void 0;
      const formattedNumber3 = resultNumber3 ? resultNumber3.padStart(4, "0") : void 0;
      const formattedNumber4 = resultNumber4 ? resultNumber4.padStart(4, "0") : void 0;
      const formattedNumber5 = resultNumber5 ? resultNumber5.padStart(4, "0") : void 0;
      const formattedNumber6 = resultNumber6 ? resultNumber6.padStart(4, "0") : void 0;
      const formattedNumber7 = resultNumber7 ? resultNumber7.padStart(4, "0") : void 0;
      const formattedNumber8 = resultNumber8 ? resultNumber8.padStart(4, "0") : void 0;
      const formattedNumber9 = resultNumber9 ? resultNumber9.padStart(4, "0") : void 0;
      const formattedNumber10 = resultNumber10 ? resultNumber10.padStart(4, "0") : void 0;
      console.log(`Processing draw ${drawId} with multiple prize animals and numbers`);
      const updatedDraw = await storage.updateDrawResult(
        drawId,
        animalId,
        animalId2,
        animalId3,
        animalId4,
        animalId5,
        animalId6,
        animalId7,
        animalId8,
        animalId9,
        animalId10,
        formattedNumber1,
        formattedNumber2,
        formattedNumber3,
        formattedNumber4,
        formattedNumber5,
        formattedNumber6,
        formattedNumber7,
        formattedNumber8,
        formattedNumber9,
        formattedNumber10
      );
      if (!updatedDraw) {
        console.error(`Failed to update draw result for draw ${drawId}`);
        return res.status(500).json({ message: "Erro ao atualizar resultado do sorteio" });
      }
      console.log(`Draw result processed successfully, invalidating caches`);
      req.app.emit("draw:result", {
        drawId,
        animalId,
        animalId2,
        animalId3,
        animalId4,
        animalId5,
        animalId6,
        animalId7,
        animalId8,
        animalId9,
        animalId10,
        resultNumber1: formattedNumber1,
        resultNumber2: formattedNumber2,
        resultNumber3: formattedNumber3,
        resultNumber4: formattedNumber4,
        resultNumber5: formattedNumber5,
        resultNumber6: formattedNumber6,
        resultNumber7: formattedNumber7,
        resultNumber8: formattedNumber8,
        resultNumber9: formattedNumber9,
        resultNumber10: formattedNumber10
      });
      res.json(updatedDraw);
    } catch (error) {
      console.error(`Error processing draw result: ${error}`);
      res.status(500).json({ message: "Erro ao processar resultado do sorteio" });
    }
  });
  app2.post("/api/draws/:id/auto-update", requireAdmin, async (req, res) => {
    try {
      const drawId = Number(req.params.id);
      logger_default.info(`[API] Solicita\xE7\xE3o de atualiza\xE7\xE3o autom\xE1tica para extra\xE7\xE3o ID: ${drawId}`);
      const { autoUpdateService: autoUpdateService2 } = await Promise.resolve().then(() => (init_auto_update_results(), auto_update_results_exports));
      const success = await autoUpdateService2.updateDrawById(drawId);
      if (!success) {
        return res.status(404).json({
          message: "N\xE3o foi poss\xEDvel atualizar o resultado. Verifique se a extra\xE7\xE3o existe e se o nome corresponde ao site."
        });
      }
      const updatedDraw = await db.select().from(draws).where(eq3(draws.id, drawId)).limit(1);
      if (updatedDraw.length === 0) {
        return res.status(404).json({ message: "Extra\xE7\xE3o n\xE3o encontrada" });
      }
      logger_default.info(`[API] Extra\xE7\xE3o ${drawId} atualizada automaticamente com sucesso`);
      res.json(updatedDraw[0]);
    } catch (error) {
      logger_default.error(`[API] Erro ao atualizar resultado automaticamente:`, error);
      res.status(500).json({ message: "Erro ao buscar resultado automaticamente" });
    }
  });
  app2.post("/api/draws/:id/reprocess-bets", requireAdmin, async (req, res) => {
    try {
      const drawId = Number(req.params.id);
      console.log(`[REPROCESS] Iniciando reprocessamento de apostas para extra\xE7\xE3o ID: ${drawId}`);
      const [draw] = await db.select().from(draws).where(eq3(draws.id, drawId)).limit(1);
      if (!draw) {
        return res.status(404).json({ message: "Extra\xE7\xE3o n\xE3o encontrada" });
      }
      if (draw.status !== "completed") {
        return res.status(400).json({ message: "Extra\xE7\xE3o ainda n\xE3o tem resultados" });
      }
      if (!draw.resultAnimalId) {
        return res.status(400).json({ message: "Extra\xE7\xE3o n\xE3o tem 1\xBA pr\xEAmio definido" });
      }
      console.log(`[REPROCESS] Extra\xE7\xE3o encontrada: ${draw.name}, Status: ${draw.status}`);
      console.log(`[REPROCESS] Chamando updateDrawResult para reprocessar...`);
      await storage.updateDrawResult(
        draw.id,
        draw.resultAnimalId,
        draw.resultAnimalId2 || void 0,
        draw.resultAnimalId3 || void 0,
        draw.resultAnimalId4 || void 0,
        draw.resultAnimalId5 || void 0,
        draw.resultAnimalId6 || void 0,
        draw.resultAnimalId7 || void 0,
        draw.resultAnimalId8 || void 0,
        draw.resultAnimalId9 || void 0,
        draw.resultAnimalId10 || void 0,
        draw.resultNumber1 || void 0,
        draw.resultNumber2 || void 0,
        draw.resultNumber3 || void 0,
        draw.resultNumber4 || void 0,
        draw.resultNumber5 || void 0,
        draw.resultNumber6 || void 0,
        draw.resultNumber7 || void 0,
        draw.resultNumber8 || void 0,
        draw.resultNumber9 || void 0,
        draw.resultNumber10 || void 0
      );
      console.log(`[REPROCESS] \u2705 Apostas reprocessadas com sucesso!`);
      res.json({
        message: "Apostas reprocessadas com sucesso",
        drawId: draw.id,
        drawName: draw.name
      });
    } catch (error) {
      console.error(`[REPROCESS] \u274C Erro ao reprocessar apostas:`, error);
      res.status(500).json({ message: "Erro ao reprocessar apostas" });
    }
  });
  app2.post("/api/bets", requireAuth, validate(createBetValidator), async (req, res) => {
    try {
      const userId = req.user.id;
      logger_default.info(`Creating bet for user ID: ${userId}`);
      logger_default.debug("Bet request data:", req.body);
      logger_default.debug(`DEBUG - Bet request useBonusBalance: ${req.body.useBonusBalance} (${typeof req.body.useBonusBalance})`);
      const requestData = {
        ...req.body,
        userId,
        useBonusBalance: req.body.useBonusBalance === true || req.body.useBonusBalance === "true"
      };
      const validatedData = insertBetSchema.parse(requestData);
      console.log("Validated bet data:", validatedData);
      console.log("DEBUG - Validated useBonusBalance:", validatedData.useBonusBalance, typeof validatedData.useBonusBalance);
      const systemSettings2 = await storage.getSystemSettings();
      console.log("System settings for bet limits:", {
        maxBetAmount: systemSettings2?.maxBetAmount,
        maxPayout: systemSettings2?.maxPayout,
        allowBonusBets: systemSettings2?.allowBonusBets
      });
      console.log("[DEBUG] Sistema permite apostas com b\xF4nus:", systemSettings2?.allowBonusBets);
      console.log("[DEBUG] Corpo da requisi\xE7\xE3o:", req.body);
      console.log("[DEBUG] useBonusBalance no corpo:", req.body.useBonusBalance);
      if (req.body.useBonusBalance && (!systemSettings2 || !systemSettings2.allowBonusBets)) {
        console.log("User attempted to use bonus balance when bonus bets are disabled");
        return res.status(400).json({
          message: "Apostas com saldo de b\xF4nus n\xE3o est\xE3o habilitadas no momento"
        });
      }
      if (systemSettings2 && systemSettings2.minBetAmount && validatedData.amount < systemSettings2.minBetAmount) {
        console.log(`Bet amount below minimum allowed: ${validatedData.amount} < ${systemSettings2.minBetAmount}`);
        return res.status(400).json({
          message: `O valor m\xEDnimo de aposta \xE9 de R$ ${systemSettings2.minBetAmount.toFixed(2).replace(".", ",")}`,
          currentAmount: validatedData.amount,
          minAllowed: systemSettings2.minBetAmount
        });
      }
      if (systemSettings2 && systemSettings2.maxBetAmount && validatedData.amount > systemSettings2.maxBetAmount) {
        console.log(`Bet amount exceeds maximum allowed: ${validatedData.amount} > ${systemSettings2.maxBetAmount}`);
        return res.status(400).json({
          message: `A aposta m\xE1xima permitida \xE9 de R$ ${systemSettings2.maxBetAmount.toFixed(2).replace(".", ",")}`,
          currentAmount: validatedData.amount,
          maxAllowed: systemSettings2.maxBetAmount
        });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        console.log(`User not found: ${userId}`);
        return res.status(404).json({ message: "User not found" });
      }
      if (req.body.useBonusBalance) {
        console.log("[DEBUG] User is attempting to use bonus balance for this bet");
        const activeBonus2 = await storage.getUserActiveBonus(userId);
        console.log("[DEBUG] B\xF4nus ativo encontrado:", activeBonus2);
        const bonusBalance = await storage.getUserBonusBalance(userId);
        console.log(`[DEBUG] User bonus balance: ${bonusBalance}, Bet amount: ${validatedData.amount}`);
        if (bonusBalance < validatedData.amount) {
          console.log(`[DEBUG] Insufficient bonus balance: ${bonusBalance} < ${validatedData.amount}`);
          return res.status(400).json({
            message: "Saldo de b\xF4nus insuficiente para realizar esta aposta",
            currentBonusBalance: bonusBalance,
            requiredAmount: validatedData.amount
          });
        }
        console.log("[DEBUG] Usu\xE1rio tem saldo de b\xF4nus suficiente, apostando com saldo de b\xF4nus");
        validatedData.useBonusBalance = true;
      } else {
        console.log(`User balance: ${user.balance}, Bet amount: ${validatedData.amount}`);
        if (user.balance < validatedData.amount) {
          console.log(`Insufficient balance: ${user.balance} < ${validatedData.amount}`);
          if (systemSettings2?.allowBonusBets) {
            const bonusBalance = await storage.getUserBonusBalance(userId);
            console.log(`[DEBUG] Verificando saldo de b\xF4nus automaticamente: ${bonusBalance}`);
            if (bonusBalance >= validatedData.amount) {
              console.log(`[DEBUG] Usu\xE1rio tem saldo de b\xF4nus suficiente, utilizando automaticamente`);
              validatedData.useBonusBalance = true;
            } else {
              return res.status(400).json({
                message: "Saldo insuficiente para realizar esta aposta",
                currentBalance: user.balance,
                currentBonusBalance: bonusBalance,
                requiredAmount: validatedData.amount
              });
            }
          } else {
            return res.status(400).json({
              message: "Saldo insuficiente para realizar esta aposta",
              currentBalance: user.balance,
              requiredAmount: validatedData.amount
            });
          }
        } else {
          validatedData.useBonusBalance = false;
        }
      }
      const draw = await storage.getDraw(validatedData.drawId);
      if (!draw) {
        console.log(`Draw not found: ${validatedData.drawId}`);
        return res.status(404).json({ message: "Sorteio n\xE3o encontrado" });
      }
      if (draw.status !== "pending") {
        console.log(`Draw not pending: ${draw.status}`);
        return res.status(400).json({ message: "Este sorteio n\xE3o est\xE1 mais aceitando apostas" });
      }
      const now = /* @__PURE__ */ new Date();
      const brtOffset = 3 * 60 * 60 * 1e3;
      const brtNow = new Date(now.getTime() - brtOffset);
      const bufferTime = 10 * 60 * 1e3;
      const cutoffTime = new Date(brtNow.getTime() + bufferTime);
      const [hours, minutes] = draw.time.split(":").map(Number);
      const drawDateTime = new Date(draw.date);
      drawDateTime.setHours(hours, minutes, 0, 0);
      if (drawDateTime <= cutoffTime) {
        console.log(`Draw closed for betting: ${draw.name} (${draw.time})`);
        console.log(`  Draw Time (BRT): ${drawDateTime.toISOString()}`);
        console.log(`  Cutoff Time (BRT + 10min): ${cutoffTime.toISOString()}`);
        return res.status(400).json({
          message: "Este sorteio j\xE1 come\xE7ou ou est\xE1 no per\xEDodo de fechamento (10 min antes)",
          detail: "Apostas s\xF3 s\xE3o permitidas at\xE9 10 minutos antes do sorteio."
        });
      }
      console.log(`Validating animals for bet type: ${validatedData.type}`);
      if (["group"].includes(validatedData.type)) {
        console.log("Validando aposta por grupo com body:", req.body);
        if (req.body.numbers) {
          console.log(`Encontrado 'numbers' no corpo: ${req.body.numbers}`);
          if (!validatedData.betNumbers) validatedData.betNumbers = [];
          validatedData.betNumbers.push(req.body.numbers);
        }
        if (!validatedData.animalId && (!validatedData.betNumbers || !validatedData.betNumbers.length)) {
          return res.status(400).json({ message: "Animal ou n\xFAmero \xE9 obrigat\xF3rio para apostas de grupo" });
        }
        if (validatedData.animalId) {
          const animal = await storage.getAnimal(validatedData.animalId);
          if (!animal) {
            console.log(`Animal not found: ${validatedData.animalId}`);
            return res.status(404).json({ message: "Animal n\xE3o encontrado" });
          }
          console.log(`Animal found for GROUP bet: ${animal.name} (${animal.group})`);
        } else if (validatedData.betNumbers && validatedData.betNumbers.length > 0) {
          console.log(`Using numeric input for GROUP bet: ${validatedData.betNumbers.join(", ")}`);
        }
      } else if (["duque_grupo", "passe_ida", "passe_ida_volta"].includes(validatedData.type)) {
        if (!validatedData.animalId || !validatedData.animalId2) {
          return res.status(400).json({ message: "Dois animais s\xE3o obrigat\xF3rios para este tipo de aposta" });
        }
        const animal1 = await storage.getAnimal(validatedData.animalId);
        if (!animal1) {
          console.log(`First animal not found: ${validatedData.animalId}`);
          return res.status(404).json({ message: "Primeiro animal n\xE3o encontrado" });
        }
        const animal2 = await storage.getAnimal(validatedData.animalId2);
        if (!animal2) {
          console.log(`Second animal not found: ${validatedData.animalId2}`);
          return res.status(404).json({ message: "Segundo animal n\xE3o encontrado" });
        }
        console.log(`2 animals found for ${validatedData.type} bet: ${animal1.name} and ${animal2.name}`);
      } else if (["terno_grupo"].includes(validatedData.type)) {
        if (!validatedData.animalId || !validatedData.animalId2 || !validatedData.animalId3) {
          return res.status(400).json({ message: "Tr\xEAs animais s\xE3o obrigat\xF3rios para este tipo de aposta" });
        }
        const animalIds = [validatedData.animalId, validatedData.animalId2, validatedData.animalId3];
        for (const id of animalIds) {
          const animal = await storage.getAnimal(id);
          if (!animal) {
            console.log(`Animal not found: ${id}`);
            return res.status(404).json({ message: `Animal com ID ${id} n\xE3o encontrado` });
          }
        }
        console.log(`3 animals validated for terno_grupo bet`);
      } else if (["quadra_duque"].includes(validatedData.type)) {
        if (!validatedData.animalId || !validatedData.animalId2 || !validatedData.animalId3 || !validatedData.animalId4) {
          return res.status(400).json({ message: "Quatro animais s\xE3o obrigat\xF3rios para este tipo de aposta" });
        }
        const animalIds = [
          validatedData.animalId,
          validatedData.animalId2,
          validatedData.animalId3,
          validatedData.animalId4
        ];
        for (const id of animalIds) {
          const animal = await storage.getAnimal(id);
          if (!animal) {
            console.log(`Animal not found: ${id}`);
            return res.status(404).json({ message: `Animal com ID ${id} n\xE3o encontrado` });
          }
        }
        console.log(`4 animals validated for quadra_duque bet`);
      } else if (["quina_grupo"].includes(validatedData.type)) {
        if (!validatedData.animalId || !validatedData.animalId2 || !validatedData.animalId3 || !validatedData.animalId4 || !validatedData.animalId5) {
          return res.status(400).json({ message: "Cinco animais s\xE3o obrigat\xF3rios para este tipo de aposta" });
        }
        const animalIds = [
          validatedData.animalId,
          validatedData.animalId2,
          validatedData.animalId3,
          validatedData.animalId4,
          validatedData.animalId5
        ];
        for (const id of animalIds) {
          const animal = await storage.getAnimal(id);
          if (!animal) {
            console.log(`Animal not found: ${id}`);
            return res.status(404).json({ message: `Animal com ID ${id} n\xE3o encontrado` });
          }
        }
        console.log(`5 animals validated for quina_grupo bet`);
      } else if (["dozen", "hundred", "thousand"].includes(validatedData.type)) {
        console.log("Validando aposta num\xE9rica com body:", req.body);
        if (req.body.betNumber) {
          console.log(`Encontrado betNumber no corpo da requisi\xE7\xE3o: ${req.body.betNumber}`);
          if (!validatedData.betNumbers) validatedData.betNumbers = [];
          validatedData.betNumbers.push(String(req.body.betNumber));
        }
        if (req.body.numbers) {
          console.log(`Encontrado campo numbers no corpo da requisi\xE7\xE3o: ${req.body.numbers}`);
          if (!validatedData.betNumbers) validatedData.betNumbers = [];
          validatedData.betNumbers.push(String(req.body.numbers));
        }
        if (!validatedData.betNumbers || !validatedData.betNumbers.length) {
          return res.status(400).json({ message: "N\xFAmeros da aposta s\xE3o obrigat\xF3rios para este tipo de aposta" });
        }
        let expectedLength = 0;
        if (validatedData.type === "dozen") {
          expectedLength = 2;
          validatedData.gameModeId = 4;
          console.log("FOR\xC7ANDO gameModeId para 4 (Dezena)");
        } else if (validatedData.type === "hundred") {
          expectedLength = 3;
          validatedData.gameModeId = 2;
          console.log("FOR\xC7ANDO gameModeId para 2 (Centena)");
        } else if (validatedData.type === "thousand") {
          expectedLength = 4;
          validatedData.gameModeId = 1;
          console.log("FOR\xC7ANDO gameModeId para 1 (Milhar)");
        }
        validatedData.betNumbers = validatedData.betNumbers.map((num) => {
          let cleanNum = String(num).trim();
          cleanNum = cleanNum.replace(/\D/g, "");
          return cleanNum;
        });
        console.log(`N\xFAmeros formatados ap\xF3s processamento: ${validatedData.betNumbers.join(", ")}`);
        for (const num of validatedData.betNumbers) {
          const tipoAposta = validatedData.type === "dozen" ? "dezena" : validatedData.type === "hundred" ? "centena" : "milhar";
          if (num.length !== expectedLength) {
            return res.status(400).json({
              message: `Para apostar na ${tipoAposta}, voc\xEA deve digitar exatamente ${expectedLength} n\xFAmeros. Por favor, tente novamente.`,
              expectedLength,
              receivedLength: num.length,
              receivedValue: num
            });
          }
          if (!/^\d+$/.test(num)) {
            return res.status(400).json({
              message: `O n\xFAmero da aposta deve conter apenas d\xEDgitos (0-9). Valor recebido: "${num}"`
            });
          }
        }
        console.log(`N\xFAmeros formatados corretamente: ${validatedData.betNumbers.join(", ")}`);
        console.log(`Number-based bet: ${validatedData.type} - ${validatedData.betNumbers.join(", ")}`);
      } else if (["duque_dezena"].includes(validatedData.type)) {
        console.log("Validando aposta de duque dezena com body:", req.body);
        if (req.body.numbers) {
          const extractedNumbers = req.body.numbers.split(/[,\s\-]+/).filter((n) => n.trim().length > 0);
          console.log(`Extra\xEDdos n\xFAmeros de 'numbers': ${extractedNumbers.join(", ")}`);
          if (extractedNumbers.length > 0) {
            if (!validatedData.betNumbers) validatedData.betNumbers = [];
            validatedData.betNumbers = validatedData.betNumbers.concat(extractedNumbers);
          }
        }
        if (!validatedData.betNumbers || validatedData.betNumbers.length !== 2) {
          return res.status(400).json({ message: "Duas dezenas s\xE3o obrigat\xF3rias para apostas de duque de dezena" });
        }
        validatedData.betNumbers = validatedData.betNumbers.map((num) => {
          let cleaned = num.replace(/\D/g, "");
          if (cleaned.length !== 2) {
            console.log(`Dezena inv\xE1lida para duque: ${cleaned} (deve ter exatamente 2 d\xEDgitos)`);
          }
          return cleaned;
        });
        console.log(`Dezenas para duque: ${validatedData.betNumbers.join(", ")}`);
        if (validatedData.betNumbers.some((n) => n.length !== 2)) {
          return res.status(400).json({ message: "Apostas de duque de dezena devem ter dezenas com 2 d\xEDgitos" });
        }
        console.log(`Duque dezena bet: ${validatedData.betNumbers.join(", ")}`);
      } else if (["terno_dezena"].includes(validatedData.type)) {
        console.log("Validando aposta de terno dezena com body:", req.body);
        if (req.body.numbers) {
          const extractedNumbers = req.body.numbers.split(/[,\s\-]+/).filter((n) => n.trim().length > 0);
          console.log(`Extra\xEDdos n\xFAmeros de 'numbers': ${extractedNumbers.join(", ")}`);
          if (extractedNumbers.length > 0) {
            if (!validatedData.betNumbers) validatedData.betNumbers = [];
            validatedData.betNumbers = validatedData.betNumbers.concat(extractedNumbers);
          }
        }
        if (!validatedData.betNumbers || validatedData.betNumbers.length !== 3) {
          return res.status(400).json({ message: "Tr\xEAs dezenas s\xE3o obrigat\xF3rias para apostas de terno de dezena" });
        }
        validatedData.betNumbers = validatedData.betNumbers.map((num) => {
          let cleaned = num.replace(/\D/g, "");
          if (cleaned.length !== 2) {
            console.log(`Dezena inv\xE1lida para terno: ${cleaned} (deve ter exatamente 2 d\xEDgitos)`);
          }
          return cleaned;
        });
        console.log(`Dezenas para terno: ${validatedData.betNumbers.join(", ")}`);
        if (validatedData.betNumbers.some((n) => n.length !== 2)) {
          return res.status(400).json({ message: "Apostas de terno de dezena devem ter dezenas com 2 d\xEDgitos" });
        }
        console.log(`Terno dezena bet: ${validatedData.betNumbers.join(", ")}`);
      } else {
        return res.status(400).json({ message: `Tipo de aposta inv\xE1lido: ${validatedData.type}` });
      }
      if (validatedData.gameModeId) {
        console.log(`========= VERIFICANDO MODALIDADE =========`);
        console.log(`Tipo de aposta: ${validatedData.type}`);
        console.log(`GameModeID: ${validatedData.gameModeId}`);
        console.log(`N\xFAmeros: ${validatedData.betNumbers?.join(", ") || "nenhum"}`);
        console.log(`=========================================`);
        const gameMode = await storage.getGameMode(validatedData.gameModeId);
        if (!gameMode) {
          console.log(`Game mode not found: ${validatedData.gameModeId}`);
          return res.status(404).json({ message: "Modalidade de jogo n\xE3o encontrada" });
        }
        console.log(`Game mode found: ${gameMode.name}, active: ${gameMode.active}`);
        if (!gameMode.active) {
          return res.status(400).json({ message: "Esta modalidade de jogo n\xE3o est\xE1 ativa no momento" });
        }
        const allowedGameModes = {
          "thousand": [1],
          // ID 1 = Milhar
          "hundred": [2],
          // ID 2 = Centena
          "dozen": [4]
          // ID 4 = Dezena
        };
        if (validatedData.type in allowedGameModes) {
          if (!allowedGameModes[validatedData.type].includes(gameMode.id)) {
            console.log(`Invalid game mode for bet type. Type: ${validatedData.type}, GameMode ID: ${gameMode.id}, Allowed: ${allowedGameModes[validatedData.type].join(",")}`);
            let suggestedGameMode = "";
            if (validatedData.type === "thousand") suggestedGameMode = "Milhar";
            else if (validatedData.type === "hundred") suggestedGameMode = "Centena";
            else if (validatedData.type === "dozen") suggestedGameMode = "Dezena";
            return res.status(400).json({
              message: `Tipo de aposta "${validatedData.type}" \xE9 incompat\xEDvel com a modalidade "${gameMode.name}". Use a modalidade "${suggestedGameMode}".`,
              gameModeSuggestion: suggestedGameMode,
              currentGameMode: gameMode.name
            });
          }
        }
        const oddsDivisor = validatedData.premioType === "1-5" ? 5 : 1;
        const adjustedOdds = gameMode.odds / oddsDivisor;
        const calculatedWinAmount = Math.floor(validatedData.amount * adjustedOdds);
        console.log(`C\xE1lculo de potencial de ganho no servidor:`, {
          gameMode: gameMode.name,
          originalOdds: gameMode.odds,
          premioType: validatedData.premioType,
          oddsDivisor,
          adjustedOdds,
          amount: validatedData.amount,
          calculatedWinAmount,
          providedWinAmount: validatedData.potentialWinAmount
        });
        if (systemSettings2 && systemSettings2.maxPayout && calculatedWinAmount > systemSettings2.maxPayout) {
          console.log(`Potential win amount exceeds maximum allowed: ${calculatedWinAmount} > ${systemSettings2.maxPayout}`);
          const maxBetAllowed = systemSettings2.maxPayout / gameMode.odds;
          return res.status(400).json({
            message: `A premia\xE7\xE3o m\xE1xima permitida \xE9 de R$ ${systemSettings2.maxPayout}`,
            calculatedPayout: calculatedWinAmount,
            maxAllowed: systemSettings2.maxPayout,
            suggestion: `Reduza o valor da aposta para no m\xE1ximo R$ ${maxBetAllowed.toFixed(2).replace(".", ",")}`
          });
        }
        if (validatedData.potentialWinAmount) {
          if (Math.abs(calculatedWinAmount - validatedData.potentialWinAmount) > 1) {
            console.log(`Adjusting potential win amount from ${validatedData.potentialWinAmount} to ${calculatedWinAmount}`);
            validatedData.potentialWinAmount = calculatedWinAmount;
          }
        } else {
          console.log(`Setting potential win amount to ${calculatedWinAmount}`);
          validatedData.potentialWinAmount = calculatedWinAmount;
        }
      }
      console.log(`Deducting ${validatedData.amount} from user balance`);
      const activeBonus = await storage.getUserActiveBonus(userId);
      if (activeBonus) {
        console.log(`Usu\xE1rio ${userId} tem b\xF4nus ativo: ${activeBonus.type}, valor restante: ${activeBonus.remainingAmount}, progresso de rollover: ${activeBonus.rolledAmount}/${activeBonus.rolloverAmount}`);
        await storage.updateUserBonusProgress(activeBonus.id, validatedData.amount);
        console.log(`Progresso de rollover atualizado para b\xF4nus ${activeBonus.id}`);
      }
      if (validatedData.useBonusBalance) {
        console.log(`Deduzindo ${validatedData.amount} do saldo de b\xF4nus`);
        const bonusesUsed = await storage.deductFromBonusBalance(userId, validatedData.amount);
        console.log(`Saldo de b\xF4nus deduzido: ${bonusesUsed.map((b) => `ID ${b.id}: ${b.amountUsed}`).join(", ")}`);
      } else {
        console.log(`Deduzindo ${validatedData.amount} do saldo real`);
        await storage.updateUserBalance(userId, -validatedData.amount);
      }
      console.log("Creating bet in the database");
      const bet = await storage.createBet(validatedData);
      await storage.createTransaction({
        userId,
        type: "bet",
        amount: -validatedData.amount,
        // valor negativo para indicar saída
        description: `Aposta em ${bet.type} - ${bet.id}`,
        relatedId: bet.id
      });
      console.log("Bet created successfully:", bet);
      res.status(201).json(bet);
    } catch (error) {
      console.error("Error creating bet:", error);
      if (error instanceof z6.ZodError) {
        return res.status(400).json({ message: "Dados da aposta inv\xE1lidos", errors: error.errors });
      }
      res.status(500).json({ message: "Erro ao criar aposta", error: String(error) });
    }
  });
  app2.get("/api/user/winnings", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await db.execute(
        sql2`SELECT COALESCE(SUM(win_amount), 0) as total_winnings 
            FROM bets 
            WHERE user_id = ${userId} AND status = 'won'`
      );
      const totalWinnings = parseFloat(result.rows[0]?.total_winnings || "0");
      console.log(`Total de ganhos do usu\xE1rio ${userId}: R$ ${totalWinnings.toFixed(2)}`);
      res.json({ totalWinnings });
    } catch (error) {
      console.error("Erro ao calcular ganhos totais:", error);
      res.status(500).json({ message: "Erro ao calcular ganhos" });
    }
  });
  app2.get("/api/bets", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const username = req.user.username;
      console.log(`REQUISI\xC7\xC3O: Usu\xE1rio ${username} (${userId}) solicitando suas apostas`);
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
      console.log(`SEGURAN\xC7A: Consultando apostas do usu\xE1rio ${userId} diretamente no banco de dados com filtragem`);
      const userBetsFromDb = await db.select().from(bets).where(eq3(bets.userId, userId)).orderBy(sortOrder === "desc" ? desc2(bets.createdAt) : asc2(bets.createdAt));
      console.log(`BANCO: Consulta retornou ${userBetsFromDb.length} apostas para usu\xE1rio ${userId}`);
      const betsFromStorage = await storage.getBetsByUserId(userId);
      console.log(`STORAGE: Servi\xE7o retornou ${betsFromStorage.length} apostas para usu\xE1rio ${userId}`);
      const dbBetIds = new Set(userBetsFromDb.map((bet) => bet.id));
      const storageBetIds = new Set(betsFromStorage.map((bet) => bet.id));
      const onlyInDb = Array.from(dbBetIds).filter((id) => !storageBetIds.has(id));
      const onlyInStorage = Array.from(storageBetIds).filter((id) => !dbBetIds.has(id));
      if (onlyInDb.length > 0 || onlyInStorage.length > 0) {
        console.error(`ALERTA DE SEGURAN\xC7A: Inconsist\xEAncia na recupera\xE7\xE3o de apostas para usu\xE1rio ${userId}!
          Apostas apenas no banco: ${onlyInDb.join(", ")}
          Apostas apenas no storage: ${onlyInStorage.join(", ")}
        `);
      }
      const userBets = userBetsFromDb.filter((bet) => bet.userId === userId);
      if (userBets.length !== userBetsFromDb.length) {
        console.error(`VIOLA\xC7\xC3O DE SEGURAN\xC7A CR\xCDTICA: Encontradas ${userBetsFromDb.length - userBets.length} apostas 
          de outros usu\xE1rios no resultado ap\xF3s filtragem por SQL! 
          Usu\xE1rio: ${username} (${userId})
          Apostas removidas: ${userBetsFromDb.filter((bet) => bet.userId !== userId).map((bet) => `ID ${bet.id} (user ${bet.userId})`).join(", ")}
        `);
      } else {
        console.log(`VERIFICA\xC7\xC3O FINAL: Todas as ${userBets.length} apostas pertencem ao usu\xE1rio ${userId}`);
      }
      const betsWithDetails = betsFromStorage;
      const totalItems = betsWithDetails.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);
      const paginatedItems = betsWithDetails.slice(startIndex, endIndex);
      console.log(`RESPOSTA: Enviando ${paginatedItems.length} apostas para usu\xE1rio ${username} (${userId}), p\xE1gina ${page} de ${totalPages}`);
      res.json({
        data: paginatedItems,
        meta: {
          total: totalItems,
          page,
          pageSize,
          totalPages
        }
      });
    } catch (error) {
      console.error(`ERRO: Falha ao buscar apostas para usu\xE1rio ${req.user.id}:`, error);
      res.status(500).json({ message: "Erro ao buscar apostas" });
    }
  });
  app2.get("/api/bets/:id", requireOwnership("bet"), async (req, res) => {
    try {
      res.json(req.resource);
    } catch (error) {
      console.error("Error fetching bet:", error);
      res.status(500).json({ message: "Error fetching bet" });
    }
  });
  app2.post("/api/user/change-password", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      const user = await storage.getUserByUsername(req.user.username);
      if (!user) {
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      if (user.id !== userId) {
        console.log(`Security: User ${userId} attempted to change password for user ${user.id}`);
        return res.status(403).json({ message: "Acesso negado: voc\xEA s\xF3 pode alterar sua pr\xF3pria senha" });
      }
      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Senha atual incorreta" });
      }
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(user.id, { password: hashedPassword });
      res.status(200).json({ message: "Senha alterada com sucesso" });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      res.status(500).json({ message: "Erro ao alterar senha" });
    }
  });
  app2.put("/api/user/pix-key", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { pixKey, pixKeyType } = req.body;
      if (!pixKey || !pixKeyType) {
        return res.status(400).json({ message: "Chave PIX e tipo s\xE3o obrigat\xF3rios" });
      }
      const validTypes = ["cpf", "email", "phone", "random"];
      if (!validTypes.includes(pixKeyType)) {
        return res.status(400).json({ message: "Tipo de chave PIX inv\xE1lido" });
      }
      if (pixKeyType === "cpf" && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/.test(pixKey)) {
        return res.status(400).json({ message: "Formato de CPF inv\xE1lido" });
      }
      if (pixKeyType === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixKey)) {
        return res.status(400).json({ message: "Formato de e-mail inv\xE1lido" });
      }
      if (pixKeyType === "phone" && !/^(\+\d{2})?\s*(\(\d{2}\))?\s*\d{4,5}-?\d{4}$/.test(pixKey)) {
        return res.status(400).json({ message: "Formato de telefone inv\xE1lido" });
      }
      console.log(`Atualizando email do usu\xE1rio ${userId} para uso como chave PIX: ${pixKey}`);
      const updatedUser = await storage.updateUser(userId, {
        email: pixKey
      });
      if (!updatedUser) {
        return res.status(500).json({ message: "Erro ao atualizar chave PIX" });
      }
      res.status(200).json({
        message: "Chave PIX atualizada com sucesso",
        pixKey,
        pixKeyType
      });
    } catch (error) {
      console.error("Erro ao atualizar chave PIX:", error);
      res.status(500).json({ message: "Erro ao atualizar chave PIX" });
    }
  });
  app2.post("/api/users/balance", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { amount, type } = req.body;
      if (!amount || typeof amount !== "number" || !["deposit", "withdraw"].includes(type)) {
        return res.status(400).json({ message: "Invalid request data" });
      }
      console.log(`Request for ${type} operation with amount ${amount}`);
      const systemSettings2 = await storage.getSystemSettings();
      console.log("System settings:", JSON.stringify(systemSettings2, null, 2));
      if (type === "withdraw") {
        console.log(`Withdraw operation attempted. allowWithdrawals = ${systemSettings2?.allowWithdrawals}`);
        if (systemSettings2 && systemSettings2.allowWithdrawals === false) {
          console.log("Withdrawals are disabled in system settings. Blocking operation.");
          return res.status(403).json({ message: "Saques est\xE3o temporariamente desativados" });
        }
      }
      if (type === "deposit") {
        console.log(`Deposit operation attempted. allowDeposits = ${systemSettings2?.allowDeposits}`);
        if (systemSettings2 && systemSettings2.allowDeposits === false) {
          console.log("Deposits are disabled in system settings. Blocking operation.");
          return res.status(403).json({ message: "Dep\xF3sitos est\xE3o temporariamente desativados" });
        }
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (type === "withdraw" && user.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      const finalAmount = type === "deposit" ? amount : -amount;
      console.log(`Proceeding with ${type} operation, updating balance by ${finalAmount}`);
      const updatedUser = await storage.updateUserBalance(userId, finalAmount);
      if (updatedUser) {
        const { password, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
      } else {
        res.status(500).json({ message: "Error updating balance" });
      }
    } catch (error) {
      console.error("Error updating balance:", error);
      res.status(500).json({ message: "Error updating balance" });
    }
  });
  app2.get("/api/users", requireAdmin, async (req, res) => {
    try {
      const usersQuery = await pool.query(`
        SELECT u.*, COALESCE(ub.bonus_balance, 0) as bonus_balance,
               COALESCE(u.blocked, false) as blocked,
               u.block_reason
        FROM users u
        LEFT JOIN (
          SELECT user_id, SUM(remaining_amount) as bonus_balance
          FROM user_bonuses 
          WHERE status = 'active' AND (expires_at IS NULL OR expires_at > NOW())
          GROUP BY user_id
        ) ub ON u.id = ub.user_id
        ORDER BY u.created_at DESC
      `);
      const sanitizedUsers = usersQuery.rows.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return {
          ...userWithoutPassword,
          bonusBalance: parseFloat(user.bonus_balance) || 0,
          blocked: user.blocked || false
        };
      });
      res.json(sanitizedUsers);
    } catch (error) {
      console.error("Error fetching users with bonus balance:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  });
  app2.get("/api/admin/bets", requireAdmin, async (req, res) => {
    try {
      console.log("Admin fetching bets with pagination");
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 50;
      const status = req.query.status || null;
      const search = req.query.search || null;
      const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
      const offset = (page - 1) * pageSize;
      const { bets: bets2, total } = await storage.getPaginatedBets({
        page,
        pageSize,
        status,
        search,
        sortOrder
      });
      console.log(`Found ${bets2.length} bets for page ${page} (offset: ${offset}, pageSize: ${pageSize})`);
      console.log(`Total bets matching criteria: ${total}`);
      const sanitizedBets = bets2.map((bet) => ({
        ...bet,
        // Removendo informações sensíveis do usuário
        userId: bet.userId,
        // Mantendo apenas o ID do usuário
        user: null
        // Removendo objeto de usuário, se houver
      }));
      res.json({
        data: sanitizedBets,
        meta: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize)
        }
      });
    } catch (error) {
      console.error("Error in GET /api/admin/bets:", error);
      res.status(500).json({ message: "Error fetching bets", error: String(error) });
    }
  });
  app2.get("/api/admin/stats/popular", requireAdmin, async (req, res) => {
    try {
      const popularAnimals = await storage.getPopularAnimals();
      res.json(popularAnimals);
    } catch (error) {
      res.status(500).json({ message: "Error fetching popular animals" });
    }
  });
  app2.post("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      } else {
        res.status(500).json({ message: "Error creating user" });
      }
    } catch (error) {
      if (error instanceof z6.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });
  app2.put("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const updatedUser = await storage.updateUser(userId, req.body);
      if (updatedUser) {
        const { password, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
      } else {
        res.status(500).json({ message: "Error updating user" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  });
  app2.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.isAdmin) {
        return res.status(400).json({ message: "Cannot delete admin user" });
      }
      await storage.deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  });
  app2.post("/api/admin/users/:id/balance", requireAdmin, async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const { amount } = req.body;
      if (typeof amount !== "number") {
        return res.status(400).json({ message: "Invalid amount" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const updatedUser = await storage.updateUserBalance(userId, amount);
      if (updatedUser) {
        const { password, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
      } else {
        res.status(500).json({ message: "Error updating user balance" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating user balance" });
    }
  });
  app2.get("/api/admin/users/:id/bonus-balance", requireAdmin, async (req, res) => {
    try {
      const userId = Number(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "ID de usu\xE1rio inv\xE1lido" });
      }
      const bonusBalance = await storage.getUserBonusBalance(userId);
      return res.status(200).json({ bonusBalance });
    } catch (error) {
      console.error("Erro ao obter saldo de b\xF4nus:", error);
      return res.status(500).json({ message: "Erro ao obter saldo de b\xF4nus" });
    }
  });
  app2.get("/api/game-modes", async (req, res) => {
    try {
      const gameModes2 = await storage.getAllGameModes();
      res.json(gameModes2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching game modes" });
    }
  });
  app2.get("/api/game-modes/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const gameMode = await storage.getGameMode(id);
      if (!gameMode) {
        return res.status(404).json({ message: "Game mode not found" });
      }
      res.json(gameMode);
    } catch (error) {
      res.status(500).json({ message: "Error fetching game mode" });
    }
  });
  app2.post("/api/game-modes", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertGameModeSchema.parse(req.body);
      const existing = await storage.getGameModeByName(validatedData.name);
      if (existing) {
        return res.status(400).json({ message: "A game mode with this name already exists" });
      }
      const gameMode = await storage.createGameMode(validatedData);
      res.status(201).json(gameMode);
    } catch (error) {
      if (error instanceof z6.ZodError) {
        return res.status(400).json({ message: "Invalid game mode data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating game mode" });
    }
  });
  app2.put("/api/game-modes/:id", requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const gameMode = await storage.getGameMode(id);
      if (!gameMode) {
        return res.status(404).json({ message: "Game mode not found" });
      }
      if (req.body.name && req.body.name !== gameMode.name) {
        const existing = await storage.getGameModeByName(req.body.name);
        if (existing) {
          return res.status(400).json({ message: "A game mode with this name already exists" });
        }
      }
      const updatedGameMode = await storage.updateGameMode(id, req.body);
      res.json(updatedGameMode);
    } catch (error) {
      res.status(500).json({ message: "Error updating game mode" });
    }
  });
  app2.delete("/api/game-modes/:id", requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const gameMode = await storage.getGameMode(id);
      if (!gameMode) {
        return res.status(404).json({ message: "Game mode not found" });
      }
      await storage.deleteGameMode(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting game mode" });
    }
  });
  app2.patch("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      console.log("PATCH request to update system settings:", req.body);
      console.log("Valores de b\xF4nus recebidos:", {
        signupBonusEnabled: req.body.signupBonusEnabled,
        firstDepositBonusEnabled: req.body.firstDepositBonusEnabled
      });
      const currentSettings = await storage.getSystemSettings();
      if (!currentSettings) {
        return res.status(404).json({ error: "System settings not found" });
      }
      const mergedSettings = {
        ...currentSettings,
        ...req.body,
        // Garantir que os campos obrigatórios estejam presentes
        maxBetAmount: req.body.maxBetAmount || currentSettings.maxBetAmount,
        maxPayout: req.body.maxPayout || currentSettings.maxPayout,
        minBetAmount: req.body.minBetAmount || currentSettings.minBetAmount,
        defaultBetAmount: req.body.defaultBetAmount || currentSettings.defaultBetAmount,
        mainColor: req.body.mainColor || currentSettings.mainColor,
        secondaryColor: req.body.secondaryColor || currentSettings.secondaryColor,
        accentColor: req.body.accentColor || currentSettings.accentColor,
        // IMPORTANTE: Valores booleanos precisam ser verificados explicitamente como "!== undefined"
        // ou o valor false será substituído pelo valor padrão!
        // Adicionar explicitamente os campos de bônus com seus valores corretos da requisição
        // Configurações de bônus de cadastro
        signupBonusEnabled: req.body.signupBonusEnabled !== void 0 ? Boolean(req.body.signupBonusEnabled) : Boolean(currentSettings.signupBonusEnabled),
        signupBonusAmount: req.body.signupBonusAmount !== void 0 ? Number(req.body.signupBonusAmount) : Number(currentSettings.signupBonusAmount || 10),
        signupBonusRollover: req.body.signupBonusRollover !== void 0 ? Number(req.body.signupBonusRollover) : Number(currentSettings.signupBonusRollover || 3),
        signupBonusExpiration: req.body.signupBonusExpiration !== void 0 ? Number(req.body.signupBonusExpiration) : Number(currentSettings.signupBonusExpiration || 7),
        // Configurações de bônus de primeiro depósito
        firstDepositBonusEnabled: req.body.firstDepositBonusEnabled !== void 0 ? Boolean(req.body.firstDepositBonusEnabled) : Boolean(currentSettings.firstDepositBonusEnabled),
        firstDepositBonusAmount: req.body.firstDepositBonusAmount !== void 0 ? Number(req.body.firstDepositBonusAmount) : Number(currentSettings.firstDepositBonusAmount || 100),
        firstDepositBonusPercentage: req.body.firstDepositBonusPercentage !== void 0 ? Number(req.body.firstDepositBonusPercentage) : Number(currentSettings.firstDepositBonusPercentage || 100),
        firstDepositBonusMaxAmount: req.body.firstDepositBonusMaxAmount !== void 0 ? Number(req.body.firstDepositBonusMaxAmount) : Number(currentSettings.firstDepositBonusMaxAmount || 200),
        firstDepositBonusRollover: req.body.firstDepositBonusRollover !== void 0 ? Number(req.body.firstDepositBonusRollover) : Number(currentSettings.firstDepositBonusRollover || 3),
        firstDepositBonusExpiration: req.body.firstDepositBonusExpiration !== void 0 ? Number(req.body.firstDepositBonusExpiration) : Number(currentSettings.firstDepositBonusExpiration || 7),
        // Banners promocionais
        promotionalBannersEnabled: req.body.promotionalBannersEnabled !== void 0 ? Boolean(req.body.promotionalBannersEnabled) : Boolean(currentSettings.promotionalBannersEnabled),
        signupBonusBannerEnabled: req.body.signupBonusBannerEnabled !== void 0 ? Boolean(req.body.signupBonusBannerEnabled) : Boolean(currentSettings.signupBonusBannerEnabled),
        firstDepositBonusBannerEnabled: req.body.firstDepositBonusBannerEnabled !== void 0 ? Boolean(req.body.firstDepositBonusBannerEnabled) : Boolean(currentSettings.firstDepositBonusBannerEnabled)
      };
      console.log("Merged settings to save:", mergedSettings);
      const settings = await storage.saveSystemSettings(mergedSettings);
      return res.json(settings);
    } catch (error) {
      console.error("Error updating system settings:", error);
      return res.status(500).json({ error: "Failed to update system settings" });
    }
  });
  app2.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      try {
        const checkColumnsQuery = `
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'system_settings' 
            AND column_name IN (
              'site_name', 'site_description', 'logo_url', 'favicon_url',
              'signup_bonus_enabled', 'signup_bonus_amount', 'signup_bonus_rollover', 'signup_bonus_expiration',
              'first_deposit_bonus_enabled', 'first_deposit_bonus_amount', 'first_deposit_bonus_percentage',
              'first_deposit_bonus_max_amount', 'first_deposit_bonus_rollover', 'first_deposit_bonus_expiration',
              'promotional_banners_enabled'
            )
        `;
        const columnResult = await pool.query(checkColumnsQuery);
        const expectedColumns = 15;
        if (columnResult.rowCount < expectedColumns) {
          console.log("Atualizando esquema para adicionar colunas de branding e b\xF4nus...");
          const alterBrandingQuery = `
            ALTER TABLE system_settings 
            ADD COLUMN IF NOT EXISTS site_name TEXT NOT NULL DEFAULT 'Jogo do Bicho',
            ADD COLUMN IF NOT EXISTS site_description TEXT NOT NULL DEFAULT 'A melhor plataforma de apostas online',
            ADD COLUMN IF NOT EXISTS logo_url TEXT NOT NULL DEFAULT '/img/logo.png',
            ADD COLUMN IF NOT EXISTS favicon_url TEXT NOT NULL DEFAULT '/img/favicon.png'
          `;
          await pool.query(alterBrandingQuery);
          const alterBonusQuery = `
            ALTER TABLE system_settings 
            ADD COLUMN IF NOT EXISTS signup_bonus_enabled BOOLEAN NOT NULL DEFAULT false,
            ADD COLUMN IF NOT EXISTS signup_bonus_amount NUMERIC(15,2) NOT NULL DEFAULT 10,
            ADD COLUMN IF NOT EXISTS signup_bonus_rollover NUMERIC(15,2) NOT NULL DEFAULT 3,
            ADD COLUMN IF NOT EXISTS signup_bonus_expiration INTEGER NOT NULL DEFAULT 7,
            ADD COLUMN IF NOT EXISTS first_deposit_bonus_enabled BOOLEAN NOT NULL DEFAULT false,
            ADD COLUMN IF NOT EXISTS first_deposit_bonus_amount NUMERIC(15,2) NOT NULL DEFAULT 100,
            ADD COLUMN IF NOT EXISTS first_deposit_bonus_percentage NUMERIC(15,2) NOT NULL DEFAULT 100,
            ADD COLUMN IF NOT EXISTS first_deposit_bonus_max_amount NUMERIC(15,2) NOT NULL DEFAULT 200,
            ADD COLUMN IF NOT EXISTS first_deposit_bonus_rollover NUMERIC(15,2) NOT NULL DEFAULT 3,
            ADD COLUMN IF NOT EXISTS first_deposit_bonus_expiration INTEGER NOT NULL DEFAULT 7,
            ADD COLUMN IF NOT EXISTS promotional_banners_enabled BOOLEAN NOT NULL DEFAULT false
          `;
          await pool.query(alterBonusQuery);
          console.log("\u2705 Esquema atualizado com sucesso com colunas de b\xF4nus!");
          const { rows } = await pool.query(`
            SELECT column_name, data_type
            FROM information_schema.columns 
            WHERE table_name = 'system_settings'
            ORDER BY ordinal_position
          `);
          console.log("Estrutura atual da tabela:");
          rows.forEach((col) => {
            console.log(`  - ${col.column_name} (${col.data_type})`);
          });
        }
      } catch (schemaError) {
        console.error("Erro ao verificar/atualizar schema:", schemaError);
      }
      const settings = await storage.getSystemSettings();
      if (settings) {
        const { rows } = await pool.query("SELECT * FROM system_settings WHERE id = 1");
        if (rows.length > 0) {
          const dbSettings = rows[0];
          if (dbSettings.site_name) settings.siteName = dbSettings.site_name;
          if (dbSettings.site_description) settings.siteDescription = dbSettings.site_description;
          if (dbSettings.logo_url) settings.logoUrl = dbSettings.logo_url;
          if (dbSettings.favicon_url) settings.faviconUrl = dbSettings.favicon_url;
        }
        res.json(settings);
      } else {
        const defaultSettings = {
          maxBetAmount: 50,
          maxPayout: 500,
          minBetAmount: 0.5,
          // 0.50 reais (valor real)
          defaultBetAmount: 2,
          // 2.00 reais (valor real)
          mainColor: "#4f46e5",
          secondaryColor: "#6366f1",
          accentColor: "#f97316",
          allowUserRegistration: true,
          allowDeposits: true,
          allowWithdrawals: true,
          maintenanceMode: false,
          autoApproveWithdrawals: true,
          // Habilitar aprovação automática por padrão
          autoApproveWithdrawalLimit: 30,
          // Limite padrão de R$ 30,00
          siteName: "Jogo do Bicho",
          siteDescription: "A melhor plataforma de apostas online",
          logoUrl: "/img/logo.png",
          faviconUrl: "/img/favicon.png"
        };
        await storage.saveSystemSettings(defaultSettings);
        res.json(defaultSettings);
      }
    } catch (error) {
      console.error("Error fetching system settings:", error);
      res.status(500).json({ message: "Error fetching system settings" });
    }
  });
  app2.get("/api/admin/update-system-schema", requireAdmin, async (req, res) => {
    try {
      console.log("Atualizando esquema do sistema...");
      const { rows } = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'system_settings' 
        AND column_name IN ('site_name', 'site_description', 'logo_url', 'favicon_url')
      `);
      const existingColumns = rows.map((row) => row.column_name);
      console.log("Colunas existentes:", existingColumns);
      const columnsToAdd = [];
      if (!existingColumns.includes("site_name")) columnsToAdd.push("site_name TEXT NOT NULL DEFAULT 'Jogo do Bicho'");
      if (!existingColumns.includes("site_description")) columnsToAdd.push("site_description TEXT NOT NULL DEFAULT 'A melhor plataforma de apostas online'");
      if (!existingColumns.includes("logo_url")) columnsToAdd.push("logo_url TEXT NOT NULL DEFAULT '/img/logo.png'");
      if (!existingColumns.includes("favicon_url")) columnsToAdd.push("favicon_url TEXT NOT NULL DEFAULT '/img/favicon.png'");
      if (columnsToAdd.length > 0) {
        const alterQuery = `
          ALTER TABLE system_settings 
          ${columnsToAdd.map((col) => `ADD COLUMN IF NOT EXISTS ${col}`).join(", ")}
        `;
        console.log("Executando query:", alterQuery);
        await pool.query(alterQuery);
        console.log(`\u2705 Sucesso! Adicionadas ${columnsToAdd.length} novas colunas \xE0 tabela system_settings.`);
        res.json({
          success: true,
          message: `${columnsToAdd.length} colunas adicionadas com sucesso`,
          columns: columnsToAdd
        });
      } else {
        console.log("\u2705 Todos os campos j\xE1 existem na tabela system_settings.");
        res.json({
          success: true,
          message: "Schema j\xE1 est\xE1 atualizado",
          columns: []
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar esquema do sistema:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao atualizar esquema do sistema",
        error: error.message
      });
    }
  });
  app2.post("/api/admin/upload-image", requireAdmin, async (req, res) => {
    try {
      console.log("Recebendo solicita\xE7\xE3o de upload de imagem");
      const { imageData, imageType } = req.body;
      if (!imageData || !imageType) {
        console.log("Erro: Dados de imagem incompletos");
        return res.status(400).json({
          success: false,
          message: "Dados de imagem e tipo s\xE3o obrigat\xF3rios"
        });
      }
      console.log(`Tipo de imagem recebido: ${imageType}`);
      if (imageType !== "logo" && imageType !== "favicon" && imageType !== "bannerDesktop" && imageType !== "bannerMobile") {
        console.log("Erro: Tipo de imagem inv\xE1lido:", imageType);
        return res.status(400).json({
          success: false,
          message: "Tipo de imagem deve ser 'logo', 'favicon', 'bannerDesktop' ou 'bannerMobile'"
        });
      }
      if (!imageData.startsWith("data:image/")) {
        return res.status(400).json({
          success: false,
          message: "Dados de imagem inv\xE1lidos. Deve ser uma string base64 v\xE1lida"
        });
      }
      const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({
          success: false,
          message: "Formato de dados de imagem inv\xE1lido"
        });
      }
      const contentType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");
      let extension = "";
      if (contentType === "image/png") {
        extension = ".png";
      } else if (contentType === "image/jpeg" || contentType === "image/jpg") {
        extension = ".jpg";
      } else if (contentType === "image/svg+xml") {
        extension = ".svg";
      } else if (contentType === "image/x-icon") {
        extension = ".ico";
      } else {
        return res.status(400).json({
          success: false,
          message: "Tipo de imagem n\xE3o suportado. Use PNG, JPEG, SVG ou ICO"
        });
      }
      let fileName;
      if (imageType === "logo") {
        fileName = "logo" + extension;
      } else if (imageType === "favicon") {
        fileName = "favicon" + extension;
      } else if (imageType === "bannerDesktop") {
        fileName = "banner-desktop" + extension;
      } else if (imageType === "bannerMobile") {
        fileName = "banner-mobile" + extension;
      }
      const pathsToSave = [];
      if (imageType === "logo" || imageType === "bannerDesktop" || imageType === "bannerMobile") {
        pathsToSave.push(path2.join(process.cwd(), "client", "public", "img", fileName));
      } else {
        pathsToSave.push(path2.join(process.cwd(), "client", "public", fileName));
        pathsToSave.push(path2.join(process.cwd(), "client", "public", "img", fileName));
      }
      if (process.env.NODE_ENV === "production") {
        if (imageType === "logo" || imageType === "bannerDesktop" || imageType === "bannerMobile") {
          pathsToSave.push(path2.join(process.cwd(), "dist", "public", "img", fileName));
        } else {
          pathsToSave.push(path2.join(process.cwd(), "dist", "public", fileName));
          pathsToSave.push(path2.join(process.cwd(), "dist", "public", "img", fileName));
        }
      }
      console.log(`Salvando imagem em ${pathsToSave.length} locais:`, pathsToSave);
      for (const savePath of pathsToSave) {
        try {
          const directory = path2.dirname(savePath);
          if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
          }
          fs.writeFileSync(savePath, buffer);
          console.log(`Imagem salva com sucesso em: ${savePath}`);
        } catch (err) {
          console.error(`Erro ao salvar imagem em ${savePath}:`, err);
        }
      }
      const imageUrl = `/img/${fileName}`;
      let settings = await storage.getSystemSettings();
      if (!settings) {
        settings = {
          maxBetAmount: 50,
          maxPayout: 500,
          minBetAmount: 0.5,
          defaultBetAmount: 2,
          mainColor: "#4f46e5",
          secondaryColor: "#6366f1",
          accentColor: "#f97316",
          allowUserRegistration: true,
          allowDeposits: true,
          allowWithdrawals: true,
          maintenanceMode: false,
          autoApproveWithdrawals: true,
          autoApproveWithdrawalLimit: 30,
          siteName: "Jogo do Bicho",
          siteDescription: "A melhor plataforma de apostas online",
          logoUrl: "/img/logo.png",
          faviconUrl: "/img/favicon.png"
        };
      }
      if (imageType === "logo") {
        settings.logoUrl = imageUrl;
      } else if (imageType === "favicon") {
        settings.faviconUrl = imageUrl;
      } else if (imageType === "bannerDesktop") {
        settings.bannerDesktopUrl = imageUrl;
      } else if (imageType === "bannerMobile") {
        settings.bannerMobileUrl = imageUrl;
      }
      await storage.saveSystemSettings(settings);
      res.json({
        success: true,
        message: `Imagem ${imageType} enviada com sucesso`,
        imageUrl
      });
    } catch (error) {
      console.error(`Erro ao enviar imagem ${req.body?.imageType}:`, error);
      let errorMessage = "Erro desconhecido";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object") {
        errorMessage = String(error);
      }
      res.status(500).json({
        success: false,
        message: "Erro ao processar upload de imagem",
        error: errorMessage
      });
    }
  });
  app2.post("/api/test-image-upload", async (req, res) => {
    try {
      console.log("Recebendo solicita\xE7\xE3o de teste de upload de imagem");
      const { imageData, imageType } = req.body;
      if (!imageData || !imageType) {
        console.log("Erro: Dados de imagem incompletos no teste");
        return res.status(400).json({
          success: false,
          message: "Dados de imagem e tipo s\xE3o obrigat\xF3rios"
        });
      }
      console.log(`Tipo de imagem recebido no teste: ${imageType}`);
      res.json({
        success: true,
        message: `Teste de upload de imagem ${imageType} recebido com sucesso`,
        imageUrl: `/img/test-${imageType}.png`
        // URL fictícia para teste
      });
    } catch (error) {
      console.error("Erro no endpoint de teste:", error);
      let errorMessage = "Erro desconhecido";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object") {
        errorMessage = String(error);
      }
      res.status(500).json({
        success: false,
        message: "Erro ao processar upload de teste",
        error: errorMessage
      });
    }
  });
  app2.put("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      console.log("Updating system settings:", req.body);
      const { maxBetAmount, maxPayout, minBetAmount, defaultBetAmount } = req.body;
      if (maxBetAmount <= 0 || maxPayout <= 0) {
        return res.status(400).json({ message: "Valores m\xE1ximos devem ser positivos" });
      }
      if (minBetAmount <= 0) {
        return res.status(400).json({ message: "O valor m\xEDnimo de aposta deve ser positivo" });
      }
      if (defaultBetAmount <= 0) {
        return res.status(400).json({ message: "O valor padr\xE3o de aposta deve ser positivo" });
      }
      if (minBetAmount > maxBetAmount) {
        return res.status(400).json({ message: "O valor m\xEDnimo de aposta n\xE3o pode ser maior que o valor m\xE1ximo" });
      }
      if (defaultBetAmount < minBetAmount) {
        return res.status(400).json({ message: "O valor padr\xE3o de aposta n\xE3o pode ser menor que o valor m\xEDnimo" });
      }
      if (defaultBetAmount > maxBetAmount) {
        return res.status(400).json({ message: "O valor padr\xE3o de aposta n\xE3o pode ser maior que o valor m\xE1ximo" });
      }
      const { autoApproveWithdrawals, autoApproveWithdrawalLimit } = req.body;
      if (autoApproveWithdrawals && (autoApproveWithdrawalLimit === void 0 || autoApproveWithdrawalLimit <= 0)) {
        return res.status(400).json({
          message: "O limite para aprova\xE7\xE3o autom\xE1tica deve ser positivo quando a aprova\xE7\xE3o autom\xE1tica est\xE1 ativada"
        });
      }
      const { siteName, siteDescription, logoUrl, faviconUrl } = req.body;
      if (siteName && siteName.length > 100) {
        return res.status(400).json({ message: "Nome do site muito longo (m\xE1ximo 100 caracteres)" });
      }
      if (siteDescription && siteDescription.length > 500) {
        return res.status(400).json({ message: "Descri\xE7\xE3o do site muito longa (m\xE1ximo 500 caracteres)" });
      }
      const settingsToSave = {
        ...req.body,
        logoUrl: logoUrl || "/img/logo.png",
        faviconUrl: faviconUrl || "/img/favicon.png",
        siteName: siteName || "Jogo do Bicho",
        siteDescription: siteDescription || "A melhor plataforma de apostas online"
      };
      const updatedSettings = await storage.saveSystemSettings(settingsToSave);
      res.json(updatedSettings);
    } catch (error) {
      console.error("Error updating system settings:", error);
      res.status(500).json({ message: "Error updating system settings" });
    }
  });
  app2.post("/api/admin/bets/discharge", requireAdmin, async (req, res) => {
    try {
      const { betId, drawId, note } = req.body;
      if (!betId || !drawId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const bet = await storage.getBet(betId);
      if (!bet) {
        return res.status(404).json({ message: "Bet not found" });
      }
      if (bet.status !== "pending") {
        return res.status(400).json({ message: "Only pending bets can be discharged" });
      }
      const draw = await storage.getDraw(drawId);
      if (!draw) {
        return res.status(404).json({ message: "Draw not found" });
      }
      if (draw.status !== "pending") {
        return res.status(400).json({ message: "Can only discharge to pending draws" });
      }
      const updatedBet = await storage.updateBet(betId, { drawId });
      console.log(`Bet ${betId} discharged from draw ${bet.drawId} to draw ${drawId}. Note: ${note || "N/A"}`);
      res.json(updatedBet);
    } catch (error) {
      console.error("Error discharging bet:", error);
      res.status(500).json({ message: "Error discharging bet" });
    }
  });
  app2.get("/api/admin/payment-gateways", requireAdmin, async (req, res) => {
    try {
      const gateways = await storage.getAllPaymentGateways();
      res.json(gateways);
    } catch (error) {
      console.error("Error fetching payment gateways:", error);
      res.status(500).json({ message: "Error fetching payment gateways" });
    }
  });
  app2.get("/api/admin/payment-gateways/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const gateway = await storage.getPaymentGateway(id);
      if (!gateway) {
        return res.status(404).json({ message: "Payment gateway not found" });
      }
      res.json(gateway);
    } catch (error) {
      console.error("Error fetching payment gateway:", error);
      res.status(500).json({ message: "Error fetching payment gateway" });
    }
  });
  app2.post("/api/admin/payment-gateways", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertPaymentGatewaySchema.parse(req.body);
      const existingGateway = await storage.getPaymentGatewayByType(validatedData.type);
      if (existingGateway) {
        return res.status(400).json({
          message: `A payment gateway with type '${validatedData.type}' already exists`
        });
      }
      const gateway = await storage.createPaymentGateway(validatedData);
      res.status(201).json(gateway);
    } catch (error) {
      console.error("Error creating payment gateway:", error);
      if (error instanceof z6.ZodError) {
        return res.status(400).json({
          message: "Invalid payment gateway data",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Error creating payment gateway" });
    }
  });
  app2.patch("/api/admin/payment-gateways/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const gateway = await storage.getPaymentGateway(id);
      if (!gateway) {
        return res.status(404).json({ message: "Payment gateway not found" });
      }
      const updatedGateway = await storage.updatePaymentGateway(id, req.body);
      res.json(updatedGateway);
    } catch (error) {
      console.error("Error updating payment gateway:", error);
      res.status(500).json({ message: "Error updating payment gateway" });
    }
  });
  app2.delete("/api/admin/payment-gateways/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const gateway = await storage.getPaymentGateway(id);
      if (!gateway) {
        return res.status(404).json({ message: "Payment gateway not found" });
      }
      await storage.deletePaymentGateway(id);
      res.json({ message: "Payment gateway deleted successfully" });
    } catch (error) {
      console.error("Error deleting payment gateway:", error);
      res.status(500).json({ message: "Error deleting payment gateway" });
    }
  });
  app2.get("/api/payment-gateways", requireAuth, async (req, res) => {
    try {
      const gateways = await storage.getAllPaymentGateways();
      const activeGateways = gateways.filter((gateway) => gateway.isActive).map((gateway) => ({
        id: gateway.id,
        name: gateway.name,
        type: gateway.type
      }));
      res.json(activeGateways);
    } catch (error) {
      console.error("Error fetching active payment gateways:", error);
      res.status(500).json({ message: "Error fetching payment gateways" });
    }
  });
  app2.get("/api/payment-transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const username = req.user.username;
      console.log(`REQUISI\xC7\xC3O: Usu\xE1rio ${username} (${userId}) solicitando suas transa\xE7\xF5es de pagamento`);
      const userTransactions = await storage.getUserTransactions(userId);
      const filteredTransactions = userTransactions.filter((tx) => tx.type !== "withdrawal");
      const userWithdrawals = await storage.getUserWithdrawals(userId);
      const withdrawalsAsTransactions = userWithdrawals.map((withdrawal) => ({
        id: withdrawal.id,
        userId: withdrawal.userId,
        gatewayId: 0,
        // Gateway fictício para saques
        amount: -withdrawal.amount,
        // Valor negativo para indicar saída
        status: withdrawal.status,
        externalId: null,
        externalUrl: null,
        response: null,
        createdAt: withdrawal.requestedAt,
        type: "withdrawal"
        // Identificador adicional
      }));
      const allTransactions = [...filteredTransactions, ...withdrawalsAsTransactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      console.log(`SEGURAN\xC7A: Opera\xE7\xE3o conclu\xEDda com sucesso. Retornando ${allTransactions.length} transa\xE7\xF5es para usu\xE1rio ${username} (${userId}) (${filteredTransactions.length} dep\xF3sitos e ${userWithdrawals.length} saques)`);
      try {
        const auditBankCheck = await db.select({ count: sql2`count(*)` }).from(paymentTransactions).where(eq3(paymentTransactions.userId, userId));
        const expectedCount = Number(auditBankCheck[0].count);
        if (expectedCount !== userTransactions.length) {
          console.error(`AUDITORIA: Discrep\xE2ncia entre contagem do banco (${expectedCount}) e contagem retornada (${userTransactions.length}) para usu\xE1rio ${userId}`);
        } else {
          console.log(`AUDITORIA: Verifica\xE7\xE3o adicional confirma que todas as ${expectedCount} transa\xE7\xF5es do usu\xE1rio foram corretamente recuperadas`);
        }
      } catch (auditError) {
        console.error(`Falha na auditoria adicional de transa\xE7\xF5es para usu\xE1rio ${userId}:`, auditError);
      }
      console.log(`RESPOSTA: Enviando ${allTransactions.length} transa\xE7\xF5es para usu\xE1rio ${username} (${userId})`);
      return res.json(allTransactions);
    } catch (error) {
      console.error(`ERRO: Falha ao consultar transa\xE7\xF5es para usu\xE1rio ${req.user.id}:`, error);
      return res.status(500).json({
        message: "Erro ao consultar transa\xE7\xF5es",
        error: process.env.NODE_ENV === "development" ? error.message : void 0
      });
    }
  });
  function sanitizeGatewayResponse(response) {
    if (!response) return null;
    try {
      const responseObj = typeof response === "string" ? JSON.parse(response) : response;
      const {
        customer_details,
        customer_email,
        customer_phone,
        customer_id,
        webhook_url,
        security_token,
        api_key,
        token,
        apiKey,
        auth,
        payer,
        sender,
        recipient,
        sensitive_data,
        ...safeFields
      } = responseObj;
      return safeFields;
    } catch (err) {
      console.error("Erro ao sanitizar resposta do gateway:", err);
      return { sanitized: true, info: "Dados completos removidos por seguran\xE7a" };
    }
  }
  app2.get("/api/payment-transactions/:id", requireOwnership("transaction"), async (req, res) => {
    try {
      res.json(req.resource);
    } catch (error) {
      console.error("Erro ao buscar transa\xE7\xE3o:", error);
      res.status(500).json({ message: "Erro ao buscar transa\xE7\xE3o" });
    }
  });
  app2.post("/api/payment-transactions/check-pending", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const transactions2 = await storage.getUserTransactions(userId);
      const userTransactions = transactions2.filter((transaction) => transaction.userId === userId);
      if (userTransactions.length !== transactions2.length) {
        console.error(`ALERTA DE SEGURAN\xC7A: Encontrado ${transactions2.length - userTransactions.length} transa\xE7\xF5es que n\xE3o pertencem ao usu\xE1rio ${userId}`);
      }
      console.log(`Verificando transa\xE7\xF5es do usu\xE1rio ${userId}. Total: ${userTransactions.length}`);
      const pendingTransactions = userTransactions.filter(
        (t) => (t.status === "pending" || t.status === "processing") && t.externalId
      );
      if (pendingTransactions.length === 0) {
        return res.json({
          message: "Nenhuma transa\xE7\xE3o pendente encontrada",
          checkedCount: 0,
          updatedCount: 0
        });
      }
      console.log(`Verificando ${pendingTransactions.length} transa\xE7\xF5es pendentes para o usu\xE1rio ${userId}`);
      const results = [];
      let updatedCount = 0;
      let checkedCount = 0;
      for (const transaction of pendingTransactions) {
        try {
          checkedCount++;
          console.log(`Verificando transa\xE7\xE3o ID: ${transaction.id}, Externa ID: ${transaction.externalId}`);
          const gateway = await storage.getPaymentGateway(transaction.gatewayId);
          if (!gateway) {
            results.push({
              transactionId: transaction.id,
              status: "error",
              message: "Gateway n\xE3o encontrado"
            });
            continue;
          }
          if (gateway.type === "pushinpay" && transaction.externalId) {
            const token = process.env.PUSHIN_PAY_TOKEN;
            if (!token) {
              results.push({
                transactionId: transaction.id,
                status: "error",
                message: "Token da API n\xE3o configurado"
              });
              continue;
            }
            console.log(`[Transa\xE7\xE3o ${transaction.id}] Tentando verificar com API V2...`);
            let verifiedWithV2 = false;
            try {
              const apiUrlV2 = `https://api.pushinpay.com.br/api/v2/transactions/${transaction.externalId}`;
              const responseV2 = await fetch(apiUrlV2, {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Accept": "application/json"
                }
              });
              if (responseV2.ok) {
                const paymentData = await responseV2.json();
                console.log(`[Transa\xE7\xE3o ${transaction.id}] Resposta API V2:`, paymentData);
                if (paymentData.status === "PAID" || paymentData.status === "COMPLETED" || paymentData.status === "paid" || paymentData.status === "completed") {
                  if (transaction.userId !== userId) {
                    console.error(`ALERTA DE SEGURAN\xC7A: Tentativa de processar pagamento de outro usu\xE1rio.
                      Transa\xE7\xE3o ID: ${transaction.id}
                      Pertence ao usu\xE1rio: ${transaction.userId}
                      Usu\xE1rio autenticado: ${userId}`);
                    results.push({
                      transactionId: transaction.id,
                      status: "error",
                      message: "Erro de seguran\xE7a: transa\xE7\xE3o pertence a outro usu\xE1rio"
                    });
                    continue;
                  }
                  const userV2 = await storage.getUser(transaction.userId);
                  if (!userV2) {
                    console.error(`ALERTA DE SEGURAN\xC7A: Usu\xE1rio ${transaction.userId} n\xE3o existe mais, mas possui transa\xE7\xE3o ${transaction.id}`);
                    results.push({
                      transactionId: transaction.id,
                      status: "error",
                      message: "Erro de seguran\xE7a: usu\xE1rio n\xE3o encontrado"
                    });
                    continue;
                  }
                  await storage.updateTransactionStatus(
                    transaction.id,
                    "completed",
                    transaction.externalId,
                    transaction.externalUrl || void 0,
                    paymentData
                  );
                  console.log(`TRANSA\xC7\xC3O CONCLU\xCDDA: ID ${transaction.id}, Usu\xE1rio ${userV2.username} (${userV2.id}), Valor R$${transaction.amount}`);
                  await storage.updateUserBalance(transaction.userId, transaction.amount);
                  updatedCount++;
                  results.push({
                    transactionId: transaction.id,
                    status: "completed",
                    message: "Pagamento confirmado (API V2)"
                  });
                  verifiedWithV2 = true;
                } else {
                  results.push({
                    transactionId: transaction.id,
                    status: "pending",
                    message: `Status atual: ${paymentData.status} (API V2)`,
                    apiStatus: paymentData.status
                  });
                  verifiedWithV2 = true;
                }
              } else {
                console.log(`[Transa\xE7\xE3o ${transaction.id}] API V2 retornou erro ${responseV2.status}`);
              }
            } catch (v2Error) {
              console.log(`[Transa\xE7\xE3o ${transaction.id}] Erro ao acessar API V2:`, v2Error);
            }
            if (verifiedWithV2) {
              continue;
            }
            console.log(`[Transa\xE7\xE3o ${transaction.id}] Tentando verificar com API V1...`);
            let verifiedWithV1 = false;
            try {
              const apiUrlV1 = `https://api.pushinpay.com.br/api/pix/v1/transaction/${transaction.externalId}`;
              const responseV1 = await fetch(apiUrlV1, {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Accept": "application/json"
                }
              });
              if (responseV1.ok) {
                const paymentData = await responseV1.json();
                console.log(`[Transa\xE7\xE3o ${transaction.id}] Resposta API V1:`, paymentData);
                if (paymentData.status === "PAID" || paymentData.status === "COMPLETED" || paymentData.status === "paid" || paymentData.status === "completed") {
                  if (transaction.userId !== userId) {
                    console.error(`ALERTA DE SEGURAN\xC7A: Tentativa de processar pagamento de outro usu\xE1rio.
                      Transa\xE7\xE3o ID: ${transaction.id}
                      Pertence ao usu\xE1rio: ${transaction.userId}
                      Usu\xE1rio autenticado: ${userId}`);
                    results.push({
                      transactionId: transaction.id,
                      status: "error",
                      message: "Erro de seguran\xE7a: transa\xE7\xE3o pertence a outro usu\xE1rio"
                    });
                    continue;
                  }
                  const userV1 = await storage.getUser(transaction.userId);
                  if (!userV1) {
                    console.error(`ALERTA DE SEGURAN\xC7A: Usu\xE1rio ${transaction.userId} n\xE3o existe mais, mas possui transa\xE7\xE3o ${transaction.id}`);
                    results.push({
                      transactionId: transaction.id,
                      status: "error",
                      message: "Erro de seguran\xE7a: usu\xE1rio n\xE3o encontrado"
                    });
                    continue;
                  }
                  await storage.updateTransactionStatus(
                    transaction.id,
                    "completed",
                    transaction.externalId,
                    transaction.externalUrl || void 0,
                    paymentData
                  );
                  console.log(`TRANSA\xC7\xC3O CONCLU\xCDDA: ID ${transaction.id}, Usu\xE1rio ${userV1.username} (${userV1.id}), Valor R$${transaction.amount}`);
                  await storage.updateUserBalance(transaction.userId, transaction.amount);
                  updatedCount++;
                  results.push({
                    transactionId: transaction.id,
                    status: "completed",
                    message: "Pagamento confirmado (API V1)"
                  });
                  verifiedWithV1 = true;
                } else {
                  results.push({
                    transactionId: transaction.id,
                    status: "pending",
                    message: `Status atual: ${paymentData.status} (API V1)`,
                    apiStatus: paymentData.status
                  });
                  verifiedWithV1 = true;
                }
              } else {
                console.log(`[Transa\xE7\xE3o ${transaction.id}] API V1 retornou erro ${responseV1.status}`);
              }
            } catch (v1Error) {
              console.log(`[Transa\xE7\xE3o ${transaction.id}] Erro ao acessar API V1:`, v1Error);
            }
            if (verifiedWithV1) {
              continue;
            }
            console.log(`[Transa\xE7\xE3o ${transaction.id}] Ambas APIs falharam, verificando por tempo...`);
            const transactionDate = new Date(transaction.createdAt);
            const now = /* @__PURE__ */ new Date();
            const hoursDiff = (now.getTime() - transactionDate.getTime()) / (1e3 * 60 * 60);
            const minutesDiff = (now.getTime() - transactionDate.getTime()) / (1e3 * 60);
            const isTestMode = process.env.NODE_ENV === "development";
            if (isTestMode && minutesDiff > 1) {
              console.log(`[DESENVOLVIMENTO] Transa\xE7\xE3o ${transaction.id} aprovada automaticamente ap\xF3s ${minutesDiff.toFixed(1)} minutos (modo de teste)`);
              const userDev = await storage.getUser(transaction.userId);
              if (!userDev) {
                results.push({
                  transactionId: transaction.id,
                  status: "error",
                  message: "Erro de seguran\xE7a: usu\xE1rio n\xE3o encontrado"
                });
                continue;
              }
              await storage.updateTransactionStatus(
                transaction.id,
                "completed",
                transaction.externalId,
                transaction.externalUrl || void 0,
                { autoApproved: true, reason: "Aprovado automaticamente em ambiente de desenvolvimento" }
              );
              console.log(`TRANSA\xC7\xC3O CONCLU\xCDDA (DESENVOLVIMENTO): ID ${transaction.id}, Usu\xE1rio ${userDev.username} (${userDev.id}), Valor R$${transaction.amount}`);
              await storage.updateUserBalance(transaction.userId, transaction.amount);
              updatedCount++;
              results.push({
                transactionId: transaction.id,
                status: "completed",
                message: "Pagamento confirmado automaticamente (ambiente de desenvolvimento)"
              });
            } else if (hoursDiff > 24) {
              console.log(`[Transa\xE7\xE3o ${transaction.id}] Tem mais de 24h (${hoursDiff.toFixed(1)}h), marcando como expirada`);
              await storage.updateTransactionStatus(
                transaction.id,
                "failed",
                transaction.externalId,
                transaction.externalUrl || void 0,
                { reason: "Expirada por tempo (mais de 24h)" }
              );
              results.push({
                transactionId: transaction.id,
                status: "expired",
                message: "Transa\xE7\xE3o expirada (mais de 24h)"
              });
            } else {
              console.log(`[Transa\xE7\xE3o ${transaction.id}] Tem menos de 24h (${hoursDiff.toFixed(1)}h), mantendo pendente`);
              results.push({
                transactionId: transaction.id,
                status: "pending",
                message: "Transa\xE7\xE3o ainda pendente, APIs indispon\xEDveis"
              });
            }
          } else {
            results.push({
              transactionId: transaction.id,
              status: "skipped",
              message: "Gateway n\xE3o suportado ou sem ID externo"
            });
          }
        } catch (txError) {
          console.error(`[Transa\xE7\xE3o ${transaction.id}] Erro na verifica\xE7\xE3o:`, txError);
          results.push({
            transactionId: transaction.id,
            status: "error",
            message: `Erro inesperado: ${txError.message}`
          });
        }
      }
      res.json({
        message: `Verifica\xE7\xE3o conclu\xEDda para ${pendingTransactions.length} transa\xE7\xF5es`,
        checkedCount: pendingTransactions.length,
        updatedCount,
        results
      });
    } catch (error) {
      console.error("Erro ao verificar transa\xE7\xF5es pendentes:", error);
      res.status(500).json({
        message: "Erro ao verificar transa\xE7\xF5es pendentes",
        error: error.message
      });
    }
  });
  app2.post("/api/payment-transactions/:id/verify", requireAuth, requireAdmin, async (req, res) => {
    try {
      const transactionId = parseInt(req.params.id);
      if (isNaN(transactionId)) {
        return res.status(400).json({ message: "ID de transa\xE7\xE3o inv\xE1lido" });
      }
      const transaction = await storage.getPaymentTransaction(transactionId);
      if (!transaction) {
        return res.status(404).json({ message: "Transa\xE7\xE3o n\xE3o encontrada" });
      }
      if (transaction.status === "completed") {
        return res.json({
          message: "Transa\xE7\xE3o j\xE1 est\xE1 conclu\xEDda",
          status: transaction.status,
          transaction
        });
      }
      if (transaction.status === "pending" || transaction.status === "processing") {
        const gateway = await storage.getPaymentGateway(transaction.gatewayId);
        if (!gateway) {
          return res.status(404).json({ message: "Gateway de pagamento n\xE3o encontrado" });
        }
        if (gateway.type === "pushinpay" && transaction.externalId) {
          try {
            const token = process.env.PUSHIN_PAY_TOKEN;
            if (!token) {
              return res.status(400).json({ message: "Token da API n\xE3o configurado" });
            }
            const apiUrl = `https://api.pushinpay.com.br/api/v2/transactions/${transaction.externalId}`;
            console.log(`Verificando status da transa\xE7\xE3o ${transaction.externalId} na API Pushin Pay`);
            const response = await fetch(apiUrl, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
              }
            });
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              console.error("Erro na resposta da Pushin Pay:", response.status, errorData);
              throw new Error(`Erro na API da Pushin Pay: ${response.status}`);
            }
            const paymentData = await response.json();
            console.log("Resposta da verifica\xE7\xE3o Pushin Pay:", paymentData);
            if (paymentData.status === "paid" || paymentData.status === "completed" || paymentData.status === "PAID" || paymentData.status === "COMPLETED") {
              const updatedTransaction = await storage.updateTransactionStatus(
                transactionId,
                "completed",
                transaction.externalId,
                transaction.externalUrl || void 0,
                paymentData
              );
              if (!updatedTransaction) {
                return res.status(500).json({ message: "Falha ao atualizar status da transa\xE7\xE3o" });
              }
              try {
                console.log(`UPDATING BALANCE: User ID ${transaction.userId}, Amount: ${transaction.amount}`);
                const userBeforeUpdate = await storage.getUser(transaction.userId);
                console.log(`BALANCE BEFORE: User ID ${transaction.userId}, Current balance: ${userBeforeUpdate?.balance}`);
                const user = await storage.updateUserBalance(transaction.userId, transaction.amount);
                console.log(`BALANCE UPDATED: User ID ${transaction.userId}, New balance: ${user?.balance}, Added: ${transaction.amount}`);
                console.log(`Saldo do usu\xE1rio atualizado. Novo saldo: ${user?.balance}`);
              } catch (balanceError) {
                console.error("Erro ao atualizar saldo do usu\xE1rio:", balanceError);
                return res.status(500).json({ message: "Erro ao atualizar saldo do usu\xE1rio" });
              }
              return res.json({
                message: "Pagamento confirmado pela API da Pushin Pay",
                status: "completed",
                transaction: updatedTransaction
              });
            } else {
              return res.json({
                message: `Status atual na Pushin Pay: ${paymentData.status}`,
                status: transaction.status,
                apiStatus: paymentData.status,
                transaction
              });
            }
          } catch (apiError) {
            console.error("Erro ao verificar pagamento na API:", apiError);
            return res.status(500).json({ message: `Erro ao verificar na API: ${apiError.message}` });
          }
        } else {
          return res.json({
            message: "Verifica\xE7\xE3o autom\xE1tica n\xE3o dispon\xEDvel para este m\xE9todo de pagamento",
            status: transaction.status,
            transaction
          });
        }
      }
      return res.json({
        message: `Transa\xE7\xE3o est\xE1 atualmente ${transaction.status}`,
        status: transaction.status,
        transaction
      });
    } catch (error) {
      console.error("Erro ao verificar transa\xE7\xE3o de pagamento:", error);
      res.status(500).json({ message: "Erro ao verificar transa\xE7\xE3o de pagamento" });
    }
  });
  app2.post("/api/payment/pushinpay", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      console.log(`SEGURAN\xC7A: Criando transa\xE7\xE3o de pagamento para usu\xE1rio ID: ${userId}`);
      let { amount } = req.body;
      if (req.body.userId !== void 0 && req.body.userId !== userId) {
        console.error(`ALERTA DE SEGURAN\xC7A: Tentativa de criar transa\xE7\xE3o para outro usu\xE1rio. 
          Usu\xE1rio real: ${userId}, 
          Usu\xE1rio tentado: ${req.body.userId}`);
      }
      console.log("Valor original recebido:", amount);
      if (typeof amount === "string") {
        if (amount.includes(",")) {
          amount = parseFloat(amount.replace(".", "").replace(",", "."));
        } else {
          amount = parseFloat(amount);
        }
      }
      if (isNaN(amount) || amount <= 0) {
        console.error(`Valor inv\xE1lido: ${req.body.amount} -> ${amount}`);
        return res.status(400).json({ message: "Valor inv\xE1lido para dep\xF3sito" });
      }
      console.log("Valor convertido:", amount);
      amount = parseFloat(amount.toFixed(2));
      const gateway = await storage.getPaymentGatewayByType("pushinpay");
      if (!gateway || !gateway.isActive) {
        return res.status(404).json({ message: "Pushin Pay gateway is not available" });
      }
      const transaction = await storage.createPaymentTransaction({
        userId,
        gatewayId: gateway.id,
        amount,
        status: "pending",
        type: "deposit"
        // Especificar explicitamente que é um depósito
      });
      try {
        if (!process.env.PUSHIN_PAY_TOKEN) {
          throw new Error("Pushin Pay token not configured");
        }
        const baseUrl = process.env.BASE_URL || "https://app-jogo-do-bicho.replit.app";
        const webhookUrl = `${baseUrl}/api/webhooks/pushinpay`;
        const token = process.env.PUSHIN_PAY_TOKEN;
        const apiUrl = "https://api.pushinpay.com.br/api/pix/cashIn";
        console.log(`Iniciando integra\xE7\xE3o com Pushin Pay - Transa\xE7\xE3o ID: ${transaction.id}`);
        if (amount < 2) {
          throw new Error(`A API da Pushin Pay exige um valor m\xEDnimo de R$2,00. Valor digitado: R$${amount.toFixed(2)}`);
        }
        if (typeof amount === "string" && amount.includes(",")) {
          amount = parseFloat(amount.replace(".", "").replace(",", "."));
        }
        amount = parseFloat(amount.toFixed(2));
        const amountInCents = Math.round(amount * 100);
        const requestData = {
          value: amountInCents,
          // Enviar o valor em centavos (formato inteiro)
          webhook_url: webhookUrl
        };
        console.log(`Valor original do usu\xE1rio: R$${amount.toFixed(2)}`);
        console.log(`Valor convertido para centavos: ${amountInCents}`);
        console.log(`Formato do valor enviado: ${typeof amountInCents}, valor em centavos: ${amountInCents}`);
        console.log(`Valor formatado como JSON: ${JSON.stringify(amountInCents)}`);
        console.log("Dados da requisi\xE7\xE3o:", requestData);
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestData)
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Erro na resposta da Pushin Pay:", response.status, errorData);
          throw new Error(`Erro na API da Pushin Pay: ${response.status} - ${errorData.message || "Erro desconhecido"}`);
        }
        const responseData = await response.json();
        console.log("Resposta da Pushin Pay:", JSON.stringify(responseData, null, 2));
        if (responseData.value !== void 0) {
          console.log(`Valor retornado pela API: ${responseData.value} - Tipo: ${typeof responseData.value}`);
        }
        if (!responseData.qr_code || !responseData.qr_code_base64) {
          throw new Error("Resposta da Pushin Pay n\xE3o cont\xE9m os dados do PIX necess\xE1rios");
        }
        const qrCodeBase64 = responseData.qr_code_base64;
        const qrCodeText = responseData.qr_code;
        const transactionId = responseData.id || `PUSHIN-${Date.now()}-${transaction.id}`;
        const qrCodeUrl = qrCodeBase64.startsWith("data:image/png;base64,") ? qrCodeBase64 : `data:image/png;base64,${qrCodeBase64}`;
        const updatedTransaction = await storage.updateTransactionStatus(
          transaction.id,
          "pending",
          transactionId,
          qrCodeUrl || void 0,
          responseData
        );
        res.json({
          transactionId: transaction.id,
          externalId: transactionId,
          externalUrl: void 0,
          // Não há página externa para redirecionar
          pixCopyPasteCode: qrCodeText,
          qrCodeUrl,
          qrCodeBase64,
          amount: amount.toFixed(2),
          status: "pending",
          message: "PIX payment process initiated via Pushin Pay",
          paymentDetails: responseData
        });
      } catch (err) {
        const integrationError = err;
        console.error("Error in Pushin Pay integration:", integrationError);
        await storage.updateTransactionStatus(
          transaction.id,
          "failed",
          void 0,
          void 0,
          { error: integrationError.message }
        );
        throw new Error(`Failed to process payment: ${integrationError.message}`);
      }
    } catch (err) {
      const error = err;
      console.error("Error creating payment transaction:", error);
      res.status(500).json({ message: error.message || "Error creating payment transaction" });
    }
  });
  app2.post("/api/webhooks/pushinpay", async (req, res) => {
    try {
      console.log("Webhook da Pushin Pay recebido:", JSON.stringify(req.body, null, 2));
      const { transactionId, status, externalId, amount, signature } = req.body;
      if (!transactionId || !status) {
        console.error("Webhook com dados incompletos:", req.body);
        return res.status(400).json({ message: "Missing required fields" });
      }
      const parsedTransactionId = parseInt(transactionId);
      if (isNaN(parsedTransactionId)) {
        console.error(`ALERTA DE SEGURAN\xC7A: ID de transa\xE7\xE3o inv\xE1lido recebido no webhook: ${transactionId}`);
        return res.status(400).json({ message: "Invalid transaction ID format" });
      }
      if (process.env.NODE_ENV === "production") {
        const transaction = await storage.getPaymentTransaction(transactionId);
        if (!transaction) {
          return res.status(404).json({ message: "Transaction not found" });
        }
        const gateway = await storage.getPaymentGateway(transaction.gatewayId);
        if (!gateway) {
          return res.status(404).json({ message: "Payment gateway not found" });
        }
        if (!gateway.secretKey || !signature) {
          console.warn("Missing webhook signature or secret key for validation");
        }
      }
      const validStatuses = ["pending", "processing", "completed", "failed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid transaction status" });
      }
      const currentTransaction = await storage.getPaymentTransaction(transactionId);
      if (!currentTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      if (currentTransaction.status === "completed" && status === "completed") {
        return res.status(200).json({
          message: "Transaction already processed",
          status: currentTransaction.status
        });
      }
      const user = await storage.getUser(currentTransaction.userId);
      if (!user) {
        console.error(`ALERTA DE SEGURAN\xC7A: Tentativa de atualizar transa\xE7\xE3o ${transactionId} para usu\xE1rio inexistente ${currentTransaction.userId}`);
        return res.status(400).json({ message: "Invalid user associated with transaction" });
      }
      console.log(`Atualizando status da transa\xE7\xE3o ${transactionId} para ${status}`);
      console.log(`Transa\xE7\xE3o pertence ao usu\xE1rio ${user.username} (ID: ${user.id})`);
      const updatedTransaction = await storage.updateTransactionStatus(
        transactionId,
        status,
        externalId || void 0,
        currentTransaction.externalUrl || void 0,
        // Manter a URL externa existente
        req.body
        // Salvar todo o payload para registro
      );
      if (!updatedTransaction) {
        return res.status(404).json({ message: "Failed to update transaction" });
      }
      if (status === "completed" && updatedTransaction.userId) {
        console.log(`Payment successful for transaction ${transactionId}. Updating user balance.`);
        try {
          const userId = updatedTransaction.userId;
          const depositAmount = updatedTransaction.amount;
          const systemSettings2 = await storage.getSystemSettings();
          console.log(`
[B\xD4NUS] Verificando elegibilidade para b\xF4nus de primeiro dep\xF3sito para usu\xE1rio ${userId}`);
          if (systemSettings2?.firstDepositBonusEnabled) {
            console.log(`[B\xD4NUS] B\xF4nus de primeiro dep\xF3sito est\xE1 ATIVADO nas configura\xE7\xF5es do sistema`);
            console.log(`[B\xD4NUS] Configura\xE7\xF5es: Percentual=${systemSettings2.firstDepositBonusPercentage}%, Valor m\xE1ximo=${systemSettings2.firstDepositBonusMaxAmount}, Rollover=${systemSettings2.firstDepositBonusRollover}x`);
            const userTransactions = await db.select().from(paymentTransactions).where(and3(
              eq3(paymentTransactions.userId, userId),
              eq3(paymentTransactions.type, "deposit"),
              eq3(paymentTransactions.status, "completed")
            ));
            const isFirstDeposit = userTransactions.length <= 1;
            console.log(`[B\xD4NUS] Verifica\xE7\xE3o de primeiro dep\xF3sito: Usu\xE1rio ${userId} tem ${userTransactions.length} dep\xF3sitos (incluindo o atual)`);
            console.log(`[B\xD4NUS] Este ${isFirstDeposit ? "\xC9" : "N\xC3O \xE9"} o primeiro dep\xF3sito do usu\xE1rio ${userId}`);
            if (!isFirstDeposit) {
              console.log(`[B\xD4NUS] N\xE3o \xE9 o primeiro dep\xF3sito. Ignorando b\xF4nus.`);
            } else {
              console.log(`[B\xD4NUS] Verificando registro de b\xF4nus anteriores para o usu\xE1rio ${userId}`);
              const hasBonus = await storage.hasUserReceivedFirstDepositBonus(userId);
              if (hasBonus) {
                console.log(`[B\xD4NUS] Usu\xE1rio ${userId} J\xC1 recebeu b\xF4nus de primeiro dep\xF3sito anteriormente. Ignorando.`);
              } else {
                console.log(`[B\xD4NUS] Usu\xE1rio ${userId} NUNCA recebeu b\xF4nus de primeiro dep\xF3sito. Prosseguindo.`);
                console.log(`[B\xD4NUS] Aplicando b\xF4nus de primeiro dep\xF3sito para usu\xE1rio ${userId}`);
                let bonusAmount = 0;
                if (systemSettings2.firstDepositBonusPercentage > 0) {
                  console.log(`[B\xD4NUS] Calculando b\xF4nus percentual: ${depositAmount} * ${systemSettings2.firstDepositBonusPercentage}%`);
                  bonusAmount = depositAmount * systemSettings2.firstDepositBonusPercentage / 100;
                  console.log(`[B\xD4NUS] Valor calculado inicialmente: ${bonusAmount}`);
                  if (systemSettings2.firstDepositBonusMaxAmount > 0 && bonusAmount > systemSettings2.firstDepositBonusMaxAmount) {
                    console.log(`[B\xD4NUS] Valor calculado (${bonusAmount}) excede o m\xE1ximo permitido (${systemSettings2.firstDepositBonusMaxAmount}). Limitando.`);
                    bonusAmount = systemSettings2.firstDepositBonusMaxAmount;
                  }
                } else {
                  console.log(`[B\xD4NUS] Usando valor fixo de b\xF4nus: ${systemSettings2.firstDepositBonusAmount}`);
                  bonusAmount = systemSettings2.firstDepositBonusAmount;
                }
                bonusAmount = parseFloat(bonusAmount.toFixed(2));
                console.log(`[B\xD4NUS] Valor final do b\xF4nus ap\xF3s arredondamento: ${bonusAmount}`);
                if (bonusAmount > 0) {
                  console.log(`[B\xD4NUS] Valor do b\xF4nus \xE9 positivo (${bonusAmount}). Prosseguindo com a cria\xE7\xE3o.`);
                  const rolloverAmount = bonusAmount * systemSettings2.firstDepositBonusRollover;
                  const expirationDays = systemSettings2.firstDepositBonusExpiration || 7;
                  const expirationDate = /* @__PURE__ */ new Date();
                  expirationDate.setDate(expirationDate.getDate() + expirationDays);
                  console.log(`[B\xD4NUS] Detalhes do b\xF4nus a ser criado:
                    - Usu\xE1rio: ${userId}
                    - Tipo: first_deposit
                    - Valor: ${bonusAmount}
                    - Valor dispon\xEDvel: ${bonusAmount}
                    - Rollover necess\xE1rio: ${rolloverAmount}
                    - Validade: ${expirationDays} dias (at\xE9 ${expirationDate})
                    - Transa\xE7\xE3o relacionada: ${updatedTransaction.id}`);
                  try {
                    const bonus = await storage.createUserBonus({
                      userId,
                      type: "first_deposit",
                      amount: bonusAmount,
                      remainingAmount: bonusAmount,
                      rolloverAmount,
                      status: "active",
                      expiresAt: expirationDate,
                      relatedTransactionId: updatedTransaction.id
                    });
                    console.log(`[B\xD4NUS] B\xF4nus de primeiro dep\xF3sito criado com ID ${bonus.id}: R$${bonusAmount.toFixed(2)}, Rollover: R$${rolloverAmount.toFixed(2)}`);
                    const createdBonus = await db.select().from(userBonuses).where(eq3(userBonuses.id, bonus.id));
                    if (createdBonus.length === 0) {
                      console.error(`[B\xD4NUS] ERRO CR\xCDTICO: O b\xF4nus com ID ${bonus.id} n\xE3o foi encontrado na base de dados ap\xF3s a cria\xE7\xE3o!`);
                    } else {
                      console.log(`[B\xD4NUS] Verifica\xE7\xE3o p\xF3s-cria\xE7\xE3o do b\xF4nus: B\xF4nus encontrado na base de dados. ID: ${createdBonus[0].id}, Tipo: ${createdBonus[0].type}`);
                    }
                    console.log(`[B\xD4NUS] Registrando transa\xE7\xE3o para o b\xF4nus`);
                    const bonusTransaction = await storage.createTransaction({
                      userId,
                      type: "deposit",
                      // Usando "deposit" em vez de "bonus" para compatibilidade
                      amount: bonusAmount,
                      description: "B\xF4nus de primeiro dep\xF3sito",
                      relatedId: bonus.id
                      // Vinculando explicitamente à transação
                    });
                    console.log(`[B\xD4NUS] Transa\xE7\xE3o registrada com ID ${bonusTransaction.id}`);
                    console.log(`[B\xD4NUS] ETAPA CR\xCDTICA: Chamando updateUserBonusBalance para atualizar saldo de usu\xE1rio ${userId} com +${bonusAmount}`);
                    const bonusBalanceBefore = await storage.getUserBonusBalance(userId);
                    console.log(`[B\xD4NUS] Saldo de b\xF4nus ANTES da atualiza\xE7\xE3o: R$${bonusBalanceBefore}`);
                    await storage.updateUserBonusBalance(userId, bonusAmount);
                    const updatedBonus = await storage.getUserBonusBalance(userId);
                    console.log(`[B\xD4NUS] Saldo de B\xD4NUS do usu\xE1rio AP\xD3S atualiza\xE7\xE3o: R$${updatedBonus}`);
                    const allUserBonuses = await storage.getUserBonuses(userId);
                    console.log(`[B\xD4NUS] Verifica\xE7\xE3o adicional: Usu\xE1rio ${userId} tem ${allUserBonuses.length} b\xF4nus no total`);
                    const expectedBalance = bonusBalanceBefore + bonusAmount;
                    if (Math.abs(updatedBonus - expectedBalance) < 0.01) {
                      console.log(`[B\xD4NUS] \u2705 SUCESSO: B\xF4nus aplicado corretamente. Saldo anterior: R$${bonusBalanceBefore}, Adicionado: R$${bonusAmount}, Novo saldo: R$${updatedBonus}`);
                    } else {
                      console.error(`[B\xD4NUS] \u274C ERRO: B\xF4nus n\xE3o foi aplicado corretamente ao saldo. Esperado: R$${expectedBalance}, Atual: R$${updatedBonus}`);
                    }
                  } catch (error) {
                    console.error(`[B\xD4NUS] ERRO ao processar b\xF4nus: ${error.message}`);
                    console.error(error.stack);
                  }
                } else {
                  console.log(`[B\xD4NUS] Valor do b\xF4nus calculado \xE9 zero ou negativo (${bonusAmount}). Ignorando.`);
                }
              }
            }
          } else {
            console.log(`[B\xD4NUS] B\xF4nus de primeiro dep\xF3sito est\xE1 DESATIVADO nas configura\xE7\xF5es do sistema`);
          }
          console.log(`[B\xD4NUS] Fim do processamento de b\xF4nus de primeiro dep\xF3sito
`);
          if (systemSettings2?.signupBonusEnabled) {
            const hasSignupBonus = await storage.hasUserReceivedSignupBonus(userId);
            if (!hasSignupBonus) {
              console.log(`Aplicando b\xF4nus de cadastro para usu\xE1rio ${userId}`);
              const bonusAmount = systemSettings2.signupBonusAmount;
              const rolloverAmount = bonusAmount * systemSettings2.signupBonusRollover;
              await storage.createUserBonus({
                userId,
                type: "signup",
                amount: bonusAmount,
                remainingAmount: bonusAmount,
                rolloverAmount,
                status: "active"
              });
              console.log(`B\xF4nus de cadastro criado: R$${bonusAmount.toFixed(2)}, Rollover: R$${rolloverAmount.toFixed(2)}`);
            }
          }
          const user2 = await storage.updateUserBalance(userId, depositAmount);
          console.log(`User balance updated successfully. New balance: ${user2?.balance}`);
        } catch (balanceError) {
          console.error("Error updating user balance:", balanceError);
        }
      }
      res.json({
        message: "Webhook processed successfully",
        transactionId,
        status: updatedTransaction.status
      });
    } catch (err) {
      const error = err;
      console.error("Error processing payment webhook:", error);
      res.status(500).json({ message: "Error processing payment webhook" });
    }
  });
  app2.post("/api/withdrawals", requireAuth, validate(createWithdrawalValidator), async (req, res) => {
    try {
      const userId = req.user.id;
      const withdrawalData = insertWithdrawalSchema.parse({
        ...req.body,
        userId
      });
      console.log(`Solicita\xE7\xE3o de saque recebida para usu\xE1rio ${userId}:`, withdrawalData);
      const withdrawal = await storage.createWithdrawal(withdrawalData);
      res.status(201).json(withdrawal);
    } catch (error) {
      console.error("Erro ao processar solicita\xE7\xE3o de saque:", error);
      if (error instanceof z6.ZodError) {
        return res.status(400).json({
          message: "Dados inv\xE1lidos",
          errors: error.errors
        });
      }
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Erro ao processar solicita\xE7\xE3o de saque" });
    }
  });
  app2.get("/api/withdrawals", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const withdrawals2 = await storage.getUserWithdrawals(userId);
      res.json(withdrawals2);
    } catch (error) {
      console.error(`Erro ao buscar saques do usu\xE1rio ${req.user.id}:`, error);
      res.status(500).json({ message: "Erro ao buscar hist\xF3rico de saques" });
    }
  });
  app2.get("/api/withdrawals/:id", requireAuth, async (req, res) => {
    try {
      const withdrawalId = parseInt(req.params.id);
      if (isNaN(withdrawalId)) {
        return res.status(400).json({ message: "ID de saque inv\xE1lido" });
      }
      const withdrawal = await storage.getWithdrawal(withdrawalId);
      if (!withdrawal) {
        return res.status(404).json({ message: "Saque n\xE3o encontrado" });
      }
      if (withdrawal.userId !== req.user.id && !req.user.isAdmin) {
        console.log(`NEGADO: Usu\xE1rio ${req.user.id} tentando acessar saque ${withdrawalId} do usu\xE1rio ${withdrawal.userId}`);
        return res.status(403).json({ message: "Acesso negado" });
      }
      res.json(withdrawal);
    } catch (error) {
      console.error(`Erro ao buscar saque ${req.params.id}:`, error);
      res.status(500).json({ message: "Erro ao buscar detalhes do saque" });
    }
  });
  app2.get("/api/admin/withdrawals", requireAdmin, async (req, res) => {
    try {
      const status = req.query.status;
      const withdrawals2 = await storage.getAllWithdrawals(status);
      res.json(withdrawals2);
    } catch (error) {
      console.error("Erro ao buscar todos os saques:", error);
      res.status(500).json({ message: "Erro ao buscar saques" });
    }
  });
  async function checkPushinPayBalance() {
    try {
      const gateway = await storage.getPaymentGatewayByType("pushinpay");
      if (!gateway) {
        throw new Error("Gateway Pushin Pay n\xE3o encontrado");
      }
      const apiUrl = "https://api.pushinpay.com.br/api/v2/balance";
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${gateway.apiKey}`
      };
      const response = await fetch(apiUrl, {
        method: "GET",
        headers
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao verificar saldo: ${errorData.message || response.statusText}`);
      }
      const data = await response.json();
      const balance = data.balance || data.amount || 0;
      console.log(`Saldo dispon\xEDvel no gateway Pushin Pay: R$ ${balance.toFixed(2)}`);
      return balance;
    } catch (error) {
      console.error("Erro ao verificar saldo no gateway:", error);
      return 0;
    }
  }
  app2.get("/api/admin/gateway-balance", requireAdmin, async (req, res) => {
    try {
      const balance = await checkPushinPayBalance();
      res.json({ balance });
    } catch (error) {
      console.error("Erro ao obter saldo do gateway:", error);
      res.status(500).json({ message: "Erro ao obter saldo do gateway" });
    }
  });
  app2.patch("/api/admin/withdrawals/:id/status", requireAdmin, async (req, res) => {
    try {
      const withdrawalId = parseInt(req.params.id);
      if (isNaN(withdrawalId)) {
        return res.status(400).json({ message: "ID de saque inv\xE1lido" });
      }
      const { status, rejectionReason, notes } = req.body;
      if (!status || !["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Status inv\xE1lido. Use 'approved' ou 'rejected'" });
      }
      if (status === "rejected" && !rejectionReason) {
        return res.status(400).json({ message: "Motivo de rejei\xE7\xE3o \xE9 obrigat\xF3rio para saques rejeitados" });
      }
      if (status === "approved") {
        const withdrawal2 = await storage.getWithdrawal(withdrawalId);
        if (!withdrawal2) {
          return res.status(404).json({ message: "Saque n\xE3o encontrado" });
        }
        const gatewayBalance = await checkPushinPayBalance();
        if (gatewayBalance < withdrawal2.amount) {
          return res.status(400).json({
            message: "Saldo insuficiente no gateway de pagamento",
            availableBalance: gatewayBalance,
            requiredAmount: withdrawal2.amount
          });
        }
        console.log(`Saldo dispon\xEDvel no gateway: R$ ${gatewayBalance.toFixed(2)} - Suficiente para o saque de R$ ${withdrawal2.amount.toFixed(2)}`);
      }
      const withdrawal = await storage.updateWithdrawalStatus(
        withdrawalId,
        status,
        req.user.id,
        // ID do admin que está processando
        rejectionReason,
        notes
      );
      if (status === "approved") {
        const processingWithdrawal = await storage.updateWithdrawalStatus(
          withdrawalId,
          "processing",
          req.user.id
        );
        res.json(processingWithdrawal);
      } else {
        res.json(withdrawal);
      }
    } catch (error) {
      console.error(`Erro ao atualizar status do saque ${req.params.id}:`, error);
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Erro ao processar saque" });
    }
  });
  app2.get("/api/transactions/history", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const transactions2 = await storage.getUserTransactionHistory(userId);
      res.json(transactions2);
    } catch (error) {
      console.error(`Erro ao buscar hist\xF3rico de transa\xE7\xF5es do usu\xE1rio ${req.user.id}:`, error);
      res.status(500).json({ message: "Erro ao buscar hist\xF3rico de transa\xE7\xF5es" });
    }
  });
  app2.get("/api/admin/transactions", requireAdmin, async (req, res) => {
    try {
      const type = req.query.type;
      const startDate = req.query.startDate ? new Date(req.query.startDate) : void 0;
      const endDate = req.query.endDate ? new Date(req.query.endDate) : void 0;
      const transactions2 = await storage.getAllTransactions(
        type,
        startDate,
        endDate
      );
      res.json(transactions2);
    } catch (error) {
      console.error("Erro ao buscar todas as transa\xE7\xF5es:", error);
      res.status(500).json({ message: "Erro ao buscar transa\xE7\xF5es" });
    }
  });
  app2.get("/api/admin/transactions/summary", requireAdmin, async (req, res) => {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate) : void 0;
      const endDate = req.query.endDate ? new Date(req.query.endDate) : void 0;
      const summary = await storage.getTransactionsSummary(startDate, endDate);
      res.json(summary);
    } catch (error) {
      console.error("Erro ao gerar resumo de transa\xE7\xF5es:", error);
      res.status(500).json({ message: "Erro ao gerar resumo financeiro" });
    }
  });
  app2.get("/api/admin/bonus-settings", requireAdmin, async (req, res) => {
    try {
      const { getBonusSettings: getBonusSettings2 } = (init_bonus_settings(), __toCommonJS(bonus_settings_exports));
      const bonusSettings = await getBonusSettings2();
      console.log("Enviando configura\xE7\xF5es de b\xF4nus:", JSON.stringify(bonusSettings));
      res.json(bonusSettings);
    } catch (error) {
      console.error("Erro ao obter configura\xE7\xF5es de b\xF4nus:", error);
      res.status(500).json({ message: "Erro ao obter configura\xE7\xF5es de b\xF4nus" });
    }
  });
  app2.post("/api/debug/update-bonus-percentage", async (req, res) => {
    try {
      await pool.query(`
        UPDATE system_settings 
        SET first_deposit_bonus_percentage = 98
        WHERE id = (SELECT id FROM system_settings LIMIT 1)
      `);
      res.json({ message: "Porcentagem de b\xF4nus atualizada para 98%" });
    } catch (error) {
      console.error("Erro ao atualizar porcentagem de b\xF4nus:", error);
      res.status(500).json({ message: "Erro ao atualizar porcentagem de b\xF4nus" });
    }
  });
  app2.get("/api/bonus-settings", async (req, res) => {
    try {
      console.log("Obtendo configura\xE7\xF5es de b\xF4nus do sistema...");
      const result = await pool.query(`
        SELECT 
          signup_bonus_enabled, 
          signup_bonus_amount, 
          signup_bonus_rollover, 
          signup_bonus_expiration,
          first_deposit_bonus_enabled, 
          first_deposit_bonus_amount,
          first_deposit_bonus_percentage, 
          first_deposit_bonus_max_amount, 
          first_deposit_bonus_rollover, 
          first_deposit_bonus_expiration,
          promotional_banners_enabled
        FROM system_settings 
        LIMIT 1
      `);
      if (result.rows.length === 0) {
        throw new Error("Configura\xE7\xF5es de sistema n\xE3o encontradas");
      }
      const settings = result.rows[0];
      console.log("Configura\xE7\xF5es de b\xF4nus obtidas diretamente do banco de dados.");
      const bonusSettings = {
        signupBonus: {
          enabled: settings.signup_bonus_enabled || false,
          amount: settings.signup_bonus_amount || 0,
          rollover: settings.signup_bonus_rollover || 1,
          expiration: settings.signup_bonus_expiration || 7
        },
        firstDepositBonus: {
          enabled: settings.first_deposit_bonus_enabled || false,
          amount: settings.first_deposit_bonus_amount || 0,
          percentage: settings.first_deposit_bonus_percentage || 100,
          maxAmount: settings.first_deposit_bonus_max_amount || 100,
          rollover: settings.first_deposit_bonus_rollover || 1,
          expiration: settings.first_deposit_bonus_expiration || 7
        },
        promotionalBanners: {
          enabled: settings.promotional_banners_enabled || false
        }
      };
      console.log("Enviando resposta de configura\xE7\xF5es de b\xF4nus:", JSON.stringify(bonusSettings));
      res.json(bonusSettings);
    } catch (error) {
      console.error("Erro ao obter configura\xE7\xF5es de b\xF4nus (p\xFAblico):", error);
      res.status(500).json({ message: "Erro ao obter configura\xE7\xF5es de b\xF4nus" });
    }
  });
  app2.post("/api/admin/bonus-settings", requireAdmin, async (req, res) => {
    try {
      const { saveBonusSettings: saveBonusSettings2 } = (init_bonus_settings(), __toCommonJS(bonus_settings_exports));
      const bonusConfig = req.body;
      console.log("Recebido para salvar:", JSON.stringify(bonusConfig));
      if (!bonusConfig.signupBonus || !bonusConfig.firstDepositBonus) {
        return res.status(400).json({
          message: "Formato de dados inv\xE1lido. Verifique a estrutura dos dados enviados."
        });
      }
      const success = await saveBonusSettings2(bonusConfig);
      if (success) {
        res.json({
          message: "Configura\xE7\xF5es de b\xF4nus salvas com sucesso",
          data: bonusConfig
        });
      } else {
        res.status(500).json({
          message: "Erro ao salvar configura\xE7\xF5es de b\xF4nus"
        });
      }
    } catch (error) {
      console.error("Erro ao salvar configura\xE7\xF5es de b\xF4nus:", error);
      res.status(500).json({
        message: "Erro ao salvar configura\xE7\xF5es de b\xF4nus",
        error: error.message || "Erro desconhecido"
      });
    }
  });
  app2.get("/api/user/bonuses", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const bonuses = await storage.getUserBonuses(userId);
      res.json(bonuses);
    } catch (error) {
      console.error("Erro ao obter b\xF4nus do usu\xE1rio:", error);
      res.status(500).json({ message: "Erro ao obter b\xF4nus do usu\xE1rio" });
    }
  });
  app2.get("/api/user/bonus-balance", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const bonusBalance = await storage.getUserBonusBalance(userId);
      res.json({ bonusBalance });
    } catch (error) {
      console.error("Erro ao obter saldo de b\xF4nus do usu\xE1rio:", error);
      res.status(500).json({ message: "Erro ao obter saldo de b\xF4nus do usu\xE1rio" });
    }
  });
  app2.get("/api/admin/user/:userId/bonuses", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "ID de usu\xE1rio inv\xE1lido" });
      }
      const bonuses = await storage.getUserBonuses(userId);
      console.log(`B\xF4nus do usu\xE1rio ${userId}:`, bonuses);
      res.json(bonuses);
    } catch (error) {
      console.error("Erro ao buscar b\xF4nus do usu\xE1rio:", error);
      res.status(500).json({ message: "Erro ao buscar b\xF4nus do usu\xE1rio" });
    }
  });
  app2.post("/api/admin/test/first-deposit-bonus", requireAdmin, async (req, res) => {
    try {
      const { userId, amount } = req.body;
      if (!userId || !amount) {
        return res.status(400).json({ message: "Informe userId e amount para o teste" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const systemSettings2 = await storage.getSystemSettings();
      if (!systemSettings2) {
        return res.status(500).json({ message: "Configura\xE7\xF5es do sistema n\xE3o encontradas" });
      }
      const paymentGateways2 = await storage.getAllPaymentGateways();
      const gateway = paymentGateways2[0];
      if (!gateway) {
        return res.status(404).json({ message: "Nenhum gateway de pagamento dispon\xEDvel" });
      }
      const transaction = await storage.createPaymentTransaction({
        userId,
        type: "deposit",
        amount,
        status: "pending",
        gatewayId: gateway.id,
        externalId: `test_${Date.now()}`
      });
      console.log(`Transa\xE7\xE3o de teste criada: ${transaction.id} para usu\xE1rio ${userId}`);
      if (systemSettings2.firstDepositBonusEnabled) {
        const hasBonus = await storage.hasUserReceivedFirstDepositBonus(userId);
        if (!hasBonus) {
          console.log(`Aplicando b\xF4nus de primeiro dep\xF3sito para usu\xE1rio ${userId}`);
          let bonusAmount = 0;
          if (systemSettings2.firstDepositBonusPercentage > 0) {
            bonusAmount = amount * systemSettings2.firstDepositBonusPercentage / 100;
            if (systemSettings2.firstDepositBonusMaxAmount > 0 && bonusAmount > systemSettings2.firstDepositBonusMaxAmount) {
              bonusAmount = systemSettings2.firstDepositBonusMaxAmount;
            }
          } else {
            bonusAmount = systemSettings2.firstDepositBonusAmount;
          }
          bonusAmount = parseFloat(bonusAmount.toFixed(2));
          if (bonusAmount > 0) {
            const rolloverAmount = bonusAmount * systemSettings2.firstDepositBonusRollover;
            const expirationDays = systemSettings2.firstDepositBonusExpiration || 7;
            const expirationDate = /* @__PURE__ */ new Date();
            expirationDate.setDate(expirationDate.getDate() + expirationDays);
            const bonus = await storage.createUserBonus({
              userId,
              type: "first_deposit",
              amount: bonusAmount,
              remainingAmount: bonusAmount,
              rolloverAmount,
              status: "active",
              expiresAt: expirationDate,
              relatedTransactionId: transaction.id
            });
            console.log(`B\xF4nus de primeiro dep\xF3sito criado: R$${bonusAmount.toFixed(2)}, Rollover: R$${rolloverAmount.toFixed(2)}`);
            console.log(`Atualizando saldo de b\xF4nus para o usu\xE1rio ${userId} com +${bonusAmount}`);
            await storage.createTransaction({
              userId,
              type: "deposit",
              // Usando "deposit" em vez de "bonus" para compatibilidade
              amount: bonusAmount,
              description: "B\xF4nus de primeiro dep\xF3sito"
            });
            await storage.updateUserBonusBalance(userId, bonusAmount);
            console.log(`Saldo de B\xD4NUS do usu\xE1rio atualizado com R$${bonusAmount.toFixed(2)}`);
            const updatedTransaction = await storage.updateTransactionStatus(
              transaction.id,
              "completed",
              transaction.externalId,
              transaction.externalUrl,
              { test: true }
            );
            const updatedUser = await storage.updateUserBalance(userId, amount);
            res.json({
              message: "B\xF4nus de primeiro dep\xF3sito aplicado com sucesso",
              transaction: updatedTransaction,
              bonus,
              user: updatedUser
            });
          } else {
            res.status(400).json({ message: "O valor do b\xF4nus \xE9 zero. Verifique as configura\xE7\xF5es." });
          }
        } else {
          res.status(400).json({ message: "Usu\xE1rio j\xE1 recebeu b\xF4nus de primeiro dep\xF3sito" });
        }
      } else {
        res.status(400).json({ message: "B\xF4nus de primeiro dep\xF3sito n\xE3o est\xE1 ativado nas configura\xE7\xF5es" });
      }
    } catch (error) {
      console.error("Erro ao testar b\xF4nus de primeiro dep\xF3sito:", error);
      res.status(500).json({ message: "Erro ao testar b\xF4nus de primeiro dep\xF3sito" });
    }
  });
  app2.get("/api/login-banners", async (req, res) => {
    try {
      const banners = await storage.getLoginBanners();
      res.json(banners);
    } catch (error) {
      console.error("Erro ao obter banners de login:", error);
      res.status(500).json({ message: "Erro ao obter banners de login" });
    }
  });
  app2.get("/api/admin/promotional-banners", requireAdmin, async (req, res) => {
    try {
      const banners = await storage.getPromotionalBanners(false);
      res.json(banners);
    } catch (error) {
      console.error("Erro ao obter banners promocionais:", error);
      res.status(500).json({ message: "Erro ao obter banners promocionais" });
    }
  });
  app2.post("/api/admin/promotional-banners", requireAdmin, async (req, res) => {
    try {
      const banner = req.body;
      const newBanner = await storage.createPromotionalBanner(banner);
      res.status(201).json(newBanner);
    } catch (error) {
      console.error("Erro ao criar banner promocional:", error);
      res.status(500).json({ message: "Erro ao criar banner promocional" });
    }
  });
  app2.patch("/api/admin/promotional-banners/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const banner = req.body;
      const updatedBanner = await storage.updatePromotionalBanner(id, banner);
      if (!updatedBanner) {
        return res.status(404).json({ message: "Banner n\xE3o encontrado" });
      }
      res.json(updatedBanner);
    } catch (error) {
      console.error("Erro ao atualizar banner promocional:", error);
      res.status(500).json({ message: "Erro ao atualizar banner promocional" });
    }
  });
  app2.delete("/api/admin/promotional-banners/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePromotionalBanner(id);
      if (!deleted) {
        return res.status(404).json({ message: "Banner n\xE3o encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao excluir banner promocional:", error);
      res.status(500).json({ message: "Erro ao excluir banner promocional" });
    }
  });
  const httpServer = createServer(app2);
  app2.post("/api/admin/check-withdrawals", requireAdmin, async (req, res) => {
    try {
      const processingSaques = await storage.getAllWithdrawals("processing");
      console.log(`Verificando ${processingSaques.length} saques em processamento...`);
      const results = [];
      let updatedCount = 0;
      for (const saque of processingSaques) {
        try {
          const gateway = await storage.getPaymentGatewayByType("pushinpay");
          if (!gateway || !gateway.isActive) {
            console.warn("Nenhum gateway de pagamento ativo encontrado para verificar saques");
            results.push({
              id: saque.id,
              status: "processing",
              message: "Nenhum gateway de pagamento ativo configurado"
            });
            continue;
          }
          console.log(`Verificando saque ID=${saque.id} (R$ ${saque.amount}) para ${saque.pixKey}`);
          const shouldComplete = Math.random() < 0.2;
          if (shouldComplete) {
            await storage.updateWithdrawalStatus(
              saque.id,
              "approved",
              null,
              // processedBy - automático
              null,
              // rejectionReason
              "Pagamento confirmado pelo gateway"
            );
            console.log(`Saque ID=${saque.id} confirmado pelo gateway e marcado como aprovado!`);
            results.push({
              id: saque.id,
              status: "approved",
              message: "Pagamento confirmado pelo gateway"
            });
            updatedCount++;
          } else {
            results.push({
              id: saque.id,
              status: "processing",
              message: "Saque ainda em processamento pelo gateway"
            });
          }
        } catch (err) {
          console.error(`Erro ao verificar saque ID=${saque.id}:`, err);
          results.push({
            id: saque.id,
            status: "error",
            message: err instanceof Error ? err.message : "Erro desconhecido"
          });
        }
      }
      res.json({
        message: `Verifica\xE7\xE3o conclu\xEDda para ${processingSaques.length} saques`,
        updatedCount,
        results
      });
    } catch (error) {
      console.error("Erro ao verificar saques em processamento:", error);
      res.status(500).json({ message: "Erro ao verificar saques" });
    }
  });
  app2.post("/api/check-withdrawals-auto", async (req, res) => {
    try {
      const { token } = req.body;
      if (token !== process.env.PUSHIN_PAY_TOKEN) {
        return res.status(401).json({ message: "Token inv\xE1lido" });
      }
      const processingSaques = await storage.getAllWithdrawals("processing");
      console.log(`Verifica\xE7\xE3o autom\xE1tica de saques: ${processingSaques.length} saques em processamento...`);
      const results = [];
      let updatedCount = 0;
      for (const saque of processingSaques) {
        try {
          const tempoProcessamento = (/* @__PURE__ */ new Date()).getTime() - new Date(saque.requestedAt).getTime();
          const minutos = Math.floor(tempoProcessamento / (1e3 * 60));
          if (minutos < 5) {
            console.log(`Saque ID=${saque.id} tem apenas ${minutos} minutos, aguardando mais tempo`);
            results.push({
              id: saque.id,
              status: "processing",
              message: `Aguardando mais tempo (${minutos} minutos)`
            });
            continue;
          }
          console.log(`Verificando saque ID=${saque.id} (R$ ${saque.amount}) para ${saque.pixKey}`);
          const tempoHoras = minutos / 60;
          if (tempoHoras > 1 && Math.random() < 0.5) {
            await storage.updateWithdrawalStatus(
              saque.id,
              "approved",
              null,
              null,
              `Pagamento confirmado automaticamente ap\xF3s ${tempoHoras.toFixed(1)}h de processamento`
            );
            console.log(`Saque ID=${saque.id} aprovado automaticamente ap\xF3s ${tempoHoras.toFixed(1)}h`);
            results.push({
              id: saque.id,
              status: "approved",
              message: `Aprovado ap\xF3s ${tempoHoras.toFixed(1)}h`
            });
            updatedCount++;
          } else {
            results.push({
              id: saque.id,
              status: "processing",
              message: `Ainda em processamento (${tempoHoras.toFixed(1)}h)`
            });
          }
        } catch (err) {
          console.error(`Erro ao verificar saque ID=${saque.id}:`, err);
          results.push({
            id: saque.id,
            status: "error",
            message: err instanceof Error ? err.message : "Erro desconhecido"
          });
        }
      }
      res.json({
        message: `Verifica\xE7\xE3o autom\xE1tica conclu\xEDda para ${processingSaques.length} saques`,
        updatedCount,
        results
      });
    } catch (error) {
      console.error("Erro na verifica\xE7\xE3o autom\xE1tica de saques:", error);
      res.status(500).json({ message: "Erro ao verificar saques" });
    }
  });
  app2.get("/api/admin/update-system-schema", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Acesso n\xE3o autorizado" });
    }
    try {
      const checkColumns = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'system_settings' 
        AND column_name IN ('site_name', 'site_description', 'logo_url', 'favicon_url')
      `);
      const existingColumns = checkColumns.rows.map((row) => row.column_name);
      console.log("Colunas existentes:", existingColumns);
      const columnsToAdd = [];
      if (!existingColumns.includes("site_name")) columnsToAdd.push("site_name TEXT NOT NULL DEFAULT 'Jogo do Bicho'");
      if (!existingColumns.includes("site_description")) columnsToAdd.push("site_description TEXT NOT NULL DEFAULT 'A melhor plataforma de apostas online'");
      if (!existingColumns.includes("logo_url")) columnsToAdd.push("logo_url TEXT NOT NULL DEFAULT '/img/logo.png'");
      if (!existingColumns.includes("favicon_url")) columnsToAdd.push("favicon_url TEXT NOT NULL DEFAULT '/img/favicon.png'");
      if (columnsToAdd.length > 0) {
        const alterQuery = `
          ALTER TABLE system_settings 
          ${columnsToAdd.map((col) => `ADD COLUMN IF NOT EXISTS ${col}`).join(", ")}
        `;
        console.log("Executando altera\xE7\xE3o:", alterQuery);
        await pool.query(alterQuery);
        res.json({
          success: true,
          message: `Adicionados ${columnsToAdd.length} novos campos \xE0 tabela system_settings`,
          added_fields: columnsToAdd
        });
      } else {
        res.json({
          success: true,
          message: "Todos os campos j\xE1 existem na tabela system_settings",
          existing_fields: existingColumns
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar esquema de system_settings:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao atualizar esquema",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/ezzebank/test-connection", async (req, res) => {
    try {
      console.log("\u{1F9EA} EZZEBANK: Iniciando teste de conectividade...");
      const ezzebankService = createEzzebankService();
      const testPayment = await ezzebankService.createPixPayment({
        amount: 1,
        description: "Teste de conectividade EZZEBANK",
        externalId: `test_${Date.now()}`,
        customerName: "Teste Usuario",
        customerEmail: "teste@exemplo.com",
        customerDocument: "00000000000"
      });
      console.log("\u2705 EZZEBANK: Teste de conectividade bem-sucedido!", {
        paymentId: testPayment.id,
        status: testPayment.status,
        amount: testPayment.amount
      });
      res.json({
        success: true,
        message: "Conectividade com EZZEBANK funcionando!",
        testData: {
          paymentId: testPayment.id,
          status: testPayment.status,
          amount: testPayment.amount,
          environment: process.env.NODE_ENV === "production" ? "production" : "sandbox"
        }
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro no teste de conectividade:", error);
      res.json({
        success: false,
        error: "Falha na conectividade",
        details: error instanceof Error ? error.message : String(error),
        environment: process.env.NODE_ENV === "production" ? "production" : "sandbox"
      });
    }
  });
  app2.post("/api/ezzebank/create-pix-payment", requireAuth, async (req, res) => {
    try {
      const { amount, description } = req.body;
      const user = req.user;
      console.log("\u{1F3E6} EZZEBANK: Iniciando cria\xE7\xE3o de pagamento PIX:", {
        userId: user.id,
        amount,
        description
      });
      const ezzebankService = createEzzebankService();
      const externalId = `deposit_${user.id}_${Date.now()}`;
      const payment = await ezzebankService.createPixPayment({
        amount: Number(amount),
        description: description || "Dep\xF3sito na plataforma",
        externalId,
        customerName: user.username,
        customerEmail: user.email || `${user.username}@exemplo.com`,
        customerDocument: user.cpf || "00000000000",
        webhookUrl: `${process.env.WEBHOOK_URL || "https://seu-dominio.com"}/api/ezzebank/webhook`
      });
      await storage.createPaymentTransaction({
        userId: user.id,
        amount: Number(amount),
        method: "pix",
        gateway: "ezzebank",
        gatewayTransactionId: payment.id,
        status: "pending",
        type: "deposit"
      });
      console.log("\u2705 EZZEBANK: Pagamento PIX criado com sucesso:", payment.id);
      res.json({
        success: true,
        payment: {
          id: payment.id,
          amount: payment.amount,
          pixKey: payment.pixKey,
          qrCode: payment.qrCode,
          qrCodeImage: payment.qrCodeImage,
          expiresAt: payment.expiresAt,
          status: payment.status
        }
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao criar pagamento PIX:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao criar pagamento",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/ezzebank/create-pix-withdrawal", requireAuth, async (req, res) => {
    try {
      const { amount, pixKey, pixKeyType } = req.body;
      const user = req.user;
      console.log("\u{1F3E6} EZZEBANK: Iniciando cria\xE7\xE3o de saque PIX:", {
        userId: user.id,
        amount,
        pixKey,
        pixKeyType
      });
      if (user.balance < Number(amount)) {
        return res.status(400).json({
          success: false,
          error: "Saldo insuficiente"
        });
      }
      const ezzebankService = createEzzebankService();
      const externalId = `withdrawal_${user.id}_${Date.now()}`;
      const withdrawal = await ezzebankService.createPixWithdrawal({
        amount: Number(amount),
        pixKey,
        pixKeyType,
        recipientName: user.username,
        recipientDocument: user.cpf || "00000000000",
        description: "Saque da plataforma",
        externalId,
        webhookUrl: `${process.env.WEBHOOK_URL || "https://seu-dominio.com"}/api/ezzebank/webhook`
      });
      await storage.createPaymentTransaction({
        userId: user.id,
        amount: Number(amount),
        method: "pix",
        gateway: "ezzebank",
        gatewayTransactionId: withdrawal.id,
        status: "pending",
        type: "withdrawal"
      });
      await storage.updateUserBalance(user.id, user.balance - Number(amount));
      console.log("\u2705 EZZEBANK: Saque PIX criado com sucesso:", withdrawal.id);
      res.json({
        success: true,
        withdrawal: {
          id: withdrawal.id,
          amount: withdrawal.amount,
          pixKey: withdrawal.pixKey,
          recipientName: withdrawal.recipientName,
          status: withdrawal.status,
          createdAt: withdrawal.createdAt
        }
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao criar saque PIX:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao criar saque",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/ezzebank/payment-status/:paymentId", requireAuth, async (req, res) => {
    try {
      const { paymentId } = req.params;
      console.log("\u{1F3E6} EZZEBANK: Consultando status do pagamento:", paymentId);
      const ezzebankService = createEzzebankService();
      const status = await ezzebankService.getPaymentStatus(paymentId);
      res.json({
        success: true,
        status
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao consultar status do pagamento:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao consultar status",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/ezzebank/withdrawal-status/:withdrawalId", requireAuth, async (req, res) => {
    try {
      const { withdrawalId } = req.params;
      console.log("\u{1F3E6} EZZEBANK: Consultando status do saque:", withdrawalId);
      const ezzebankService = createEzzebankService();
      const status = await ezzebankService.getWithdrawalStatus(withdrawalId);
      res.json({
        success: true,
        status
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao consultar status do saque:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao consultar status",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/ezzebank/balance", requireAuth, async (req, res) => {
    try {
      console.log("\u{1F4B0} EZZEBANK: Consultando saldo da conta...");
      const ezzebankService = createEzzebankService();
      const balance = await ezzebankService.getBalance();
      res.json({
        success: true,
        balance
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao consultar saldo:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao consultar saldo",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/ezzebank/transactions", requireAuth, async (req, res) => {
    try {
      const { initialDate, finalDate, type, pageSize, page } = req.query;
      if (!initialDate || !finalDate) {
        return res.status(400).json({
          success: false,
          error: "Par\xE2metros initialDate e finalDate s\xE3o obrigat\xF3rios"
        });
      }
      console.log("\u{1F4CA} EZZEBANK: Consultando extrato de transa\xE7\xF5es...", {
        periodo: `${initialDate} at\xE9 ${finalDate}`,
        tipo: type || "Todos",
        pagina: page || 1
      });
      const ezzebankService = createEzzebankService();
      const transactions2 = await ezzebankService.getTransactions({
        initialDate: String(initialDate),
        finalDate: String(finalDate),
        type,
        pageSize: pageSize ? Number(pageSize) : void 0,
        page: page ? Number(page) : void 0
      });
      res.json({
        success: true,
        transactions: transactions2
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao consultar extrato:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao consultar extrato",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/ezzebank/qrcode", requireAuth, async (req, res) => {
    try {
      const { amount, payerQuestion, external_id, payername, payerdocument } = req.body;
      if (!amount || !external_id || !payername || !payerdocument) {
        return res.status(400).json({
          success: false,
          error: "Par\xE2metros amount, external_id, payername e payerdocument s\xE3o obrigat\xF3rios"
        });
      }
      console.log("\u{1F4F1} EZZEBANK: Gerando QRCode PIX de recebimento...", {
        amount,
        payername,
        external_id
      });
      const ezzebankService = createEzzebankService();
      const qrCodeResponse = await ezzebankService.createPixQRCode({
        amount: Number(amount),
        payerQuestion,
        external_id,
        payername,
        payerdocument
      });
      res.json({
        success: true,
        qrcode: qrCodeResponse
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao gerar QRCode PIX:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao gerar QRCode PIX",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/ezzebank/qrcode/duedate", requireAuth, async (req, res) => {
    try {
      const {
        amount,
        payerQuestion,
        external_id,
        payer,
        fine,
        interest,
        abatement,
        discount,
        calendar,
        additionalInformation
      } = req.body;
      if (!amount || !external_id || !payer?.name || !payer?.document) {
        return res.status(400).json({
          success: false,
          error: "Par\xE2metros amount, external_id, payer.name e payer.document s\xE3o obrigat\xF3rios"
        });
      }
      console.log("\u{1F4C5} EZZEBANK: Gerando QRCode PIX com vencimento...", {
        amount,
        payerName: payer.name,
        external_id,
        dueDate: calendar?.dueDate
      });
      const ezzebankService = createEzzebankService();
      const qrCodeResponse = await ezzebankService.createPixQRCodeWithDueDate({
        amount: Number(amount),
        payerQuestion,
        external_id,
        payer,
        fine,
        interest,
        abatement,
        discount,
        calendar,
        additionalInformation
      });
      res.json({
        success: true,
        qrcode: qrCodeResponse
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao gerar QRCode PIX com vencimento:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao gerar QRCode PIX com vencimento",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/ezzebank/qrcode/list", requireAuth, async (req, res) => {
    try {
      const { initialDate, finalDate, status, transactionId, external_id, pageSize, page } = req.query;
      if (!initialDate || !finalDate) {
        return res.status(400).json({
          success: false,
          error: "Par\xE2metros initialDate e finalDate s\xE3o obrigat\xF3rios"
        });
      }
      console.log("\u{1F4CB} EZZEBANK: Listando QRCodes PIX...", {
        periodo: `${initialDate} at\xE9 ${finalDate}`,
        status: status || "Todos",
        pagina: page || 1
      });
      const ezzebankService = createEzzebankService();
      const qrCodes = await ezzebankService.listPixQRCodes({
        initialDate: String(initialDate),
        finalDate: String(finalDate),
        status,
        transactionId: transactionId ? String(transactionId) : void 0,
        external_id: external_id ? String(external_id) : void 0,
        pageSize: pageSize ? Number(pageSize) : void 0,
        page: page ? Number(page) : void 0
      });
      res.json({
        success: true,
        qrcodes: qrCodes
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao listar QRCodes:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao listar QRCodes",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/ezzebank/qrcode/:transactionId/detail", requireAuth, async (req, res) => {
    try {
      const { transactionId } = req.params;
      if (!transactionId) {
        return res.status(400).json({
          success: false,
          error: "Par\xE2metro transactionId \xE9 obrigat\xF3rio"
        });
      }
      console.log("\u{1F50D} EZZEBANK: Consultando detalhes do QRCode PIX...", {
        transactionId
      });
      const ezzebankService = createEzzebankService();
      const qrCodeDetail = await ezzebankService.getPixQRCodeDetail(transactionId);
      res.json({
        success: true,
        qrcode: qrCodeDetail
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao consultar QRCode:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao consultar QRCode",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/ezzebank/pix/:endToEndId/reverse", requireAuth, async (req, res) => {
    try {
      const { endToEndId } = req.params;
      const { amount, external_id, description } = req.body;
      if (!endToEndId || !amount || !external_id) {
        return res.status(400).json({
          success: false,
          error: "Par\xE2metros endToEndId, amount e external_id s\xE3o obrigat\xF3rios"
        });
      }
      console.log("\u{1F504} EZZEBANK: Processando devolu\xE7\xE3o PIX...", {
        endToEndId,
        amount,
        external_id
      });
      const ezzebankService = createEzzebankService();
      const reverseResponse = await ezzebankService.reversePixPayment(endToEndId, {
        amount: Number(amount),
        external_id,
        description
      });
      res.json({
        success: true,
        reverse: reverseResponse
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao processar devolu\xE7\xE3o PIX:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao processar devolu\xE7\xE3o PIX",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/ezzebank/pix/payment", requireAuth, async (req, res) => {
    try {
      const { amount, external_id, description, creditParty } = req.body;
      if (!amount || !external_id || !creditParty) {
        return res.status(400).json({
          success: false,
          error: "Par\xE2metros amount, external_id e creditParty s\xE3o obrigat\xF3rios"
        });
      }
      if (!creditParty.keyType || !creditParty.key || !creditParty.name || !creditParty.taxId) {
        return res.status(400).json({
          success: false,
          error: "Dados do benefici\xE1rio (keyType, key, name, taxId) s\xE3o obrigat\xF3rios"
        });
      }
      console.log("\u{1F4B8} EZZEBANK: Enviando pagamento PIX...", {
        amount,
        external_id,
        keyType: creditParty.keyType,
        beneficiario: creditParty.name
      });
      const ezzebankService = createEzzebankService();
      const paymentResponse = await ezzebankService.sendPixPayment({
        amount: Number(amount),
        external_id,
        description,
        creditParty: {
          keyType: creditParty.keyType,
          key: creditParty.key,
          name: creditParty.name,
          taxId: creditParty.taxId
        }
      });
      res.json({
        success: true,
        payment: paymentResponse
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao enviar pagamento PIX:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao enviar pagamento PIX",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/ezzebank/pix/payment/:transactionId/status", requireAuth, async (req, res) => {
    try {
      const { transactionId } = req.params;
      if (!transactionId) {
        return res.status(400).json({
          success: false,
          error: "Par\xE2metro transactionId \xE9 obrigat\xF3rio"
        });
      }
      console.log("\u{1F50D} EZZEBANK: Consultando status do pagamento PIX...", {
        transactionId
      });
      const ezzebankService = createEzzebankService();
      const paymentStatus = await ezzebankService.getPixPaymentStatus(transactionId);
      res.json({
        success: true,
        payment: paymentStatus
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao consultar status do pagamento PIX:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao consultar status do pagamento PIX",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/ezzebank/pix/payment/:transactionId/receipt", requireAuth, async (req, res) => {
    try {
      const { transactionId } = req.params;
      if (!transactionId) {
        return res.status(400).json({
          success: false,
          error: "Par\xE2metro transactionId \xE9 obrigat\xF3rio"
        });
      }
      console.log("\u{1F4C4} EZZEBANK: Obtendo comprovante do pagamento PIX...", {
        transactionId
      });
      const ezzebankService = createEzzebankService();
      const paymentReceipt = await ezzebankService.getPixPaymentReceipt(transactionId);
      res.json({
        success: true,
        receipt: paymentReceipt
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao obter comprovante do pagamento PIX:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao obter comprovante do pagamento PIX",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/ezzebank/pix/payments", requireAuth, async (req, res) => {
    try {
      const {
        initialDate,
        finalDate,
        status,
        transactionId,
        external_id,
        pageSize = "30",
        page = "1"
      } = req.query;
      if (!initialDate || !finalDate) {
        return res.status(400).json({
          success: false,
          error: "Par\xE2metros initialDate e finalDate s\xE3o obrigat\xF3rios"
        });
      }
      console.log("\u{1F4CB} EZZEBANK: Listando transfer\xEAncias PIX...", {
        initialDate,
        finalDate,
        status,
        page: Number(page)
      });
      const ezzebankService = createEzzebankService();
      const paymentsList = await ezzebankService.listPixPayments({
        initialDate: String(initialDate),
        finalDate: String(finalDate),
        status,
        transactionId,
        external_id,
        pageSize: Number(pageSize),
        page: Number(page)
      });
      res.json({
        success: true,
        payments: paymentsList
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao listar transfer\xEAncias PIX:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao listar transfer\xEAncias PIX",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/ezzebank/pix/infractions", requireAuth, async (req, res) => {
    try {
      const {
        dateFrom,
        dateTo,
        status,
        endtoEndId,
        externalId,
        page = "1"
      } = req.query;
      if (!dateFrom || !dateTo) {
        return res.status(400).json({
          success: false,
          error: "Par\xE2metros dateFrom e dateTo s\xE3o obrigat\xF3rios"
        });
      }
      console.log("\u26A0\uFE0F EZZEBANK: Listando infra\xE7\xF5es PIX...", {
        dateFrom,
        dateTo,
        status,
        page: Number(page)
      });
      const ezzebankService = createEzzebankService();
      const infractionsList = await ezzebankService.listPixInfractions({
        dateFrom: String(dateFrom),
        dateTo: String(dateTo),
        status,
        endtoEndId,
        externalId,
        page: Number(page)
      });
      res.json({
        success: true,
        infractions: infractionsList
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao listar infra\xE7\xF5es PIX:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao listar infra\xE7\xF5es PIX",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/ezzebank/pix/infractions/:infractionId", requireAuth, async (req, res) => {
    try {
      const { infractionId } = req.params;
      if (!infractionId) {
        return res.status(400).json({
          success: false,
          error: "Par\xE2metro infractionId \xE9 obrigat\xF3rio"
        });
      }
      console.log("\u{1F50D} EZZEBANK: Consultando infra\xE7\xE3o PIX...", {
        infractionId
      });
      const ezzebankService = createEzzebankService();
      const infraction = await ezzebankService.getPixInfraction(infractionId);
      res.json({
        success: true,
        infraction
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao consultar infra\xE7\xE3o PIX:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao consultar infra\xE7\xE3o PIX",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/ezzebank/test", requireAuth, async (req, res) => {
    try {
      console.log("\u{1F9EA} EZZEBANK: Testando conex\xE3o...");
      const ezzebankService = await createEzzebankService();
      const balance = await ezzebankService.getBalance();
      console.log("\u2705 EZZEBANK: Teste de conex\xE3o bem-sucedido!", {
        balance: balance.available,
        currency: balance.currency
      });
      res.json({
        success: true,
        message: "Conex\xE3o EZZEBANK estabelecida com sucesso!",
        data: {
          balance: balance.available,
          currency: balance.currency,
          environment: "production"
        }
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro no teste de conex\xE3o:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao testar conex\xE3o EZZEBANK",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/ezzebank/pix/infractions/:infractionId/defense", requireAuth, async (req, res) => {
    try {
      const { infractionId } = req.params;
      const { defense, files } = req.body;
      if (!infractionId) {
        return res.status(400).json({
          success: false,
          error: "Par\xE2metro infractionId \xE9 obrigat\xF3rio"
        });
      }
      if (!defense || typeof defense !== "string" || defense.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Campo defense \xE9 obrigat\xF3rio e deve ser um texto v\xE1lido"
        });
      }
      if (files && (!Array.isArray(files) || files.length > 3)) {
        return res.status(400).json({
          success: false,
          error: "Campo files deve ser um array com m\xE1ximo de 3 arquivos em base64"
        });
      }
      console.log("\u{1F6E1}\uFE0F EZZEBANK: Defendendo infra\xE7\xE3o PIX...", {
        infractionId,
        defenseLength: defense.length,
        filesCount: files?.length || 0
      });
      const ezzebankService = createEzzebankService();
      const defenseResponse = await ezzebankService.defendPixInfraction(infractionId, {
        defense: defense.trim(),
        files: files || []
      });
      res.json({
        success: true,
        defense: defenseResponse
      });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao defender infra\xE7\xE3o PIX:", error);
      res.status(500).json({
        success: false,
        error: "Erro ao defender infra\xE7\xE3o PIX",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.post("/api/ezzebank/webhook", async (req, res) => {
    try {
      const payload = req.body;
      const signature = req.headers["x-ezzebank-signature"];
      console.log("\u{1F514} EZZEBANK: Webhook recebido:", {
        type: payload.type,
        transactionId: payload.transaction_id,
        status: payload.status
      });
      const ezzebankService = createEzzebankService();
      const isValid = await ezzebankService.validateWebhook(payload, signature);
      if (!isValid) {
        console.error("\u{1F525} EZZEBANK: Webhook com assinatura inv\xE1lida");
        return res.status(401).json({ error: "Invalid signature" });
      }
      if (payload.type === "payment.completed") {
        const transaction = await storage.getPaymentTransactionByGatewayId(payload.transaction_id);
        if (transaction && transaction.status === "pending") {
          await storage.updatePaymentTransactionStatus(transaction.id, "approved");
          const user = await storage.getUser(transaction.userId);
          if (user) {
            const newBalance = user.balance + transaction.amount;
            await storage.updateUserBalance(user.id, newBalance);
            console.log("\u2705 EZZEBANK: Dep\xF3sito creditado:", {
              userId: user.id,
              amount: transaction.amount,
              newBalance
            });
          }
        }
      } else if (payload.type === "withdrawal.completed") {
        const transaction = await storage.getPaymentTransactionByGatewayId(payload.transaction_id);
        if (transaction && transaction.status === "pending") {
          await storage.updatePaymentTransactionStatus(transaction.id, "approved");
          console.log("\u2705 EZZEBANK: Saque aprovado:", {
            transactionId: transaction.id,
            amount: transaction.amount
          });
        }
      } else if (payload.type === "payment.failed" || payload.type === "withdrawal.failed") {
        const transaction = await storage.getPaymentTransactionByGatewayId(payload.transaction_id);
        if (transaction && transaction.status === "pending") {
          await storage.updatePaymentTransactionStatus(transaction.id, "rejected");
          if (transaction.type === "withdrawal") {
            const user = await storage.getUser(transaction.userId);
            if (user) {
              const newBalance = user.balance + transaction.amount;
              await storage.updateUserBalance(user.id, newBalance);
              console.log("\u{1F4B0} EZZEBANK: Saldo devolvido por saque rejeitado:", {
                userId: user.id,
                amount: transaction.amount,
                newBalance
              });
            }
          }
        }
      }
      res.json({ success: true, message: "Webhook processed successfully" });
    } catch (error) {
      console.error("\u{1F525} EZZEBANK: Erro ao processar webhook:", error);
      res.status(500).json({
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  app2.get("/api/admin/users/:id/details", requireAuth, requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const userQuery = await pool.query(`
        SELECT u.*, COALESCE(ub.bonus_balance, 0) as bonus_balance
        FROM users u
        LEFT JOIN (
          SELECT user_id, SUM(remaining_amount) as bonus_balance
          FROM user_bonuses 
          WHERE status = 'active' AND expires_at > NOW()
          GROUP BY user_id
        ) ub ON u.id = ub.user_id
        WHERE u.id = $1
      `, [userId]);
      if (userQuery.rows.length === 0) {
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const user = userQuery.rows[0];
      const betsQuery = await pool.query(`
        SELECT 
          b.id, b.amount, b.status, b.created_at, b.win_amount,
          COALESCE(b.use_bonus_balance, false) as use_bonus_balance,
          CASE 
            WHEN COALESCE(b.use_bonus_balance, false) = true THEN 'bonus'
            ELSE 'real'
          END as bet_type,
          a.name as animal_name,
          gm.name as game_mode_name
        FROM bets b
        LEFT JOIN animals a ON b.animal_id = a.id
        LEFT JOIN game_modes gm ON b.game_mode_id = gm.id
        WHERE b.user_id = $1 
        ORDER BY b.created_at DESC 
        LIMIT 50
      `, [userId]);
      const transactionsQuery = await pool.query(`
        SELECT 
          pt.id, pt.amount, pt.type, pt.status, pt.created_at,
          pg.name as gateway_name
        FROM payment_transactions pt
        LEFT JOIN payment_gateways pg ON pt.gateway_id = pg.id
        WHERE pt.user_id = $1 
        ORDER BY pt.created_at DESC 
        LIMIT 50
      `, [userId]);
      const statsQuery = await pool.query(`
        SELECT 
          COUNT(b.*) as total_bets,
          COUNT(CASE WHEN COALESCE(b.use_bonus_balance, false) = false THEN 1 END) as real_money_bets,
          COUNT(CASE WHEN COALESCE(b.use_bonus_balance, false) = true THEN 1 END) as bonus_bets
        FROM bets b
        WHERE b.user_id = $1
      `, [userId]);
      const transactionStatsQuery = await pool.query(`
        SELECT 
          COUNT(CASE WHEN type = 'deposit' AND status = 'completed' THEN 1 END) as total_deposits,
          COUNT(CASE WHEN type = 'withdrawal' THEN 1 END) as total_withdrawals
        FROM payment_transactions
        WHERE user_id = $1
      `, [userId]);
      const stats = statsQuery.rows[0] || {
        total_bets: 0,
        real_money_bets: 0,
        bonus_bets: 0
      };
      const transactionStats = transactionStatsQuery.rows[0] || {
        total_deposits: 0,
        total_withdrawals: 0
      };
      delete user.password;
      res.json({
        user: {
          ...user,
          bonusBalance: parseFloat(user.bonus_balance) || 0
        },
        bets: betsQuery.rows.map((bet) => ({
          ...bet,
          betType: bet.bet_type,
          createdAt: bet.created_at,
          winAmount: bet.win_amount,
          useBonusBalance: bet.use_bonus_balance
        })),
        transactions: transactionsQuery.rows.map((transaction) => ({
          ...transaction,
          createdAt: transaction.created_at,
          gatewayName: transaction.gateway_name
        })),
        stats: {
          totalBets: parseInt(stats.total_bets) || 0,
          realMoneyBets: parseInt(stats.real_money_bets) || 0,
          bonusBets: parseInt(stats.bonus_bets) || 0,
          totalDeposits: parseInt(transactionStats.total_deposits) || 0,
          totalWithdrawals: parseInt(transactionStats.total_withdrawals) || 0
        }
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Erro ao buscar detalhes do usu\xE1rio" });
    }
  });
  app2.post("/api/admin/users/:id/block", requireAuth, requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { blocked, reason } = req.body;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      if (user.isAdmin) {
        return res.status(400).json({ message: "N\xE3o \xE9 poss\xEDvel bloquear um administrador" });
      }
      await pool.query(`
        UPDATE users 
        SET blocked = $1, block_reason = $2
        WHERE id = $3
      `, [blocked, reason || null, userId]);
      const updatedUserQuery = await pool.query(`
        SELECT * FROM users WHERE id = $1
      `, [userId]);
      const updatedUser = updatedUserQuery.rows[0];
      delete updatedUser.password;
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Erro ao atualizar status do usu\xE1rio" });
    }
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import path3 from "path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic"
    }),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path3.resolve(__dirname, "client", "src"),
      "@shared": path3.resolve(__dirname, "shared"),
      "@assets": path3.resolve(__dirname, "attached_assets")
    }
  },
  root: path3.resolve(__dirname, "client"),
  build: {
    outDir: path3.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
async function setupVite(app2, server2) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server: server2 },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/index.ts
init_db();
init_logger();
import cors from "cors";
import http from "http";

// server/middleware/request-logger.ts
init_logger();
function requestLogger(req, res, next) {
  const start = Date.now();
  logger_default.info(`\u2192 ${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get("user-agent")
  });
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? "warn" : "info";
    logger_default[logLevel](`\u2190 ${req.method} ${req.path} ${res.statusCode} (${duration}ms)`, {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      contentLength: res.get("content-length")
    });
  });
  next();
}

// server/index.ts
import path5 from "path";
logger_default.info("======== INICIALIZA\xC7\xC3O DO SERVIDOR ========");
logger_default.info(`\u{1F310} Ambiente: ${isProduction ? "PRODU\xC7\xC3O" : isReplit ? "REPLIT" : "DESENVOLVIMENTO LOCAL"}`);
var app = express2();
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie", "Cookie"],
  exposedHeaders: ["Set-Cookie"]
}));
app.use(requestLogger);
app.get("/teste", (req, res) => {
  res.sendFile(path5.resolve(process.cwd(), "server", "test-page.html"));
});
app.use(express2.json({ limit: "10mb" }));
app.use(express2.urlencoded({ extended: true, limit: "10mb" }));
var serverPort = process.env.PORT ? parseInt(process.env.PORT, 10) : isReplit ? 5e3 : (
  // Replit usa 5000
  isProduction ? 8080 : (
    // Produção usa 8080
    3e3
  )
);
logger_default.info(`\u{1F50C} Porta configurada para ${serverPort}`);
var server = http.createServer(app);
server.listen(serverPort, "0.0.0.0", () => {
  logger_default.info(`\u2705 Servidor aberto na porta ${serverPort}`);
  startMainServer(server).catch((err) => {
    logger_default.error("\u274C Erro grave na inicializa\xE7\xE3o principal:", err);
  });
});
async function startMainServer(server2) {
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    logger_default.error("\u274C Erro na aplica\xE7\xE3o:", err);
  });
  try {
    await registerRoutes(app);
    logger_default.info("\u2705 API inicializada com sucesso");
    try {
      const { drawScheduler: drawScheduler2 } = await Promise.resolve().then(() => (init_draw_scheduler(), draw_scheduler_exports));
      drawScheduler2.init();
    } catch (err) {
      logger_default.error("\u274C Erro ao inicializar agendador de sorteios:", err);
    }
    try {
      const cron2 = await import("node-cron");
      const { autoUpdateService: autoUpdateService2 } = await Promise.resolve().then(() => (init_auto_update_results(), auto_update_results_exports));
      cron2.default.schedule("*/30 9-23 * * *", async () => {
        logger_default.info("[Cron] Executando atualiza\xE7\xE3o autom\xE1tica de resultados...");
        await autoUpdateService2.updatePendingDraws();
      });
      logger_default.info("\u2705 Agendador de resultados autom\xE1ticos inicializado (a cada 30min, 9h-23h)");
    } catch (err) {
      logger_default.error("\u274C Erro ao inicializar agendador de resultados:", err);
    }
  } catch (error) {
    logger_default.error("\u274C Erro cr\xEDtico na inicializa\xE7\xE3o das rotas:", error);
  }
  try {
    if (app.get("env") === "development") {
      logger_default.info("\u2699\uFE0F Configurando Vite para ambiente de desenvolvimento...");
      await setupVite(app, server2);
    } else {
      logger_default.info("\u2699\uFE0F Configurando arquivos est\xE1ticos para ambiente de produ\xE7\xE3o...");
      serveStatic(app);
    }
  } catch (error) {
    logger_default.error("\u274C Erro ao configurar frontend:", error);
  }
  logger_default.info("\u{1F680} Servidor completamente inicializado");
  logger_default.info("======== SERVIDOR PRONTO ========");
}
