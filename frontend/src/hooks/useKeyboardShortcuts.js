import { useEffect } from "react";

/**
 * キーボードイベントリスナーをマウント/アンマウントするカスタムフック
 *
 * @param {Function} handler - キーボードイベントのハンドラ関数
 */
export const useKeyboardShortcuts = (handler) => {
  useEffect(() => {
    // ハンドラが提供されていない場合は何もしない
    if (!handler) return;

    // キーボードイベントリスナーを追加
    window.addEventListener("keydown", handler);

    // クリーンアップ: コンポーネントがアンマウントされたときにリスナーを削除
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [handler]);
};
