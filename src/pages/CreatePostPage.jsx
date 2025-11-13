import { useState } from 'react';
import { createPost } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CreatePostPage = ({ onBack, onPostCreated }) => {
  const { token, isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !token) {
      setError('ログインが必要です');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('タイトルと内容を入力してください');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const postData = {
        title: title.trim(),
        content: content.trim(),
        tags: tags
      };

      await createPost(postData, token);

      // 성공 시 커뮤니티 페이지로 돌아가기
      if (onPostCreated) onPostCreated();
      onBack();
    } catch (err) {
      setError('投稿に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = title.trim() && content.trim() && !loading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-purple-50/30">
      {/* ヘッダー */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-blue-100/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-gray-900">
            新規投稿
          </h1>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
              canSubmit
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? '投稿中...' : '投稿'}
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* タイトル入力 */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タイトルを入力"
              maxLength={100}
              className="w-full px-0 py-3 text-xl font-semibold text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
            />
            <div className="flex justify-end">
              <span className="text-xs text-gray-400">{title.length}/100</span>
            </div>
          </div>

          {/* 내용 입력 */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="内容を入力してください..."
              maxLength={2000}
              rows={12}
              className="w-full px-0 py-2 text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400 resize-none leading-relaxed"
            />
            <div className="flex justify-end">
              <span className="text-xs text-gray-400">{content.length}/2000</span>
            </div>
          </div>

          {/* 태그 입력 */}
          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              タグ
              <span className="text-xs text-gray-400 font-normal">
                (最大5個、Enterまたは","で追加)
              </span>
            </label>

            {/* 태그 목록 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* 태그 입력창 */}
            {tags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="タグを追加..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            )}
          </div>

          {/* 투고 가이드 */}
          <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              投稿のヒント
            </h3>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>• 他の人が理解しやすいように具体的に書きましょう</li>
              <li>• 関連するタグを追加すると、より多くの人に届きます</li>
              <li>• 質問する場合は、状況を詳しく説明してください</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePostPage;

