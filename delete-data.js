import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const deleteQuery = `
  -- 1. ID 4 のトイレにつけられた口コミを先に削除（あれば）
  DELETE FROM reviews WHERE toilet_id = 4;

  -- 2. ID 4 のトイレ本体を削除
  DELETE FROM toilets WHERE id = 4;
`;

async function runDelete() {
  try {
    console.log('ID 4 のデータを削除しています...');
    await pool.query(deleteQuery);
    console.log('✅ ID 4 のデータを無事に削除しました！');
  } catch (err) {
    console.error('❌ エラーが発生しました:', err);
  } finally {
    pool.end();
  }
}

runDelete();