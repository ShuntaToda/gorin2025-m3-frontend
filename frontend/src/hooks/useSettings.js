import { useState, useEffect, useCallback } from "react";
import { getSettings, saveSettings, getThemes } from "../api/photoApi";

/**
 * 設定とテーマを管理するカスタムフック
 *
 * @returns {object} 設定データと操作関数
 * @returns {object} settings - 設定オブジェクト
 * @returns {Array} themes - テーマの配列
 * @returns {boolean} loading - 読み込み中フラグ
 * @returns {Error|null} error - エラーオブジェクト
 * @returns {Function} updateSettings - 設定を更新する関数
 */
export const useSettings = () => {
  const [settings, setSettings] = useState({
    themeId: "A",
    slideInterval: 500,
    playMode: "auto",
  });
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 初期データ読み込み
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, themesData] = await Promise.all([getSettings(), getThemes()]);
        setSettings(settingsData);
        setThemes(themesData);
        setLoading(false);
      } catch (err) {
        console.error("設定の取得に失敗しました:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * 設定を更新してサーバーに保存
   *
   * @param {object} newSettings - 新しい設定オブジェクト
   */
  const updateSettings = useCallback(async (newSettings) => {
    try {
      await saveSettings(newSettings);
      setSettings(newSettings);
    } catch (err) {
      console.error("設定の保存に失敗しました:", err);
      throw err;
    }
  }, []);

  return {
    settings,
    themes,
    loading,
    error,
    updateSettings,
  };
};
