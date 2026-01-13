import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://pixbet:pixbet123@db:5432/pixbetbicho',
    ssl: false
});

async function initDatabase() {
    try {
        console.log('🔧 Inicializando banco de dados...');

        // Criar tabelas básicas
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        name TEXT,
        balance REAL DEFAULT 0 NOT NULL,
        is_admin BOOLEAN DEFAULT false NOT NULL,
        blocked BOOLEAN DEFAULT false NOT NULL,
        block_reason TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS animals (
        id SERIAL PRIMARY KEY,
        "group" INTEGER NOT NULL,
        name TEXT NOT NULL,
        numbers TEXT[] NOT NULL
      );
    `);

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
        premio_type TEXT DEFAULT '1',
        use_bonus_balance BOOLEAN DEFAULT false
      );
    `);

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
        auto_approve_withdrawals BOOLEAN DEFAULT true NOT NULL,
        auto_approve_withdrawal_limit REAL DEFAULT 30 NOT NULL,
        site_name TEXT DEFAULT 'Jogo do Bicho' NOT NULL,
        site_description TEXT DEFAULT 'A melhor plataforma de apostas online' NOT NULL,
        logo_url TEXT DEFAULT '/img/logo.png' NOT NULL,
        favicon_url TEXT DEFAULT '/img/favicon.png' NOT NULL,
        signup_bonus_enabled BOOLEAN DEFAULT false NOT NULL,
        signup_bonus_amount REAL DEFAULT 10 NOT NULL,
        signup_bonus_rollover REAL DEFAULT 3 NOT NULL,
        signup_bonus_expiration INTEGER DEFAULT 7 NOT NULL,
        first_deposit_bonus_enabled BOOLEAN DEFAULT false NOT NULL,
        first_deposit_bonus_amount REAL DEFAULT 100 NOT NULL,
        first_deposit_bonus_rollover REAL DEFAULT 3 NOT NULL,
        first_deposit_bonus_expiration INTEGER DEFAULT 7 NOT NULL,
        first_deposit_bonus_percentage REAL DEFAULT 100 NOT NULL,
        first_deposit_bonus_max_amount REAL DEFAULT 200 NOT NULL,
        promotional_banners_enabled BOOLEAN DEFAULT false NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

        console.log('✅ Tabelas criadas com sucesso!');

    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await pool.end();
    }
}

initDatabase();
