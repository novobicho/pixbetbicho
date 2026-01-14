import pg from 'pg';
import crypto from 'crypto';
import util from 'util';

// Otimização para produção DigitalOcean
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function hashPassword(password) {
  const scryptAsync = util.promisify(crypto.scrypt);
  const salt = crypto.randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function setup() {
  console.log('🚀 Iniciando configuração do banco de dados...');
  let pool;

  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.log('⚠️ DATABASE_URL não definida. Pulando configuração do banco.');
      return;
    }

    if (dbUrl.includes('${')) {
      console.log('⚠️ ALERTA: DATABASE_URL parece conter um template não processado:', dbUrl);
      console.log('👉 Verifique se o nome do banco no painel da DigitalOcean coincide com o que está na variável.');
      console.log('👉 Exemplo: Se o banco se chama "db", a variável deve ser ${db.DATABASE_URL}');
      return;
    }

    try {
      const url = new URL(dbUrl);
      console.log('🔌 Conectando ao host:', url.hostname);

      pool = new pg.Pool({
        connectionString: dbUrl,
        ssl: {
          rejectUnauthorized: false,
          checkServerIdentity: () => undefined
        },
        max: 5,
        connectionTimeoutMillis: 10000,
      });
    } catch (e) {
      console.log('⚠️ DATABASE_URL não é uma URL válida. Valor atual:', dbUrl);
      return;
    }
  } catch (err) {
    console.error('❌ Erro ao ler variáveis de ambiente:', err);
    return;
  }

  try {
    // 1. Criar tabelas (Baseado no migrate-db.js)
    console.log('Step 1: Criando tabelas...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        name TEXT,
        balance REAL DEFAULT 0 NOT NULL,
        is_admin BOOLEAN DEFAULT false NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        blocked BOOLEAN DEFAULT false NOT NULL,
        block_reason TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS animals (
        id SERIAL PRIMARY KEY,
        "group" INTEGER NOT NULL UNIQUE,
        name TEXT NOT NULL,
        numbers TEXT[] NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_modes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        odds INTEGER NOT NULL,
        active BOOLEAN DEFAULT true NOT NULL,
        sort_order INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS draw_templates (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        time TEXT NOT NULL,
        days_of_week INTEGER[] NOT NULL,
        active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS draws (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        time TEXT NOT NULL,
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL,
        result_animal_id INTEGER,
        result_animal_id_2 INTEGER,
        result_animal_id_3 INTEGER,
        result_animal_id_4 INTEGER,
        result_animal_id_5 INTEGER,
        result_animal_id_6 INTEGER,
        result_animal_id_7 INTEGER,
        result_animal_id_8 INTEGER,
        result_animal_id_9 INTEGER,
        result_animal_id_10 INTEGER,
        result_number_1 TEXT,
        result_number_2 TEXT,
        result_number_3 TEXT,
        result_number_4 TEXT,
        result_number_5 TEXT,
        result_number_6 TEXT,
        result_number_7 TEXT,
        result_number_8 TEXT,
        result_number_9 TEXT,
        result_number_10 TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        animal_id INTEGER REFERENCES animals(id),
        animal_id_2 INTEGER REFERENCES animals(id),
        animal_id_3 INTEGER REFERENCES animals(id),
        animal_id_4 INTEGER REFERENCES animals(id),
        animal_id_5 INTEGER REFERENCES animals(id),
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        draw_id INTEGER NOT NULL REFERENCES draws(id),
        status TEXT DEFAULT 'pending' NOT NULL,
        win_amount REAL,
        game_mode_id INTEGER REFERENCES game_modes(id),
        potential_win_amount REAL,
        bet_numbers TEXT[],
        premio_type TEXT DEFAULT '1',
        use_bonus_balance BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        max_bet_amount REAL DEFAULT 10000 NOT NULL,
        max_payout REAL DEFAULT 1000000 NOT NULL,
        min_bet_amount REAL DEFAULT 5 NOT NULL,
        default_bet_amount REAL DEFAULT 20 NOT NULL,
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
        banner_desktop_url TEXT DEFAULT '/img/banner-desktop.jpg',
        banner_mobile_url TEXT DEFAULT '/img/banner-mobile.jpg',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        gateway_id INTEGER NOT NULL REFERENCES payment_gateways(id),
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL,
        type TEXT DEFAULT 'deposit' NOT NULL,
        external_id TEXT,
        external_url TEXT,
        gateway_response JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL,
        pix_key TEXT NOT NULL,
        pix_key_type TEXT NOT NULL,
        account_info TEXT,
        requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        processed_at TIMESTAMP WITH TIME ZONE,
        processed_by INTEGER REFERENCES users(id),
        rejection_reason TEXT,
        notes TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        related_id INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

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
        expires_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        related_transaction_id INTEGER
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS promotional_banners (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        link_url TEXT,
        start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        end_date TIMESTAMP WITH TIME ZONE,
        is_login_banner BOOLEAN DEFAULT false NOT NULL,
        is_enabled BOOLEAN DEFAULT true NOT NULL,
        display_order INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);


    // 2. Popular dados se estiver vazio
    console.log('Step 2: Verificando dados iniciais...');

    // Animais
    const animalsCheck = await pool.query('SELECT count(*) FROM animals');
    if (parseInt(animalsCheck.rows[0].count) === 0) {
      console.log('Populando animais...');
      const animals = [
        [1, 'Avestruz', '01,02,03,04'], [2, 'Águia', '05,06,07,08'], [3, 'Burro', '09,10,11,12'],
        [4, 'Borboleta', '13,14,15,16'], [5, 'Cachorro', '17,18,19,20'], [6, 'Cabra', '21,22,23,24'],
        [7, 'Carneiro', '25,26,27,28'], [8, 'Camelo', '29,30,31,32'], [9, 'Cobra', '33,34,35,36'],
        [10, 'Coelho', '37,38,39,40'], [11, 'Cavalo', '41,42,43,44'], [12, 'Elefante', '45,46,47,48'],
        [13, 'Galo', '49,50,51,52'], [14, 'Gato', '53,54,55,56'], [15, 'Jacaré', '57,58,59,60'],
        [16, 'Leão', '61,62,63,64'], [17, 'Macaco', '65,66,67,68'], [18, 'Porco', '69,70,71,72'],
        [19, 'Pavão', '73,74,75,76'], [20, 'Peru', '77,78,79,80'], [21, 'Touro', '81,82,83,84'],
        [22, 'Tigre', '85,86,87,88'], [23, 'Urso', '89,90,91,92'], [24, 'Veado', '93,94,95,96'],
        [25, 'Vaca', '97,98,99,00']
      ];
      for (const a of animals) {
        // Converter string de números (01,02,03,04) para array de strings para compatibilidade com TEXT[]
        const animalData = [a[0], a[1], a[2].split(',')];
        await pool.query('INSERT INTO animals ("group", name, numbers) VALUES ($1, $2, $3)', animalData);
      }
    }

    // Modos de Jogo
    const modesCheck = await pool.query('SELECT count(*) FROM game_modes');
    if (parseInt(modesCheck.rows[0].count) === 0) {
      console.log('Populando modos de jogo...');
      const modes = [
        ['Grupo', 'Aposta no grupo do animal', 2100, 1],
        ['Centena', 'Três últimos dígitos', 80000, 2],
        ['Dezena', 'Dois últimos dígitos', 8400, 3],
        ['Milhar', 'Quatro dígitos completo', 800000, 4],
        ['Duque de Grupo', 'Dois grupos', 2000, 5],
        ['Terno de Grupo', 'Três grupos', 15000, 6],
        ['Duque de Dezena', 'Duas dezenas', 30000, 7],
        ['Terno de Dezena', 'Três dezenas', 600000, 8]
      ];
      for (const m of modes) {
        await pool.query('INSERT INTO game_modes (name, description, odds, sort_order) VALUES ($1, $2, $3, $4)', m);
      }
    }

    // Admin
    const adminCheck = await pool.query("SELECT count(*) FROM users WHERE username = 'admin'");
    if (parseInt(adminCheck.rows[0].count) === 0) {
      console.log('Criando usuário admin...');
      const pass = await hashPassword('admin123'); // Senha padrão recomendada
      await pool.query(
        'INSERT INTO users (username, password, is_admin, name) VALUES ($1, $2, $3, $4)',
        ['admin', pass, true, 'Administrator']
      );
      console.log('⚠️ Usuário ADMIN criado: admin / admin123');
    }

    // Configurações
    const settingsCheck = await pool.query('SELECT count(*) FROM system_settings');
    if (parseInt(settingsCheck.rows[0].count) === 0) {
      await pool.query('INSERT INTO system_settings (id) VALUES (1)');
    }

    console.log('✅ Configuração finalizada com sucesso!');
  } catch (error) {
    console.error('❌ Erro na configuração:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setup();
