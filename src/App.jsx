import { useState } from 'react';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import SettingsPage from './pages/SettingsPage';
import UniversityDetailPage from './pages/UniversityDetailPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import TabNavigation from './components/common/TabNavigation';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedUniversityId, setSelectedUniversityId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleUniversityClick = (universityId) => {
    setSelectedUniversityId(universityId);
  };

  const handleBackToHome = () => {
    setSelectedUniversityId(null);
  };

  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
  };

  const handleBackToCommunity = () => {
    setSelectedPostId(null);
  };

  const handleCreatePostClick = () => {
    setShowCreatePost(true);
  };

  const handleBackFromCreatePost = () => {
    setShowCreatePost(false);
  };

  const renderContent = () => {
    // 大学詳細ページを表示中の場合
    if (selectedUniversityId) {
      return <UniversityDetailPage universityId={selectedUniversityId} onBack={handleBackToHome} />;
    }

    // 投稿詳細ページを表示中の場合
    if (selectedPostId) {
      return <PostDetailPage postId={selectedPostId} onBack={handleBackToCommunity} />;
    }

    // 投稿作成ページを表示中の場合
    if (showCreatePost) {
      return <CreatePostPage onBack={handleBackFromCreatePost} onPostCreated={handleBackFromCreatePost} />;
    }

    // メインページ
    return (
      <>
        {(() => {
          switch (activeTab) {
            case 'home':
              return <HomePage onUniversityClick={handleUniversityClick} />;
            case 'community':
              return <CommunityPage onPostClick={handlePostClick} onCreateClick={handleCreatePostClick} />;
            case 'settings':
              return <SettingsPage />;
            default:
              return <HomePage onUniversityClick={handleUniversityClick} />;
          }
        })()}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </>
    );
  };

  return (
    <AuthProvider>
      <div className="app">
        {renderContent()}
      </div>
    </AuthProvider>
  );
}

export default App;
