
import { pool } from "./db";

async function runMigration() {
    console.log("Iniciando migração de colunas de banner...");

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log("Verificando/Adicionando colunas na tabela system_settings...");

        await client.query(`
      ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS banner_desktop_url TEXT DEFAULT '/img/banner-desktop.jpg';
      ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS banner_mobile_url TEXT DEFAULT '/img/banner-mobile.jpg';
      ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS signup_bonus_banner_enabled BOOLEAN DEFAULT false;
      ALTER TABLE system_settings ADD COLUMN IF NOT EXISTS first_deposit_bonus_banner_enabled BOOLEAN DEFAULT false;
    `);

        await client.query('COMMIT');
        console.log("Migração concluída com sucesso!");
    } catch (e) {
        await client.query('ROLLBACK');
        console.log("Erro na migração:", e);
    } finally {
        client.release();
        process.exit(0);
    }
}

runMigration();
