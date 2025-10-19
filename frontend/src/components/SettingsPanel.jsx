import { useState } from 'react'

/**
 * 設定パネルコンポーネント
 * テーマ選択、スライド間隔、再生モードの設定を管理
 */
export const SettingsPanel = ({ themes, settings, onSettingsChange, shufflePhotos }) => {
  // スライド間隔の入力値（文字列として保持）
  const [intervalInput, setIntervalInput] = useState(String(settings.slideInterval))
  // バリデーションエラーメッセージ
  const [intervalError, setIntervalError] = useState('')

  /**
   * テーマ変更ハンドラー
   */
  const handleThemeChange = (e) => {
    // 即座に親コンポーネントに変更を通知
    onSettingsChange({
      ...settings,
      themeId: e.target.value
    })
  }

  /**
   * スライド間隔テキストボックスの変更ハンドラー
   */
  const handleIntervalInputChange = (e) => {
    setIntervalInput(e.target.value)
    setIntervalError('')
  }

  /**
   * スライド間隔の設定を確定・保存
   * Enterキー押下時またはフォーカス喪失時に呼び出される
   */
  const handleIntervalSubmit = () => {
    // 入力値を数値に変換
    const value = parseInt(intervalInput, 10)

    // バリデーション: 正の整数値のみ許可
    if (isNaN(value) || value <= 0 || !Number.isInteger(parseFloat(intervalInput))) {
      setIntervalError('正の整数値を入力してください')
      setIntervalInput(String(settings.slideInterval))
      return
    }

    // 設定を更新
    setIntervalError('')

    // 親コンポーネントに変更を通知して保存
    onSettingsChange({
      ...settings,
      slideInterval: value
    })
  }

  /**
   * Enterキー押下時のハンドラー
   */
  const handleIntervalKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleIntervalSubmit()
    }
  }

  /**
   * 再生モード変更ハンドラー
   */
  const handlePlayModeChange = (e) => {
    // 即座に親コンポーネントに変更を通知
    onSettingsChange({
      ...settings,
      playMode: e.target.value
    })
    shufflePhotos()
  }

  return (
    <div className="bg-gray-100 p-5 rounded-lg">
      <h2 className="text-xl mb-5 text-slate-800">設定</h2>

      {/* テーマ選択 */}
      <div className="mb-5">
        <div className="block mb-2 font-bold text-slate-700 text-sm">
          表示テーマ（キー: 1-{themes.length}で切り替え）
        </div>
        <div className="space-y-2">
          {themes.map((theme) => (
            <label
              key={theme.id}
              className="flex items-center p-3 border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name="theme"
                value={theme.id}
                checked={settings.themeId === theme.id}
                onChange={handleThemeChange}
                className="w-4 h-4 text-blue-500 cursor-pointer"
              />
              <span className="ml-3 text-sm text-slate-700">
                <span className="font-semibold"></span> {theme.name} - {theme.description}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* スライド間隔（テキストボックス） */}
      <div className="mb-5">
        <label htmlFor="interval-input" className="block mb-2 font-bold text-slate-700 text-sm">
          スライド間隔（ミリ秒）
        </label>
        <input
          id="interval-input"
          type="text"
          value={intervalInput}
          onChange={handleIntervalInputChange}
          onKeyDown={handleIntervalKeyDown}
          onBlur={handleIntervalSubmit}
          placeholder="例: 3000"
          className={`w-full py-2.5 px-2.5 border ${intervalError ? 'border-red-500' : 'border-gray-300'
            } rounded-md bg-white text-sm focus:outline-none focus:border-blue-500`}
        />
        {intervalError && (
          <p className="text-red-500 text-xs mt-1">{intervalError}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Enterキーで確定・保存（現在: {settings.slideInterval}ms）
        </p>
      </div>

      {/* 再生モード */}
      <div className="mb-5">
        <label className="block mb-2 font-bold text-slate-700 text-sm">再生モード</label>
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center cursor-pointer font-normal">
            <input
              type="radio"
              name="playMode"
              value="auto"
              checked={settings.playMode === 'auto'}
              onChange={handlePlayModeChange}
              className="mr-2 cursor-pointer"
            />
            <span className="text-sm text-slate-800">自動再生（順番）</span>
          </label>
          <label className="flex items-center cursor-pointer font-normal">
            <input
              type="radio"
              name="playMode"
              value="random"
              checked={settings.playMode === 'random'}
              onChange={handlePlayModeChange}
              className="mr-2 cursor-pointer"
            />
            <span className="text-sm text-slate-800">ランダム再生</span>
          </label>
        </div>
      </div>

      {/* 操作ヒント */}
      <div className="bg-gray-300 p-4 rounded-md mt-5 text-xs text-slate-800">
        <p className="mb-2.5">
          <strong className="block mb-2.5 text-sm">キーボード操作:</strong>
        </p>
        <p className="my-1">← 左矢印: 前の写真</p>
        <p className="my-1">→ 右矢印: 次の写真</p>
        <p className="my-1">1-3: テーマ切り替え（1:基本 2:フェード 3:ぼかし）</p>
        <p className="my-1">写真をクリック: 詳細表示</p>
      </div>
    </div>
  )
}