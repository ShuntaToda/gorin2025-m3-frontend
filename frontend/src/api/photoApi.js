/**
 * 写真スライドショーAPI クライアント
 * すべてのAPIリクエストをここで管理します
 */

// バックエンドのベースURL（画像などの静的ファイル用）
const BACKEND_BASE_URL = "http://localhost:3000";

// APIのベースURL
const API_BASE_URL = BACKEND_BASE_URL + "/api";
/**
 * 汎用的なfetchラッパー関数
 * エラーハンドリングを統一的に行います
 *
 * @param {string} endpoint - APIエンドポイント（例: '/photos'）
 * @param {object} options - fetchのオプション（method, headers, bodyなど）
 * @returns {Promise<any>} - レスポンスのJSONデータ
 */
const fetchApi = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    // HTTPエラーをチェック
    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
    }

    // JSONレスポンスをパース
    const data = await response.json();
    return data;
  } catch (error) {
    // エラーログを出力
    console.error(`API呼び出しエラー (${endpoint}):`, error);
    throw error;
  }
};

/**
 * 画像URLを完全なURLに変換
 * 相対パスの場合はバックエンドのベースURLを付与
 *
 * @param {string} imageUrl - 画像URL（相対パスまたは絶対URL）
 * @returns {string} 完全なURL
 */
const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return imageUrl;

  // すでに完全なURLの場合はそのまま返す
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // 相対パスの場合はバックエンドのベースURLを付与
  return `${BACKEND_BASE_URL}${imageUrl}`;
};

/**
 * 写真オブジェクトの画像URLを解決
 *
 * @param {object} photo - 写真オブジェクト
 * @returns {object} URLが解決された写真オブジェクト
 */
const resolvePhotoUrls = (photo) => {
  return {
    ...photo,
    imageUrl: resolveImageUrl(photo.imageUrl),
  };
};

/**
 * 写真一覧を取得
 * GET /api/photos
 *
 * @returns {Promise<Array>} 写真オブジェクトの配列
 */
export const getPhotos = async () => {
  const photos = await fetchApi("/photos");
  // 各写真の画像URLを解決
  return photos.map(resolvePhotoUrls);
};

/**
 * 写真詳細を取得
 * GET /api/photos/{id}
 *
 * @param {number} id - 写真ID
 * @returns {Promise<object>} 写真オブジェクト
 */
export const getPhotoById = async (id) => {
  const photo = await fetchApi(`/photos/${id}`);
  // 画像URLを解決
  return resolvePhotoUrls(photo);
};

/**
 * テーマ一覧を取得
 * GET /api/themes
 *
 * @returns {Promise<Array>} テーマオブジェクトの配列
 */
export const getThemes = async () => {
  return fetchApi("/themes");
};

/**
 * ユーザー設定を取得
 * GET /api/settings
 *
 * @returns {Promise<object>} 設定オブジェクト
 */
export const getSettings = async () => {
  return fetchApi("/settings");
};

/**
 * ユーザー設定を保存
 * POST /api/settings
 *
 * @param {object} settings - 保存する設定オブジェクト
 * @param {string} settings.themeId - テーマID
 * @param {number} settings.slideInterval - スライド間隔（ミリ秒）
 * @param {string} settings.playMode - 再生モード（'auto' または 'random'）
 * @returns {Promise<object>} 保存された設定オブジェクト
 */
export const saveSettings = async (settings) => {
  return fetchApi("/settings", {
    method: "POST",
    body: JSON.stringify(settings),
  });
};
