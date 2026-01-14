import pg from 'pg';
import crypto from 'crypto';
import util from 'util';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') || process.env.DATABASE_URL?.includes('@db:')
    ? false
    : { rejectUnauthorized: false }
});

async function hashPassword(password) {
  const scryptAsync = util.promisify(crypto.scrypt);
  const salt = crypto.randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function setup() {
  console.log('🚀 Iniciando configuração do banco de dados...');

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
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        blocked BOOLEAN DEFAULT false NOT NULL,
        block_reason TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS animals (
        id SERIAL PRIMARY KEY,
        "group" INTEGER NOT NULL,
        name TEXT NOT NULL,
        numbers TEXT NOT NULL
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
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
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
        await pool.query('INSERT INTO animals ("group", name, numbers) VALUES ($1, $2, $3)', a);
      }
    }

    // Modos de Jogo
    const modesCheck = await pool.query('SELECT count(*) FROM game_modes');
    if (parseInt(modesCheck.rows[0].count) === 0) {
      console.log('Populando modos de jogo...');
      const modes = [
        ['Grupo', 'Aposta no grupo do animal', 18, 1],
        ['Centena', 'Três últimos dígitos', 900, 2],
        ['Dezena', 'Dois últimos dígitos', 90, 3],
        ['Milhar', 'Quatro dígitos completo', 9000, 4]
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
