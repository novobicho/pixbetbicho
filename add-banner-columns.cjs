const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://dbnovobicho:AVNS_Viy3ObhvZqKE1zrKQWX@app-f83e6f0f-1f27-4089-8a14-7bc1ea2c2ab3-do-user-21865989-0.k.db.ondigitalocean.com:25060/dbnovobicho?sslmode=require',
});

async function addBannerColumns() {
    try {
        console.log('Adding banner URL columns to system_settings...');

        await pool.query(`
      ALTER TABLE system_settings 
      ADD COLUMN IF NOT EXISTS banner_desktop_url TEXT DEFAULT '/img/banner-desktop.jpg',
      ADD COLUMN IF NOT EXISTS banner_mobile_url TEXT DEFAULT '/img/banner-mobile.jpg';
    `);

        console.log('✅ Banner columns added successfully!');

        // Update existing row
        await pool.query(`
      UPDATE system_settings 
      SET banner_desktop_url = COALESCE(banner_desktop_url, '/img/banner-desktop.jpg'),
          banner_mobile_url = COALESCE(banner_mobile_url, '/img/banner-mobile.jpg')
      WHERE id = 1;
    `);

        console.log('✅ Existing settings updated!');
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        await pool.end();
        process.exit(1);
    }
}

addBannerColumns();
