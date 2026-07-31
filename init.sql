-- 1. トイレの場所を登録するテーブル
CREATE TABLE toilets (
    id SERIAL PRIMARY KEY,
    building VARCHAR(50) NOT NULL, -- 棟（例：1号館）
    floor VARCHAR(20) NOT NULL,    -- 階（例：2階）
    name VARCHAR(100) NOT NULL     -- 表示名（例：1号館 2階 男子トイレ）
);

-- 2. 口コミを登録するテーブル
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    toilet_id INTEGER REFERENCES toilets(id), -- どのトイレへの口コミか
    cleanliness INTEGER CHECK (cleanliness >= 1 AND cleanliness <= 5), -- 清潔さ (1〜5)
    crowdedness INTEGER CHECK (crowdedness >= 1 AND crowdedness <= 5), -- 空き具合/混み具合 (1〜5)
    accessibility INTEGER CHECK (accessibility >= 1 AND accessibility <= 5), -- アクセス (1〜5)
    comment TEXT, -- コメント（任意）
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. テスト用のトイレデータをいくつか登録しておく
INSERT INTO toilets (building, floor, name) VALUES
('1号館', '1階', '1号館 1階 トイレ（男女）'),
('1号館', '2階', '1号館 2階 トイレ（男女）'),
('2号館', '1階', '2号館 1階 トイレ（男女）'),
('図書館', '1階', '図書館 1階 だれでもトイレ');