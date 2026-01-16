import * as cheerio from 'cheerio';

export interface ScrapedPrize {
    position: number;
    number: string;
    animal: string;
    group: number;
}

export interface ScrapedResult {
    drawName: string;
    drawTime: string;
    date: Date;
    prizes: ScrapedPrize[];
}

/**
 * Scraper que busca resultados no resultadofacil.com.br
 */
export class ResultScraper {
    private baseUrl = 'https://www.resultadofacil.com.br/resultado-do-jogo-do-bicho';

    private async getCookies(baseUrl: string): Promise<string[]> {
        try {
            console.log(`[ResultScraper] 🕒 Obtendo cookies iniciais de: ${baseUrl}`);
            const response = await fetch(baseUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                },
                signal: AbortSignal.timeout(5000)
            });
            const cookies = response.headers.getSetCookie();
            console.log(`[ResultScraper] 🍪 Cookies encontrados: ${cookies.length}`);
            return cookies;
        } catch (error) {
            console.error(`[ResultScraper] ⚠️ Erro ao obter cookies:`, error);
            return [];
        }
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async fetchResult(drawName: string, drawDate?: Date): Promise<ScrapedResult | null> {
        try {
            if (!drawDate) {
                console.error(`[ResultScraper] ❌ Data do sorteio é obrigatória!`);
                return null;
            }

            const suffix = this.getStateSuffix(drawName);
            const targetUrl = this.baseUrl + suffix;

            // Verificação de Scraper API (Proxy Gateway)
            const scraperApiKey = process.env.SCRAPER_API_KEY;
            let finalUrl = targetUrl;
            let isUsingProxy = false;

            if (scraperApiKey) {
                console.log(`[ResultScraper] 🛡️ Usando Scraper API para burlar bloqueio...`);
                // Construindo URL do gateway (ex: ScraperAPI, ZenRows, etc)
                // Usamos o padrão de ScraperAPI como exemplo, mas é facilmente adaptável
                finalUrl = `https://api.scraperapi.com/?api_key=${scraperApiKey}&url=${encodeURIComponent(targetUrl)}&render=false`;
                isUsingProxy = true;
            }

            // Passo 1: Obter cookies (apenas se NÃO estiver usando proxy, pois o proxy gerencia isso)
            let cookieHeader = '';
            if (!isUsingProxy) {
                const sessionCookies = await this.getCookies(this.baseUrl);
                cookieHeader = sessionCookies.length > 0 ? sessionCookies.join('; ') : '';
                console.log(`[ResultScraper] 🕒 Esperando 4s (comportamento humano)...`);
                await this.sleep(4000);
            }

            console.log(`[ResultScraper] 🌐 Buscando em: ${isUsingProxy ? '(via Proxy) ' : ''}${targetUrl} para: "${drawName}"`);

            const fetchOptions = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language': 'pt-BR,pt;q=0.9',
                    ...(cookieHeader && !isUsingProxy ? { 'Cookie': cookieHeader } : {}),
                    'Referer': this.baseUrl,
                },
                signal: AbortSignal.timeout(isUsingProxy ? 30000 : 10000) // Gateways de proxy levam mais tempo
            };

            let response = await fetch(finalUrl, fetchOptions);
            console.log(`[ResultScraper] 📡 Status da Resposta: ${response.status} ${response.statusText}`);

            // Se ainda assim der 403 e não estiver usando proxy, avisar sobre a necessidade da API Key
            if (!response.ok && response.status === 403 && !isUsingProxy) {
                console.error(`[ResultScraper] ❌ BLOQUEIO DETECTADO (403). Por favor, configure SCRAPER_API_KEY no painel da DigitalOcean para usar um Proxy.`);

                // Tentativa de Fallback sem WWW (pode ser útil no localhost)
                console.log('[ResultScraper] 🔄 Tentando Fallback local: Sem WWW...');
                const rootUrl = targetUrl.replace('www.', '');
                try {
                    const fallbackResponse = await fetch(rootUrl, { ...fetchOptions, signal: AbortSignal.timeout(5000) });
                    if (fallbackResponse.ok) response = fallbackResponse;
                } catch (e) { }
            }

            if (!response.ok) {
                console.error(`[ResultScraper] ❌ Falha definitiva: HTTP ${response.status}`);
                return null;
            }

            const html = await response.text();
            console.log(`[ResultScraper] 📄 HTML recebido (${html.length} bytes)`);

            if (html.includes('Acesso Bloqueado') || html.includes('captcha')) {
                console.warn(`[ResultScraper] ⚠️ O HTML recebido parece ser uma página de bloqueio mesmo com Proxy!`);
            }

            return this.parseResult(html, drawName, drawDate);
        } catch (error) {
            console.error(`[ResultScraper] ❌ Erro na requisição:`, error);
            return null;
        }
    }

    private getStateSuffix(name: string): string {
        const n = this.normalizeString(name);
        if (n.includes('SP')) return '/SP';
        if (n.includes('RJ')) return '/RJ';
        if (n.includes('BA')) return '/BA';
        if (n.includes('PB') || n.includes('LOTEP') || n.includes('PARATODOS PB') || n.includes('CAMPINA')) return '/PB';
        if (n.includes('PE') || n.includes('PERNAMBUCO') || n.includes('AVAL') || n.includes('CAMINHO') || n.includes('POPULAR') || n.includes('MONTE CARLOS')) return '/PE';
        if (n.includes('CE') || n.includes('LOTECE')) return '/CE';
        if (n.includes('DF') || n.includes('BRASILIA') || n.includes('LBR')) return '/DF';
        if (n.includes('GO') || n.includes('LOOK')) return '/GO';
        if (n.includes('RS')) return '/RS';
        if (n.includes('MG') || n.includes('MINAS') || n.includes('ALVORADA')) return '/MG';
        if (n.includes('SE')) return '/SE';
        if (n.includes('RN')) return '/RN';
        // Adicionar outros estados conforme necessário
        return ''; // Padrão (geralmente RJ ou home)
    }

    private parseResult(html: string, drawName: string, drawDate: Date): ScrapedResult | null {
        try {
            const $ = cheerio.load(html);
            const normalizedDrawName = this.normalizeString(drawName);

            // Passo 1: Validar se a data na página do site é a mesma solicitada
            // Procuramos por formatos como "15/01/2026" ou "15 de janeiro"
            const pageText = $('body').text();

            // Formatar drawDate para busca (Ex: 15/01/2026)
            const day = String(drawDate.getDate()).padStart(2, '0');
            const month = String(drawDate.getMonth() + 1).padStart(2, '0');
            const year = drawDate.getFullYear();
            const dateStr = `${day}/${month}/${year}`;

            console.log(`[ResultScraper] 📅 Validando se o site contém a data: ${dateStr}`);

            // Se o texto da página não contém a data do sorteio, avisar e abortar
            if (!pageText.includes(dateStr)) {
                // Tentar uma busca mais flexível (só dia e mês curta) para garantir
                const shortDateStr = `${day}/${month}`;
                if (!pageText.includes(shortDateStr)) {
                    console.error(`[ResultScraper] ❌ A data ${dateStr} não foi encontrada na página. O site ainda pode estar com resultados do dia anterior ou não atualizou.`);
                    return null;
                }
            }

            console.log(`[ResultScraper] ✅ Data ${dateStr} confirmada na página.`);

            console.log(`[ResultScraper] 🔍 Procurando por: "${normalizedDrawName}"`);

            // Estratégia: Busca Exata pelo Nome (conforme solicitado pelo usuário)
            // O site geralmente usa o prefixo "Resultado do " antes do nome.
            // Ex: Site: "Resultado do Jogo do Bicho LOTECE - CE, 11:00 (manhã)"
            //     Sistema: "Jogo do Bicho LOTECE - CE, 11:00 (manhã)"
            // A busca por substring (includes) deve resolver.

            let bestMatchTable: cheerio.Cheerio | null = null;
            let bestMatchTitle = "";
            let titlesFoundCount = 0;

            // Iterar sobre todos os possíveis títulos de tabelas
            $('h2, h3, h4, div.title').each((i: number, el: any) => {
                const titleText = this.normalizeString($(el).text());
                titlesFoundCount++;

                // Verificação estrita: O título do site contém o nome do sorteio do sistema?
                if (titleText.includes(normalizedDrawName)) {
                    const table = this.findTableForHeader($, el);
                    if (table) {
                        if (!bestMatchTable) {
                            bestMatchTable = table;
                            bestMatchTitle = titleText;
                        }
                    }
                }
            });

            if (!bestMatchTable) {
                console.log(`[ResultScraper] ⚠️ Nenhum match exato. Títulos processados: ${titlesFoundCount}`);
            }

            // Fallback: Se não achou com o nome completo (talvez "Jogo do Bicho" esteja sobrando ou faltando)
            if (!bestMatchTable) {
                // Tentar remover "JOGO DO BICHO" do nome de busca, caso o sistema tenha e o site não (raro, mas possível)
                const shortName = normalizedDrawName.replace('JOGO DO BICHO', '').trim();
                if (shortName.length > 5 && shortName !== normalizedDrawName) {
                    console.log(`[ResultScraper] ⚠️ Tentando fallback com nome curto: "${shortName}"`);
                    $('h2, h3, h4, div.title').each((i: number, el: any) => {
                        const titleText = this.normalizeString($(el).text());
                        if (titleText.includes(shortName)) {
                            const table = this.findTableForHeader($, el);
                            if (table && !bestMatchTable) {
                                bestMatchTable = table;
                                bestMatchTitle = titleText;
                            }
                        }
                    });
                }
            }

            if (!bestMatchTable) {
                console.error(`[ResultScraper] ❌ Nenhuma tabela encontrada contendo: "${drawName}"`);
                return null;
            }

            console.log(`[ResultScraper] ✅ Match encontrado: "${bestMatchTitle}"`);

            const prizes: ScrapedPrize[] = [];
            const rows = $(bestMatchTable).find('tr');

            let prizeCount = 0;
            rows.each((i: number, row: any) => {
                // Pular cabeçalho
                if ($(row).find('th').length > 0) return;

                const cells = $(row).find('td');
                if (cells.length < 2) return;

                const posText = $(cells[0]).text().trim();
                const milharText = $(cells[1]).text().trim();

                // Validar se é uma linha de prêmio (1º, 2º, etc)
                if (!posText.match(/^\d/)) return;

                // Validar se tem milhar (4 dígitos)
                const match = milharText.match(/(\d{4})/);
                if (match) {
                    prizeCount++;
                    // Se o sorteio pede 10 prêmios, tentamos pegar até 10.
                    // Se a tabela só tiver 5, vai parar em 5.
                    if (prizeCount > 10) return;

                    const milhar = match[1];
                    const grupo = this.getAnimalGroupFromNumber(milhar);
                    const animal = this.getAnimalNameFromGroup(grupo);

                    prizes.push({
                        position: prizeCount,
                        number: milhar,
                        animal: animal,
                        group: grupo
                    });
                }
            });

            if (prizes.length === 0) {
                console.warn(`[ResultScraper] ⚠️ Nenhum prêmio extraído para ${drawName}`);
                return null;
            }

            // Validação de quantidade (opcional, mas bom para log)
            if (normalizedDrawName.includes('1 AO 10') && prizes.length < 6) {
                console.warn(`[ResultScraper] ⚠️ Sorteio pede 10 prêmios mas só encontramos ${prizes.length}.`);
            }

            return {
                drawName,
                drawTime: '', // Poderia extrair do título se necessário
                date: drawDate,
                prizes
            };

        } catch (error) {
            console.error(`[ResultScraper] ❌ Erro no parsing:`, error);
            return null;
        }
    }

    private normalizeString(str: string): string {
        return str.toUpperCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remover acentos
            .replace(/\s+/g, ' ').trim();
    }

    private findTableForHeader($: cheerio.CheerioAPI, headerEl: any): cheerio.Cheerio | null {
        // Procurar tabela nos próximos irmãos (siblings)
        let nextEl = $(headerEl).next();
        let attempts = 0;

        while (nextEl.length > 0 && attempts < 8) {
            // Se for uma tabela direta
            if (nextEl.is('table')) {
                return nextEl;
            }

            // Se tiver uma tabela dentro
            const tableInside = nextEl.find('table');
            if (tableInside.length > 0) {
                return tableInside;
            }

            nextEl = nextEl.next();
            attempts++;
        }
        return null;
    }

    getAnimalGroupFromNumber(number: string): number {
        const lastTwo = number.slice(-2);
        const num = parseInt(lastTwo, 10);
        return num === 0 ? 25 : Math.ceil(num / 4);
    }

    private getAnimalNameFromGroup(group: number): string {
        const animals: { [key: number]: string } = {
            1: 'Avestruz', 2: 'Águia', 3: 'Burro', 4: 'Borboleta', 5: 'Cachorro',
            6: 'Cabra', 7: 'Carneiro', 8: 'Camelo', 9: 'Cobra', 10: 'Coelho',
            11: 'Cavalo', 12: 'Elefante', 13: 'Galo', 14: 'Gato', 15: 'Jacaré',
            16: 'Leão', 17: 'Macaco', 18: 'Porco', 19: 'Pavão', 20: 'Peru',
            21: 'Touro', 22: 'Tigre', 23: 'Urso', 24: 'Veado', 25: 'Vaca',
        };
        return animals[group] || 'Desconhecido';
    }

    getAnimalFromNumber(number: string): number {
        return this.getAnimalGroupFromNumber(number);
    }
}

export const resultScraper = new ResultScraper();
