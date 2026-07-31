import 'dotenv/config';
import express from 'express';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// 1. トップページ：トイレ一覧と平均評価の表示
app.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        t.id, t.name, t.building, t.floor,
        COUNT(r.id) as review_count,
        ROUND(AVG(r.cleanliness), 1) as avg_clean,
        ROUND(AVG(r.crowdedness), 1) as avg_crowd,
        ROUND(AVG(r.accessibility), 1) as avg_access
      FROM toilets t
      LEFT JOIN reviews r ON t.id = r.toilet_id
      GROUP BY t.id
      ORDER BY t.building, t.floor;
    `;
    const result = await pool.query(query);
    res.render('index', { toilets: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('データベースエラーが発生しました。');
  }
});

// 2. トイレ詳細ページ：口コミ一覧と投稿フォーム
app.get('/toilets/:id', async (req, res) => {
  const toiletId = req.params.id;
  try {
    const toiletResult = await pool.query('SELECT * FROM toilets WHERE id = $1', [toiletId]);
    if (toiletResult.rows.length === 0) return res.status(404).send('トイレが見つかりません');
    
    const reviewsResult = await pool.query('SELECT * FROM reviews WHERE toilet_id = $1 ORDER BY created_at DESC', [toiletId]);
    
    res.render('detail', { 
      toilet: toiletResult.rows[0], 
      reviews: reviewsResult.rows 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('エラーが発生しました。');
  }
});

// 【追加】トイレの新規登録画面を表示
app.get('/add-toilet', (req, res) => {
  res.render('add-toilet');
});

// 【追加】新しいトイレをデータベースに保存
app.post('/add-toilet', async (req, res) => {
  const { building, floor, name } = req.body;
  try {
    await pool.query(
      'INSERT INTO toilets (building, floor, name) VALUES ($1, $2, $3)',
      [building, floor, name]
    );
    res.redirect('/'); // 保存したらトップページに戻る
  } catch (err) {
    console.error(err);
    res.status(500).send('トイレの登録に失敗しました。');
  }
});

// 3. 口コミの投稿処理
app.post('/toilets/:id/reviews', async (req, res) => {
  const toiletId = req.params.id;
  const { cleanliness, crowdedness, accessibility, comment } = req.body;
  
  try {
    await pool.query(
      `INSERT INTO reviews (toilet_id, cleanliness, crowdedness, accessibility, comment) 
       VALUES ($1, $2, $3, $4, $5)`,
      [toiletId, cleanliness, crowdedness, accessibility, comment]
    );
    res.redirect(`/toilets/${toiletId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('口コミの投稿に失敗しました。');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});