import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// データベース接続の準備
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // SSL 接続を許可しつつ、「証明書の検証」をスキップする設定じゃ
  ssl: {
    rejectUnauthorized: false 
  }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["query"] });

const app = express();
const PORT = process.env.PORT || 8888;

// EJS の設定
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));

// 一覧表示のルート
app.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.render("index", { users });
  } catch (error) {
    console.error(error);
    res.status(500).send("エラーが発生しましたぞ");
  }
});

app.post("/users", async (req, res) => {
  const { name, age } = req.body;
  if (name) {
    await prisma.user.create({ 
      data: { 
        name, 
        age: age ? parseInt(age) : null // 文字列を数字に変えて保存するのじゃ
      } 
    });
  }
  res.redirect("/");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
