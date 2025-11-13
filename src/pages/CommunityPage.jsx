import { useState, useEffect, useRef } from 'react';
import { fetchCommunityPosts, fetchCommunityTags } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CommunityPage = ({ onPostClick, onCreateClick }) => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortStates, setSortStates] = useState({
    time: 'desc',  // 기본: 최신순 (내림차순)
    likes: 'none',
    views: 'none'
  });
  const filtersRef = useRef({ sort: '-created_at' });
  const isInitialMount = useRef(true);

  useEffect(() => {
    // 초기 로드 (태그 목록 + 게시물)
    loadTags();
    buildAndLoadWithFilters(true); // 초기 로드

    // 10초마다 자동 새로고침 (백그라운드)
    const interval = setInterval(() => {
      loadPosts('silent'); // 로딩 표시 없이 조용히 새로고침
    }, 10000); // 10초

    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(interval);
  }, []);

  // 필터/정렬 변경 시 재조회 (초기 마운트 제외)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    buildAndLoadWithFilters(false); // 필터 변경 시에는 부드럽게
  }, [selectedTag, sortStates]);

  const loadTags = async () => {
    try {
      const response = await fetchCommunityTags();
      setAllTags(response.data || []);

    } catch (error) {
      console.error('Error loading tags:', error);
      setAllTags([]);
    }
  };

  const buildAndLoadWithFilters = (isInitial = false) => {
    const filters = {};

    // 정렬: 활성화된 정렬 찾기
    const activeSortKey = Object.keys(sortStates).find(key => sortStates[key] !== 'none');
    if (activeSortKey) {
      const direction = sortStates[activeSortKey];
      const sortMapping = {
        time: 'created_at',
        likes: 'likes_count',
        views: 'counter.view_count'
      };
      const sortField = sortMapping[activeSortKey];
      filters.sort = direction === 'desc' ? `-${sortField}` : sortField;
    } else {
      // 기본 정렬: 최신순
      filters.sort = '-created_at';
    }

    // 태그 필터 (태그 ID 전달)
    if (selectedTag) {
      filters.tags = selectedTag; // 태그 ID
    }

    filtersRef.current = filters;
    loadPosts(isInitial ? 'initial' : 'refresh');
  };

  const loadPosts = async (loadType = 'initial') => {
    try {
      if (loadType === 'initial') {
        setInitialLoading(true);
      } else if (loadType === 'refresh') {
        setIsRefreshing(true);
      }
      const response = await fetchCommunityPosts(filtersRef.current);
      setPosts(response.data || []);

    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      if (loadType === 'initial') {
        setInitialLoading(false);
      } else if (loadType === 'refresh') {
        setIsRefreshing(false);
      }
    }
  };

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      alert('投稿するにはログインが必要です。\n設定タブからログインしてください。');
      return;
    }
    onCreateClick();
  };

  const handleSortChange = (sortKey) => {
    const currentState = sortStates[sortKey];
    let newState;

    if (currentState === 'none') {
      newState = 'asc';
    } else if (currentState === 'asc') {
      newState = 'desc';
    } else {
      newState = 'none';
    }

    // 다른 정렬을 none으로 초기화
    const newSortStates = {
      time: 'none',
      likes: 'none',
      views: 'none',
      [sortKey]: newState
    };

    setSortStates(newSortStates);
  };

  const getSortIcon = (state) => {
    if (state === 'asc') {
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else if (state === 'desc') {
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
    return null;
  };

  const tagColors = ['blue', 'green', 'amber', 'purple'];

  // 검색은 프론트엔드에서만 처리 (타이핑마다 API 호출하지 않기 위해)
  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortOptions = [
    { value: 'time', label: '時間', icon: '🕐' },
    { value: 'likes', label: 'いいね', icon: '💙' },
    { value: 'views', label: '閲覧', icon: '👀' }
  ];

  // 초기 로딩 시에만 전체 화면 로딩 표시
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-purple-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-purple-50/30 pb-20">
      {/* ヘッダー */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-blue-100/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            コミュニティ
          </h1>
          {/* 検索バー */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キーワードで検索"
              className="w-full pl-12 pr-4 py-3 text-gray-900 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* タグフィルター */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {allTags.map((tag, index) => {
            const color = tagColors[index % tagColors.length];
            const isActive = selectedTag === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(isActive ? null : tag.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' :
                      color === 'green' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md' :
                      color === 'amber' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' :
                      'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                    : color === 'blue' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' :
                      color === 'green' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' :
                      color === 'amber' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' :
                      'bg-purple-50 text-purple-600 hover:bg-purple-100'
                }`}
              >
                # {tag.name}
              </button>
            );
          })}
        </div>

        {/* 並び替え */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">並び替え</span>
          <div className="flex gap-2">
            {sortOptions.map((option) => {
              const state = sortStates[option.value];
              const isActive = state !== 'none';
              return (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                  {isActive && getSortIcon(state)}
                </button>
              );
            })}
          </div>
        </div>

        {/* 投稿リスト */}
        <div className="relative">
          {/* 필터 변경 시 부드러운 로딩 인디케이터 */}
          {isRefreshing && (
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-center py-2">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm text-gray-600">更新中...</span>
              </div>
            </div>
          )}

          <div className={`space-y-3 ${isRefreshing ? 'opacity-50 transition-opacity' : 'transition-opacity'}`}>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onClick={() => onPostClick(post.id)} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">投稿が見つかりませんでした</p>
            </div>
          )}
        </div>
      </main>

      {/* 新規投稿ボタン */}
      <button
        onClick={handleCreateClick}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-40"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

// 投稿カード
const PostCard = ({ post, onClick }) => {
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
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer p-4 border border-gray-100"
    >
      <div className="flex items-start gap-3 mb-3">
        {/* アバター */}
        <div className="flex-shrink-0">
          {post.author?.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
              {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">{post.author?.username || 'Unknown'}</span>
            <span className="text-xs text-gray-500">{timeAgo(post.created_at)}</span>
          </div>

          <h3 className="text-base font-bold text-gray-900 mb-2">
            {post.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {post.content}
          </p>

          {/* タグ */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* メタ情報 */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{post.likes_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.comments_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{post.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
