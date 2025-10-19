import { useNavigate, Routes, Route } from "react-router-dom";
import { usePhotos } from "./hooks/usePhotos";
import { useSettings } from "./hooks/useSettings";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useCallback } from "react";
import { SettingsPanel } from "./components/SettingsPanel";
import { PhotoDetail } from "./components/PhotoDetail";
import { Slideshow } from "./components/Slideshow";

/**
 * メインページコンポーネント
 */
const MainPage = () => {
  const navigate = useNavigate();

  // カスタムフックを使用してデータ管理
  const {
    photos,
    loading: photosLoading,
    addPhoto,
    currentPhotoIndex,
    setCurrentPhotoIndex,
    shufflePhotos,
  } = usePhotos();

  const {
    settings,
    themes,
    loading: settingsLoading,
    updateSettings,
  } = useSettings();

  /**
   * キーボードショートカットハンドラー
   * 数字キー1-9でテーマを切り替える
   */
  const handleKeyDown = useCallback(
    (e) => {
      // 入力フィールドにフォーカスがある場合は何もしない
      const tagName = e.target.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea" || tagName === "select") {
        return;
      }

      // 数字キー1-9でテーマを切り替え
      const keyNumber = parseInt(e.key);
      if (keyNumber >= 1 && keyNumber <= themes.length) {
        const newThemeId = themes[keyNumber - 1]?.id;
        if (newThemeId && newThemeId !== settings.themeId) {
          const newSettings = {
            ...settings,
            themeId: newThemeId,
          };
          updateSettings(newSettings);
        }
      }
    },
    [themes, settings, updateSettings]
  );

  // キーボードショートカットをマウント
  useKeyboardShortcuts(handleKeyDown);

  /**
   * 写真詳細表示ハンドラー
   * URLを変更して詳細ページに遷移
   */
  const handleShowDetail = (photo) => {
    navigate(`/photo/${photo.id}`);
  };

  // データ読み込み中の表示
  const loading = photosLoading || settingsLoading;
  if (loading) {
    return (
      <div className="w-[500px] mx-auto bg-white min-h-screen shadow-lg">
        <div className="text-center py-12 text-lg text-gray-600">
          読み込み中...
        </div>
      </div>
    );
  }

  return (
    <div className="w-[500px] mx-auto bg-white min-h-screen shadow-lg">
      <header className="bg-slate-800 text-white py-5 px-5 text-center">
        <h1 className="text-2xl font-normal">写真スライドショー</h1>
      </header>

      <main className="p-5">
        {/* スライドショー表示エリア */}
        <Slideshow
          photos={photos}
          settings={settings}
          currentPhotoIndex={currentPhotoIndex}
          setCurrentPhotoIndex={setCurrentPhotoIndex}
          onShowDetail={handleShowDetail}
          onAddPhoto={addPhoto}
          shufflePhotos={shufflePhotos}
        />

        {/* 設定パネル */}
        <SettingsPanel
          themes={themes}
          settings={settings}
          onSettingsChange={updateSettings}
          shufflePhotos={shufflePhotos}
        />
      </main>
    </div>
  );
}


/**
 * メインアプリケーションコンポーネント
 * ルーティングを管理
 */
export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/photo/:id" element={<PhotoDetail />} />
    </Routes>
  );
}
