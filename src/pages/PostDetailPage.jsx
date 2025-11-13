import { useState, useEffect, useRef } from 'react';
import { fetchPostDetail, createComment } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import pusher from '../services/pusher';

const PostDetailPage = ({ postId, onBack }) => {
  const { token, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [replyTo, setReplyTo] = useState(null); // 답글 대상 (댓글 객체)
  const [submitting, setSubmitting] = useState(false);
  const channelRef = useRef(null);

  useEffect(() => {
    loadPostDetail();
  }, [postId, token]); // token 변경 시에도 재조회 (로그인/로그아웃)

  // Pusher 실시간 업데이트 구독
  useEffect(() => {
    if (!postId) return;

    const channel = pusher.subscribe(`community.${postId}`);
    channelRef.current = channel;

    // PostUpdated 이벤트 리스너
    channel.bind('PostUpdated', (data) => {
      console.log('Receive PostUpdated:', data);
      // 사용자 경험을 해치지 않고 조용히 데이터만 갱신
      loadPostDetail(true); // silent mode
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      console.log(`Ubsubscribe: community.${postId}`);
      channel.unbind('PostUpdated');
      pusher.unsubscribe(`community.${postId}`);
      channelRef.current = null;
    };
  }, [postId]);

  const loadPostDetail = async (silent = false) => {
    try {
      // silent 모드가 아닐 때만 로딩 표시
      if (!silent) {
        setLoading(true);
      }

      // 로그인되어 있으면 토큰 포함
      const response = await fetchPostDetail(postId, token);
      setPost(response.data);

    } catch (error) {
      console.error('Error loading post detail:', error);
      if (!silent) {
        setPost(null);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (!isAuthenticated || !token) {
      alert('コメントするにはログインが必要です。\n設定タブからログインしてください。');
      return;
    }

    try {
      setSubmitting(true);

      const commentData = {
        content: comment.trim()
      };

      // 대댓글인 경우 comment_id 추가
      if (replyTo) {
        commentData.comment_id = replyTo.id;
      }

      await createComment(postId, commentData, token);

      // 댓글 작성 성공 시 입력창 초기화 및 게시물 재조회 (조용히)
      setComment('');
      setReplyTo(null);
      await loadPostDetail(true); // 댓글 목록 갱신 (silent mode)
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('コメントの投稿に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (comment) => {
    if (!isAuthenticated) {
      alert('コメントするにはログインが必要です。\n設定タブからログインしてください。');
      return;
    }
    setReplyTo(comment);
    setComment('');
    // 입력창으로 스크롤
    setTimeout(() => {
      document.getElementById('comment-input')?.focus();
    }, 100);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setComment('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-purple-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const timeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));

    if (diffInHours < 1) return '1時間未満';
    if (diffInHours < 24) return `${diffInHours}時間前`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}日前`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}週間前`;
    return `${Math.floor(diffInDays / 30)}ヶ月前`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-purple-50/30 pb-24">
      {/* ヘッダー */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-blue-100/50 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center px-4 py-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-gray-900 pr-10">
            投稿詳細
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* 投稿内容 */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          {/* 投稿者情報 */}
          <div className="flex items-start gap-3 mb-4">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
                {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <div className="font-semibold text-gray-900">{post.author?.username || 'Unknown'}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{timeAgo(post.created_at)}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{post.views}</span>
                </div>
              </div>
            </div>
          </div>

          {/* タイトル */}
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {post.title}
          </h2>

          {/* 内容 */}
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* タグ */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* いいねボタン */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                post.liked_by_me
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill={post.liked_by_me ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-medium">いいね</span>
              {post.likes_count > 0 && <span>{post.likes_count}</span>}
            </button>
          </div>
        </div>

        {/* コメントセクション */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          <div className="px-5 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              コメント {post.comments_count > 0 && `${post.comments_count}件`}
            </h3>
          </div>
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
            ))
          ) : (
            <div className="px-5 py-8 text-center text-gray-500 text-sm">
              まだコメントがありません
            </div>
          )}
        </div>
      </main>

      {/* コメント入力 */}
      <form onSubmit={handleSubmitComment} className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-blue-100/50 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* 답글 대상 표시 */}
          {replyTo && (
            <div className="mb-2 flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span>
                  <span className="font-semibold">{replyTo.author?.username}</span> さんへの返信
                </span>
              </div>
              <button
                type="button"
                onClick={handleCancelReply}
                className="text-blue-700 hover:text-blue-900 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              id="comment-input"
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={replyTo ? "返信を入力..." : "コメントを入力..."}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={!comment.trim() || submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>送信中...</span>
                </>
              ) : (
                <span>投稿</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// コメントアイテム（YouTube風）
const CommentItem = ({ comment, isReply = false, onReply }) => {
  const [showReplies, setShowReplies] = useState(true);

  const timeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));

    if (diffInHours < 1) return '1時間未満';
    if (diffInHours < 24) return `${diffInHours}時間前`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}日前`;
  };

  const hasReplies = comment.comments && comment.comments.length > 0;

  return (
    <div className={isReply ? 'ml-12' : ''}>
      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          {/* アバター */}
          {comment.author?.avatar ? (
            <img
              src={comment.author.avatar}
              alt={comment.author.username}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {comment.author?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}

          {/* コンテンツ */}
          <div className="flex-1 min-w-0">
            {/* ヘッダー */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-semibold text-gray-900 text-sm">
                {comment.author?.username || 'Unknown'}
              </span>
              <span className="text-xs text-gray-500">
                {timeAgo(comment.created_at)}
              </span>
            </div>

            {/* コメント本文 */}
            <p className="text-sm text-gray-800 mb-2 leading-relaxed">
              {comment.content}
            </p>

            {/* アクションボタン */}
            <div className="flex items-center gap-4">
              {/* いいねボタン */}
              <button
                className={`flex items-center gap-1.5 transition-colors group ${
                  comment.liked_by_me ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                <svg
                  className={`w-4 h-4 ${!comment.liked_by_me && 'group-hover:scale-110 transition-transform'}`}
                  fill={comment.liked_by_me ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                {comment.likes_count > 0 && (
                  <span className="text-xs font-medium">{comment.likes_count}</span>
                )}
              </button>

              {/* 返信ボタン */}
              {!isReply && (
                <button
                  onClick={() => onReply && onReply(comment)}
                  className="text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors"
                >
                  返信
                </button>
              )}
            </div>

            {/* 返信表示トグル */}
            {!isReply && hasReplies && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${showReplies ? '' : '-rotate-90'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span>{comment.comments.length}件の返信</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 返信リスト */}
      {!isReply && hasReplies && showReplies && (
        <div>
          {comment.comments.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;

