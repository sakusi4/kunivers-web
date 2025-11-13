import { useState, useEffect, useRef } from 'react';

const FilterBar = ({ onChange }) => {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortStates, setSortStates] = useState({
    name: 'none',
    rank: 'asc',
    favourites: 'none'
  });
  const isInitialMount = useRef(true);

  // 필터/정렬을 백엔드 형식으로 변환
  const buildFilters = (city, type, sorts) => {
    const filters = {};

    // is_seoul 필터
    if (city === 'seoul') {
      filters.is_seoul = 1;
    } else if (city === 'other') {
      filters.is_seoul = 0;
    }

    // ownership_type 필터
    if (type === 'national' || type === 'private') {
      filters.ownership_type = type;
    }

    // sort 파라미터
    const activeSortKey = Object.keys(sorts).find(key => sorts[key] !== 'none');
    if (activeSortKey) {
      const direction = sorts[activeSortKey];
      const sortMapping = {
        name: 'name_jp_sort',
        rank: 'qs_rank',
        favourites: 'favourites_count'
      };
      const sortField = sortMapping[activeSortKey];
      filters.sort = direction === 'desc' ? `-${sortField}` : sortField;
    } else {
      // 기본 정렬: qs_rank 오름차순
      filters.sort = 'qs_rank';
    }

    return filters;
  };

  // 초기 마운트 시에도 필터 전달
  useEffect(() => {
    const filters = buildFilters(selectedCity, selectedType, sortStates);

    if (isInitialMount.current) {
      isInitialMount.current = false;
      // 초기 마운트 시에도 필터 전달 (FilterBar의 초기 상태와 동기화)
      onChange(filters);
      return;
    }

    onChange(filters);
  }, [selectedCity, selectedType, sortStates]);

  const handleCityChange = (city) => {
    const newCity = selectedCity === city ? 'all' : city;
    setSelectedCity(newCity);
  };

  const handleTypeChange = (type) => {
    const newType = selectedType === type ? 'all' : type;
    setSelectedType(newType);
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
      name: 'none',
      rank: 'none',
      favourites: 'none',
      [sortKey]: newState
    };

    setSortStates(newSortStates);
  };

  const filters = [
    {
      id: 'seoul',
      label: 'ソウル所在',
      type: 'city',
      activeClass: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md border-blue-600',
      inactiveClass: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
    },
    {
      id: 'other',
      label: 'ソウル以外',
      type: 'city',
      activeClass: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md border-emerald-600',
      inactiveClass: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
    },
    {
      id: 'national',
      label: '国立',
      type: 'type',
      activeClass: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md border-orange-600',
      inactiveClass: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
    },
    {
      id: 'private',
      label: '私立',
      type: 'type',
      activeClass: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md border-purple-600',
      inactiveClass: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100'
    }
  ];

  const isFilterActive = (filter) => {
    if (filter.type === 'city') return selectedCity === filter.id;
    if (filter.type === 'type') return selectedType === filter.id;
    return false;
  };

  const getSortIcon = (state) => {
    if (state === 'asc') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else if (state === 'desc') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  };

  return (
    <div className="mb-5">
      {/* フィルター */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-semibold text-gray-800">フィルター</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => {
            const isActive = isFilterActive(filter);
            return (
              <button
                key={filter.id}
                onClick={() => filter.type === 'city' ? handleCityChange(filter.id) : handleTypeChange(filter.id)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border-2 ${
                  isActive
                    ? filter.activeClass
                    : filter.inactiveClass
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 並び替え */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <span className="text-sm font-semibold text-gray-800">並び替え</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSortChange('name')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              sortStates.name !== 'none'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            <span>名前</span>
            {getSortIcon(sortStates.name)}
          </button>
          <button
            onClick={() => handleSortChange('rank')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              sortStates.rank !== 'none'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            <span>ランク</span>
            {getSortIcon(sortStates.rank)}
          </button>
          <button
            onClick={() => handleSortChange('favourites')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              sortStates.favourites !== 'none'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            <span>★数</span>
            {getSortIcon(sortStates.favourites)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

