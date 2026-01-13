import { resultScraper } from './server/services/result-scraper';

async function test() {
    console.log('Testing ResultScraper...');

    // Test with a known draw name that should exist on the page
    // The page usually has PPT, PTM, PT, PTV, PTN, COR
    const drawName = 'PT Rio';
    const date = new Date(); // Today

    console.log(`Fetching result for ${drawName} on ${date.toISOString()}...`);

    const result = await resultScraper.fetchResult(drawName, date);

    if (result) {
        console.log('✅ Result found:');
        console.log(JSON.stringify(result, null, 2));
    } else {
        console.log('❌ No result found.');
    }
}

test().catch(console.error);
