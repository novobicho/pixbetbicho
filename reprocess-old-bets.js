/**
 * Script para reprocessar apostas de extrações antigas que já têm resultados
 * 
 * USO:
 * node reprocess-old-bets.js
 */

const API_URL = 'http://localhost:5000';

async function reprocessAllCompletedDraws() {
    try {
        console.log('🔄 Buscando extrações completadas...\n');

        // Buscar todas as extrações completadas
        const response = await fetch(`${API_URL}/api/draws`);
        const allDraws = await response.json();

        const completedDraws = allDraws.filter(draw =>
            draw.status === 'completed' && draw.resultAnimalId
        );

        console.log(`✅ Encontradas ${completedDraws.length} extrações com resultados\n`);

        if (completedDraws.length === 0) {
            console.log('Nenhuma extração para reprocessar.');
            return;
        }

        // Fazer login como admin
        console.log('🔐 Fazendo login como admin...');
        const loginResponse = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123' // ALTERE PARA SUA SENHA
            })
        });

        if (!loginResponse.ok) {
            console.error('❌ Erro ao fazer login. Verifique usuário e senha.');
            return;
        }

        // Pegar cookie de sessão
        const setCookie = loginResponse.headers.get('set-cookie');
        console.log('✅ Login realizado\n');

        // Reprocessar cada extração
        let processed = 0;
        let errors = 0;

        for (const draw of completedDraws) {
            try {
                console.log(`📊 Reprocessando: ${draw.name} (ID: ${draw.id})`);

                const reprocessResponse = await fetch(
                    `${API_URL}/api/draws/${draw.id}/reprocess-bets`,
                    {
                        method: 'POST',
                        headers: {
                            'Cookie': setCookie || '',
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (reprocessResponse.ok) {
                    const result = await reprocessResponse.json();
                    console.log(`   ✅ ${result.message}\n`);
                    processed++;
                } else {
                    const error = await reprocessResponse.json();
                    console.log(`   ❌ Erro: ${error.message}\n`);
                    errors++;
                }

                // Aguardar 500ms entre cada requisição
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                console.error(`   ❌ Erro ao reprocessar ${draw.name}:`, error.message, '\n');
                errors++;
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log(`✅ Processadas: ${processed}`);
        console.log(`❌ Erros: ${errors}`);
        console.log(`📊 Total: ${completedDraws.length}`);
        console.log('='.repeat(50));

    } catch (error) {
        console.error('❌ Erro geral:', error);
    }
}

// Executar
reprocessAllCompletedDraws();
