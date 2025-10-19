import { useState, useEffect, useCallback } from "react";
import { getPhotos } from "../api/photoApi";

/**
 * 写真データを管理するカスタムフック
 *
 * @returns {object} 写真データと操作関数
 * @returns {Array} photos - 写真の配列
 * @returns {boolean} loading - 読み込み中フラグ
 * @returns {Error|null} error - エラーオブジェクト
 * @returns {Function} addPhoto - 写真を追加する関数
 * @returns {number} currentPhotoIndex - 現在の写真インデックス
 * @returns {Function} setCurrentPhotoIndex - インデックスを設定する関数
 */
export const usePhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  /**
   * 初期データ読み込み
   */
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getPhotos();
        setPhotos(data);
        setLoading(false);
      } catch (err) {
        console.error("写真の取得に失敗しました:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  /**
   * 写真を追加する関数
   *
   * @param {object} newPhoto - 追加する写真オブジェクト
   */
  const addPhoto = (newPhoto) => {
    setPhotos([...photos, newPhoto]);
  };

  /**
   * テーマをシャッフル
   */
  const shufflePhotos = useCallback(() => {
    // 配列をシャッフル
    const shuffledPhotos = [...photos].sort(() => Math.random() - 0.5);
    setPhotos(shuffledPhotos);
  }, [photos]);

  return {
    photos,
    loading,
    error,
    addPhoto,
    currentPhotoIndex,
    setCurrentPhotoIndex,
    shufflePhotos,
  };
};
