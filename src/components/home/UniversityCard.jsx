const UniversityCard = ({ university, onClick }) => {
  return (
    <div
      onClick={() => onClick(university)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer p-5 border border-gray-100 hover:border-gray-200"
    >
      <div className="flex items-start gap-4">
        {/* ロゴ */}
        <div className="flex-shrink-0">
          {university.logo_url ? (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                src={university.logo_url}
                alt={`${university.name_jp} logo`}
                className="w-full h-full object-contain p-1"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl font-semibold">
                {university.name_jp?.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-1.5 tracking-tight">
            {university.name_jp}
          </h3>
          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
            <span className="text-gray-400">📍</span>
            <span>{university.city}</span>
            <span className="text-gray-300">•</span>
            <span>{university.type === 'national' ? '国立' : '私立'}</span>
          </p>

          {/* ランキング情報 */}
          {university.qs_rank && (
            <div className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md mb-2 shadow-sm">
              <span className="text-xs font-semibold text-white">
                世界大学ランキング 第{university.qs_rank}位
              </span>
            </div>
          )}

          {/* 近隣大学情報 */}
          {university.neighbor && (
            <p className="text-xs text-gray-500 mt-2">
              近い順位: <span className="text-gray-700">{university.neighbor.name_en || university.neighbor.name_jp}</span> ({university.neighbor.rank}位)
            </p>
          )}
        </div>

        {/* お気に入りとチェブロン */}
        <div className="flex flex-col items-end justify-between self-stretch">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // お気に入り機能（後で実装）
            }}
            className={`transition-colors ${
              university.favourited_by_me
                ? 'text-yellow-500'
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            <svg className="w-5 h-5" fill={university.favourited_by_me ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;

