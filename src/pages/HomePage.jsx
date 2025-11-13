import { useState, useEffect, useCallback, useRef } from 'react';
import SearchBar from '../components/common/SearchBar';
import AnnouncementCarousel from '../components/home/AnnouncementCarousel';
import UniversityList from '../components/home/UniversityList';
import { fetchUniversities, fetchAnnouncements } from '../services/api';

const HomePage = ({ onUniversityClick }) => {
  const [universities, setUniversities] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [filters, setFilters] = useState({ sort: 'qs_rank' }); // 기본 정렬
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const prevFiltersRef = useRef(null);

  // 초기 로드 (공지사항 + 대학 목록)
  useEffect(() => {
    loadAnnouncements();
    loadUniversities(true); // 초기 로드
    prevFiltersRef.current = JSON.stringify(filters);
  }, []);

  // 필터 변경 시 대학 목록 재조회
  useEffect(() => {
    const currentFiltersString = JSON.stringify(filters);

    // 이전 필터와 같으면 호출하지 않음
    if (prevFiltersRef.current === currentFiltersString) {
      return;
    }

    prevFiltersRef.current = currentFiltersString;
    loadUniversities(false);
  }, [filters]);

  const loadAnnouncements = async () => {
    try {
      const announcementsData = await fetchAnnouncements();
      setAnnouncements(announcementsData.data || []);
    } catch (err) {
      console.error('Error loading announcements:', err);
      setAnnouncements([]);
    }
  };

  const loadUniversities = async (isInitial = false) => {
    try {
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const universitiesData = await fetchUniversities(filters);
      setUniversities(universitiesData.data || []);
    } catch (err) {
      console.error('❌ Error loading universities:', err);
      setUniversities([]);
    } finally {
      if (isInitial) {
        setInitialLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSearch = (query) => {
    console.log('検索:', query);
    // TODO: 검索機能の実装
  };

  const handleUniversityClick = (university) => {
    onUniversityClick(university.id);
  };

  // 초기 로딩 시에만 전체 화면 로딩 표시
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-purple-50/30 pb-20">
      {/* ヘッダー - 検索バーのみ */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-blue-100/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-5">
        {/* 公知事項カルーセル */}
        <div className="mb-5">
          <AnnouncementCarousel announcements={announcements} />
        </div>

        {/* 大学リスト */}
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

          <div className={isRefreshing ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
            <UniversityList
              universities={universities}
              onUniversityClick={handleUniversityClick}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

