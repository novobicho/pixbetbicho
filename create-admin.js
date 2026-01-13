import pg from 'pg';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://pixbet:pixbet123@db:5432/pixbetbicho',
    ssl: false
});

async function hashPassword(password) {
    const scryptAsync = promisify(scrypt);
    const salt = randomBytes(16).toString("hex");
    const buf = await scryptAsync(password, salt, 64);
    return `${buf.toString("hex")}.${salt}`;
}

async function createAdmin() {
    try {
        console.log('🔧 Criando usuário admin...');

        // Verificar se já existe
        const check = await pool.query('SELECT id FROM users WHERE username = $1', ['admin']);

        if (check.rows.length > 0) {
            console.log('✅ Usuário admin já existe!');
            console.log('   Username: admin');
            console.log('   Password: admin123');
            await pool.end();
            return;
        }

        // Criar hash da senha
        const hashedPassword = await hashPassword('admin123');

        // Inserir admin (sem a coluna blocked que não existe)
        const result = await pool.query(`
      INSERT INTO users (username, password, name, email, balance, is_admin)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, name, email
    `, ['admin', hashedPassword, 'Administrador', 'admin@sistema.com', 10000, true]);

        console.log('✅ Usuário admin criado com sucesso!');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('   Saldo inicial: R$ 10.000,00');
        console.log('   Dados:', result.rows[0]);

    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await pool.end();
    }
}

createAdmin();
