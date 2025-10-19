import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { apiReference } from "@scalar/hono-api-reference";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// データ型定義
interface Photo {
  id: number;
  imageUrl: string;
  caption: string;
  fileSize: string;
  createdAt: string;
}

interface Theme {
  id: string;
  name: string;
  description: string;
}

interface Settings {
  themeId: string;
  slideInterval: number;
  playMode: string;
}

interface DataStore {
  photos: Photo[];
  themes: Theme[];
  settings: Settings;
}

// データファイルからデータを読み込む
function loadData(): DataStore {
  const dataFile = path.join(__dirname, "../data.json");

  if (!fs.existsSync(dataFile)) {
    console.error(`Data file not found: ${dataFile}`);
    return { photos: [], themes: [], settings: { themeId: "A", slideInterval: 500, playMode: "auto" } };
  }

  const jsonData = fs.readFileSync(dataFile, "utf-8");
  const data = JSON.parse(jsonData) as DataStore;

  return data;
}

// 設定データのバリデーション
function validateSettingsData(input: any): string[] {
  const errors: string[] = [];

  // テーマバリデーション
  if (!input.themeId || !["A", "B", "C"].includes(input.themeId)) {
    errors.push("テーマはA、B、Cのいずれかを指定してください");
  }

  // スライド間隔バリデーション
  if (input.slideInterval === undefined || typeof input.slideInterval !== "number") {
    errors.push("スライド間隔は数値で指定してください");
  } else if (input.slideInterval <= 0) {
    errors.push("スライド間隔は正の数値で指定してください");
  }

  // 操作モードバリデーション
  if (input.playMode && !["auto", "random"].includes(input.playMode)) {
    errors.push("操作モードはautoまたはrandomを指定してください");
  }

  return errors;
}

const app = new Hono();

// CORS設定
app.use("*", cors());

// 静的ファイル（画像など）を提供
app.use("/assets/*", serveStatic({ root: "./public" }));

// APIルート
const api = new Hono();

// OpenAPI仕様を提供
api.get("/openapi.json", (c) => {
  const openapiFile = path.join(__dirname, "../openapi.json");

  if (fs.existsSync(openapiFile)) {
    const openapiSpec = fs.readFileSync(openapiFile, "utf-8");
    return c.json(JSON.parse(openapiSpec));
  }

  return c.json({ error: "OpenAPI仕様ファイルが見つかりません" }, 500);
});

// API情報表示（Scalar UI）
api.get(
  "/",
  apiReference({
    spec: {
      url: "/api/openapi.json",
    },
    pageTitle: "写真スライドショー API",
    theme: "default",
  })
);

// 写真一覧取得
api.get("/photos", (c) => {
  const data = loadData();
  return c.json(data.photos);
});

// 写真詳細取得
api.get("/photos/:id", (c) => {
  const data = loadData();
  const photoId = parseInt(c.req.param("id"));

  const photo = data.photos.find((p) => p.id === photoId);

  if (!photo) {
    return c.json({ error: "写真が見つかりません" }, 404);
  }

  return c.json(photo);
});

// テーマ一覧取得
api.get("/themes", (c) => {
  const data = loadData();
  return c.json(data.themes);
});

// 設定取得
api.get("/settings", (c) => {
  const data = loadData();
  return c.json(data.settings);
});

// 設定保存
api.post("/settings", async (c) => {
  let input: any;

  try {
    input = await c.req.json();
  } catch (error) {
    return c.json({ error: "JSONフォーマットが無効です" }, 400);
  }

  // バリデーション実行
  const validationErrors = validateSettingsData(input);
  if (validationErrors.length > 0) {
    return c.json({ error: validationErrors.join(", ") }, 400);
  }

  // 保存された設定オブジェクト作成（プロトタイプ用）
  const savedSettings: Settings = {
    themeId: input.themeId,
    slideInterval: parseInt(input.slideInterval),
    playMode: input.playMode || "auto",
  };

  return c.json(savedSettings);
});

// APIルートをマウント
app.route("/api", api);

// ルートパス
app.get("/", (c) => {
  return c.text("写真スライドショー API Server");
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(`API documentation: http://localhost:${info.port}/api`);
  }
);
