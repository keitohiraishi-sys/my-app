import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ここに実行したいUPDATE文（書き換えの命令）を書きます
const updateQuery = `
  -- ID 1 の更新
  UPDATE toilets 
  SET building = '独立館',
    name = '日吉 第四校舎独立館 1階 男子トイレ',
      floor = '1階'
  WHERE id = 1;

  -- ID 2 の更新
  UPDATE toilets 
  SET building = '12棟',
  name = '矢上 12棟 1階 男子トイレ',
      floor = '1階'
  WHERE id = 2;

  -- ID 3 の更新
  UPDATE toilets 
  SET building = '14棟',
  name = '矢上 14棟 4階 男子トイレ',
      floor = '4階'
  WHERE id = 3;
`;

async function runUpdate() {
  try {
    console.log('データを更新しています...');
    
    // SQLを実行
    const result = await pool.query(updateQuery);
    
    console.log('✅ データの書き換えが完了しました！');
  } catch (err) {
    console.error('❌ エラーが発生しました:', err);
  } finally {
    // 処理が終わったらデータベースとの接続を閉じる
    pool.end();
  }
}

runUpdate();