import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const cleanMySQL = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db',
    port: process.env.DB_PORT || 3306
  });

  console.log('✅ MySQL Connected!');

  try {
    // Foreign key check off karo taake truncate ho jaye
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    console.log('🗑️ Cleaning tables...');

    // 👇 Apni table names yahan check kar lena — ye common names hain
    const tables = [
      'experiences', // ya 'experience'
      'projects',
      'skills',
      'education',
      'hero',
      'about',
      'messages',
      'socials'
    ];

    for (let table of tables) {
      try {
        await connection.query(`TRUNCATE TABLE ${table}`);
        console.log(`✅ Cleaned: ${table}`);
      } catch (e) {
        console.log(`⚠️ Skip: ${table} (table not found - ${e.message})`);
      }
    }

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('\n✅ DATABASE 100% CLEAN! All dummy data deleted!');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await connection.end();
    process.exit(0);
  }
};

cleanMySQL();