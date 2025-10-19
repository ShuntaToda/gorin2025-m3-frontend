import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPhotoById } from '../api/photoApi'

/**
 * 写真詳細モーダルコンポーネント
 * 写真の詳細情報を表示
 */
export const PhotoDetail = () => {
  const { id } = useParams(0)
  const navigate = useNavigate()
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(true)

  const [failed, setFailed] = useState(false)
  /**
   * 写真詳細データを取得
   */
  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const data = await getPhotoById(id)
        setPhoto(data)
        setLoading(false)
      } catch (error) {
        console.error('写真の取得に失敗しました:', error)
        setFailed(true)
        setLoading(false)
      }
    }

    fetchPhoto()
  }, [id, navigate])

  /**
   * 詳細を閉じてメインページに戻る
   */
  const onClose = useCallback(() => {
    navigate('/')
  }, [navigate])

  /**
   * モーダル背景クリックハンドラー
   * 背景をクリックした場合のみモーダルを閉じる
   */
  const handleBackdropClick = (e) => {
    // モーダルの背景（backdrop）自体がクリックされた場合のみ閉じる
    if (e.target.classList.contains('photo-detail-modal')) {
      onClose()
    }
  }

  // コンポーネントマウント時にキーボードイベントリスナーを追加（ESCキーでモーダルを閉じる）
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    // クリーンアップ: コンポーネントがアンマウントされたときにリスナーを削除
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  /**
   * 画像URLからファイル名を取得
   */
  const getFileName = useCallback((url) => {
    const parts = url.split('/')
    return parts[parts.length - 1]
  }, [])

  return (
    <div
      className="photo-detail-modal fixed top-0 left-0 right-0 bottom-0 bg-opacity-85 flex justify-center items-center z-[1000] animate-[fade-in_0.3s_ease-out]"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-xl max-w-[450px] w-[90%] max-h-[90vh] overflow-auto shadow-2xl animate-[slide-up_0.3s_ease-out]">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {/* 閉じるボタン */}
            < button
              className="absolute top-2.5 right-2.5 bg-black bg-opacity-60 text-white border-none w-10 h-10 rounded-full text-[28px] cursor-pointer flex justify-center items-center z-10 transition-colors leading-none p-0 hover:bg-opacity-80"
              onClick={onClose}
              aria-label="閉じる"
            >
              ×
            </button>

            {failed ? (
              <div className="p-5 bg-white rounded-b-xl h-[250px] flex justify-center items-center">
                <div className="text-center text-lg">写真が見つかりません</div>
              </div>
            ) : (
              <div>
                {/* 写真表示 */}
                <div className="w-full bg-gray-300 flex justify-center items-center p-5 min-h-[250px]">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption}
                    className="max-w-full max-h-[400px] object-contain"
                  />
                </div>

                {/* 詳細情報 */}
                <div className="p-5 bg-white rounded-b-xl">
                  <h2 className="text-xl text-slate-800 mb-4 break-words">{photo.caption}</h2>

                  <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm">
                    <span className="font-bold text-slate-700">ファイル名:</span>
                    <span className="text-gray-500 text-right">{getFileName(photo.imageUrl)}</span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm">
                    <span className="font-bold text-slate-700">ファイルサイズ:</span>
                    <span className="text-gray-500 text-right">{photo.fileSize}</span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm">
                    <span className="font-bold text-slate-700">作成日時:</span>
                    <span className="text-gray-500 text-right">{photo.createdAt}</span>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm">
                    <span className="font-bold text-slate-700">キャプション:</span>
                    <span className="text-gray-500 text-right">{photo.caption}</span>
                  </div>
                  <div className="flex justify-between py-2.5 text-sm">
                    <span className="font-bold text-slate-700">写真ID:</span>
                    <span className="text-gray-500 text-right">{photo.id}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div >
  )
}

