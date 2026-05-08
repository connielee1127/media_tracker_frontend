import { STATE_OPTIONS, MEDIA_TYPE_OPTIONS } from "../constants/filterOptions";

function FilterBar({
    search,
    setSearch,
    mediaType, 
    setMediaType, 
    stateFilter, 
    setStateFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    limit,
    setLimit,
    onApplyFilters
  }) {
    return (
      <div>
        <h2>{"Search for Media"}</h2>
  
        {/* SEARCH */}
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FILTER BY MEDIA TYPE */}
        <select 
            value={mediaType} 
            onChange={(e) => {
                setMediaType(e.target.value);
                setPage(1); 
            }}
        >
          <option value="">All Media</option>
          {MEDIA_TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
            {opt.label}
            </option>
          ))}
        </select>

        {/* FILTER BY STATE */}
        <select 
            value={stateFilter} 
            onChange={(e) => {
                setStateFilter(e.target.value);
                setPage(1); 
            }}
        >
          <option value="">All States</option>
          {STATE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
            {opt.label}
            </option>
          ))}
        </select>

        {/* SORT BY */}
        <select 
            value={sortBy} 
            onChange={(e) => {
                setSortBy(e.target.value)
                setPage(1)    
            }}
        >
          <option value="created_at">Created At</option>
          <option value="title">Title</option>
          <option value="rating">Rating</option>
          <option value="media_type">Media Type</option>
        </select>
  
        {/* SORT ORDER */}
        <select 
            value={sortOrder} 
            onChange={(e) => {
                setSortOrder(e.target.value)
                setPage(1)
            }}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
  
        {/* LIMIT */}
        <input
            type="number"
            min="1"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            />
  
        {/* APPLY BUTTON */}
        <button onClick={onApplyFilters}>
          Apply
        </button>
  
        {/* PAGINATION */}
        <button onClick={() => setPage(p => Math.max(p - 1, 1))}>
          Prev
        </button>
  
        <span> Page {page} </span>
  
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
  
      </div>
    );
  }
  
  export default FilterBar;