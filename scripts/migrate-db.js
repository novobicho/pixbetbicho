import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') || process.env.DATABASE_URL?.includes('@db:')
    ? false
    : { rejectUnauthorized: false }
});

async function runMigrations() {
  console.log('🔄 Iniciando migrações do banco de dados...\n');

  try {
    // ========== TABELA: users ==========
    console.log('📋 Verificando tabela users...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        name TEXT,
        balance REAL DEFAULT 0 NOT NULL,
        is_admin BOOLEAN DEFAULT false NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Adicionar colunas que podem estar faltando
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS blocked BOOLEAN DEFAULT false NOT NULL;`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS block_reason TEXT;`);
    console.log('✅ Tabela users OK\n');

    // ========== TABELA: animals ==========
    console.log('📋 Verificando tabela animals...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS animals (
        id SERIAL PRIMARY KEY,
        "group" INTEGER NOT NULL,
        name TEXT NOT NULL,
        numbers TEXT[] NOT NULL
      );
    `);
    console.log('✅ Tabela animals OK\n');

    // ========== TABELA: draw_templates ==========
    console.log('📋 Verificando tabela draw_templates...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS draw_templates (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        time TEXT NOT NULL,
        days_of_week INTEGER[] NOT NULL,
        active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Tabela draw_templates OK\n');

    // ========== TABELA: draws ==========
    console.log('📋 Verificando tabela draws...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS draws (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        time TEXT NOT NULL,
        date TIMESTAMP NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL,
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
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Tabela draws OK\n');

    // ========== TABELA: game_modes ==========
    console.log('📋 Verificando tabela game_modes...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_modes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        odds INTEGER NOT NULL,
        active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Tabela game_modes OK\n');

    // ========== TABELA: bets ==========
    console.log('📋 Verificando tabela bets...');
    await pool.query(`
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
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        draw_id INTEGER NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL,
        win_amount REAL,
        game_mode_id INTEGER,
        potential_win_amount REAL,
        bet_numbers TEXT[],
        premio_type TEXT DEFAULT '1'
      );
    `);

    // Adicionar coluna que pode estar faltando
    await pool.query(`ALTER TABLE bets ADD COLUMN IF NOT EXISTS use_bonus_balance BOOLEAN DEFAULT false;`);
    console.log('✅ Tabela bets OK\n');

    // ========== TABELA: system_settings ==========
    console.log('📋 Verificando tabela system_settings...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        max_bet_amount REAL DEFAULT 10000 NOT NULL,
        max_payout REAL DEFAULT 1000000 NOT NULL,
        min_bet_amount REAL DEFAULT 50 NOT NULL,
        default_bet_amount REAL DEFAULT 200 NOT NULL,
        main_color TEXT DEFAULT '#035faf' NOT NULL,
        secondary_color TEXT DEFAULT '#b0d525' NOT NULL,
        accent_color TEXT DEFAULT '#b0d524' NOT NULL,
        allow_user_registration BOOLEAN DEFAULT true NOT NULL,
        allow_deposits BOOLEAN DEFAULT true NOT NULL,
        allow_withdrawals BOOLEAN DEFAULT true NOT NULL,
        maintenance_mode BOOLEAN DEFAULT false NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Adicionar colunas que podem estar faltando
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS auto_approve_withdrawals BOOLEAN DEFAULT true NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS auto_approve_withdrawal_limit REAL DEFAULT 30 NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS site_name TEXT DEFAULT 'Jogo do Bicho' NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS site_description TEXT DEFAULT 'A melhor plataforma de apostas online' NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT '/img/logo.png' NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS favicon_url TEXT DEFAULT '/img/favicon.png' NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS signup_bonus_enabled BOOLEAN DEFAULT false NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS signup_bonus_amount REAL DEFAULT 10 NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS signup_bonus_rollover REAL DEFAULT 3 NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS signup_bonus_expiration INTEGER DEFAULT 7 NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS first_deposit_bonus_enabled BOOLEAN DEFAULT false NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS first_deposit_bonus_amount REAL DEFAULT 100 NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS first_deposit_bonus_rollover REAL DEFAULT 3 NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS first_deposit_bonus_expiration INTEGER DEFAULT 7 NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS first_deposit_bonus_percentage REAL DEFAULT 100 NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS first_deposit_bonus_max_amount REAL DEFAULT 200 NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS promotional_banners_enabled BOOLEAN DEFAULT false NOT NULL;`);
    await pool.query(`ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS allow_bonus_bets BOOLEAN DEFAULT true NOT NULL;`);
    console.log('✅ Tabela system_settings OK\n');

    // ========== TABELA: transactions ==========
    console.log('📋 Verificando tabela transactions...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        related_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Tabela transactions OK\n');

    // ========== TABELA: payment_gateways ==========
    console.log('📋 Verificando tabela payment_gateways...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_gateways (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        is_active BOOLEAN DEFAULT false NOT NULL,
        api_key TEXT,
        secret_key TEXT,
        sandbox BOOLEAN DEFAULT true NOT NULL,
        config JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Tabela payment_gateways OK\n');

    // ========== TABELA: payment_transactions ==========
    console.log('📋 Verificando tabela payment_transactions...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        gateway_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL,
        type TEXT DEFAULT 'deposit' NOT NULL,
        external_id TEXT,
        external_url TEXT,
        gateway_response JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Tabela payment_transactions OK\n');

    // ========== TABELA: withdrawals ==========
    console.log('📋 Verificando tabela withdrawals...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL,
        pix_key TEXT NOT NULL,
        pix_key_type TEXT NOT NULL,
        account_info TEXT,
        requested_at TIMESTAMP DEFAULT NOW() NOT NULL,
        processed_at TIMESTAMP,
        processed_by INTEGER,
        rejection_reason TEXT,
        notes TEXT
      );
    `);
    console.log('✅ Tabela withdrawals OK\n');

    // ========== TABELA: user_bonuses ==========
    console.log('📋 Verificando tabela user_bonuses...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_bonuses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        remaining_amount REAL NOT NULL,
        rollover_amount REAL NOT NULL,
        rolled_amount REAL DEFAULT 0 NOT NULL,
        status TEXT DEFAULT 'active' NOT NULL,
        expires_at TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        related_transaction_id INTEGER
      );
    `);
    console.log('✅ Tabela user_bonuses OK\n');

    // ========== TABELA: promotional_banners ==========
    console.log('📋 Verificando tabela promotional_banners...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS promotional_banners (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        link_url TEXT,
        start_date TIMESTAMP DEFAULT NOW() NOT NULL,
        end_date TIMESTAMP,
        is_login_banner BOOLEAN DEFAULT false NOT NULL,
        is_enabled BOOLEAN DEFAULT true NOT NULL,
        display_order INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Tabela promotional_banners OK\n');

    console.log('✅ Todas as migrações concluídas com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante migrações:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigrations();
