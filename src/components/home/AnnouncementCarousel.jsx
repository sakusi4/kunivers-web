import { useState, useEffect } from 'react';

const AnnouncementCarousel = ({ announcements }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!announcements || announcements.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000); // 5초마다 자동 회전

    return () => clearInterval(interval);
  }, [announcements]);

  if (!announcements || announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-md">
      {/* 画像 */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600">
        {currentAnnouncement.image ? (
          <img
            src={currentAnnouncement.image}
            alt={currentAnnouncement.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
          </div>
        )}

        {/* オーバーレイグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* テキストコンテンツ */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {currentAnnouncement.published_at && (
            <p className="text-white/80 text-xs mb-1.5 font-medium">
              {new Date(currentAnnouncement.published_at).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }).replace(/\//g, '.')}
            </p>
          )}
          <h3 className="text-white font-semibold text-base line-clamp-2 leading-snug">
            {currentAnnouncement.title}
          </h3>
        </div>
      </div>

      {/* インジケーター */}
      {announcements.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {announcements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/40 w-1'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementCarousel;

