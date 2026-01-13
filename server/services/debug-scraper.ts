import * as cheerio from 'cheerio';

export class DebugScraper {
    async getTableDump(): Promise<string> {
        try {
            const response = await fetch('https://www.ojogodobicho.com/deu_no_poste.htm', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
            });
            const html = await response.text();
            const $ = cheerio.load(html);

            let output = '';
            $('table').each((i, table) => {
                output += `\n--- TABLE ${i} ---\n`;
                $(table).find('tr').each((j, tr) => {
                    const rowText = $(tr).find('td, th').map((k, cell) => $(cell).text().trim()).get().join(' | ');
                    output += `Row ${j}: ${rowText}\n`;
                });
            });
            return output;
        } catch (error: any) {
            return `Error: ${error.message}`;
        }
    }
}

export const debugScraper = new DebugScraper();
