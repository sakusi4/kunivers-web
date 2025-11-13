import UniversityCard from './UniversityCard';
import FilterBar from './FilterBar';

const UniversityList = ({ universities, onUniversityClick, onFilterChange }) => {
  return (
    <div>
      <FilterBar onChange={onFilterChange} />

      <div className="space-y-3">
        {universities.map((university) => (
          <UniversityCard
            key={university.id}
            university={university}
            onClick={onUniversityClick}
          />
        ))}
      </div>

      {universities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">条件に合う大学が見つかりませんでした</p>
        </div>
      )}
    </div>
  );
};

export default UniversityList;

