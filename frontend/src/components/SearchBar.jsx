import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

export const SearchBar = ({
    placeholder = 'Search...',
    onSearch,
    filters = [],
    onFilterChange
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={placeholder}
                        className="input pl-10"
                    />
                </div>

                {filters.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn btn-outline"
                    >
                        <Filter size={20} />
                        Filters
                    </button>
                )}

                <button type="submit" className="btn btn-primary">
                    Search
                </button>
            </form>

            {showFilters && filters.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                    {filters.map((filter, index) => (
                        <div key={index}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {filter.label}
                            </label>
                            <select
                                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                                className="input"
                            >
                                <option value="">All</option>
                                {filter.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
