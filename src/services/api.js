// API 기본 설정
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 대학 목록 가져오기
export const fetchUniversities = async (filters = {}) => {
  try {
    // 쿼리 파라미터 생성
    const params = new URLSearchParams();

    // 정렬
    if (filters.sort) {
      params.append('sort', filters.sort);
    }

    // 필터: ownership_type (national/private)
    if (filters.ownership_type) {
      params.append('ownership_type', filters.ownership_type);
    }

    // 필터: is_seoul (0/1)
    if (filters.is_seoul !== undefined && filters.is_seoul !== null) {
      params.append('is_seoul', filters.is_seoul);
    }

    const url = `${BASE_URL}/api/v1/universities${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch universities');
    return await response.json();
  } catch (error) {
    console.error('Error fetching universities:', error);
    throw error;
  }
};

// 공지사항 목록 가져오기
export const fetchAnnouncements = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/announcements`);
    if (!response.ok) throw new Error('Failed to fetch announcements');
    return await response.json();
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

// 대학 상세 정보 가져오기
export const fetchUniversityDetail = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/universities/${id}`);
    if (!response.ok) throw new Error('Failed to fetch university detail');
    return await response.json();
  } catch (error) {
    console.error('Error fetching university detail:', error);
    throw error;
  }
};

// 커뮤니티 게시물 목록 가져오기
export const fetchCommunityPosts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    // 정렬: sort=created_at, sort=-likes_count, sort=counter.view_count
    if (filters.sort) {
      params.append('sort', filters.sort);
    }

    // 필터: tags=1 (태그 ID)
    if (filters.tags) {
      params.append('tags', filters.tags);
    }

    const url = `${BASE_URL}/api/v1/community/posts${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch community posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching community posts:', error);
    throw error;
  }
};

// 커뮤니티 태그 목록 가져오기
export const fetchCommunityTags = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/community/tags`);
    if (!response.ok) throw new Error('Failed to fetch community tags');
    return await response.json();
  } catch (error) {
    console.error('Error fetching community tags:', error);
    throw error;
  }
};

// 커뮤니티 게시물 상세 가져오기
export const fetchPostDetail = async (id, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // 토큰이 있으면 헤더에 추가
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/api/v1/community/posts/${id}`, {
      headers,
    });
    if (!response.ok) throw new Error('Failed to fetch post detail');
    return await response.json();
  } catch (error) {
    console.error('Error fetching post detail:', error);
    throw error;
  }
};

// 커뮤니티 게시물 작성
export const createPost = async (postData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/community/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error('Failed to create post');
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// 댓글 작성
export const createComment = async (postId, commentData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/community/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create comment: ${response.status} - ${errorText}`);
    }
    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Google 로그인
export const loginWithGoogle = async (idToken) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/google/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: idToken,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API: Error response:', errorText);
      throw new Error(`Failed to login with Google: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('API: Error logging in with Google:', error);
    throw error;
  }
};

// 로그아웃
export const logout = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error('API: Logout error response:', errorText);
      // 401 에러(토큰 만료)는 무시하고 진행
      if (response.status !== 401) {
        throw new Error(`Failed to logout: ${response.status} - ${errorText}`);
      }
    }

    return true;
  } catch (error) {
    console.error('API: Error logging out:', error);
    // 로그아웃은 실패해도 로컬 데이터는 지워야 함
    return true;
  }
};
