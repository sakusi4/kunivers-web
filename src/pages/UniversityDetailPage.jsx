import { useState, useEffect } from 'react';
import { fetchUniversityDetail } from '../services/api';

const UniversityDetailPage = ({ universityId, onBack }) => {
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadUniversityDetail();
  }, [universityId]);

  const loadUniversityDetail = async () => {
    try {
      setLoading(true);
      const response = await fetchUniversityDetail(universityId);
      setUniversity(response.data);
    } catch (error) {
      console.error('Error loading university detail:', error);
      // Mock data for development
      setUniversity(getMockUniversityDetail());
    } finally {
      setLoading(false);
    }
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

  if (!university) return null;

  const tabs = [
    {
      id: 'overview',
      label: '概要',
      icon: (isActive) => (
        <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'faculties',
      label: '学部',
      icon: (isActive) => (
        <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'admissions',
      label: '入試',
      icon: (isActive) => (
        <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      id: 'video',
      label: '動画',
      icon: (isActive) => (
        <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'location',
      label: '位置',
      icon: (isActive) => (
        <svg className="w-6 h-6" fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

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
            {university.name_jp}
          </h1>
        </div>
      </header>

      {/* コンテンツ */}
      <main className="pb-4">
        {activeTab === 'overview' && <OverviewTab university={university} />}
        {activeTab === 'faculties' && <FacultiesTab faculties={university.faculties} />}
        {activeTab === 'admissions' && <AdmissionsTab admissions={university.admissions} />}
        {activeTab === 'video' && <VideoTab university={university} />}
        {activeTab === 'location' && <LocationTab university={university} />}
      </main>

      {/* タブナビゲーション（下部固定） */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-blue-100/50 z-50 shadow-lg">
        <div className="flex justify-around items-center h-16 max-w-7xl mx-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-b-full" />
                )}
                {tab.icon(isActive)}
                <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

// 概要タブ
const OverviewTab = ({ university }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
      {/* ヘッダーカード */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col items-center">
          {university.logo_url && (
            <img
              src={university.logo_url}
              alt={university.name_jp}
              className="w-24 h-24 object-contain mb-4"
            />
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{university.name_jp}</h2>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-yellow-500 transition-colors">
            <svg className="w-5 h-5" fill={university.favourited_by_me ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>{university.favourites_count}人がお気に入り</span>
          </button>

          <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{university.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{university.founding_year}年創立</span>
            </div>
          </div>
        </div>
      </div>

      {/* ランキング */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">ランキング</h3>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 mb-3">
          <div className="text-sm text-blue-600 font-medium mb-1">世界大学ランキング: 第{university.qs_rank}位</div>
        </div>
        {university.neighbor && (
          <div className="text-sm text-gray-600">
            • 近い順位: {university.neighbor.name_jp} ({university.neighbor.rank}位)
          </div>
        )}
      </div>

      {/* 規模 統計 */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">規模 統計</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{university.professor_count?.toLocaleString()}</div>
            <div className="text-xs text-gray-500">教授</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{university.student_count?.toLocaleString()}</div>
            <div className="text-xs text-gray-500">学生</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{university.global_student_count?.toLocaleString()}</div>
            <div className="text-xs text-gray-500">留学生</div>
          </div>
        </div>
      </div>

      {/* 連絡先 */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">連絡先</h3>
        </div>
        <div className="space-y-3 text-sm text-gray-600">
          {university.contact_address && (
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{university.contact_address}</span>
            </div>
          )}
          {university.contact_phone && (
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{university.contact_phone}</span>
            </div>
          )}
          {university.contact_email && (
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{university.contact_email}</span>
            </div>
          )}
          {university.website_url && (
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <a href={university.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                公式ウェブサイト
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 学部タブ
const FacultiesTab = ({ faculties }) => {
  if (!faculties || faculties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">学部情報がありません</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      {faculties.map((faculty) => (
        <div key={faculty.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-l-4 border-blue-500 pl-3">
            {faculty.name_jp}
          </h3>
          {faculty.overview_jp && (
            <p className="text-sm text-gray-600 mb-4">{faculty.overview_jp}</p>
          )}

          {faculty.fees && faculty.fees.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-sm font-semibold text-gray-800">学費情報</h4>
              </div>
              {faculty.fees.map((fee) => (
                <div key={fee.id} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{fee.category}</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">
                        ₩ {fee.amount.toLocaleString()}원
                      </div>
                      <div className="text-xs text-gray-500">
                        ¥ JPY {Math.round(fee.amount * 0.109).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {fee.notes_jp && (
                    <p className="text-xs text-gray-500">{fee.notes_jp}</p>
                  )}
                  {fee.id < faculty.fees.length && <div className="border-b border-gray-200 my-2" />}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// 入試タブ
const AdmissionsTab = ({ admissions }) => {
  if (!admissions || admissions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">入試情報がありません</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      {admissions.map((admission) => (
        <div key={admission.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">入試情報</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">入学時期</span>
              </div>
              <p className="text-gray-900 ml-7">{admission.intakes || `${admission.year}年`}</p>
            </div>

            {admission.application_start && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">出願期間</span>
                </div>
                <p className="text-gray-900 ml-7">
                  {new Date(admission.application_start).toLocaleDateString('ja-JP')} - {new Date(admission.application_end).toLocaleDateString('ja-JP')}
                </p>
              </div>
            )}

            {admission.exam_date && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">最終日程</span>
                </div>
                <p className="text-gray-900 ml-7">{new Date(admission.exam_date).toLocaleDateString('ja-JP')}</p>
              </div>
            )}

            {admission.result_date && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">合格発表</span>
                </div>
                <p className="text-gray-900 ml-7">{new Date(admission.result_date).toLocaleDateString('ja-JP')}</p>
              </div>
            )}

            {admission.requirements_jp && admission.requirements_jp.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">出願要件</span>
                </div>
                <ul className="ml-7 space-y-2">
                  {admission.requirements_jp.map((req, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {admission.notes_jp && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-yellow-800">{admission.notes_jp}</p>
                </div>
              </div>
            )}
          </div>

          <button className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            入試要項 PDF を確認
          </button>
        </div>
      ))}
    </div>
  );
};

// 動画タブ
const VideoTab = ({ university }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      {university.youtube_url && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            <h3 className="text-lg font-semibold">大学紹介動画</h3>
          </div>
          <p className="text-white/90 text-sm">キャンパスの魅力や特徴をご確認いただけます</p>
        </div>
      )}

      {university.youtube_url && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <a
                href={university.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                YouTubeで動画を再生
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-sm font-semibold text-gray-700">動画について</h4>
        </div>
        <p className="text-sm text-gray-600">
          この動画では大学の魅力や特色、キャンパスライフなどを詳しく紹介しています。大学を検討されている方はぜひご覧ください。
        </p>
      </div>

      <div className="bg-gray-100 rounded-2xl p-12 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">キャンパス写真ギャラリー</h3>
        <p className="text-sm text-gray-500">近日公開予定</p>
      </div>
    </div>
  );
};

// 位置タブ
const LocationTab = ({ university }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">{university.name_jp}</h3>
        </div>

        {university.contact_address && (
          <div className="flex items-start gap-3 mb-4">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="text-sm text-gray-700">{university.contact_address}</span>
          </div>
        )}

        <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Googleマップで開く
        </button>
      </div>

      {/* マップ表示エリア */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-gray-500 text-sm">地図を読み込んでいます...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// モックデータ
const getMockUniversityDetail = () => ({
  id: 1,
  type: "national",
  qs_rank: 31,
  professor_count: 6397,
  global_student_count: 2535,
  location_lat: "37.464831",
  location_lng: "126.954624",
  student_count: 29073,
  name_kr: "서울대학교",
  name_en: "Seoul National University",
  name_jp: "ソウル大学校",
  city: "ソウル",
  founding_year: "1946",
  logo_url: "https://api.kunivers.com/storage/logos/seoul_logo.png",
  cover_img_url: "https://api.kunivers.com/storage/logos/seoul_logo.png",
  website_url: "https://www.snu.ac.kr",
  contact_phone: "01075774395",
  contact_email: "junpark4395@gmail.com",
  contact_address: "1 Gwanak-ro, Gwanak-gu, Seoul 08826, Korea",
  intro_text_jp: "「大転換の時代を先導する学問共同体」を目指し、学問の垣根を越え、世界的な学問共同体への飛躍を図ります。",
  youtube_url: "https://youtu.be/LcZMk_73fzA",
  favourited_by_me: false,
  favourites_count: 1,
  faculties: [
    {
      id: 1,
      university_id: 1,
      name_kr: "공과대학",
      name_en: "College of Engineering",
      name_jp: "工学部",
      overview_jp: "ソウル大学の工学部は、工学分野の最先端研究を牽引する学部です。",
      website_url: "https://eng.snu.ac.kr",
      intro_text_jp: "韓国のトップ大学であるソウル大学の工学部にようこそ。",
      fees: [
        {
          id: 1,
          faculty_id: 1,
          category: "授業料",
          amount: 4200000,
          notes_jp: "工学部の授業料は1学期あたり約420万ウォンです。学科により若干の違いがあります。"
        },
        {
          id: 2,
          faculty_id: 1,
          category: "出願料",
          amount: 100000,
          notes_jp: "出願料は10万ウォンです。支払い後は返金されませんのでご注意ください。"
        }
      ]
    }
  ],
  admissions: [
    {
      id: 1,
      university_id: 1,
      year: 2025,
      intakes: "春・秋入学",
      application_start: "2025-01-01 00:00:00",
      application_end: "2025-02-15 00:00:00",
      exam_date: "2025-03-01 00:00:00",
      result_date: "2025-03-15 00:00:00",
      requirements_jp: [
        "韓国語能力試験（TOPIK）4級以上",
        "英語能力証明書（TOEFL、IELTS）を提出",
        "高校卒業証明書",
        "パスポートのコピー"
      ],
      notes_jp: "学費納付期限は合格発表後2週間以内です。詳細は大学の公式ウェブサイトをご確認ください。"
    }
  ],
  neighbor: {
    name_jp: "The University of Tokyo",
    name_en: "The University of Tokyo",
    city: "Tokyo",
    rank: 33,
    overall_score: 82.1
  }
});

export default UniversityDetailPage;

