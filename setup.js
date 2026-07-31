import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const setupQuery = `
-- テーブルがなければ作成する
CREATE TABLE IF NOT EXISTS toilets (
    id SERIAL PRIMARY KEY,
    building VARCHAR(50) NOT NULL,
    floor VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    toilet_id INTEGER REFERENCES toilets(id),
    cleanliness INTEGER,
    crowdedness INTEGER,
    accessibility INTEGER,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 初期データを登録する（すでに登録されていなければ追加）
INSERT INTO toilets (building, floor, name) 
SELECT '1号館', '1階', '1号館 1階 トイレ（男女）'
WHERE NOT EXISTS (SELECT 1 FROM toilets WHERE name = '1号館 1階 トイレ（男女）');

INSERT INTO toilets (building, floor, name) 
SELECT '1号館', '2階', '1号館 2階 トイレ（男女）'
WHERE NOT EXISTS (SELECT 1 FROM toilets WHERE name = '1号館 2階 トイレ（男女）');

INSERT INTO toilets (building, floor, name) 
SELECT '2号館', '1階', '2号館 1階 トイレ（男女）'
WHERE NOT EXISTS (SELECT 1 FROM toilets WHERE name = '2号館 1階 トイレ（男女）');
`;

async function runSetup() {
  try {
    console.log('テーブルを作成しています...');
    await pool.query(setupQuery);
    console.log('✅ テーブルと初期データの作成が完了しました！');
  } catch (err) {
    console.error('❌ エラーが発生しました:', err);
  } finally {
    pool.end();
  }
}

runSetup();