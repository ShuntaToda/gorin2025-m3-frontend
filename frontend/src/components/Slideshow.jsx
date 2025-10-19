import { useState, useEffect, useRef, useCallback } from 'react'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

/**
 * スライドショーコンポーネント
 * 写真の表示、自動再生、テーマ切り替え、ドラッグ&ドロップを管理
 */
export const Slideshow = ({ photos, settings, currentPhotoIndex, setCurrentPhotoIndex, onShowDetail, onAddPhoto, shufflePhotos }) => {
  /**
   * 自動再生タイマーのリファレンス
   * 
   * useRefを使用する理由：
   * 1. 再レンダリング時に値が保持される（タイマーIDを保持し続けられる）
   * 2. 値が変わっても再レンダリングをトリガーしない（パフォーマンス向上）
   * 3. clearIntervalで同じタイマーを参照できる（正確なタイマー制御）
   * 4. stateと違い同期的にアクセスできる（即座に値を取得・更新可能）
   */
  const timerRef = useRef(null)
  // アニメーションフェーズ: null（アニメーションなし）, 'exiting'（退場中）, 'entering'（入場中）
  const [animationPhase, setAnimationPhase] = useState(null)
  // ドラッグオーバー状態
  const [isDragOver, setIsDragOver] = useState(false)

  /**
   * 次の写真インデックスを計算
   * @param {string} direction - 方向（'next' または 'prev'）
   * @returns {number} 次の写真のインデックス
   */
  const calculateNextPhotoIndex = useCallback((direction) => {
    if (direction === 'next') {
      return (currentPhotoIndex + 1) % photos.length
    } else {
      return (currentPhotoIndex - 1 + photos.length) % photos.length
    }
  }, [photos.length, currentPhotoIndex])

  /**
   * 次の写真へ移動
   * @param {boolean} withAnimation - アニメーションを使用するか（デフォルト: true）
   * @param {boolean} resetTimer - 自動再生タイマーをリセットするか（デフォルト: false）
   */
  const goToNext = useCallback(({ withAnimation = true, resetTimer = false }) => {
    if (photos.length === 0) return

    // 次の写真のインデックスを計算
    const nextIndex = calculateNextPhotoIndex('next')

    // 自動再生タイマーをリセット（クリアして再設定させる）
    if (resetTimer) {
      clearInterval(timerRef.current)
    }

    // アニメーションなしで即座に切り替え
    if (!withAnimation) {
      // 自動モード: 方向に応じてインデックスを計算
      if (settings.playMode === 'random' && currentPhotoIndex === photos.length - 1) {
        shufflePhotos()
      }
      setCurrentPhotoIndex(nextIndex)
      return
    }

    // アニメーション開始（退場アニメーション）
    setAnimationPhase('exiting')

    // 退場アニメーションの時間（500ms）待つ
    setTimeout(() => {
      // 自動モード: 方向に応じてインデックスを計算
      if (settings.playMode === 'random' && currentPhotoIndex === photos.length - 1) {
        shufflePhotos()
      }
      // 写真を切り替えて入場アニメーション開始
      setCurrentPhotoIndex(nextIndex)
      setAnimationPhase('entering')

      // 入場アニメーションの時間待つ
      setTimeout(() => {
        setAnimationPhase(null)

        //CSSとのずれを考慮して10ms短くする
      }, 490)
    }, 490)
  }, [photos.length, calculateNextPhotoIndex, setCurrentPhotoIndex, settings.playMode, shufflePhotos, currentPhotoIndex])

  /**
   * 前の写真へ移動
   * @param {boolean} withAnimation - アニメーションを使用するか（デフォルト: true）
   * @param {boolean} resetTimer - 自動再生タイマーをリセットするか（デフォルト: false）
   */
  const goToPrevious = useCallback(({ withAnimation = true, resetTimer = false } = {}) => {
    if (photos.length === 0) return

    // 自動再生タイマーをリセット（クリアして再設定させる）
    if (resetTimer) {
      clearInterval(timerRef.current)
    }

    // 前の写真のインデックスを計算
    const nextIndex = calculateNextPhotoIndex('prev')

    // アニメーションなしで即座に切り替え
    if (!withAnimation) {
      // 自動モード: 方向に応じてインデックスを計算
      if (settings.playMode === 'random' && currentPhotoIndex === photos.length - 1) {
        shufflePhotos()
      }
      setCurrentPhotoIndex(nextIndex)
      return
    }

    // アニメーション開始（退場アニメーション）
    setAnimationPhase('exiting')

    // 退場アニメーションの時間（500ms）待つ
    setTimeout(() => {
      // 写真を切り替えて入場アニメーション開始
      setCurrentPhotoIndex(nextIndex)
      setAnimationPhase('entering')

      // 入場アニメーションの時間待つ
      setTimeout(() => {
        setAnimationPhase(null)

        //CSSとのずれを考慮して10ms短くする
      }, 490)
      //CSSとのずれを考慮して10ms短くする
    }, 490)
  }, [photos.length, calculateNextPhotoIndex, setCurrentPhotoIndex, settings.playMode, shufflePhotos, currentPhotoIndex])

  /**
   * キーボードショートカットハンドラー
   * 左右矢印キーで写真を切り替える
   */
  const handleKeyDown = useCallback(
    (e) => {

      // 入力フィールドにフォーカスがある場合は何もしない
      const tagName = e.target.tagName.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return
      }

      // 左右矢印キーによるナビゲーション
      if (e.key === 'ArrowLeft') {
        e.preventDefault() // デフォルトのスクロール動作を防ぐ
        goToPrevious({ withAnimation: false, resetTimer: true })
      } else if (e.key === 'ArrowRight') {
        e.preventDefault() // デフォルトのスクロール動作を防ぐ
        goToNext({ withAnimation: false, resetTimer: true })
      }
    },
    [goToNext, goToPrevious]
  )

  // キーボードショートカットをマウント
  useKeyboardShortcuts(handleKeyDown)

  /**
   * 自動再生タイマーの設定
   */
  useEffect(() => {
    // 既存のタイマーをクリア
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // 写真が存在する場合のみタイマーを設定
    if (photos.length > 0) {
      timerRef.current = setInterval(() => {
        goToNext({})
      }, settings.slideInterval)
    }

    // クリーンアップ: コンポーネントがアンマウントされたときにタイマーをクリア
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.length, settings.slideInterval, currentPhotoIndex, settings.playMode])

  /**
   * ドラッグ&ドロップハンドラー
   */
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)

    // ドロップされたファイルを取得
    const files = e.dataTransfer.files
    if (files.length === 0) return

    const file = files[0]

    // 画像ファイルかチェック
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルをドロップしてください')
      return
    }

    // ファイルを読み込んでプレビュー用のURLを作成
    const reader = new FileReader()
    reader.onload = (event) => {
      // 新しい写真オブジェクトを作成
      const newPhoto = {
        id: photos.length + 1,
        imageUrl: event.target.result,
        caption: file.name,
      }

      // 親コンポーネントに新しい写真を追加
      onAddPhoto(newPhoto)
    }
    reader.readAsDataURL(file)
  }

  /**
   * 写真クリックハンドラー
   * 詳細表示を開く
   */
  const handlePhotoClick = () => {
    if (photos.length > 0) {
      onShowDetail(photos[currentPhotoIndex])
    }
  }

  /**
   * テーマに応じたアニメーションクラスを取得
   */
  const getAnimationClass = () => {
    // アニメーション中でない場合は何も返さない
    if (!animationPhase) return ''

    // テーマAは基本テーマなのでアニメーションなし
    if (settings.themeId === 'A') return ''

    // 退場アニメーション（写真が消える）
    if (animationPhase === 'exiting') {
      switch (settings.themeId) {
        case 'B':
          return 'animate-fade-out' // フェードアウト
        case 'C':
          return 'animate-blur-out' // ぼかしアウト
      }
    }

    // 入場アニメーション（写真が現れる）
    if (animationPhase === 'entering') {
      switch (settings.themeId) {
        case 'B':
          return 'animate-fade-in' // フェードイン
        case 'C':
          return 'animate-blur-in' // ぼかしイン
      }
    }

    return ''
  }

  // 写真が存在しない場合
  if (photos.length === 0) {
    return (
      <div
        className={`relative bg-black rounded-lg overflow-hidden mb-5 min-h-[400px] ${isDragOver ? 'border-3 border-dashed border-blue-500 bg-blue-50 bg-opacity-10' : ''
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col justify-center items-center h-[400px] text-white text-center">
          <p className="my-2.5 text-lg">写真がありません</p>
          <p className="text-sm text-gray-400">画像ファイルをドラッグ&ドロップして追加</p>
        </div>
      </div>
    )
  }

  const currentPhoto = photos[currentPhotoIndex]

  return (
    <div
      className={`relative bg-gray-300 rounded-lg overflow-hidden mb-5 min-h-[400px] ${isDragOver ? 'border-3 border-dashed border-blue-500 bg-blue-50 bg-opacity-10' : ''
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 写真表示エリア */}
      <div
        className={`relative w-full h-[400px] flex flex-col justify-center items-center cursor-pointer transition-opacity duration-300 ${getAnimationClass()}`}
        onClick={handlePhotoClick}
      >
        <img
          src={currentPhoto.imageUrl}
          alt={currentPhoto.caption}
          className="max-w-full max-h-[350px] object-contain"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gray-300 bg-opacity-70 py-2.5 px-2.5 text-center text-base">
          {currentPhoto.caption}
        </div>
      </div>

      {/* ドロップオーバーレイ */}
      {isDragOver && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-blue-800 bg-opacity-80 flex justify-center items-center z-10">
          <div className="text-white text-2xl font-bold">ここに画像をドロップ</div>
        </div>
      )}
    </div>
  )
}