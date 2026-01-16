
import { pool } from "./db";

async function fixSchema() {
    try {
        console.log("Verificando schema...");

        // Adicionar banner_dashboard_url
        await pool.query(`
      ALTER TABLE system_settings 
      ADD COLUMN IF NOT EXISTS banner_dashboard_url TEXT DEFAULT '/img/banner-dashboard.jpg'
    `);
        console.log("Coluna banner_dashboard_url verificada/adicionada.");

        // Verificar se existe
        const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'system_settings' 
      AND column_name = 'banner_dashboard_url'
    `);

        if (res.rows.length > 0) {
            console.log("SUCESSO: Coluna banner_dashboard_url existe no banco.");
        } else {
            console.error("ERRO: Coluna banner_dashboard_url NÃO foi criada.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Erro ao atualizar schema:", error);
        process.exit(1);
    }
}

fixSchema();
